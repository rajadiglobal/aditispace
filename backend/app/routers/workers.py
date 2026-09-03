"""
Workers router — /api/v1/workers/

Endpoints:
  POST  /api/v1/workers/   Register a worker (public)
  GET   /api/v1/workers/   List workers (admin only)
"""

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.dependencies import require_admin
from app.models.worker import Worker
from app.schemas.worker import WorkerCreate, WorkerListResponse, WorkerResponse

router = APIRouter(prefix="/api/v1/workers", tags=["workers"])


@router.post(
    "/",
    status_code=status.HTTP_201_CREATED,
    summary="Register a worker",
    description="Public endpoint — any contractor/tradesperson can self-register.",
)
async def register_worker(
    payload: WorkerCreate,
    db: Session = Depends(get_db),
) -> dict:
    # Check for duplicate phone number
    existing = db.query(Worker).filter(Worker.phone == payload.phone).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="A worker with this phone number is already registered.",
        )

    worker = Worker(**payload.model_dump())
    db.add(worker)
    db.commit()
    db.refresh(worker)
    return {
        "id": str(worker.id),
        "message": "Registration submitted. Our team will verify and contact you shortly.",
    }


@router.get(
    "/",
    response_model=WorkerListResponse,
    summary="List workers",
    description="Admin only — list all registered workers with optional filters.",
)
async def list_workers(
    is_available: bool | None = Query(None),
    worker_type: str | None = Query(None),
    city: str | None = Query(None),
    limit: int = Query(50, ge=1, le=200),
    offset: int = Query(0, ge=0),
    db: Session = Depends(get_db),
    _admin=Depends(require_admin),
) -> WorkerListResponse:
    query = db.query(Worker).order_by(Worker.created_at.desc())

    if is_available is not None:
        query = query.filter(Worker.is_available == is_available)
    if worker_type:
        query = query.filter(Worker.worker_type.ilike(f"%{worker_type}%"))
    if city:
        query = query.filter(Worker.city.ilike(f"%{city}%"))

    total = query.count()
    workers = query.offset(offset).limit(limit).all()

    return WorkerListResponse(
        total=total,
        workers=[WorkerResponse.model_validate(w) for w in workers],
    )
