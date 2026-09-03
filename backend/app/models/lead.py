"""
Lead ORM model.

Each Lead represents a CRM enquiry submitted through the Project Planner form.
The 9-step form maps directly to fields here:
  Step 1 → service_type
  Step 2 → property_type
  Step 3 → city, address, pincode
  Step 4 → carpet_area, buildup_area, num_rooms, budget_min/max, dates
  Step 5 → required_work (array)
  Step 7 → client_name, client_email, client_phone
  Step 8 → meeting_preference
"""

import uuid
from datetime import datetime, timezone

from sqlalchemy import Column, DateTime, Enum, Float, ForeignKey, Integer, String, Text, Uuid
from sqlalchemy.orm import relationship

from app.database import Base


class LeadService(Base):
    """
    Services requested by a lead.
    Replaces the PostgreSQL-specific ARRAY(String) column for MySQL compatibility.
    """
    __tablename__ = "lead_services"

    id = Column(Uuid(as_uuid=True), primary_key=True, default=uuid.uuid4)
    lead_id = Column(Uuid(as_uuid=True), ForeignKey("leads.id", ondelete="CASCADE"), nullable=False)
    service_name = Column(String(100), nullable=False)

    lead = relationship("Lead", back_populates="required_work")


class Lead(Base):
    __tablename__ = "leads"

    id = Column(Uuid(as_uuid=True), primary_key=True, default=uuid.uuid4)

    # Link to the authenticated user (nullable — guest submissions allowed)
    user_id = Column(Uuid(as_uuid=True), ForeignKey("users.id"), nullable=True)

    # ── Step 1: Service Type ──────────────────────────────────────────────────
    service_type = Column(
        Enum("complete_interior", "design_only", "consultancy", name="service_type"),
        nullable=False,
    )

    # ── Step 2: Property ─────────────────────────────────────────────────────
    property_type = Column(
        Enum(
            "apartment", "villa", "office", "shop", "restaurant", "hotel",
            name="property_type",
        ),
    )

    # ── Step 3: Location ─────────────────────────────────────────────────────
    city = Column(String(100))
    address = Column(Text)
    pincode = Column(String(10))

    # ── Step 4: Scope & Budget ────────────────────────────────────────────────
    carpet_area = Column(Float)      # sq ft
    buildup_area = Column(Float)     # sq ft
    num_rooms = Column(Integer)
    budget_min = Column(Float)       # INR
    budget_max = Column(Float)       # INR
    expected_start_date = Column(DateTime(timezone=True))
    expected_end_date = Column(DateTime(timezone=True))

    # ── Step 5: Required Work ─────────────────────────────────────────────────
    # Example: ["modular_kitchen", "false_ceiling", "painting"]
    required_work = relationship("LeadService", back_populates="lead", cascade="all, delete-orphan")


    # ── Step 7: Contact ───────────────────────────────────────────────────────
    client_name = Column(String(255))
    client_email = Column(String(255))
    client_phone = Column(String(20))

    # ── Step 8: Meeting Preference ────────────────────────────────────────────
    meeting_preference = Column(
        Enum(
            "site_visit", "video_call", "phone_call", "office_visit",
            name="meeting_type",
        ),
    )

    # ── CRM Pipeline ─────────────────────────────────────────────────────────
    status = Column(
        Enum(
            "new",
            "contacted",
            "site_visit_scheduled",
            "quoted",
            "negotiating",
            "won",
            "lost",
            name="lead_status",
        ),
        default="new",
        nullable=False,
    )
    # Admin user assigned to follow up on this lead
    assigned_to = Column(Uuid(as_uuid=True), ForeignKey("users.id"), nullable=True)
    notes = Column(Text)
    source = Column(String(100), default="website_form")

    created_at = Column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False,
    )
    updated_at = Column(
        DateTime(timezone=True),
        onupdate=lambda: datetime.now(timezone.utc),
    )

    # ── Relationships ─────────────────────────────────────────────────────────
    user = relationship("User", back_populates="leads", foreign_keys=[user_id])

    def __repr__(self) -> str:
        return f"<Lead id={self.id} client={self.client_name} status={self.status}>"
