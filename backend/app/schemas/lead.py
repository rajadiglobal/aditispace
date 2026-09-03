"""
Pydantic schemas for Lead API requests and responses.

LeadCreate  → what Pratibha's frontend POSTs to /api/v1/leads/
LeadUpdate  → PATCH body for status updates
LeadResponse→ what the API returns for each lead
"""

from datetime import datetime
from typing import Literal, Optional
import uuid

from pydantic import BaseModel, EmailStr, Field


# ─── Enums (as Literal types for Pydantic validation) ─────────────────────────

ServiceType = Literal["complete_interior", "design_only", "consultancy"]
PropertyType = Literal["apartment", "villa", "office", "shop", "restaurant", "hotel"]
MeetingPreference = Literal["site_visit", "video_call", "phone_call", "office_visit"]
LeadStatus = Literal[
    "new", "contacted", "site_visit_scheduled", "quoted", "negotiating", "won", "lost"
]


# ─── Request Schemas ─────────────────────────────────────────────────────────

class LeadCreate(BaseModel):
    """
    Payload for POST /api/v1/leads/
    Maps directly to the 9-step Project Planner form.
    """
    # Step 1
    service_type: ServiceType

    # Step 2
    property_type: Optional[PropertyType] = None

    # Step 3
    city: str = Field(..., min_length=2, max_length=100)
    address: Optional[str] = None
    pincode: Optional[str] = Field(None, pattern=r"^\d{6}$")

    # Step 4
    carpet_area: Optional[float] = Field(None, gt=0)
    buildup_area: Optional[float] = Field(None, gt=0)
    num_rooms: Optional[int] = Field(None, ge=1)
    budget_min: Optional[float] = Field(None, ge=0)
    budget_max: Optional[float] = Field(None, ge=0)
    expected_start_date: Optional[datetime] = None
    expected_end_date: Optional[datetime] = None

    # Step 5
    required_work: Optional[list[str]] = []

    # Step 7
    client_name: str = Field(..., min_length=2, max_length=255)
    client_email: EmailStr
    client_phone: str = Field(..., pattern=r"^[6-9]\d{9}$")

    # Step 8
    meeting_preference: Optional[MeetingPreference] = None


class LeadStatusUpdate(BaseModel):
    """Payload for PATCH /api/v1/leads/{id}/status"""
    status: LeadStatus
    notes: Optional[str] = None


# ─── Response Schemas ─────────────────────────────────────────────────────────

class LeadResponse(BaseModel):
    """Full lead details returned by the API."""
    id: str
    status: str
    service_type: str
    property_type: Optional[str]
    city: Optional[str]
    client_name: Optional[str]
    client_email: Optional[str]
    client_phone: Optional[str]
    budget_min: Optional[float]
    budget_max: Optional[float]
    required_work: Optional[list[str]]
    meeting_preference: Optional[str]
    notes: Optional[str]
    source: Optional[str]
    created_at: datetime
    updated_at: Optional[datetime]

    model_config = {"from_attributes": True}


class LeadListResponse(BaseModel):
    """Paginated list of leads."""
    total: int
    leads: list[LeadResponse]
