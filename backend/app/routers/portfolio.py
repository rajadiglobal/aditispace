"""
Portfolio router — /api/v1/portfolio/

Endpoints:
  GET /api/v1/portfolio/        Public — list published portfolio items
  GET /api/v1/portfolio/{id}    Public — single item details
"""

from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.portfolio import PortfolioItem

router = APIRouter(prefix="/api/v1/portfolio", tags=["portfolio"])


@router.get(
    "/",
    summary="Get portfolio items",
    description="Public — returns published portfolio items sorted by display order.",
)
async def list_portfolio(
    category: str | None = Query(None, description="Filter by category"),
    featured_only: bool = Query(False),
    limit: int = Query(20, ge=1, le=100),
    offset: int = Query(0, ge=0),
    db: Session = Depends(get_db),
) -> dict:
    query = (
        db.query(PortfolioItem)
        .filter(PortfolioItem.is_published == True)  # noqa: E712
        .order_by(PortfolioItem.is_featured.desc(), PortfolioItem.display_order.asc())
    )

    if category:
        query = query.filter(PortfolioItem.category == category)
    if featured_only:
        query = query.filter(PortfolioItem.is_featured == True)  # noqa: E712

    total = query.count()
    items = query.offset(offset).limit(limit).all()

    return {
        "total": total,
        "items": [
            {
                "id": str(item.id),
                "title": item.title,
                "description": item.description,
                "category": item.category,
                "location": item.location,
                "image_url": item.image_url,
                "before_image_url": item.before_image_url,
                "after_image_url": item.after_image_url,
                "video_url": item.video_url,
                "tags": item.tags,
                "budget_display": item.budget_display,
                "is_featured": item.is_featured,
            }
            for item in items
        ],
    }


@router.get(
    "/{item_id}",
    summary="Get single portfolio item",
)
async def get_portfolio_item(
    item_id: str,
    db: Session = Depends(get_db),
) -> dict:
    import uuid
    from fastapi import HTTPException

    try:
        uid = uuid.UUID(item_id)
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid item ID.")

    item = (
        db.query(PortfolioItem)
        .filter(PortfolioItem.id == uid, PortfolioItem.is_published == True)  # noqa: E712
        .first()
    )
    if not item:
        raise HTTPException(status_code=404, detail="Portfolio item not found.")

    return {
        "id": str(item.id),
        "title": item.title,
        "description": item.description,
        "category": item.category,
        "location": item.location,
        "image_url": item.image_url,
        "before_image_url": item.before_image_url,
        "after_image_url": item.after_image_url,
        "video_url": item.video_url,
        "tags": item.tags,
        "budget_display": item.budget_display,
        "is_featured": item.is_featured,
    }
