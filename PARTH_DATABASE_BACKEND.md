# 🗄️ PARTH'S TASK — Database Configuration & Backend API Setup
**Assigned To:** Parth  
**Project:** Avyron Studio Interior Design CRM  
**Stack:** Python FastAPI · PostgreSQL · SQLAlchemy ORM · Alembic Migrations  
**Priority:** 🔴 Critical — Auth (Rimesh) and API Integration (Pratibha) depend on this  

---

## 📋 Overview

Your task is to:
1. **Set up the FastAPI backend** application structure in the `backend/` folder.
2. **Configure PostgreSQL** as the primary database.
3. **Design and create all CRM database tables** using SQLAlchemy ORM models.
4. **Run Alembic migrations** to apply schemas to the database.
5. **Implement the Google Auth endpoint** (`POST /api/v1/auth/google`) needed by Rimesh.
6. **Implement core CRM CRUD endpoints** that Pratibha will connect to the frontend.

---

## 🗺️ Database Architecture (Entity Relationship)

```
users ──────────────── leads ──────────── lead_services
  │                      │
  │                      ├─── projects ── project_workers
  │                      │
  │                      └─── quotations
  │
workers ──────────────── worker_skills
  │
  └── worker_verifications

portfolio_items
testimonials
```

---

## 🛠️ Step 1 — Environment Setup

### 1.1 — Install Prerequisites

```bash
# Install Python 3.11+
python3 --version

# Install PostgreSQL (Mac)
brew install postgresql@16
brew services start postgresql@16

# Create the database
psql postgres
CREATE DATABASE avyron_crm;
CREATE USER avyron_user WITH PASSWORD 'your-strong-password';
GRANT ALL PRIVILEGES ON DATABASE avyron_crm TO avyron_user;
\q
```

### 1.2 — Backend Project Structure

Create this folder structure inside `backend/`:

```
backend/
├── app/
│   ├── __init__.py
│   ├── main.py                  ← FastAPI app entry point
│   ├── config.py                ← Settings & env variables
│   ├── database.py              ← DB engine & session
│   ├── dependencies.py          ← Shared dependencies (get_db, get_current_user)
│   │
│   ├── models/                  ← SQLAlchemy ORM models
│   │   ├── __init__.py
│   │   ├── user.py
│   │   ├── lead.py
│   │   ├── project.py
│   │   ├── worker.py
│   │   ├── quotation.py
│   │   └── portfolio.py
│   │
│   ├── schemas/                 ← Pydantic request/response models
│   │   ├── __init__.py
│   │   ├── user.py
│   │   ├── lead.py
│   │   ├── project.py
│   │   └── worker.py
│   │
│   ├── routers/                 ← API route handlers
│   │   ├── __init__.py
│   │   ├── auth.py              ← /api/v1/auth/*
│   │   ├── leads.py             ← /api/v1/leads/*
│   │   ├── projects.py          ← /api/v1/projects/*
│   │   ├── workers.py           ← /api/v1/workers/*
│   │   └── portfolio.py         ← /api/v1/portfolio/*
│   │
│   └── utils/
│       ├── __init__.py
│       ├── jwt.py               ← JWT token creation/verification
│       └── google_auth.py       ← Google token verification
│
├── alembic/                     ← Database migrations
│   ├── env.py
│   └── versions/
│
├── alembic.ini
├── requirements.txt
├── .env                         ← Environment variables (never commit)
└── run.py                       ← Startup script
```

---

## 🛠️ Step 2 — Install Python Dependencies

Create `backend/requirements.txt`:

```txt
fastapi==0.115.0
uvicorn[standard]==0.30.6
sqlalchemy==2.0.35
alembic==1.13.3
psycopg2-binary==2.9.9
python-jose[cryptography]==3.3.0
passlib[bcrypt]==1.7.4
python-multipart==0.0.12
pydantic-settings==2.5.2
google-auth==2.35.0
google-auth-oauthlib==1.2.1
python-dotenv==1.0.1
httpx==0.27.2
boto3==1.35.28
celery==5.4.0
redis==5.1.1
```

Install:
```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

---

## 🛠️ Step 3 — Environment Variables

Create `backend/.env`:

```env
# Database
DATABASE_URL=postgresql://avyron_user:your-strong-password@localhost:5432/avyron_crm

# JWT
JWT_SECRET_KEY=your-super-secret-jwt-key-min-32-chars
JWT_ALGORITHM=HS256
JWT_ACCESS_TOKEN_EXPIRE_MINUTES=10080

