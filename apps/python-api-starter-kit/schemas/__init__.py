"""API response schemas for the Python API."""

from .common import ErrorResponse, HealthResponse
from .kaspa import BlockDagInfoResponse, BlockResponse

__all__ = [
    "BlockDagInfoResponse",
    "BlockResponse",
    "ErrorResponse",
    "HealthResponse",
]
