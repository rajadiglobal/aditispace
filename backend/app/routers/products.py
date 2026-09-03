from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
from uuid import UUID

from app.database import get_db
from app.dependencies import require_admin
from app.models.product import Product, ProductImage, ProductSpecification, ProductVariant
from app.models.project import ProjectProduct
from app.models.quotation import QuotationItem
from app.models.requirement import RequirementProduct
from app.schemas.product import (
    ProductCreate, ProductResponse, ProductUpdate,
    ProductImageCreate, ProductImageResponse,
    ProductSpecificationCreate, ProductSpecificationResponse,
    ProductVariantCreate, ProductVariantResponse
)

router = APIRouter(prefix="/api/v1/products", tags=["products"])
admin_router = APIRouter(prefix="/api/v1/admin/products", tags=["admin-products"])

# --- PUBLIC ENDPOINTS ---

@router.get("", response_model=List[ProductResponse])
def get_products(
    skip: int = 0, limit: int = 100,
    search: Optional[str] = None,
    category_id: Optional[UUID] = None,
    collection_id: Optional[UUID] = None,
    brand_id: Optional[UUID] = None,
    status: Optional[str] = None,
    is_featured: Optional[bool] = None,
    min_price: Optional[float] = None,
    max_price: Optional[float] = None,
    db: Session = Depends(get_db)
):
    query = db.query(Product)
    if search:
        query = query.filter(Product.name.ilike(f"%{search}%") | Product.sku.ilike(f"%{search}%"))
    if category_id:
        query = query.filter(Product.category_id == category_id)
    if collection_id:
        query = query.filter(Product.collection_id == collection_id)
    if brand_id:
        query = query.filter(Product.brand_id == brand_id)
    if status:
        query = query.filter(Product.status == status)
    if is_featured is not None:
        query = query.filter(Product.is_featured == is_featured)
    if min_price is not None:
        query = query.filter(Product.price >= min_price)
    if max_price is not None:
        query = query.filter(Product.price <= max_price)
        
    return query.offset(skip).limit(limit).all()

@router.get("/{product_id}", response_model=ProductResponse)
def get_product(product_id: UUID, db: Session = Depends(get_db)):
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return product

# --- ADMIN ENDPOINTS ---

@admin_router.get("", response_model=List[ProductResponse])
def admin_get_products(skip: int = 0, limit: int = 100, db: Session = Depends(get_db), _admin = Depends(require_admin)):
    return db.query(Product).offset(skip).limit(limit).all()

@admin_router.get("/{product_id}", response_model=ProductResponse)
def admin_get_product(product_id: UUID, db: Session = Depends(get_db), _admin = Depends(require_admin)):
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return product

@admin_router.post("", response_model=ProductResponse, status_code=status.HTTP_201_CREATED)
def create_product(product_in: ProductCreate, db: Session = Depends(get_db), _admin = Depends(require_admin)):
    existing = db.query(Product).filter(Product.sku == product_in.sku).first()
    if existing:
        raise HTTPException(status_code=400, detail="SKU already exists.")
    new_product = Product(**product_in.model_dump())
    db.add(new_product)
    db.commit()
    db.refresh(new_product)
    return new_product

@admin_router.put("/{product_id}", response_model=ProductResponse)
def update_product(product_id: UUID, product_in: ProductUpdate, db: Session = Depends(get_db), _admin = Depends(require_admin)):
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    update_data = product_in.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(product, key, value)
    db.commit()
    db.refresh(product)
    return product

