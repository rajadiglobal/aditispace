"""
Leads router — /api/v1/leads/

Endpoints:
  POST   /api/v1/leads/              Submit Project Planner form (public)
  GET    /api/v1/leads/              List all leads in CRM (admin only)
  GET    /api/v1/leads/{id}          Get a single lead's full details (admin)
  PATCH  /api/v1/leads/{id}/status   Update lead pipeline status (admin)
"""

import uuid

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.dependencies import require_admin
from app.models.lead import Lead
from app.schemas.lead import LeadCreate, LeadListResponse, LeadResponse, LeadStatusUpdate

router = APIRouter(prefix="/api/v1/leads", tags=["leads"])


# ── POST /api/v1/leads/ ───────────────────────────────────────────────────────

@router.post(
    "/",
    status_code=status.HTTP_201_CREATED,
    summary="Submit Project Planner form",
    description="Public endpoint — no auth required. Creates a new CRM lead from the 9-step form.",
)
async def create_lead(
    payload: LeadCreate,
    db: Session = Depends(get_db),
) -> dict:
    lead = Lead(**payload.model_dump())
    db.add(lead)
    db.commit()
    db.refresh(lead)
    return {
        "id": str(lead.id),
        "message": "Your project request has been submitted. Our team will contact you within 24 hours.",
    }


# ── GET /api/v1/leads/ ────────────────────────────────────────────────────────

@router.get(
    "/",
    response_model=LeadListResponse,
    summary="List all CRM leads",
    description="Admin only — returns a paginated list of all leads with optional status filter.",
)
async def list_leads(
    lead_status: str | None = Query(None, alias="status", description="Filter by CRM status"),
    limit: int = Query(20, ge=1, le=100),
    offset: int = Query(0, ge=0),
    db: Session = Depends(get_db),
    _admin=Depends(require_admin),
) -> LeadListResponse:
    query = db.query(Lead).order_by(Lead.created_at.desc())

    if lead_status:
        query = query.filter(Lead.status == lead_status)

    total = query.count()
    leads = query.offset(offset).limit(limit).all()

    return LeadListResponse(
        total=total,
        leads=[LeadResponse.model_validate(lead) for lead in leads],
    )


# ── GET /api/v1/leads/{id} ────────────────────────────────────────────────────

@router.get(
    "/{lead_id}",
    response_model=LeadResponse,
    summary="Get single lead details",
    description="Admin only — returns full details of a single lead.",
)
async def get_lead(
    lead_id: str,
    db: Session = Depends(get_db),
    _admin=Depends(require_admin),
) -> LeadResponse:
    try:
        uid = uuid.UUID(lead_id)
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid lead ID format.")

    lead = db.query(Lead).filter(Lead.id == uid).first()
    if not lead:
        raise HTTPException(status_code=404, detail="Lead not found.")

    return LeadResponse.model_validate(lead)


# ── PATCH /api/v1/leads/{id}/status ──────────────────────────────────────────

@router.patch(
    "/{lead_id}/status",
    summary="Update lead CRM status",
    description="Admin only — moves a lead through the CRM pipeline.",
)
async def update_lead_status(
    lead_id: str,
    body: LeadStatusUpdate,
    db: Session = Depends(get_db),
    _admin=Depends(require_admin),
) -> dict:
    try:
        uid = uuid.UUID(lead_id)
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid lead ID format.")

    lead = db.query(Lead).filter(Lead.id == uid).first()
    if not lead:
        raise HTTPException(status_code=404, detail="Lead not found.")

    lead.status = body.status
    if body.notes is not None:
        lead.notes = body.notes

    db.commit()
    return {"message": f"Lead status updated to '{body.status}'."}
