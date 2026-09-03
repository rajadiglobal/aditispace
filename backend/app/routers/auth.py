"""
Authentication router — /api/v1/auth/

POST /api/v1/auth/google
    Called by NextAuth.js (Rimesh) after Google OAuth completes.
    Receives the Google id_token, verifies it, upserts the user in DB,
    and returns an Avyron JWT.
"""

from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, EmailStr
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.user import User
from app.schemas.user import UserResponse
from app.utils.google_auth import verify_google_token
from app.utils.jwt import create_access_token

router = APIRouter(prefix="/api/v1/auth", tags=["authentication"])


# ─── Request / Response Models ────────────────────────────────────────────────

class GoogleAuthRequest(BaseModel):
    """Payload from NextAuth.js after Google OAuth completes."""
    id_token: str
    email: str | None = None
    name: str | None = None
    picture: str | None = None


class AuthResponse(BaseModel):
    """JWT token + user info returned to the frontend."""
    access_token: str
    token_type: str = "bearer"
    user: UserResponse


# ─── Endpoints ────────────────────────────────────────────────────────────────

@router.post(
    "/google",
    response_model=AuthResponse,
    summary="Google OAuth Login",
    description=(
        "Verify a Google id_token, upsert the user in the database, "
        "and return an Avyron JWT access token. "
        "Called by NextAuth.js (Rimesh's implementation)."
    ),
)
async def google_auth(
    payload: GoogleAuthRequest,
    db: Session = Depends(get_db),
) -> AuthResponse:
    # ── 1. Verify the Google id_token ─────────────────────────────────────────
    try:
        google_info = verify_google_token(payload.id_token)
    except ValueError as exc:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=str(exc),
        )

    google_id: str = google_info["sub"]
    email: str = google_info.get("email") or payload.email or ""
    name: str = google_info.get("name") or payload.name or "Avyron User"
    picture: str | None = google_info.get("picture") or payload.picture

    # ── 2. Upsert user in database ────────────────────────────────────────────
    # Look up by google_id first (most reliable); fall back to email.
    from app.config import settings
    is_admin = (settings.admin_email and email.lower() == settings.admin_email.lower())
    assigned_role = "admin" if is_admin else "client"

    user = db.query(User).filter(User.google_id == google_id).first()

    if not user:
        # Check if account exists with same email (pre-registered admin, etc.)
        user = db.query(User).filter(User.email == email).first()
        if user:
            # Link Google identity to existing account
            user.google_id = google_id
            user.picture = picture
            if is_admin:
                user.role = "admin"
        else:
            # First-ever sign-in — create a new account
            user = User(
                email=email,
                name=name,
                picture=picture,
                google_id=google_id,
                role=assigned_role,
            )
            db.add(user)
    else:
        # Update existing user role if they match admin email
        if is_admin and user.role != "admin":
            user.role = "admin"

    # Update name/picture on every login so they stay in sync with Google profile
    user.name = name
    if picture:
        user.picture = picture

    db.commit()
    db.refresh(user)

    # ── 3. Issue Avyron JWT ───────────────────────────────────────────────────
    access_token = create_access_token(
        data={
            "sub": str(user.id),
            "email": user.email,
            "role": user.role,
        }
    )

    return AuthResponse(
        access_token=access_token,
        user=UserResponse(
            id=str(user.id),
            email=user.email,
            name=user.name,
            picture=user.picture,
            role=user.role,
        ),
    )