@admin_router.delete("/{product_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_product(product_id: UUID, db: Session = Depends(get_db), _admin = Depends(require_admin)):
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
        
    # Check CRM constraints for Safe Deletion
    if db.query(ProjectProduct).filter(ProjectProduct.product_id == product_id).first():
        raise HTTPException(status_code=400, detail="Cannot delete: Product is linked to an existing Project. Please Archive it instead.")
    if db.query(RequirementProduct).filter(RequirementProduct.product_id == product_id).first():
        raise HTTPException(status_code=400, detail="Cannot delete: Product is linked to an existing Requirement. Please Archive it instead.")
    if db.query(QuotationItem).filter(QuotationItem.product_id == product_id).first():
        raise HTTPException(status_code=400, detail="Cannot delete: Product is linked to an existing Quotation. Please Archive it instead.")
        
    db.delete(product)
    db.commit()
    return None

# --- ADMIN: Product Images ---
@admin_router.post("/{product_id}/images", response_model=ProductImageResponse, status_code=status.HTTP_201_CREATED)
def add_product_image(product_id: UUID, image_in: ProductImageCreate, db: Session = Depends(get_db), _admin = Depends(require_admin)):
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    if image_in.is_main:
        db.query(ProductImage).filter(ProductImage.product_id == product_id).update({"is_main": False})
    new_image = ProductImage(product_id=product_id, **image_in.model_dump())
    db.add(new_image)
    db.commit()
    db.refresh(new_image)
    return new_image

@admin_router.delete("/{product_id}/images/{image_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_product_image(product_id: UUID, image_id: UUID, db: Session = Depends(get_db), _admin = Depends(require_admin)):
    image = db.query(ProductImage).filter(ProductImage.id == image_id, ProductImage.product_id == product_id).first()
    if not image:
        raise HTTPException(status_code=404, detail="Image not found")
    db.delete(image)
    db.commit()
    return None

@admin_router.put("/{product_id}/images/{image_id}/main", response_model=ProductImageResponse)
def set_main_image(product_id: UUID, image_id: UUID, db: Session = Depends(get_db), _admin = Depends(require_admin)):
    image = db.query(ProductImage).filter(ProductImage.id == image_id, ProductImage.product_id == product_id).first()
    if not image:
        raise HTTPException(status_code=404, detail="Image not found")
    
    # Unset others
    db.query(ProductImage).filter(ProductImage.product_id == product_id).update({"is_main": False})
    image.is_main = True
    db.commit()
    db.refresh(image)
    return image

# --- ADMIN: Product Specifications ---
@admin_router.post("/{product_id}/specifications", response_model=ProductSpecificationResponse, status_code=status.HTTP_201_CREATED)
def add_product_specification(product_id: UUID, spec_in: ProductSpecificationCreate, db: Session = Depends(get_db), _admin = Depends(require_admin)):
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    new_spec = ProductSpecification(product_id=product_id, **spec_in.model_dump())
    db.add(new_spec)
    db.commit()
    db.refresh(new_spec)
    return new_spec

@admin_router.delete("/{product_id}/specifications/{spec_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_product_specification(product_id: UUID, spec_id: UUID, db: Session = Depends(get_db), _admin = Depends(require_admin)):
    spec = db.query(ProductSpecification).filter(ProductSpecification.id == spec_id, ProductSpecification.product_id == product_id).first()
    if not spec:
        raise HTTPException(status_code=404, detail="Specification not found")
    db.delete(spec)
    db.commit()
    return None

# --- ADMIN: Product Variants ---
@admin_router.post("/{product_id}/variants", response_model=ProductVariantResponse, status_code=status.HTTP_201_CREATED)
def add_product_variant(product_id: UUID, variant_in: ProductVariantCreate, db: Session = Depends(get_db), _admin = Depends(require_admin)):
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    new_var = ProductVariant(product_id=product_id, **variant_in.model_dump())
    db.add(new_var)
    db.commit()
    db.refresh(new_var)
    return new_var

@admin_router.delete("/{product_id}/variants/{variant_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_product_variant(product_id: UUID, variant_id: UUID, db: Session = Depends(get_db), _admin = Depends(require_admin)):
    variant = db.query(ProductVariant).filter(ProductVariant.id == variant_id, ProductVariant.product_id == product_id).first()
    if not variant:
        raise HTTPException(status_code=404, detail="Variant not found")
    db.delete(variant)
    db.commit()
    return None
