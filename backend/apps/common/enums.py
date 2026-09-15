from django.db import models


class RoundType(models.TextChoices):
    ONLINE_ASSESSMENT = 'ONLINE_ASSESSMENT', 'Online Assessment'
    CODING_TEST = 'CODING_TEST', 'Coding Test'
    GROUP_DISCUSSION = 'GROUP_DISCUSSION', 'Group Discussion'
    TECHNICAL_INTERVIEW = 'TECHNICAL_INTERVIEW', 'Technical Interview'
    HR_INTERVIEW = 'HR_INTERVIEW', 'HR Interview'
    HYBRID = 'HYBRID', 'Hybrid'


class Difficulty(models.TextChoices):
    EASY = 'EASY', 'Easy'
    MEDIUM = 'MEDIUM', 'Medium'
    HARD = 'HARD', 'Hard'


class CandidateOutcome(models.TextChoices):
    OFFERED = 'OFFERED', 'Offered'
    REJECTED = 'REJECTED', 'Rejected'
    WITHDREW = 'WITHDREW', 'Withdrew'


class PublicationStatus(models.TextChoices):
    DRAFT = 'DRAFT', 'Draft'
    PENDING = 'PENDING', 'Pending'
    CHANGES_REQUESTED = 'CHANGES_REQUESTED', 'Changes Requested'
    APPROVED = 'APPROVED', 'Approved'
    REPORTED = 'REPORTED', 'Reported'
    UNDER_REVIEW = 'UNDER_REVIEW', 'Under Review'
    REJECTED = 'REJECTED', 'Rejected'
    REMOVED = 'REMOVED', 'Removed'


PUBLIC_VISIBLE_STATUSES = {
    PublicationStatus.APPROVED,
    PublicationStatus.REPORTED,
}


class RevisionStatus(models.TextChoices):
    PENDING_REVISION = 'PENDING_REVISION', 'Pending Revision'
    MERGED = 'MERGED', 'Merged'
    DISCARDED = 'DISCARDED', 'Discarded'


class ReportSeverity(models.TextChoices):
    LOW = 'LOW', 'Low'
    MEDIUM = 'MEDIUM', 'Medium'
    HIGH = 'HIGH', 'High'
    URGENT = 'URGENT', 'Urgent'


class ReportReason(models.TextChoices):
    INACCURATE = 'INACCURATE', 'Inaccurate Information'
    ABUSIVE = 'ABUSIVE', 'Abusive or Inappropriate'
    NDA_VIOLATION = 'NDA_VIOLATION', 'NDA Violation'
    SPAM = 'SPAM', 'Spam or Promotional'
    OTHER = 'OTHER', 'Other'


class JobRoleFamily(models.TextChoices):
    SOFTWARE_ENGINEER = 'SOFTWARE_ENGINEER', 'Software Engineer'
    DATA_ENGINEER = 'DATA_ENGINEER', 'Data Engineer'
    QA_ENGINEER = 'QA_ENGINEER', 'QA Engineer'
    PRODUCT = 'PRODUCT', 'Product'
    DESIGN = 'DESIGN', 'Design'
    DEVOPS_SRE = 'DEVOPS_SRE', 'DevOps / SRE'
    OTHER = 'OTHER', 'Other'


class TenureBand(models.TextChoices):
    LESS_THAN_ONE_YEAR = 'LESS_THAN_ONE_YEAR', '< 1 year'
    ONE_TO_TWO_YEARS = 'ONE_TO_TWO_YEARS', '1-2 years'
    THREE_TO_FIVE_YEARS = 'THREE_TO_FIVE_YEARS', '3-5 years'
    MORE_THAN_FIVE_YEARS = 'MORE_THAN_FIVE_YEARS', '5+ years'


class DeclarationStatus(models.TextChoices):
    PENDING = 'PENDING', 'Pending'
    APPROVED = 'APPROVED', 'Approved'
    REJECTED = 'REJECTED', 'Rejected'
    CHANGES_REQUESTED = 'CHANGES_REQUESTED', 'Changes Requested'


class ProposalStatus(models.TextChoices):
    PENDING = 'PENDING', 'Pending'
    APPROVED = 'APPROVED', 'Approved'
    REJECTED = 'REJECTED', 'Rejected'


class ReportStatus(models.TextChoices):
    PENDING = 'PENDING', 'Pending'
    REPORT_DISMISSED = 'REPORT_DISMISSED', 'Report Dismissed'
    ACTION_TAKEN = 'ACTION_TAKEN', 'Action Taken'


class ModerationActionType(models.TextChoices):
    APPROVED = 'APPROVED', 'Approved'
    REJECTED = 'REJECTED', 'Rejected'
    CHANGES_REQUESTED = 'CHANGES_REQUESTED', 'Changes Requested'
    REMOVED = 'REMOVED', 'Removed'
    UNDER_REVIEW = 'UNDER_REVIEW', 'Under Review'
    REPORT_DISMISSED = 'REPORT_DISMISSED', 'Report Dismissed'
    CLEARED = 'CLEARED', 'Cleared'
    MERGE_REVISION = 'MERGE_REVISION', 'Merge Revision'
