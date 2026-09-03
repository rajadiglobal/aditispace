"""
JWT utilities — token creation and verification using python-jose.

Tokens are HS256-signed JWTs containing:
  sub   → User.id (UUID string)
  email → User.email
  role  → User.role
  exp   → Expiration timestamp
"""

from datetime import datetime, timedelta, timezone

from jose import JWTError, jwt

from app.config import settings


def create_access_token(data: dict) -> str:
    """
    Create a signed JWT access token.

    Args:
        data: Dict with at minimum {"sub": user_id, "email": ..., "role": ...}

    Returns:
        Signed JWT string.
    """
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + timedelta(
        minutes=settings.jwt_access_token_expire_minutes
    )
    to_encode.update({"exp": expire, "iat": datetime.now(timezone.utc)})
    return jwt.encode(
        to_encode,
        settings.jwt_secret_key,
        algorithm=settings.jwt_algorithm,
    )


def verify_token(token: str) -> dict:
    """
    Decode and verify a JWT token.

    Args:
        token: Raw JWT string from the Authorization header.

    Returns:
        Decoded payload dict.

    Raises:
        ValueError: If the token is invalid, expired, or tampered with.
    """
    try:
        payload = jwt.decode(
            token,
            settings.jwt_secret_key,
            algorithms=[settings.jwt_algorithm],
        )
        return payload
    except JWTError as exc:
        raise ValueError(f"Invalid token: {exc}") from exc
