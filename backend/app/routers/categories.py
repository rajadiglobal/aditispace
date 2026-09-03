from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from uuid import UUID

from app.database import get_db
from app.dependencies import require_admin
from app.models.product import Category, Product
from app.schemas.product import CategoryCreate, CategoryResponse

router = APIRouter(prefix="/api/v1/categories", tags=["categories"])
admin_router = APIRouter(prefix="/api/v1/admin/categories", tags=["admin-categories"])

# --- PUBLIC ENDPOINTS ---

@router.get("", response_model=List[CategoryResponse])
def get_categories(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    """Fetch all active categories."""
    categories = db.query(Category).filter(Category.is_active == True).offset(skip).limit(limit).all()
    return categories

@router.get("/{category_id}", response_model=CategoryResponse)
def get_category(category_id: UUID, db: Session = Depends(get_db)):
    category = db.query(Category).filter(Category.id == category_id).first()
    if not category:
        raise HTTPException(status_code=404, detail="Category not found")
    return category

# --- ADMIN ENDPOINTS ---

@admin_router.get("", response_model=List[CategoryResponse])
def admin_get_categories(skip: int = 0, limit: int = 100, db: Session = Depends(get_db), _admin = Depends(require_admin)):
    categories = db.query(Category).offset(skip).limit(limit).all()
    return categories

@admin_router.get("/{category_id}", response_model=CategoryResponse)
def admin_get_category(category_id: UUID, db: Session = Depends(get_db), _admin = Depends(require_admin)):
    category = db.query(Category).filter(Category.id == category_id).first()
    if not category:
        raise HTTPException(status_code=404, detail="Category not found")
    return category

@admin_router.post("", response_model=CategoryResponse, status_code=status.HTTP_201_CREATED)
def create_category(category_in: CategoryCreate, db: Session = Depends(get_db), _admin = Depends(require_admin)):
    new_cat = Category(**category_in.model_dump())
    db.add(new_cat)
    db.commit()
    db.refresh(new_cat)
    return new_cat

@admin_router.put("/{category_id}", response_model=CategoryResponse)
def update_category(category_id: UUID, category_in: CategoryCreate, db: Session = Depends(get_db), _admin = Depends(require_admin)):
    category = db.query(Category).filter(Category.id == category_id).first()
    if not category:
        raise HTTPException(status_code=404, detail="Category not found")
    update_data = category_in.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(category, key, value)
    db.commit()
    db.refresh(category)
    return category

@admin_router.delete("/{category_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_category(category_id: UUID, db: Session = Depends(get_db), _admin = Depends(require_admin)):
    category = db.query(Category).filter(Category.id == category_id).first()
    if not category:
        raise HTTPException(status_code=404, detail="Category not found")
        
    # Safe delete check: are there products?
    if db.query(Product).filter(Product.category_id == category_id).first():
        raise HTTPException(status_code=400, detail="Cannot delete: Category has linked products. Please deactivate it or reassign the products.")
        
    db.delete(category)
    db.commit()
    return None
