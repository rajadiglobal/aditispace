"""
Projects router — /api/v1/projects/

Stub implementation — to be expanded in a future sprint.
"""

from fastapi import APIRouter, Depends

from app.dependencies import get_current_user

router = APIRouter(prefix="/api/v1/projects", tags=["projects"])


@router.get(
    "/",
    summary="List projects",
    description="Returns active projects. Full implementation coming in next sprint.",
)
async def list_projects(
    _user=Depends(get_current_user),
) -> dict:
    return {
        "total": 0,
        "projects": [],
        "message": "Projects module coming soon.",
    }
