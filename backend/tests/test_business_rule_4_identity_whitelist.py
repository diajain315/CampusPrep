import pytest
from apps.users.models import User
from apps.users.serializers import PublicAuthorSerializer


@pytest.mark.django_db
class TestBusinessRule4IdentityWhitelistIsolation:
    """
    IT643 Canonical Business Rule 4:
    Public serializers must strictly whitelist non-identifying fields.
    Zero leakage of institutional_email, username, password hashes, or real names.
    """

    def test_public_author_serializer_whitelists_only_pseudonym_and_affiliation(self):
        # Arrange: User with private institutional details
        user = User.objects.create_user(
            username="secret_student_202201001",
            first_name="Aarav",
            last_name="Sharma",
            email="aarav.personal@gmail.com",
            institutional_email="202201001@dau.ac.in",
            password="confidential_password_xyz",
            stable_pseudonym="CampusExplorer_99",
            is_verified_contributor=True
        )

        # Act: Serialize via PublicAuthorSerializer
        serializer = PublicAuthorSerializer(user)
        data = serializer.data

        # Assert: Whitelist check
        assert set(data.keys()) == {'stable_pseudonym', 'affiliation_label'}
        assert data['stable_pseudonym'] == "CampusExplorer_99"
        assert data['affiliation_label'] == "Institution-verified email"

        # Assert: PII explicitly absent
        assert 'username' not in data
        assert 'email' not in data
        assert 'institutional_email' not in data
        assert 'first_name' not in data
        assert 'last_name' not in data
        assert 'password' not in data

    def test_alumni_qualification_affiliation_label(self):
        # Arrange: Alumni qualified contributor
        alumni = User.objects.create_user(
            username="alumni_grad_2023",
            stable_pseudonym="CampusSenior_12",
            is_verified_contributor=True,
            is_alumni_qualified=True
        )

        # Act
        serializer = PublicAuthorSerializer(alumni)
        data = serializer.data

        # Assert
        assert data['affiliation_label'] == "DAU Alumni (declared)"
