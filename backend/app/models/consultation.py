"""
Consultation Request ORM model.

Stores consultation requests submitted from the global FREE Consultation & Estimate modal.
"""

import uuid
from datetime import datetime, timezone

from sqlalchemy import Column, DateTime, Date, String, Text, Uuid
from app.database import Base

class ConsultationRequest(Base):
    __tablename__ = "consultation_requests"

    id = Column(Uuid(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String(255), nullable=False)
    email = Column(String(255), nullable=False)
    phone = Column(String(50), nullable=False)
    city = Column(String(100), nullable=False)
    preferred_date = Column(Date, nullable=True)
    requirement_type = Column(String(100), nullable=True)

    status = Column(String(50), default="new", nullable=False)  # new, contacted, in_progress, converted, closed
    notes = Column(Text, nullable=True)

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
        return f"<ConsultationRequest name={self.name} status={self.status}>"
