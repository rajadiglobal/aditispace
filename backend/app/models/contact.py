"""
Contact Inquiry ORM model.

Stores messages submitted from the Get in Touch form.
"""

import uuid
from datetime import datetime, timezone

from sqlalchemy import Column, DateTime, String, Text, Uuid
from app.database import Base

class ContactInquiry(Base):
    __tablename__ = "contact_inquiries"

    id = Column(Uuid(as_uuid=True), primary_key=True, default=uuid.uuid4)
    first_name = Column(String(255), nullable=False)
    last_name = Column(String(255), nullable=False)
    email = Column(String(255), nullable=False)
    phone = Column(String(50), nullable=True)
    message = Column(Text, nullable=False)

    status = Column(String(50), default="new", nullable=False)  # new, contacted, resolved, closed

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
        return f"<ContactInquiry name={self.first_name} {self.last_name} status={self.status}>"
