from rest_framework import serializers
from apps.users.models import User


class PublicAuthorSerializer(serializers.ModelSerializer):
    """
    Public Display Identity Serializer.
    Strictly whitelists non-identifying attributes (Stable Pseudonym and Affiliation Label).
    Guarantees zero leakage of Private Account Identity (PII).
    """
    affiliation_label = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ['stable_pseudonym', 'affiliation_label']
        read_only_fields = ['stable_pseudonym', 'affiliation_label']

    def get_affiliation_label(self, obj) -> str:
        """
        Derives non-identifying institutional standing Affiliation Label.
        Only two labels are valid: 'DAU Alumni (declared)' and 'Institution-verified email'.
        Unverified users cannot publish, so no third label exists.
        """
        if getattr(obj, 'is_alumni_qualified', False):
            return "DAU Alumni (declared)"
        if getattr(obj, 'is_verified_contributor', False):
            return "Institution-verified email"
        raise ValueError("Unverified users cannot publish or have a public affiliation label.")
