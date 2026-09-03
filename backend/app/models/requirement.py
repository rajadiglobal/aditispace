"""
Requirement ORM model.

A Requirement represents the actual interior-design requirements submitted by a lead/customer.
"""

import uuid
from datetime import datetime, timezone

from sqlalchemy import Column, DateTime, Float, ForeignKey, Integer, String, Text, Uuid
from sqlalchemy.orm import relationship

from app.database import Base


class RequirementProduct(Base):
    __tablename__ = "requirement_products"

    id = Column(Uuid(as_uuid=True), primary_key=True, default=uuid.uuid4)
    requirement_id = Column(Uuid(as_uuid=True), ForeignKey("requirements.id", ondelete="CASCADE"), nullable=False)
    product_id = Column(Uuid(as_uuid=True), ForeignKey("products.id", ondelete="CASCADE"), nullable=False)
    
    quantity = Column(Integer, default=1)
    notes = Column(Text)
    
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))

    requirement = relationship("Requirement", back_populates="products")
    product = relationship("Product")


class Requirement(Base):
    __tablename__ = "requirements"

    id = Column(Uuid(as_uuid=True), primary_key=True, default=uuid.uuid4)
    
    # Relationships
    lead_id = Column(Uuid(as_uuid=True), ForeignKey("leads.id", ondelete="SET NULL"), nullable=True)
    customer_id = Column(Uuid(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=True)

    # Customer Information (Submitted via Planner)
    customer_name = Column(String(255), nullable=True)
    customer_email = Column(String(255), nullable=True)
    customer_phone = Column(String(50), nullable=True)
    customer_whatsapp = Column(String(50), nullable=True)

    # Project Information
    property_type = Column(String(100), nullable=True)
    property_status = Column(String(100), nullable=True)

    # Location
    location_city = Column(String(100), nullable=True)
    location_state = Column(String(100), nullable=True)
    location_locality = Column(String(255), nullable=True)
    pincode = Column(String(20), nullable=True)
    address = Column(Text, nullable=True)

    # Scope and Size
    scope = Column(String(255), nullable=True)  # e.g., "Full Home Interior, Living Room"
    property_size = Column(String(100), nullable=True)

    # Budget and Timeline
    budget_range = Column(String(100), nullable=True)
    timeline = Column(String(100), nullable=True)

    # Additional Data
    design_preferences = Column(Text, nullable=True)
    additional_notes = Column(Text, nullable=True)

    # Admin Fields
    status = Column(String(50), default="new", nullable=False) # new, contacted, site_visit, in_progress, converted, closed

    created_at = Column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False,
    )
    updated_at = Column(
        DateTime(timezone=True),
        onupdate=lambda: datetime.now(timezone.utc),
    )

    products = relationship("RequirementProduct", back_populates="requirement", cascade="all, delete-orphan")

    def __repr__(self) -> str:
        return f"<Requirement id={self.id} status={self.status}>"
