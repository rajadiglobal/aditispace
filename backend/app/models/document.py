"""
Document ORM model.

A Document stores metadata for uploaded files. Legacy files may have S3 paths, while new files will use local relative paths.
"""

import uuid
from datetime import datetime, timezone

from sqlalchemy import Column, DateTime, ForeignKey, Integer, String, Uuid
from sqlalchemy.orm import relationship

from app.database import Base


class Document(Base):
    __tablename__ = "documents"

    id = Column(Uuid(as_uuid=True), primary_key=True, default=uuid.uuid4)
    original_name = Column(String(255), nullable=False)
    file_path = Column(String(500), nullable=False)
    file_type = Column(String(50))
    file_size = Column(Integer)  # in bytes

    uploaded_by_id = Column(Uuid(as_uuid=True), ForeignKey("users.id"), nullable=True)
    customer_id = Column(Uuid(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=True)
    requirement_id = Column(Uuid(as_uuid=True), ForeignKey("requirements.id", ondelete="CASCADE"), nullable=True)
    project_id = Column(Uuid(as_uuid=True), ForeignKey("projects.id", ondelete="CASCADE"), nullable=True)

    created_at = Column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False,
    )

    def __repr__(self) -> str:
        return f"<Document id={self.id} original_name={self.original_name}>"
