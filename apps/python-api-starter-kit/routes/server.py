"""Server health and status routes."""

from fastapi import APIRouter

from core import __version__, get_settings
from schemas import HealthResponse

router = APIRouter()


@router.get("/health", response_model=HealthResponse, summary="Health check")
async def health_check():
    """Detailed health check endpoint."""
    settings = get_settings()
    return HealthResponse(
        status="healthy",
        version=__version__,
        network=settings.kaspa_network,
    )

