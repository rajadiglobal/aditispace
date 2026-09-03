"""
Google OAuth token verification.

Uses the official `google-auth` library to validate Google id_tokens.
The token is verified against Google's public keys and the app's Client ID.
"""

from google.auth.transport import requests as google_requests
from google.oauth2 import id_token

from app.config import settings

# Reuse a single transport.Request instance across calls (thread-safe)
_http_request = google_requests.Request()


def verify_google_token(token: str) -> dict:
    """
    Verify a Google id_token and extract user information.

    Args:
        token: The `id_token` received from Google OAuth flow.

    Returns:
        Dict with user info: sub, email, name, picture, email_verified, etc.

    Raises:
        ValueError: If the token is invalid, expired, or from the wrong audience.
    """
    try:
        idinfo = id_token.verify_oauth2_token(
            token,
            _http_request,
            settings.google_client_id,
        )
    except Exception as exc:
        raise ValueError(f"Google token verification failed: {exc}") from exc

    # Extra issuer check for defence in depth
    if idinfo.get("iss") not in (
        "accounts.google.com",
        "https://accounts.google.com",
    ):
        raise ValueError("Invalid token issuer.")

    # Ensure the email is verified by Google
    if not idinfo.get("email_verified"):
        raise ValueError("Google email is not verified.")

    return idinfo
