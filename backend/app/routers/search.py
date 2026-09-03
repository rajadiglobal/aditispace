from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from sqlalchemy import or_, and_

from app.database import get_db
from app.dependencies import get_current_user
from app.models.user import User
from app.models.lead import Lead
from app.models.requirement import Requirement
from app.models.project import Project
from app.models.quotation import Quotation
from app.models.product import Product

router = APIRouter(prefix="/api/v1/search", tags=["search"])

@router.get("", summary="Global CRM Search")
def global_search(
    q: str = Query(..., min_length=2, description="Search query"),
    user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Search across Customers, Leads, Requirements, Projects, Products, Quotations.
    Access restricted to admin and staff.
    """
    # Enforce Role
    if user.role not in ["admin", "staff"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Customers are not authorized to use the global CRM search."
        )

    search_term = f"%{q}%"
    results = {
        "customers": [],
        "leads": [],
        "requirements": [],
        "projects": [],
        "products": [],
        "quotations": []
    }

    # Search Customers (User role='client')
    # Assuming User model has name, email, phone
    customers = db.query(User).filter(
        and_(
            User.role == "client",
            or_(
                User.name.ilike(search_term),
                User.email.ilike(search_term),
                User.phone.ilike(search_term) if hasattr(User, 'phone') else False
            )
        )
    ).limit(10).all()
    for c in customers:
        results["customers"].append({
            "id": c.id,
            "title": c.name or c.email,
            "subtitle": c.email,
            "type": "customer"
        })

    # Search Leads
    leads = db.query(Lead).filter(
        or_(
            Lead.client_name.ilike(search_term),
            Lead.client_email.ilike(search_term),
            Lead.client_phone.ilike(search_term)
        )
    ).limit(10).all()
    for l in leads:
        results["leads"].append({
            "id": l.id,
            "title": l.client_name,
            "subtitle": l.client_email or l.client_phone,
            "type": "lead"
        })

    # Search Requirements
    reqs = db.query(Requirement).filter(
        or_(
            Requirement.customer_name.ilike(search_term),
            Requirement.customer_email.ilike(search_term),
            Requirement.customer_phone.ilike(search_term),
            Requirement.scope.ilike(search_term)
        )
    ).limit(10).all()
    for r in reqs:
        results["requirements"].append({
            "id": r.id,
            "title": r.customer_name or "Unknown",
            "subtitle": f"Scope: {r.scope} - Status: {r.status}",
            "type": "requirement"
        })

    # Search Projects
    # Assuming Project model has name
    if hasattr(Project, 'name'):
        projects = db.query(Project).filter(
            or_(
                Project.name.ilike(search_term),
                Project.description.ilike(search_term) if hasattr(Project, 'description') else False
            )
        ).limit(10).all()
        for p in projects:
            results["projects"].append({
                "id": p.id,
                "title": p.name,
                "subtitle": f"Status: {p.status}",
                "type": "project"
            })

    # Search Products
    products = db.query(Product).filter(
        or_(
            Product.name.ilike(search_term),
            Product.sku.ilike(search_term)
        )
    ).limit(10).all()
    for prod in products:
        results["products"].append({
            "id": prod.id,
            "title": prod.name,
            "subtitle": f"SKU: {prod.sku}",
            "type": "product"
        })

    # Search Quotations
    # Assuming Quotation model has quotation_number or title
    if hasattr(Quotation, 'quotation_number'):
        quots = db.query(Quotation).filter(
            Quotation.quotation_number.ilike(search_term)
        ).limit(10).all()
        for q_item in quots:
            results["quotations"].append({
                "id": q_item.id,
                "title": q_item.quotation_number,
                "subtitle": f"Status: {q_item.status}",
                "type": "quotation"
            })

    return results
