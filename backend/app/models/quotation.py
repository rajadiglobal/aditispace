"""
Quotation ORM model.

Quotations are generated for Leads before they become Projects.
"""

import uuid
from datetime import datetime, timezone

from sqlalchemy import Column, DateTime, Float, ForeignKey, String, Text, Uuid, Enum, Integer
from sqlalchemy.orm import relationship

from app.database import Base


class QuotationItem(Base):
    """
    Stores a snapshot of product pricing for historical accuracy.
    """
    __tablename__ = "quotation_items"

    id = Column(Uuid(as_uuid=True), primary_key=True, default=uuid.uuid4)
    quotation_id = Column(Uuid(as_uuid=True), ForeignKey("quotations.id", ondelete="CASCADE"), nullable=False)
    product_id = Column(Uuid(as_uuid=True), ForeignKey("products.id", ondelete="SET NULL"), nullable=True)
    
    product_name = Column(String(255), nullable=False)
    unit_price = Column(Float, nullable=False)
    quantity = Column(Integer, default=1, nullable=False)
    discount = Column(Float, default=0.0)
    
    notes = Column(Text)
    
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))

    quotation = relationship("Quotation", back_populates="items")
    product = relationship("Product")


class Quotation(Base):
    __tablename__ = "quotations"

    id = Column(Uuid(as_uuid=True), primary_key=True, default=uuid.uuid4)
    lead_id = Column(Uuid(as_uuid=True), ForeignKey("leads.id", ondelete="CASCADE"), nullable=False)
    
    total_amount = Column(Float, nullable=False)
    valid_until = Column(DateTime(timezone=True), nullable=False)
    document_url = Column(String(500))  # Link to PDF
    
    status = Column(
        Enum("draft", "sent", "accepted", "rejected", name="quotation_status"),
        default="draft",
        nullable=False,
    )
    notes = Column(Text)

    created_at = Column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False,
    )
    updated_at = Column(
        DateTime(timezone=True),
        onupdate=lambda: datetime.now(timezone.utc),
    )

    lead = relationship("Lead")
    items = relationship("QuotationItem", back_populates="quotation", cascade="all, delete-orphan")

    def __repr__(self) -> str:
        return f"<Quotation id={self.id} lead_id={self.lead_id} amount={self.total_amount}>"
