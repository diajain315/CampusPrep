import pytest
from django.core.exceptions import PermissionDenied
from apps.users.models import User
from apps.workspace.services import WorkspaceService


@pytest.mark.django_db
class TestBusinessRule5PersonalWorkspaceUserIsolation:
    """
    IT643 Canonical Business Rule 5:
    A user can view, edit, or delete only their own Preparation Tasks and Bookmarks;
    attempts to query or mutate another user's workspace records must be rejected.
    """

    @pytest.fixture
    def users_and_tasks(self):
        user_a = User.objects.create_user(username="student_a", password="password_a")
        user_b = User.objects.create_user(username="student_b", password="password_b")

        task_a = WorkspaceService.create_task(
            user=user_a,
            title="Solve Blind 75 Graphs",
            category="DSA"
        )
        task_b = WorkspaceService.create_task(
            user=user_b,
            title="Design Rate Limiter",
            category="SYSTEM_DESIGN"
        )
        return {
            'user_a': user_a,
            'user_b': user_b,
            'task_a': task_a,
            'task_b': task_b,
        }

    def test_user_can_only_view_their_own_tasks(self, users_and_tasks):
        # Arrange
        user_a = users_and_tasks['user_a']
        task_a = users_and_tasks['task_a']
        task_b = users_and_tasks['task_b']

        # Act
        tasks = WorkspaceService.get_user_tasks(user_a)

        # Assert: task_a present, task_b strictly absent
        assert task_a in tasks
        assert task_b not in tasks

    def test_user_cannot_modify_another_users_task(self, users_and_tasks):
        # Arrange
        user_a = users_and_tasks['user_a']
        task_b = users_and_tasks['task_b']

        # Act & Assert: user_a attempting to toggle task_b raises PermissionDenied
        with pytest.raises(PermissionDenied) as exc_info:
            WorkspaceService.toggle_task_completion(user=user_a, task_id=task_b.id)

        assert "do not have permission" in str(exc_info.value)

    def test_user_cannot_delete_another_users_task(self, users_and_tasks):
        # Arrange
        user_a = users_and_tasks['user_a']
        task_b = users_and_tasks['task_b']

        # Act & Assert: user_a attempting to delete task_b raises PermissionDenied
        with pytest.raises(PermissionDenied) as exc_info:
            WorkspaceService.delete_task(user=user_a, task_id=task_b.id)

        assert "do not have permission" in str(exc_info.value)
