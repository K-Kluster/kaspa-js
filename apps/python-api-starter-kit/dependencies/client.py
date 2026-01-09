"""Kaspa client dependency."""

from fastapi import Request

from utils import KaspaClient


def get_client(request: Request) -> KaspaClient:
    """Get the Kaspa client from app state."""
    return request.app.state.kaspa_client
