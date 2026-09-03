from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from uuid import UUID

from app.database import get_db
from app.models.consultation import ConsultationRequest
from app.models.newsletter import NewsletterSubscriber
from app.schemas.public_forms import ConsultationRequestCreate, ConsultationRequestResponse, ConsultationRequestUpdate
from app.dependencies import require_admin

router = APIRouter(prefix="/consultations", tags=["Consultation"])

@router.post("", response_model=ConsultationRequestResponse, status_code=status.HTTP_201_CREATED)
def submit_consultation(data: ConsultationRequestCreate, db: Session = Depends(get_db)):
    consult = ConsultationRequest(**data.dict())
    db.add(consult)

    # Add to newsletter
    existing = db.query(NewsletterSubscriber).filter(NewsletterSubscriber.email == data.email).first()
    if not existing:
        sub = NewsletterSubscriber(email=data.email, source="consultation_form")
        db.add(sub)
    elif existing.status == "unsubscribed":
        existing.status = "active"
        existing.source = "consultation_form"

    db.commit()
    db.refresh(consult)
    return consult

# Admin Routes
@router.get("", response_model=List[ConsultationRequestResponse])
def get_all_consultations(db: Session = Depends(get_db), current_user=Depends(require_admin)):
    return db.query(ConsultationRequest).order_by(ConsultationRequest.created_at.desc()).all()

@router.patch("/{consult_id}", response_model=ConsultationRequestResponse)
def update_consultation(consult_id: UUID, data: ConsultationRequestUpdate, db: Session = Depends(get_db), current_user=Depends(require_admin)):
    consult = db.query(ConsultationRequest).filter(ConsultationRequest.id == consult_id).first()
    if not consult:
        raise HTTPException(status_code=404, detail="Consultation not found")
    
    if data.status:
        consult.status = data.status
    if data.notes is not None:
        consult.notes = data.notes
        
    db.commit()
    db.refresh(consult)
    return consult
