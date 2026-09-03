"""
Pydantic schemas for User API requests and responses.

These are separate from the SQLAlchemy ORM models.
- ORM models define the database table structure.
- Pydantic schemas define what the API accepts and returns.
"""

from datetime import datetime
from typing import Literal
import uuid

from pydantic import BaseModel, EmailStr


# ─── Response Schemas ─────────────────────────────────────────────────────────

class UserResponse(BaseModel):
    """Returned in auth responses and user profile endpoints."""
    id: str
    email: EmailStr
    name: str
    picture: str | None
    role: Literal["client", "admin", "staff"]

    model_config = {"from_attributes": True}


class UserPublic(BaseModel):
    """Minimal user info — safe to embed in other responses."""
    id: str
    name: str
    email: EmailStr

    model_config = {"from_attributes": True}
