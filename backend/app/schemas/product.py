from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime
from uuid import UUID

# Shared generic response base
class BaseResponse(BaseModel):
    id: UUID
    created_at: datetime
    
    class Config:
        from_attributes = True

# --- Images ---
class ProductImageBase(BaseModel):
    is_main: bool = False
    display_order: int = 0

class ProductImageCreate(ProductImageBase):
    file_path: str

class ProductImageResponse(BaseResponse, ProductImageBase):
    file_path: str
    product_id: UUID


# --- Specifications ---
class ProductSpecificationBase(BaseModel):
    name: str
    value: str
    unit: Optional[str] = None

class ProductSpecificationCreate(ProductSpecificationBase):
    pass

class ProductSpecificationResponse(ProductSpecificationBase):
    id: UUID
    product_id: UUID

    class Config:
        from_attributes = True


# --- Variants ---
class ProductVariantBase(BaseModel):
    name: str
    sku: Optional[str] = None
    price: Optional[float] = None
    color: Optional[str] = None
    size: Optional[str] = None
    material: Optional[str] = None
    availability: bool = True
    image_url: Optional[str] = None

class ProductVariantCreate(ProductVariantBase):
    pass

class ProductVariantResponse(BaseResponse, ProductVariantBase):
    product_id: UUID
    updated_at: Optional[datetime] = None


# --- Category ---
class CategoryBase(BaseModel):
    name: str
    description: Optional[str] = None
    image_url: Optional[str] = None
    parent_id: Optional[UUID] = None
    is_active: bool = True

class CategoryCreate(CategoryBase):
    pass

class CategoryResponse(BaseResponse, CategoryBase):
    updated_at: Optional[datetime] = None


# --- Brand ---
class BrandBase(BaseModel):
    name: str
    description: Optional[str] = None

class BrandCreate(BrandBase):
    pass

class BrandResponse(BaseResponse, BrandBase):
    updated_at: Optional[datetime] = None


# --- Collection ---
class CollectionBase(BaseModel):
    name: str
    description: Optional[str] = None

class CollectionCreate(CollectionBase):
    pass

class CollectionResponse(BaseResponse, CollectionBase):
    updated_at: Optional[datetime] = None


# --- Product ---
class ProductBase(BaseModel):
    name: str
    sku: str
    category_id: Optional[UUID] = None
    collection_id: Optional[UUID] = None
    brand_id: Optional[UUID] = None
    description: Optional[str] = None
    short_description: Optional[str] = None
    price: float = 0.0
    sale_price: Optional[float] = None
    unit: str = "Piece"
    availability: bool = True
    status: str = "DRAFT"
    is_featured: bool = False

class ProductCreate(ProductBase):
    pass

class ProductUpdate(BaseModel):
    name: Optional[str] = None
    sku: Optional[str] = None
    category_id: Optional[UUID] = None
    collection_id: Optional[UUID] = None
    brand_id: Optional[UUID] = None
    description: Optional[str] = None
    short_description: Optional[str] = None
    price: Optional[float] = None
    sale_price: Optional[float] = None
    unit: Optional[str] = None
    availability: Optional[bool] = None
    status: Optional[str] = None
    is_featured: Optional[bool] = None

class ProductResponse(BaseResponse, ProductBase):
    updated_at: Optional[datetime] = None
    
    # We might not always want to load these, but for detail view we do
    images: List[ProductImageResponse] = []
    specifications: List[ProductSpecificationResponse] = []
    variants: List[ProductVariantResponse] = []
    
    # Simple relations if needed
    category: Optional[CategoryResponse] = None
    brand: Optional[BrandResponse] = None
    collection: Optional[CollectionResponse] = None
