from pydantic import BaseModel, EmailStr
from typing import Optional, List
from uuid import UUID
from datetime import datetime

class RequirementCreate(BaseModel):
    # Customer Info
    customer_name: Optional[str] = None
    customer_email: Optional[EmailStr] = None
    customer_phone: Optional[str] = None
    customer_whatsapp: Optional[str] = None
    
    # Project Info
    property_type: Optional[str] = None
    property_status: Optional[str] = None
    
    # Location
    location_city: Optional[str] = None
    location_state: Optional[str] = None
    location_locality: Optional[str] = None
    pincode: Optional[str] = None
    address: Optional[str] = None
    
    # Scope & Size
    scope: Optional[str] = None
    property_size: Optional[str] = None
    
    # Budget & Timeline
    budget_range: Optional[str] = None
    timeline: Optional[str] = None
    
    # Preferences
    design_preferences: Optional[str] = None
    additional_notes: Optional[str] = None

class RequirementResponse(RequirementCreate):
    id: UUID
    status: str
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class RequirementUpdate(BaseModel):
    status: Optional[str] = None
    additional_notes: Optional[str] = None
