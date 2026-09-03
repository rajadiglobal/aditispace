from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from uuid import UUID

from app.database import get_db
from app.models.contact import ContactInquiry
from app.schemas.public_forms import ContactInquiryCreate, ContactInquiryResponse, ContactInquiryUpdate
from app.dependencies import require_admin

router = APIRouter(prefix="/contact", tags=["Contact"])

@router.post("", response_model=ContactInquiryResponse, status_code=status.HTTP_201_CREATED)
def submit_contact(data: ContactInquiryCreate, db: Session = Depends(get_db)):
    inquiry = ContactInquiry(
        first_name=data.firstName,
        last_name=data.lastName,
        email=data.email,
        phone=data.phone,
        message=data.message,
    )
    db.add(inquiry)
    db.commit()
    db.refresh(inquiry)
    return inquiry

# Admin Routes
@router.get("", response_model=List[ContactInquiryResponse])
def get_all_inquiries(db: Session = Depends(get_db), current_user=Depends(require_admin)):
    return db.query(ContactInquiry).order_by(ContactInquiry.created_at.desc()).all()

@router.patch("/{inquiry_id}", response_model=ContactInquiryResponse)
def update_inquiry(inquiry_id: UUID, data: ContactInquiryUpdate, db: Session = Depends(get_db), current_user=Depends(require_admin)):
    inquiry = db.query(ContactInquiry).filter(ContactInquiry.id == inquiry_id).first()
    if not inquiry:
        raise HTTPException(status_code=404, detail="Inquiry not found")
    
    inquiry.status = data.status
    db.commit()
    db.refresh(inquiry)
    return inquiry
