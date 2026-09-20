from rest_framework import permissions


class IsPublicVisitor(permissions.BasePermission):
    """
    Grants read-only access to published platform recruitment intelligence.
    """
    def has_permission(self, request, view):
        return request.method in permissions.SAFE_METHODS


class IsVerifiedContributor(permissions.BasePermission):
    """
    Requires an authenticated user whose institutional affiliation has been confirmed
    through Institutional Email Verification.
    """
    def has_permission(self, request, view):
        return bool(
            request.user and
            request.user.is_authenticated and
            request.user.is_verified_contributor
        )


class IsAlumniContributor(permissions.BasePermission):
    """
    Requires an authenticated user who has an approved Alumni Qualification Declaration.
    Permits authoring Company Reviews.
    """
    def has_permission(self, request, view):
        return bool(
            request.user and
            request.user.is_authenticated and
            request.user.is_alumni_qualified
        )


class IsModerator(permissions.BasePermission):
    """
    Requires an authenticated user authorized to review pending submissions,
    request revisions, and triage content reports.
    """
    def has_permission(self, request, view):
        return bool(
            request.user and
            request.user.is_authenticated and
            (request.user.is_moderator or request.user.is_staff or request.user.is_superuser)
        )


class IsAdministrator(permissions.BasePermission):
    """
    Requires an authenticated platform administrator responsible for university settings,
    global company seed data, and role assignments.
    """
    def has_permission(self, request, view):
        return bool(
            request.user and
            request.user.is_authenticated and
            (request.user.is_administrator or request.user.is_superuser)
        )
