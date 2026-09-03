"""
Worker ORM model.

Stores registered contractors / tradespeople who work on Avyron projects.
Workers are verified by admin staff before being assigned to projects.
"""

import uuid
from datetime import datetime, timezone

from sqlalchemy import Boolean, Column, DateTime, Float, ForeignKey, Integer, String, Text, Uuid
from sqlalchemy.orm import relationship

from app.database import Base


class WorkerSkill(Base):
    """
    Specific skills of a worker (replaces ARRAY(String)).
    """
    __tablename__ = "worker_skills"

    id = Column(Uuid(as_uuid=True), primary_key=True, default=uuid.uuid4)
    worker_id = Column(Uuid(as_uuid=True), ForeignKey("workers.id", ondelete="CASCADE"), nullable=False)
    skill_name = Column(String(100), nullable=False)

    worker = relationship("Worker", back_populates="skills")


class WorkerVerification(Base):
    """
    Verification documents for a worker.
    """
    __tablename__ = "worker_verifications"

    id = Column(Uuid(as_uuid=True), primary_key=True, default=uuid.uuid4)
    worker_id = Column(Uuid(as_uuid=True), ForeignKey("workers.id", ondelete="CASCADE"), nullable=False)
    document_type = Column(String(50), nullable=False)  # e.g., 'aadhar', 'pan'
    document_number = Column(String(100), nullable=False)
    is_verified = Column(Boolean, default=False)
    verified_at = Column(DateTime(timezone=True), nullable=True)

    worker = relationship("Worker", back_populates="verifications")


class Worker(Base):
    __tablename__ = "workers"

    id = Column(Uuid(as_uuid=True), primary_key=True, default=uuid.uuid4)

    # ── Personal Info ─────────────────────────────────────────────────────────
    name = Column(String(255), nullable=False)
    phone = Column(String(20), nullable=False, unique=True)
    email = Column(String(255), unique=True)
    address = Column(Text)
    city = Column(String(100))

    # ── Trade / Skills ────────────────────────────────────────────────────────
    # worker_type is the primary trade (e.g., "carpenter", "painter")
    worker_type = Column(String(100))
    # skills is a list of specific capabilities
    skills = relationship("WorkerSkill", back_populates="worker", cascade="all, delete-orphan")
    experience_years = Column(Integer)
    daily_wage = Column(Float)       # INR per day

    # ── Status ────────────────────────────────────────────────────────────────
    is_available = Column(Boolean, default=True, nullable=False)
    is_verified = Column(Boolean, default=False, nullable=False)
    verifications = relationship("WorkerVerification", back_populates="worker", cascade="all, delete-orphan")

    # ── Identity Documents ────────────────────────────────────────────────────
    # Stored for compliance — never expose in API responses
    aadhar_number = Column(String(20))
    pan_number = Column(String(20))

    created_at = Column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False,
    )
    updated_at = Column(
        DateTime(timezone=True),
        onupdate=lambda: datetime.now(timezone.utc),
    )

    def __repr__(self) -> str:
        return f"<Worker id={self.id} name={self.name} type={self.worker_type}>"
