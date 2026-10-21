from django.core.exceptions import PermissionDenied
from apps.workspace.models import PreparationTask, Bookmark


class WorkspaceService:
    """
    Pure Python service managing Personal Workspace operations.
    Enforces Business Rule 5: Personal Workspace User Isolation.
    Every operation is scoped strictly by the authenticated user to prevent cross-user data leakage.
    """

    @staticmethod
    def get_user_tasks(user):
        """
        Retrieves all preparation tasks for the given user only.
        """
        return PreparationTask.objects.filter(user=user)

    @staticmethod
    def create_task(user, title: str, category: str = 'DSA', due_date=None) -> PreparationTask:
        """
        Creates a private preparation task scoped strictly to the authenticated user.
        """
        return PreparationTask.objects.create(
            user=user,
            title=title,
            category=category,
            due_date=due_date
        )

    @staticmethod
    def toggle_task_completion(user, task_id: int) -> PreparationTask:
        """
        Toggles completion status. Raises PermissionDenied if the task does not belong to the user.
        """
        try:
            task = PreparationTask.objects.get(id=task_id, user=user)
        except PreparationTask.DoesNotExist:
            raise PermissionDenied("You do not have permission to modify this preparation task.")
        
        task.is_completed = not task.is_completed
        task.save(update_fields=['is_completed', 'updated_at'])
        return task

    @staticmethod
    def delete_task(user, task_id: int) -> bool:
        """
        Deletes a task owned by user. Raises PermissionDenied if user does not own the task.
        """
        deleted_count, _ = PreparationTask.objects.filter(id=task_id, user=user).delete()
        if deleted_count == 0:
            raise PermissionDenied("You do not have permission to delete this preparation task.")
        return True

    @staticmethod
    def get_user_bookmarks(user):
        """
        Retrieves all bookmarks for the given user only.
        """
        return Bookmark.objects.filter(user=user)

    @staticmethod
    def add_bookmark(user, content_type: str, object_id: int, note: str = "") -> Bookmark:
        """
        Adds a private bookmark scoped strictly to user.
        """
        bookmark, _ = Bookmark.objects.get_or_create(
            user=user,
            content_type=content_type,
            object_id=object_id,
            defaults={'note': note}
        )
        return bookmark

    @staticmethod
    def remove_bookmark(user, bookmark_id: int) -> bool:
        """
        Removes a bookmark owned by user.
        """
        deleted_count, _ = Bookmark.objects.filter(id=bookmark_id, user=user).delete()
        if deleted_count == 0:
            raise PermissionDenied("You do not have permission to remove this bookmark.")
        return True
