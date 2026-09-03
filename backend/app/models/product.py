"""
Product Catalog Models.
"""

import uuid
from datetime import datetime, timezone
from sqlalchemy import Boolean, Column, DateTime, Float, ForeignKey, Integer, String, Text, Uuid, Enum
from sqlalchemy.orm import relationship

from app.database import Base


class Category(Base):
    __tablename__ = "categories"

    id = Column(Uuid(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String(255), nullable=False)
    description = Column(Text)
    image_url = Column(String(500))
    parent_id = Column(Uuid(as_uuid=True), ForeignKey("categories.id", ondelete="SET NULL"), nullable=True)
    is_active = Column(Boolean, default=True)

    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime(timezone=True), onupdate=lambda: datetime.now(timezone.utc))

    subcategories = relationship("Category", backref="parent", remote_side=[id])
    products = relationship("Product", back_populates="category")


class Collection(Base):
    __tablename__ = "collections"

    id = Column(Uuid(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String(255), nullable=False)
    description = Column(Text)
    
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime(timezone=True), onupdate=lambda: datetime.now(timezone.utc))

    products = relationship("Product", back_populates="collection")


class Brand(Base):
    __tablename__ = "brands"

    id = Column(Uuid(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String(255), nullable=False)
    description = Column(Text)
    
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime(timezone=True), onupdate=lambda: datetime.now(timezone.utc))

    products = relationship("Product", back_populates="brand")


class Product(Base):
    __tablename__ = "products"

    id = Column(Uuid(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String(255), nullable=False)
    sku = Column(String(100), unique=True, nullable=False, index=True)
    
    category_id = Column(Uuid(as_uuid=True), ForeignKey("categories.id", ondelete="SET NULL"), nullable=True)
    collection_id = Column(Uuid(as_uuid=True), ForeignKey("collections.id", ondelete="SET NULL"), nullable=True)
    brand_id = Column(Uuid(as_uuid=True), ForeignKey("brands.id", ondelete="SET NULL"), nullable=True)
    
    description = Column(Text)
    short_description = Column(String(500))
    price = Column(Float, nullable=False, default=0.0)
    sale_price = Column(Float, nullable=True)
    unit = Column(String(50), default="Piece")
    availability = Column(Boolean, default=True)
    
    status = Column(
        Enum("DRAFT", "ACTIVE", "INACTIVE", "OUT_OF_STOCK", "ARCHIVED", name="product_status_enum"),
        default="DRAFT",
        nullable=False,
        index=True
    )
    is_featured = Column(Boolean, default=False)

    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime(timezone=True), onupdate=lambda: datetime.now(timezone.utc))

    category = relationship("Category", back_populates="products")
    collection = relationship("Collection", back_populates="products")
    brand = relationship("Brand", back_populates="products")
    
    images = relationship("ProductImage", back_populates="product", cascade="all, delete-orphan", order_by="ProductImage.display_order")
    specifications = relationship("ProductSpecification", back_populates="product", cascade="all, delete-orphan")
    variants = relationship("ProductVariant", back_populates="product", cascade="all, delete-orphan")


class ProductImage(Base):
    __tablename__ = "product_images"

    id = Column(Uuid(as_uuid=True), primary_key=True, default=uuid.uuid4)
    product_id = Column(Uuid(as_uuid=True), ForeignKey("products.id", ondelete="CASCADE"), nullable=False)
    
    file_path = Column(String(500), nullable=False)
    is_main = Column(Boolean, default=False)
    display_order = Column(Integer, default=0)
    
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))

    product = relationship("Product", back_populates="images")


class ProductSpecification(Base):
    __tablename__ = "product_specifications"

    id = Column(Uuid(as_uuid=True), primary_key=True, default=uuid.uuid4)
    product_id = Column(Uuid(as_uuid=True), ForeignKey("products.id", ondelete="CASCADE"), nullable=False)
    
    name = Column(String(255), nullable=False)
    value = Column(String(255), nullable=False)
    unit = Column(String(50))
    
    product = relationship("Product", back_populates="specifications")


class ProductVariant(Base):
    __tablename__ = "product_variants"

    id = Column(Uuid(as_uuid=True), primary_key=True, default=uuid.uuid4)
    product_id = Column(Uuid(as_uuid=True), ForeignKey("products.id", ondelete="CASCADE"), nullable=False)
    
    name = Column(String(255), nullable=False)
    sku = Column(String(100), unique=True)
    price = Column(Float, nullable=True) # overrides product price if set
    
    color = Column(String(100))
    size = Column(String(100))
    material = Column(String(100))
    availability = Column(Boolean, default=True)
    
    image_url = Column(String(500))
    
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime(timezone=True), onupdate=lambda: datetime.now(timezone.utc))
    
    product = relationship("Product", back_populates="variants")
