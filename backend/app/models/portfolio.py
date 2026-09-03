"""
PortfolioItem ORM model.

Admin-managed showcase items (images / videos / before-after pairs)
displayed on the public portfolio page.
"""

import uuid
from datetime import datetime, timezone

from sqlalchemy import Boolean, Column, DateTime, ForeignKey, Integer, String, Text, Uuid
from sqlalchemy.orm import relationship

from app.database import Base


class PortfolioTag(Base):
    """
    Tags for filtering portfolio items (replaces ARRAY(String)).
    """
    __tablename__ = "portfolio_tags"

    id = Column(Uuid(as_uuid=True), primary_key=True, default=uuid.uuid4)
    portfolio_item_id = Column(Uuid(as_uuid=True), ForeignKey("portfolio_items.id", ondelete="CASCADE"), nullable=False)
    tag_name = Column(String(50), nullable=False)

    portfolio_item = relationship("PortfolioItem", back_populates="tags")


class PortfolioItem(Base):
    __tablename__ = "portfolio_items"

    id = Column(Uuid(as_uuid=True), primary_key=True, default=uuid.uuid4)

    title = Column(String(255), nullable=False)
    description = Column(Text)
    category = Column(String(100))   # e.g., "modular_kitchen", "living_room"
    location = Column(String(100))   # e.g., "Noida, UP"

    # Primary display image URL (from S3 or CDN)
    image_url = Column(String(500), nullable=False)

    # Optional before/after pair
    before_image_url = Column(String(500))
    after_image_url = Column(String(500))

    # Optional video walkthrough
    video_url = Column(String(500))

    # Tags for filtering
    tags = relationship("PortfolioTag", back_populates="portfolio_item", cascade="all, delete-orphan")

    # Project cost range (for display)
    budget_display = Column(String(50))  # e.g., "₹8–12 Lakhs"

    # Sort order for admin-controlled display sequence
    display_order = Column(Integer, default=0)
    is_featured = Column(Boolean, default=False, nullable=False)
    is_published = Column(Boolean, default=True, nullable=False)

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
        return f"<PortfolioItem id={self.id} title={self.title}>"
