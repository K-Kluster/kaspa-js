"""FastAPI application for the Python API."""

from contextlib import asynccontextmanager

from core import __version__
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import kaspa, server
from utils import KaspaClient


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Manage application lifespan - startup and shutdown."""
    # Startup
    app.state.kaspa_client = KaspaClient()
    await app.state.kaspa_client.connect()

    yield

    # Shutdown
    await app.state.kaspa_client.disconnect()


def create_app() -> FastAPI:
    """Create and configure the FastAPI application."""
    app = FastAPI(
        title="Python API",
        description="Starter kit on Kaspa",
        version=__version__,
        lifespan=lifespan,
        docs_url="/docs",
        redoc_url="/redoc",
    )

    # Configure CORS
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],  # Configure appropriately for production
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    # Include routers
    app.include_router(server.router, tags=["Health"])
    app.include_router(kaspa.router, prefix="/api", tags=["Kaspa"])

    return app


# Create app instance
app = create_app()
