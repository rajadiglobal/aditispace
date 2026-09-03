"""
Testimonial ORM model.

Testimonials from clients displayed on the public website.
"""

import uuid
from datetime import datetime, timezone

from sqlalchemy import Boolean, Column, DateTime, Integer, String, Text, Uuid

from app.database import Base


class Testimonial(Base):
    __tablename__ = "testimonials"

    id = Column(Uuid(as_uuid=True), primary_key=True, default=uuid.uuid4)
    
    client_name = Column(String(255), nullable=False)
    client_designation = Column(String(255)) # e.g., "Homeowner, Noida"
    client_image_url = Column(String(500))
    
    content = Column(Text, nullable=False)
    rating = Column(Integer, default=5) # 1-5 scale
    
    is_published = Column(Boolean, default=False, nullable=False)
    display_order = Column(Integer, default=0)

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
        return f"<Testimonial id={self.id} client={self.client_name}>"
