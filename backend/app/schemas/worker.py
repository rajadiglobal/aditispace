"""
Pydantic schemas for Worker API requests and responses.
"""

from datetime import datetime
from typing import Optional

from pydantic import BaseModel, EmailStr, Field


# ─── Request Schemas ─────────────────────────────────────────────────────────

class WorkerCreate(BaseModel):
    """Payload for POST /api/v1/workers/"""
    name: str = Field(..., min_length=2, max_length=255)
    phone: str = Field(..., pattern=r"^[6-9]\d{9}$")
    email: Optional[EmailStr] = None
    address: Optional[str] = None
    city: Optional[str] = None
    experience_years: Optional[int] = Field(None, ge=0, le=50)
    daily_wage: Optional[float] = Field(None, gt=0)
    worker_type: str = Field(..., min_length=2, max_length=100)
    skills: Optional[list[str]] = []


class WorkerFilter(BaseModel):
    """Query params for GET /api/v1/workers/"""
    is_available: Optional[bool] = None
    worker_type: Optional[str] = None
    city: Optional[str] = None


# ─── Response Schemas ─────────────────────────────────────────────────────────

class WorkerResponse(BaseModel):
    id: str
    name: str
    phone: str
    email: Optional[str]
    city: Optional[str]
    worker_type: Optional[str]
    skills: Optional[list[str]]
    experience_years: Optional[int]
    daily_wage: Optional[float]
    is_available: bool
    is_verified: bool
    created_at: datetime

    model_config = {"from_attributes": True}


class WorkerListResponse(BaseModel):
    total: int
    workers: list[WorkerResponse]
