import random
import string
import hashlib
from datetime import timedelta
from django.utils import timezone
from apps.users.models import VerificationChallenge


class VerificationService:
    """
    Domain service managing institutional email challenges and deterministic stable pseudonym assignment.
    """

    @staticmethod
    def generate_stable_pseudonym(user_id: int) -> str:
        """
        Generates a non-identifying persistent handle (e.g., CampusExplorer_a1b2 or CampusExplorer_42).
        Uses a deterministic salt + user_id to prevent enumeration if desired, or index format.
        """
        if not user_id:
            # Fallback for unsaved instance: generate random token
            suffix = ''.join(random.choices(string.ascii_lowercase + string.digits, k=4))
            return f"CampusExplorer_{suffix}"
        
        # Deterministic 4-character hex hash based on ID
        digest = hashlib.sha256(f"campus-prep-pseudonym-salt-{user_id}".encode()).hexdigest()[:4]
        return f"CampusExplorer_{digest}_{user_id}"

    @staticmethod
    def generate_otp(user, institutional_email: str) -> VerificationChallenge:
        """
        Creates a 6-digit numeric OTP challenge valid for 15 minutes.
        """
        otp_code = f"{random.randint(100000, 999999)}"
        expires_at = timezone.now() + timedelta(minutes=15)
        
        challenge = VerificationChallenge.objects.create(
            user=user,
            email=institutional_email,
            otp_code=otp_code,
            expires_at=expires_at,
            is_used=False
        )
        return challenge

    @staticmethod
    def validate_otp(user, otp_code: str) -> bool:
        """
        Validates OTP challenge for the given user, marking user as a Verified Contributor upon success.
        """
        challenge = VerificationChallenge.objects.filter(
            user=user,
            otp_code=otp_code,
            is_used=False,
            expires_at__gte=timezone.now()
        ).order_by('-created_at').first()

        if not challenge:
            return False

        challenge.is_used = True
        challenge.save(update_fields=['is_used'])

        user.institutional_email = challenge.email
        user.is_verified_contributor = True
        user.save(update_fields=['institutional_email', 'is_verified_contributor'])
        return True
