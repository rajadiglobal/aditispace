from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from uuid import UUID

from app.database import get_db
from app.dependencies import require_admin
from app.models.product import Collection, Product
from app.schemas.product import CollectionCreate, CollectionResponse

router = APIRouter(prefix="/api/v1/collections", tags=["collections"])
admin_router = APIRouter(prefix="/api/v1/admin/collections", tags=["admin-collections"])

# --- PUBLIC ENDPOINTS ---

@router.get("", response_model=List[CollectionResponse])
def get_collections(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    collections = db.query(Collection).offset(skip).limit(limit).all()
    return collections

@router.get("/{collection_id}", response_model=CollectionResponse)
def get_collection(collection_id: UUID, db: Session = Depends(get_db)):
    collection = db.query(Collection).filter(Collection.id == collection_id).first()
    if not collection:
        raise HTTPException(status_code=404, detail="Collection not found")
    return collection

# --- ADMIN ENDPOINTS ---

@admin_router.get("", response_model=List[CollectionResponse])
def admin_get_collections(skip: int = 0, limit: int = 100, db: Session = Depends(get_db), _admin = Depends(require_admin)):
    return db.query(Collection).offset(skip).limit(limit).all()

@admin_router.get("/{collection_id}", response_model=CollectionResponse)
def admin_get_collection(collection_id: UUID, db: Session = Depends(get_db), _admin = Depends(require_admin)):
    collection = db.query(Collection).filter(Collection.id == collection_id).first()
    if not collection:
        raise HTTPException(status_code=404, detail="Collection not found")
    return collection

@admin_router.post("", response_model=CollectionResponse, status_code=status.HTTP_201_CREATED)
def create_collection(collection_in: CollectionCreate, db: Session = Depends(get_db), _admin = Depends(require_admin)):
    new_col = Collection(**collection_in.model_dump())
    db.add(new_col)
    db.commit()
    db.refresh(new_col)
    return new_col

@admin_router.put("/{collection_id}", response_model=CollectionResponse)
def update_collection(collection_id: UUID, collection_in: CollectionCreate, db: Session = Depends(get_db), _admin = Depends(require_admin)):
    collection = db.query(Collection).filter(Collection.id == collection_id).first()
    if not collection:
        raise HTTPException(status_code=404, detail="Collection not found")
    update_data = collection_in.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(collection, key, value)
    db.commit()
    db.refresh(collection)
    return collection

@admin_router.delete("/{collection_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_collection(collection_id: UUID, db: Session = Depends(get_db), _admin = Depends(require_admin)):
    collection = db.query(Collection).filter(Collection.id == collection_id).first()
    if not collection:
        raise HTTPException(status_code=404, detail="Collection not found")
        
    # Safe delete check: are there products?
    if db.query(Product).filter(Product.collection_id == collection_id).first():
        raise HTTPException(status_code=400, detail="Cannot delete: Collection has linked products.")
        
    db.delete(collection)
    db.commit()
    return None
