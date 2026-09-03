"""
Aditi Studio CRM — Backend startup script.

Usage:
    cd backend
    source venv/bin/activate
    python run.py

Swagger docs: http://localhost:8000/docs
ReDoc:        http://localhost:8000/redoc
"""

import uvicorn

if __name__ == "__main__":
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info",
    )
