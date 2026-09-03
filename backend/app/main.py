"""
Avyron Studio CRM — FastAPI application entry point.

Registers all routers and global middleware.
Visit http://localhost:8000/docs for the interactive Swagger UI.
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import os

from app.config import settings
from app.routers import (
    auth, leads, portfolio, projects, workers, products, 
    categories, uploads, dashboard, search, newsletter, contact, 
    consultations, requirements, brands, collections
)

# ─── App Instance ─────────────────────────────────────────────────────────────

app = FastAPI(
    title=settings.app_name,
    version="1.0.0",
    description=(
        "REST API for the Avyron Studio Interior Design CRM Platform. "
        "Handles authentication, lead management, worker registration, "
        "and portfolio content."
    ),
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url="/openapi.json",
)

# ─── CORS Middleware ──────────────────────────────────────────────────────────
# Allow the Next.js frontend (Pratibha) to call the API from the browser.

origins = [o.strip() for o in settings.allowed_origins.split(",")]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ─── Routers ─────────────────────────────────────────────────────────────────

app.include_router(auth.router)
app.include_router(leads.router)
app.include_router(products.router)
app.include_router(products.admin_router)
app.include_router(categories.router)
app.include_router(categories.admin_router)
app.include_router(search.router)
app.include_router(uploads.router)
app.include_router(projects.router)
app.include_router(portfolio.router)
app.include_router(workers.router)
app.include_router(brands.router)
app.include_router(brands.admin_router)
app.include_router(collections.router)
app.include_router(collections.admin_router)

# Phase 1: New CRM Routers
app.include_router(dashboard.router, prefix="/api/v1")
app.include_router(newsletter.router, prefix="/api/v1")
app.include_router(contact.router, prefix="/api/v1")
app.include_router(consultations.router, prefix="/api/v1")
app.include_router(requirements.router, prefix="/api/v1")

# ─── Static Files ────────────────────────────────────────────────────────────
# Ensure uploads dir exists before mounting
os.makedirs("uploads", exist_ok=True)
app.mount("/static/uploads", StaticFiles(directory="uploads"), name="uploads")


# ─── Health Check ────────────────────────────────────────────────────────────

@app.get("/health", tags=["system"])
async def health_check() -> dict:
    """Returns 200 OK when the backend is running. Used for deployment checks."""
    return {"status": "ok", "service": settings.app_name}


@app.get("/", tags=["system"])
async def root() -> dict:
    """Root endpoint — redirects to /docs in browser."""
    return {
        "message": f"Welcome to {settings.app_name}",
        "docs": "/docs",
        "health": "/health",
    }
