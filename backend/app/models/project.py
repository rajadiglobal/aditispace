"""
Project ORM model.

Projects are created from converted Leads.
Contains association table to link multiple Workers to a Project.
"""

import uuid
from datetime import datetime, timezone

from sqlalchemy import Column, DateTime, ForeignKey, String, Text, Uuid, Enum, Integer
from sqlalchemy.orm import relationship

from app.database import Base


class ProjectProduct(Base):
    __tablename__ = "project_products"

    id = Column(Uuid(as_uuid=True), primary_key=True, default=uuid.uuid4)
    project_id = Column(Uuid(as_uuid=True), ForeignKey("projects.id", ondelete="CASCADE"), nullable=False)
    product_id = Column(Uuid(as_uuid=True), ForeignKey("products.id", ondelete="CASCADE"), nullable=False)
    
    quantity = Column(Integer, default=1)
    status = Column(String(50), default="pending") # e.g. pending, ordered, installed
    notes = Column(Text)
    
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))

    project = relationship("Project", back_populates="products")
    product = relationship("Product")


class ProjectWorker(Base):
    """
    Association table between Projects and Workers.
    """
    __tablename__ = "project_workers"

    id = Column(Uuid(as_uuid=True), primary_key=True, default=uuid.uuid4)
    project_id = Column(Uuid(as_uuid=True), ForeignKey("projects.id", ondelete="CASCADE"), nullable=False)
    worker_id = Column(Uuid(as_uuid=True), ForeignKey("workers.id", ondelete="CASCADE"), nullable=False)
    assigned_role = Column(String(100))
    assigned_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))

    project = relationship("Project", back_populates="workers")
    worker = relationship("Worker")


class Project(Base):
    __tablename__ = "projects"

    id = Column(Uuid(as_uuid=True), primary_key=True, default=uuid.uuid4)
    lead_id = Column(Uuid(as_uuid=True), ForeignKey("leads.id", ondelete="SET NULL"), nullable=True, unique=True)
    
    name = Column(String(255), nullable=False)
    description = Column(Text)
    
    status = Column(
        Enum("planning", "in_progress", "on_hold", "completed", "cancelled", name="project_status"),
        default="planning",
        nullable=False,
    )

    start_date = Column(DateTime(timezone=True))
    end_date = Column(DateTime(timezone=True))

    created_at = Column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False,
    )
    updated_at = Column(
        DateTime(timezone=True),
        onupdate=lambda: datetime.now(timezone.utc),
    )

    # Relationships
    lead = relationship("Lead")
    workers = relationship("ProjectWorker", back_populates="project", cascade="all, delete-orphan")
    products = relationship("ProjectProduct", back_populates="project", cascade="all, delete-orphan")

    def __repr__(self) -> str:
        return f"<Project id={self.id} name={self.name} status={self.status}>"
