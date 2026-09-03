import os
import uuid
import shutil
from pathlib import Path
from fastapi import APIRouter, Depends, File, UploadFile, HTTPException, status
from PIL import Image

# Use dependency injection if you want to restrict uploads to specific roles, but for now we will keep it simple.
# from app.routers.auth import get_current_user  # depending on how auth is structured

router = APIRouter(prefix="/api/v1/upload", tags=["upload"])

UPLOAD_DIR = Path("uploads")
PRODUCTS_DIR = UPLOAD_DIR / "products"
DOCUMENTS_DIR = UPLOAD_DIR / "documents"

# Ensure directories exist
PRODUCTS_DIR.mkdir(parents=True, exist_ok=True)
DOCUMENTS_DIR.mkdir(parents=True, exist_ok=True)

ALLOWED_IMAGE_TYPES = {"image/jpeg", "image/png", "image/webp"}
MAX_IMAGE_SIZE = 5 * 1024 * 1024  # 5MB

@router.post("/image", summary="Upload a product image")
async def upload_image(file: UploadFile = File(...)):
    """
    Uploads an image, validates its size and type, resizes if too large, and converts to webp.
    Returns the relative URL path to access the image.
    """
    if file.content_type not in ALLOWED_IMAGE_TYPES:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Unsupported file type: {file.content_type}. Allowed types are: {ALLOWED_IMAGE_TYPES}",
        )

    # Check file size by reading content
    file_bytes = await file.read()
    if len(file_bytes) > MAX_IMAGE_SIZE:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"File too large. Maximum size is {MAX_IMAGE_SIZE / (1024 * 1024)}MB",
        )
    
    # Process image with Pillow
    try:
        from io import BytesIO
        image = Image.open(BytesIO(file_bytes))
        
        # Convert to RGB if it's RGBA and we want to save as JPEG, though we will prefer WEBP
        if image.mode in ("RGBA", "P"):
            image = image.convert("RGB")
            
        # Resize if dimensions are too large (e.g., max 1920x1080)
        max_size = (1920, 1080)
        image.thumbnail(max_size, Image.Resampling.LANCZOS)
        
        # Generate safe unique filename
        file_ext = ".webp"
        unique_filename = f"{uuid.uuid4()}{file_ext}"
        file_path = PRODUCTS_DIR / unique_filename
        
        # Save as optimized webp
        image.save(file_path, "WEBP", quality=85, optimize=True)
        
        # Path to return to the client (to be served statically)
        # e.g. "/static/uploads/products/1234.webp"
        public_url = f"/static/uploads/products/{unique_filename}"
        
        return {"url": public_url, "filename": unique_filename}
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Could not process image: {str(e)}"
        )
