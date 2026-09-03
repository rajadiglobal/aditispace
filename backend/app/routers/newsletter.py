from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from uuid import UUID

from app.database import get_db
from app.models.newsletter import NewsletterSubscriber
from app.schemas.public_forms import NewsletterSubscriberCreate, NewsletterSubscriberResponse
from app.dependencies import require_admin

router = APIRouter(prefix="/newsletter", tags=["Newsletter"])

@router.post("/subscribe", response_model=NewsletterSubscriberResponse, status_code=status.HTTP_201_CREATED)
def subscribe(data: NewsletterSubscriberCreate, db: Session = Depends(get_db)):
    # Check if exists
    existing = db.query(NewsletterSubscriber).filter(NewsletterSubscriber.email == data.email).first()
    if existing:
        if existing.status == "unsubscribed":
            existing.status = "active"
            existing.source = data.source or "footer"
            db.commit()
            db.refresh(existing)
            return existing
        return existing  # Already active, just return success

    new_sub = NewsletterSubscriber(email=data.email, source=data.source or "footer")
    db.add(new_sub)
    db.commit()
    db.refresh(new_sub)
    return new_sub

# Admin Routes
@router.get("", response_model=List[NewsletterSubscriberResponse])
def get_all_subscribers(db: Session = Depends(get_db), current_user=Depends(require_admin)):
    return db.query(NewsletterSubscriber).order_by(NewsletterSubscriber.created_at.desc()).all()
