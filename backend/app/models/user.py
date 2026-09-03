"""
User ORM model.

Stores all users (clients + admins) authenticated via Google OAuth.
The `google_id` is the stable Google subject identifier (never changes).
"""

import uuid
from datetime import datetime, timezone

from sqlalchemy import Boolean, Column, DateTime, Enum, String, Text, Uuid
from sqlalchemy.orm import relationship

from app.database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Uuid(as_uuid=True), primary_key=True, default=uuid.uuid4)
    email = Column(String(255), unique=True, nullable=False, index=True)
    name = Column(String(255), nullable=False)
    picture = Column(String(500))

    # Stable Google subject ID — never changes even if user changes their email
    google_id = Column(String(255), unique=True, index=True)

    # Role controls CRM access:
    # - client: can submit forms only
    # - staff:  can view / update leads
    # - admin:  full access including dashboard
    role = Column(
        Enum("client", "admin", "staff", name="user_role"),
        default="client",
        nullable=False,
    )

    is_active = Column(Boolean, default=True, nullable=False)
    phone = Column(String(20))

    created_at = Column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False,
    )
    updated_at = Column(
        DateTime(timezone=True),
        onupdate=lambda: datetime.now(timezone.utc),
    )

    # ── Extended Profile Fields ───────────────────────────────────────────────
    dob = Column(DateTime(timezone=True), nullable=True)
    gender = Column(String(20), nullable=True)
    address = Column(Text, nullable=True)
    city = Column(String(100), nullable=True)
    state = Column(String(100), nullable=True)
    country = Column(String(100), nullable=True)
    pincode = Column(String(20), nullable=True)
    customer_status = Column(String(50), nullable=True)
    notes = Column(Text, nullable=True)

    # ── Relationships ─────────────────────────────────────────────────────────
    leads = relationship(
        "Lead",
        back_populates="user",
        foreign_keys="Lead.user_id",
    )

    def __repr__(self) -> str:
        return f"<User id={self.id} email={self.email} role={self.role}>"
