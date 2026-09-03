"""
Application settings — loaded from backend/.env via pydantic-settings.

All environment variables are typed and validated at startup.
"""

from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    # App
    app_name: str = "Aditi Studio CRM API"
    debug: bool = True
    
    # CRM Admin
    admin_email: str | None = None
    
    # Local File Storage
    upload_dir: str = "uploads"

    # Database
    database_url: str

    # JWT
    jwt_secret_key: str
    jwt_algorithm: str = "HS256"
    jwt_access_token_expire_minutes: int = 10080  # 7 days

    # Google OAuth (same Client ID as Rimesh uses in frontend)
    google_client_id: str

    # CORS — comma-separated origins
    allowed_origins: str = "http://localhost:3000"

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"


# Singleton settings instance — import this everywhere
settings = Settings()
