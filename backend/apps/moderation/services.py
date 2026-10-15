from django.apps import apps
from django.utils import timezone
from django.core.exceptions import PermissionDenied, ObjectDoesNotExist
from apps.moderation.models import ContentReport, ModerationAction, ContentRevision
from apps.common.enums import (
    PublicationStatus,
    RevisionStatus,
    ReportSeverity,
    ModerationActionType,
)


class ModerationService:
    """
    Pure Python domain service encapsulating moderation workflows:
    - Pre-publication review
    - Risk-aware report triage (Business Rule 2)
    - Content revision merging and live record preservation (Business Rule 5)
    """

    @staticmethod
    def _resolve_model(content_type: str):
        """
        Resolves content_type string (e.g. 'interviewexperience', 'companyreview', 'companyproposal')
        to its Django model class.
        """
        for model in apps.get_models():
            if model.__name__.lower() == content_type.lower():
                return model
        raise ObjectDoesNotExist(f"No model found matching content_type '{content_type}'")

    @classmethod
    def resolve_record_owner_id(cls, instance) -> int | None:
        """
        Resolves the owning user ID across distinct model schemas:
        - author_id (InterviewExperience, CompanyReview, ContentRevision, CampusDrive, CompanyProposal)
        - user_id (AlumniQualificationDeclaration, PreparationTask, Bookmark)
        - proposer_id (fallback for proposal models)
        """
        if hasattr(instance, 'author_id') and instance.author_id is not None:
            return instance.author_id
        if hasattr(instance, 'user_id') and instance.user_id is not None:
            return instance.user_id
        if hasattr(instance, 'proposer_id') and instance.proposer_id is not None:
            return instance.proposer_id
        return None

    @classmethod
    def review_submission(cls, moderator, instance, new_status: str, feedback: str = "") -> ModerationAction:
        """
        Executes a formal moderator review on a moderatable instance.
        Transitions instance status and creates an auditable ModerationAction.
        """
        if not (moderator.is_moderator or moderator.is_staff or moderator.is_superuser):
            raise PermissionDenied("User is not authorized to perform moderation actions.")

        owner_id = cls.resolve_record_owner_id(instance)
        if owner_id is not None and owner_id == moderator.id:
            raise PermissionDenied("A moderator cannot moderate their own submission (Anti-Self-Approval Invariant).")

        prev_status = getattr(instance, 'status', '')
        instance.status = new_status
        instance.save(update_fields=['status', 'updated_at'])

        action = ModerationAction.objects.create(
            moderator=moderator,
            content_type=instance._meta.model_name,
            object_id=instance.id,
            action=f"TRANSITION_{new_status}",
            action_taken=new_status if new_status in ModerationActionType.values else ModerationActionType.APPROVED,
            previous_status=prev_status,
            new_status=new_status,
            feedback=feedback
        )
        return action

    @classmethod
    def review_declaration(cls, moderator, declaration, new_status: str, feedback: str = "") -> ModerationAction:
        """
        Executes formal review on an AlumniQualificationDeclaration.
        Enforces Anti-Self-Approval Invariant.
        """
        if not (moderator.is_moderator or moderator.is_staff or moderator.is_superuser):
            raise PermissionDenied("User is not authorized to perform moderation actions.")

        owner_id = cls.resolve_record_owner_id(declaration)
        if owner_id is not None and owner_id == moderator.id:
            raise PermissionDenied("A moderator cannot moderate their own submission (Anti-Self-Approval Invariant).")

        prev_status = declaration.declaration_status
        declaration.declaration_status = new_status
        declaration.reviewed_by = moderator
        declaration.reviewed_at = timezone.now()
        declaration.save()

        if new_status == 'APPROVED':
            declaration.user.is_alumni_qualified = True
            declaration.user.save(update_fields=['is_alumni_qualified'])

        action = ModerationAction.objects.create(
            moderator=moderator,
            content_type=declaration._meta.model_name,
            object_id=declaration.id,
            action=f"DECLARATION_{new_status}",
            action_taken=new_status if new_status in ModerationActionType.values else ModerationActionType.APPROVED,
            previous_status=prev_status,
            new_status=new_status,
            feedback=feedback
        )
        return action

    @classmethod
    def review_proposal(cls, moderator, proposal, new_status: str, feedback: str = "") -> ModerationAction:
        """
        Executes formal review on a CompanyProposal.
        Enforces Anti-Self-Approval Invariant.
        """
        if not (moderator.is_moderator or moderator.is_staff or moderator.is_superuser):
            raise PermissionDenied("User is not authorized to perform moderation actions.")

        owner_id = cls.resolve_record_owner_id(proposal)
        if owner_id is not None and owner_id == moderator.id:
            raise PermissionDenied("A moderator cannot moderate their own submission (Anti-Self-Approval Invariant).")

        prev_status = proposal.proposal_status
        proposal.proposal_status = new_status
        proposal.status = new_status
        proposal.save(update_fields=['proposal_status', 'status', 'updated_at'])

        action = ModerationAction.objects.create(
            moderator=moderator,
            content_type=proposal._meta.model_name,
            object_id=proposal.id,
            action=f"PROPOSAL_{new_status}",
            action_taken=new_status if new_status in ModerationActionType.values else ModerationActionType.APPROVED,
            previous_status=prev_status,
            new_status=new_status,
            feedback=feedback
        )
        return action

    @classmethod
    def submit_content_report(
        cls,
        reporter,
        content_type: str,
        object_id: int,
        reason: str,
        severity: str = ReportSeverity.MEDIUM,
        details: str = ""
    ) -> ContentReport:
        """
        Enforces Business Rule 2: Risk-Aware Moderation.
        - If severity is URGENT: The target record is immediately quarantined to UNDER_REVIEW
          (hidden from public indexing).
        - If severity is LOW, MEDIUM, or HIGH: The target record's status becomes REPORTED
          (retains public visibility pending moderator triage).
        """
        report = ContentReport.objects.create(
            reporter=reporter,
            content_type=content_type,
            object_id=object_id,
            reason=reason,
            severity=severity,
            details=details
        )

        model_cls = cls._resolve_model(content_type)
        try:
            target = model_cls.objects.get(id=object_id)
            if severity == ReportSeverity.URGENT:
                target.status = PublicationStatus.UNDER_REVIEW
            else:
                if target.status == PublicationStatus.APPROVED:
                    target.status = PublicationStatus.REPORTED
            target.save(update_fields=['status', 'updated_at'])
        except model_cls.DoesNotExist:
            pass

        return report

    @classmethod
    def triage_report(cls, moderator, report_id: int, action: str, resolution_notes: str = "") -> ContentReport:
        """
        Triages an outstanding ContentReport. Resolves the report and optionally
        updates the target record's publication status.
        """
        if not (moderator.is_moderator or moderator.is_staff or moderator.is_superuser):
            raise PermissionDenied("User is not authorized to triage reports.")

        report = ContentReport.objects.get(id=report_id)
        report.is_resolved = True
        report.resolved_by = moderator
        report.resolved_at = timezone.now()
        report.resolution_notes = resolution_notes
        report.save()

        # Update target status based on action
        model_cls = cls._resolve_model(report.content_type)
        try:
            target = model_cls.objects.get(id=report.object_id)
            if action == 'DISMISS':
                target.status = PublicationStatus.APPROVED
            elif action == 'REMOVE':
                target.status = PublicationStatus.REMOVED
            elif action == 'QUARANTINE':
                target.status = PublicationStatus.UNDER_REVIEW
            target.save(update_fields=['status', 'updated_at'])
        except model_cls.DoesNotExist:
            pass

        return report

    @classmethod
    def create_revision(cls, author, instance, proposed_payload: dict) -> ContentRevision:
        """
        Enforces Business Rule 5: Content Revision Traceability.
        When author edits an already APPROVED record:
        - The live record remains in APPROVED state without disruption.
        - A ContentRevision record is created in PENDING_REVISION for moderator review.
        """
        if instance.status != PublicationStatus.APPROVED:
            raise ValueError("Revisions can only be submitted for already APPROVED live records.")

        revision = ContentRevision.objects.create(
            author=author,
            content_type=instance._meta.model_name,
            object_id=instance.id,
            revision_status=RevisionStatus.PENDING_REVISION,
            proposed_payload=proposed_payload
        )
        return revision

    @classmethod
    def merge_revision(cls, moderator, revision_id: int) -> bool:
        """
        Applies a pending revision's proposed payload to the live record.
        Marks revision as MERGED and logs moderation action.
        """
        if not (moderator.is_moderator or moderator.is_staff or moderator.is_superuser):
            raise PermissionDenied("Only moderators can merge content revisions.")

        revision = ContentRevision.objects.get(id=revision_id)
        if cls.resolve_record_owner_id(revision) == moderator.id:
            raise PermissionDenied("A moderator cannot moderate their own submission (Anti-Self-Approval Invariant).")

        model_cls = cls._resolve_model(revision.content_type)
        target = model_cls.objects.get(id=revision.object_id)
        if cls.resolve_record_owner_id(target) == moderator.id:
            raise PermissionDenied("A moderator cannot moderate their own submission (Anti-Self-Approval Invariant).")

        # Apply payload
        update_fields = []
        for key, value in revision.proposed_payload.items():
            if hasattr(target, key):
                setattr(target, key, value)
                update_fields.append(key)

        if update_fields:
            target.save(update_fields=update_fields)

        revision.revision_status = RevisionStatus.MERGED
        revision.save(update_fields=['revision_status', 'updated_at'])

        ModerationAction.objects.create(
            moderator=moderator,
            content_type=revision.content_type,
            object_id=revision.object_id,
            action="MERGE_REVISION",
            previous_status=PublicationStatus.APPROVED,
            new_status=PublicationStatus.APPROVED,
            feedback=f"Merged revision #{revision.id}"
        )
        return True

    @staticmethod
    def get_queue():
        """
        Retrieves pending submissions, revisions, and reported items.
        """
        return {
            'pending_reports': ContentReport.objects.filter(is_resolved=False),
            'pending_revisions': ContentRevision.objects.filter(revision_status=RevisionStatus.PENDING_REVISION),
        }