# Google OAuth (same Client ID as Rimesh uses)
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com

# App
APP_NAME=Avyron Studio CRM API
DEBUG=True
ALLOWED_ORIGINS=http://localhost:3000,https://yourdomain.com
```

---

## 🛠️ Step 4 — Database Configuration

### `backend/app/config.py`

```python
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    app_name: str = "Avyron Studio CRM API"
    debug: bool = True
    database_url: str
    jwt_secret_key: str
    jwt_algorithm: str = "HS256"
    jwt_access_token_expire_minutes: int = 10080  # 7 days
    google_client_id: str
    allowed_origins: str = "http://localhost:3000"

    class Config:
        env_file = ".env"

settings = Settings()
```

### `backend/app/database.py`

```python
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, DeclarativeBase
from app.config import settings

# Create the database engine
engine = create_engine(
    settings.database_url,
    pool_pre_ping=True,       # Reconnect on stale connections
    pool_size=10,             # Connection pool size
    max_overflow=20,          # Allow extra connections
    echo=settings.debug,      # Log SQL queries in debug mode
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

class Base(DeclarativeBase):
    pass

def get_db():
    """Dependency: provides a database session per request."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
```

---

## 🛠️ Step 5 — Database Models (SQLAlchemy)

### `backend/app/models/user.py`

```python
from sqlalchemy import Column, String, DateTime, Enum, Boolean
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from datetime import datetime, timezone
import uuid
from app.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    email = Column(String(255), unique=True, nullable=False, index=True)
    name = Column(String(255), nullable=False)
    picture = Column(String(500))
    google_id = Column(String(255), unique=True, index=True)
    role = Column(Enum("client", "admin", "staff", name="user_role"), default="client")
    is_active = Column(Boolean, default=True)
    phone = Column(String(20))
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime(timezone=True), onupdate=lambda: datetime.now(timezone.utc))

    # Relationships
    leads = relationship("Lead", back_populates="user")
```

### `backend/app/models/lead.py`

```python
from sqlalchemy import Column, String, Integer, Float, DateTime, Enum, Text, ForeignKey
from sqlalchemy.dialects.postgresql import UUID, ARRAY, JSONB
from sqlalchemy.orm import relationship
from datetime import datetime, timezone
import uuid
from app.database import Base

class Lead(Base):
    __tablename__ = "leads"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=True)

    # Step 1: Service Type
    service_type = Column(Enum("complete_interior", "design_only", "consultancy", name="service_type"))

    # Step 2: Property
    property_type = Column(Enum("apartment", "villa", "office", "shop", "restaurant", "hotel", name="property_type"))

    # Step 3: Location
    city = Column(String(100))
    address = Column(Text)
    pincode = Column(String(10))

    # Step 4: Scope
    carpet_area = Column(Float)       # in sq ft
    buildup_area = Column(Float)
    num_rooms = Column(Integer)
    budget_min = Column(Float)
    budget_max = Column(Float)
    expected_start_date = Column(DateTime)
    expected_end_date = Column(DateTime)

    # Step 5: Required Work (array of service names)
    required_work = Column(ARRAY(String))

    # Step 7: Contact
    client_name = Column(String(255))
    client_email = Column(String(255))
    client_phone = Column(String(20))

    # Step 8: Meeting Preference
    meeting_preference = Column(Enum("site_visit", "video_call", "phone_call", "office_visit", name="meeting_type"))

    # CRM Status
    status = Column(
        Enum("new", "contacted", "site_visit_scheduled", "quoted", "negotiating", "won", "lost", name="lead_status"),
        default="new"
    )
    assigned_to = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=True)
    notes = Column(Text)
    source = Column(String(100), default="website_form")

    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime(timezone=True), onupdate=lambda: datetime.now(timezone.utc))

    # Relationships
    user = relationship("User", back_populates="leads", foreign_keys=[user_id])
```

### `backend/app/models/worker.py`

```python
from sqlalchemy import Column, String, Integer, Float, DateTime, Boolean, Text
from sqlalchemy.dialects.postgresql import UUID, ARRAY
from datetime import datetime, timezone
import uuid
from app.database import Base

class Worker(Base):
    __tablename__ = "workers"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String(255), nullable=False)
    phone = Column(String(20), nullable=False, unique=True)
    email = Column(String(255), unique=True)
    address = Column(Text)
    city = Column(String(100))
    experience_years = Column(Integer)
    daily_wage = Column(Float)
    worker_type = Column(String(100))    # carpenter, painter, etc.
    skills = Column(ARRAY(String))
    is_available = Column(Boolean, default=True)
    is_verified = Column(Boolean, default=False)
    aadhar_number = Column(String(20))
    pan_number = Column(String(20))
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
```

---

## 🛠️ Step 6 — Alembic Migrations

### Initialize Alembic

```bash
cd backend
alembic init alembic
```

### Edit `alembic/env.py` — add these lines:

```python
# At the top:
import sys
sys.path.append(".")
from app.database import Base
from app.models import user, lead, worker, project, quotation  # import all models

# Replace `target_metadata = None` with:
target_metadata = Base.metadata

# Update get_url():
from app.config import settings
def get_url():
    return settings.database_url
```

### Create and run the first migration:

```bash
# Generate migration
alembic revision --autogenerate -m "initial_schema"

# Apply migration to database
alembic upgrade head

# To rollback:
alembic downgrade -1
```

---

## 🛠️ Step 7 — Google Auth Endpoint (Critical for Rimesh)

### `backend/app/utils/google_auth.py`

```python
from google.oauth2 import id_token
from google.auth.transport import requests
from app.config import settings

def verify_google_token(token: str) -> dict:
    """Verify a Google id_token and return the user info."""
    try:
        idinfo = id_token.verify_oauth2_token(
            token,
            requests.Request(),
            settings.google_client_id
        )
        if idinfo["iss"] not in ["accounts.google.com", "https://accounts.google.com"]:
            raise ValueError("Invalid issuer.")
        return idinfo
    except Exception as e:
        raise ValueError(f"Invalid Google token: {e}")
```

### `backend/app/utils/jwt.py`

```python
from datetime import datetime, timedelta, timezone
from jose import JWTError, jwt
from app.config import settings

def create_access_token(data: dict) -> str:
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + timedelta(minutes=settings.jwt_access_token_expire_minutes)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, settings.jwt_secret_key, algorithm=settings.jwt_algorithm)

def verify_token(token: str) -> dict:
    try:
        payload = jwt.decode(token, settings.jwt_secret_key, algorithms=[settings.jwt_algorithm])
        return payload
    except JWTError:
        raise ValueError("Invalid token")
```

### `backend/app/routers/auth.py`

```python
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from pydantic import BaseModel
from app.database import get_db
from app.models.user import User
from app.utils.google_auth import verify_google_token
from app.utils.jwt import create_access_token

router = APIRouter(prefix="/api/v1/auth", tags=["authentication"])

class GoogleAuthRequest(BaseModel):
    id_token: str
    email: str | None = None
    name: str | None = None
    picture: str | None = None

class AuthResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: dict

@router.post("/google", response_model=AuthResponse)
async def google_auth(payload: GoogleAuthRequest, db: Session = Depends(get_db)):
    """
    Verify Google id_token, create/find user in DB, return our JWT.
    This is called by NextAuth.js (Rimesh's implementation).
    """
    try:
        # 1. Verify the Google token
        google_info = verify_google_token(payload.id_token)
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail=str(e))

    google_id = google_info["sub"]
    email = google_info.get("email", payload.email)
    name = google_info.get("name", payload.name)
    picture = google_info.get("picture", payload.picture)

    # 2. Find or create user in database
    user = db.query(User).filter(User.google_id == google_id).first()
    if not user:
        # Check if user exists with same email
        user = db.query(User).filter(User.email == email).first()
        if user:
            user.google_id = google_id
            user.picture = picture
        else:
            # Create new user
            user = User(
                email=email,
                name=name,
                picture=picture,
                google_id=google_id,
                role="client",
            )
            db.add(user)

    db.commit()
    db.refresh(user)

    # 3. Create our JWT token
    access_token = create_access_token(
        data={"sub": str(user.id), "email": user.email, "role": user.role}
    )

    return AuthResponse(
        access_token=access_token,
        user={
            "id": str(user.id),
            "email": user.email,
            "name": user.name,
            "picture": user.picture,
            "role": user.role,
        }
    )
```

---

## 🛠️ Step 8 — FastAPI Main App

### `backend/app/main.py`

```python
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.routers import auth, leads, projects, workers, portfolio

app = FastAPI(
    title=settings.app_name,
    version="1.0.0",
    docs_url="/docs",         # Swagger UI at http://localhost:8000/docs
    redoc_url="/redoc",
)

# CORS — allow Next.js frontend to call the API
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.allowed_origins.split(","),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register all routers
app.include_router(auth.router)
app.include_router(leads.router)
app.include_router(projects.router)
app.include_router(workers.router)
app.include_router(portfolio.router)

@app.get("/health")
async def health_check():
    return {"status": "ok", "service": settings.app_name}
```

### `backend/run.py`

```python
import uvicorn

if __name__ == "__main__":
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
```

---

## 🛠️ Step 9 — Run the Backend

```bash
cd backend
source venv/bin/activate

# Apply database migrations
alembic upgrade head

# Start the dev server
python run.py

# Visit Swagger docs:
# http://localhost:8000/docs
```

---

## 🛠️ Step 10 — Core CRM Lead Endpoints (for Pratibha)

### `backend/app/routers/leads.py`

```python
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.lead import Lead
from app.dependencies import get_current_user
from pydantic import BaseModel
from typing import Optional, List
import uuid

router = APIRouter(prefix="/api/v1/leads", tags=["leads"])

class LeadCreate(BaseModel):
    service_type: str
    property_type: str
    city: str
    address: Optional[str] = None
    pincode: Optional[str] = None
    carpet_area: Optional[float] = None
    num_rooms: Optional[int] = None
    budget_min: Optional[float] = None
    budget_max: Optional[float] = None
    required_work: Optional[List[str]] = []
    client_name: str
    client_email: str
    client_phone: str
    meeting_preference: Optional[str] = None

@router.post("/", status_code=status.HTTP_201_CREATED)
async def create_lead(payload: LeadCreate, db: Session = Depends(get_db)):
    """Submit a new lead from the Project Planner form."""
    lead = Lead(**payload.model_dump())
    db.add(lead)
    db.commit()
    db.refresh(lead)
    return {"id": str(lead.id), "message": "Lead submitted successfully"}

@router.get("/")
async def list_leads(
    status: Optional[str] = None,
    limit: int = 20,
    offset: int = 0,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """Admin: List all leads with optional status filter."""
    if current_user.role not in ["admin", "staff"]:
        raise HTTPException(status_code=403, detail="Not authorized")
    query = db.query(Lead)
    if status:
        query = query.filter(Lead.status == status)
    total = query.count()
    leads = query.offset(offset).limit(limit).all()
    return {"total": total, "leads": leads}

@router.patch("/{lead_id}/status")
async def update_lead_status(
    lead_id: str,
    new_status: str,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """Admin: Update lead status in the CRM pipeline."""
    lead = db.query(Lead).filter(Lead.id == uuid.UUID(lead_id)).first()
    if not lead:
        raise HTTPException(status_code=404, detail="Lead not found")
    lead.status = new_status
    db.commit()
    return {"message": "Status updated"}
```

---

## ✅ API Endpoints Summary

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| GET | `/health` | Health check | No |
| POST | `/api/v1/auth/google` | Google OAuth login | No |
| POST | `/api/v1/leads/` | Submit project planner form | No |
| GET | `/api/v1/leads/` | List all leads (admin) | Yes (admin) |
| PATCH | `/api/v1/leads/{id}/status` | Update lead status | Yes (admin) |
| GET | `/api/v1/projects/` | List projects | Yes |
| POST | `/api/v1/workers/` | Register a worker | No |
| GET | `/api/v1/portfolio/` | Get portfolio items | No |

> Full API docs available at `http://localhost:8000/docs` (Swagger UI) once backend is running.

---

## 📁 Files to Create

| Action | File Path |
|---|---|
| CREATE | `backend/requirements.txt` |
| CREATE | `backend/.env` |
| CREATE | `backend/app/main.py` |
| CREATE | `backend/app/config.py` |
| CREATE | `backend/app/database.py` |
| CREATE | `backend/app/models/user.py` |
| CREATE | `backend/app/models/lead.py` |
| CREATE | `backend/app/models/worker.py` |
| CREATE | `backend/app/routers/auth.py` |
| CREATE | `backend/app/routers/leads.py` |
| CREATE | `backend/app/utils/jwt.py` |
| CREATE | `backend/app/utils/google_auth.py` |
| CREATE | `backend/run.py` |
| RUN | `alembic init alembic` → `alembic upgrade head` |

---

## 🤝 Coordination

- **Rimesh** (Auth): He needs `POST /api/v1/auth/google` working first. Prioritize `routers/auth.py`.
- **Pratibha** (API Integration): She will call your endpoints from the frontend. Share the Swagger URL (`/docs`) with her.
- **Share** `GOOGLE_CLIENT_ID` with Rimesh — must be the same value in both frontend and backend `.env` files.

---

*Assigned to: Parth | Avyron Studio CRM | 2026-08-26*
