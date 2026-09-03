"""
Newsletter Subscriber ORM model.

Stores emails collected from the website footer and consultation forms.
"""

import uuid
from datetime import datetime, timezone

from sqlalchemy import Column, DateTime, String, Uuid
from app.database import Base

class NewsletterSubscriber(Base):
    __tablename__ = "newsletter_subscribers"

    id = Column(Uuid(as_uuid=True), primary_key=True, default=uuid.uuid4)
    email = Column(String(255), unique=True, nullable=False, index=True)
    status = Column(String(50), default="active", nullable=False)  # active, unsubscribed
    source = Column(String(100), default="footer", nullable=False)

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
        return f"<NewsletterSubscriber email={self.email} status={self.status}>"
