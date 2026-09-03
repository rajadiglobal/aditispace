from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from uuid import UUID

from app.database import get_db
from app.dependencies import require_admin
from app.models.product import Brand, Product
from app.schemas.product import BrandCreate, BrandResponse

router = APIRouter(prefix="/api/v1/brands", tags=["brands"])
admin_router = APIRouter(prefix="/api/v1/admin/brands", tags=["admin-brands"])

# --- PUBLIC ENDPOINTS ---

@router.get("", response_model=List[BrandResponse])
def get_brands(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    brands = db.query(Brand).offset(skip).limit(limit).all()
    return brands

@router.get("/{brand_id}", response_model=BrandResponse)
def get_brand(brand_id: UUID, db: Session = Depends(get_db)):
    brand = db.query(Brand).filter(Brand.id == brand_id).first()
    if not brand:
        raise HTTPException(status_code=404, detail="Brand not found")
    return brand

# --- ADMIN ENDPOINTS ---

@admin_router.get("", response_model=List[BrandResponse])
def admin_get_brands(skip: int = 0, limit: int = 100, db: Session = Depends(get_db), _admin = Depends(require_admin)):
    return db.query(Brand).offset(skip).limit(limit).all()

@admin_router.get("/{brand_id}", response_model=BrandResponse)
def admin_get_brand(brand_id: UUID, db: Session = Depends(get_db), _admin = Depends(require_admin)):
    brand = db.query(Brand).filter(Brand.id == brand_id).first()
    if not brand:
        raise HTTPException(status_code=404, detail="Brand not found")
    return brand

@admin_router.post("", response_model=BrandResponse, status_code=status.HTTP_201_CREATED)
def create_brand(brand_in: BrandCreate, db: Session = Depends(get_db), _admin = Depends(require_admin)):
    new_brand = Brand(**brand_in.model_dump())
    db.add(new_brand)
    db.commit()
    db.refresh(new_brand)
    return new_brand

@admin_router.put("/{brand_id}", response_model=BrandResponse)
def update_brand(brand_id: UUID, brand_in: BrandCreate, db: Session = Depends(get_db), _admin = Depends(require_admin)):
    brand = db.query(Brand).filter(Brand.id == brand_id).first()
    if not brand:
        raise HTTPException(status_code=404, detail="Brand not found")
    update_data = brand_in.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(brand, key, value)
    db.commit()
    db.refresh(brand)
    return brand

@admin_router.delete("/{brand_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_brand(brand_id: UUID, db: Session = Depends(get_db), _admin = Depends(require_admin)):
    brand = db.query(Brand).filter(Brand.id == brand_id).first()
    if not brand:
        raise HTTPException(status_code=404, detail="Brand not found")
        
    # Safe delete check: are there products?
    if db.query(Product).filter(Product.brand_id == brand_id).first():
        raise HTTPException(status_code=400, detail="Cannot delete: Brand has linked products.")
        
    db.delete(brand)
    db.commit()
    return None
