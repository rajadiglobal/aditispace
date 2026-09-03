from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from uuid import UUID

from app.database import get_db
from app.models.requirement import Requirement
from app.schemas.requirement import RequirementCreate, RequirementResponse, RequirementUpdate
from app.dependencies import require_admin

router = APIRouter(prefix="/requirements", tags=["Requirements"])

@router.post("", response_model=RequirementResponse, status_code=status.HTTP_201_CREATED)
def submit_requirement(data: RequirementCreate, db: Session = Depends(get_db)):
    req = Requirement(**data.dict())
    db.add(req)
    db.commit()
    db.refresh(req)
    return req

# Admin Routes
@router.get("", response_model=List[RequirementResponse])
def get_all_requirements(db: Session = Depends(get_db), current_user=Depends(require_admin)):
    return db.query(Requirement).order_by(Requirement.created_at.desc()).all()

@router.patch("/{req_id}", response_model=RequirementResponse)
def update_requirement(req_id: UUID, data: RequirementUpdate, db: Session = Depends(get_db), current_user=Depends(require_admin)):
    req = db.query(Requirement).filter(Requirement.id == req_id).first()
    if not req:
        raise HTTPException(status_code=404, detail="Requirement not found")
    
    if data.status:
        req.status = data.status
    if data.additional_notes is not None:
        req.additional_notes = data.additional_notes
        
    db.commit()
    db.refresh(req)
    return req
