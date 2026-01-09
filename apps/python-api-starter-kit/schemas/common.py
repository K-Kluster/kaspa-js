"""Common API response schemas."""

from pydantic import BaseModel, Field


class HealthResponse(BaseModel):
    """Response schema for health check."""

    status: str = Field(..., description="Service status")
    version: str = Field(..., description="API version")
    network: str = Field(..., description="Connected network")


class ErrorResponse(BaseModel):
    """Response schema for errors."""

    error: str = Field(..., description="Error message")
    detail: str | None = Field(None, description="Detailed error information")

