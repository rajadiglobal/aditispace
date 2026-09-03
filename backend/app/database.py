"""
Database engine, session factory, and SQLAlchemy declarative base.

All ORM models inherit from `Base`.
All route handlers receive a `db: Session` via the `get_db` dependency.
"""

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, DeclarativeBase
from app.config import settings


# ─── Engine ───────────────────────────────────────────────────────────────────

engine = create_engine(
    settings.database_url,
    pool_pre_ping=True,       # Detect stale connections and reconnect
    pool_size=10,             # Number of persistent connections
    max_overflow=20,          # Extra connections allowed above pool_size
    echo=settings.debug,      # Log all SQL queries in debug mode
)


# ─── Session Factory ──────────────────────────────────────────────────────────

SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine,
)


# ─── Declarative Base ─────────────────────────────────────────────────────────

class Base(DeclarativeBase):
    """All ORM models inherit from this class."""
    pass


# ─── FastAPI Dependency ───────────────────────────────────────────────────────

def get_db():
    """
    Yield a database session per request, and always close it when done.

    Usage in route handlers:
        db: Session = Depends(get_db)
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
