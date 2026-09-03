from pydantic import BaseModel, EmailStr
from typing import Optional
from uuid import UUID
from datetime import datetime, date

# ----------------------------------------
# NEWSLETTER
# ----------------------------------------
class NewsletterSubscriberCreate(BaseModel):
    email: EmailStr
    source: Optional[str] = "footer"

class NewsletterSubscriberResponse(BaseModel):
    id: UUID
    email: str
    status: str
    source: str
    created_at: datetime

    class Config:
        from_attributes = True

# ----------------------------------------
# CONTACT INQUIRY
# ----------------------------------------
class ContactInquiryCreate(BaseModel):
    firstName: str
    lastName: str
    email: EmailStr
    phone: Optional[str] = None
    message: str

class ContactInquiryResponse(BaseModel):
    id: UUID
    first_name: str
    last_name: str
    email: str
    phone: Optional[str] = None
    message: str
    status: str
    created_at: datetime

    class Config:
        from_attributes = True

class ContactInquiryUpdate(BaseModel):
    status: str

# ----------------------------------------
# CONSULTATION REQUEST
# ----------------------------------------
class ConsultationRequestCreate(BaseModel):
    name: str
    email: EmailStr
    phone: str
    city: str
    preferred_date: Optional[date] = None
    requirement_type: Optional[str] = None

class ConsultationRequestResponse(BaseModel):
    id: UUID
    name: str
    email: str
    phone: str
    city: str
    preferred_date: Optional[date] = None
    requirement_type: Optional[str] = None
    status: str
    notes: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True

class ConsultationRequestUpdate(BaseModel):
    status: Optional[str] = None
    notes: Optional[str] = None
