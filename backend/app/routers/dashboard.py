from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import func

from app.database import get_db
from app.dependencies import get_current_user
from app.models.user import User
from app.models.lead import Lead
from app.models.requirement import Requirement
from app.models.project import Project
from app.models.quotation import Quotation
from app.models.product import Product
from app.models.appointment import Appointment
from app.models.task import Task

router = APIRouter(prefix="/dashboard", tags=["dashboard"])

@router.get("/stats", summary="Get Admin Dashboard Statistics")
def get_dashboard_stats(
    user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Returns aggregated counts for the admin dashboard.
    Only accessible by admin or staff.
    """
    # Enforce role
    if user.role not in ["admin", "staff"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to access dashboard statistics."
        )

    # We use direct count queries for efficiency instead of loading all records.
    
    total_leads = db.query(func.count(Lead.id)).scalar() or 0
    new_leads = db.query(func.count(Lead.id)).filter(Lead.status == "new").scalar() or 0
    
    total_customers = db.query(func.count(User.id)).filter(User.role == "client").scalar() or 0
    
    pending_requirements = db.query(func.count(Requirement.id)).filter(Requirement.status.in_(["new", "under_review"])).scalar() or 0
    
    active_projects = db.query(func.count(Project.id)).filter(Project.status == "in_progress").scalar() or 0
    
    pending_quotations = db.query(func.count(Quotation.id)).filter(Quotation.status.in_(["draft", "sent"])).scalar() or 0
    
    upcoming_appointments = db.query(func.count(Appointment.id)).filter(Appointment.status == "scheduled").scalar() or 0
    
    pending_tasks = db.query(func.count(Task.id)).filter(Task.status.in_(["todo", "in_progress"])).scalar() or 0
    
    total_products = db.query(func.count(Product.id)).scalar() or 0
    active_products = db.query(func.count(Product.id)).filter(Product.status == "ACTIVE").scalar() or 0
    
    # We could also add recent activities or upcoming appointments list here if desired.
    
    return {
        "leads": {
            "total": total_leads,
            "new": new_leads,
        },
        "customers": {
            "total": total_customers,
        },
        "requirements": {
            "pending": pending_requirements,
        },
        "projects": {
            "active": active_projects,
        },
        "quotations": {
            "pending": pending_quotations,
        },
        "appointments": {
            "upcoming": upcoming_appointments,
        },
        "tasks": {
            "pending": pending_tasks,
        },
        "products": {
            "total": total_products,
            "active": active_products,
        }
    }
