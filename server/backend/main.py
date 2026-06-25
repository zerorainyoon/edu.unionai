import logging
from contextlib import asynccontextmanager
from typing import AsyncGenerator
from fastapi import FastAPI, Request, status
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from starlette.exceptions import HTTPException as StarletteHTTPException

from backend.api.v1 import router as api_v1_router
from backend.core.config import settings
from backend.core.db import engine
from datetime import datetime, timezone
from backend.core.logging import (
    get_correlation_id,
    get_request_id,
    get_message_id,
    setup_logging,
)
from backend.middlewares.logging_middleware import LoggingMiddleware

logger = logging.getLogger("backend.main")

@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncGenerator[None, None]:
    """
    Manages application lifecycle:
    - Configure structured JSON logging on startup.
    - Gracefully dispose of DB Connection Pool on shutdown.
    """
    # Initialize logging configuration
    log_level = "INFO" if settings.ENVIRONMENT == "production" else "DEBUG"
    setup_logging(log_level=log_level)
    
    logger.info("Application lifespan startup: system initialized.")
    yield
    # Cleanup: close all database pool connections
    logger.info("Application lifespan shutdown: disposing database engine.")
    await engine.dispose()

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="Production-Ready FastAPI Backend Server",
    version="1.0.0",
    lifespan=lifespan,
)

# Set CORS middleware
if settings.CORS_ORIGINS:
    app.add_middleware(
        CORSMiddleware,
        allow_origins=list(settings.CORS_ORIGINS),
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

# Register request logging and tracing middleware
app.add_middleware(LoggingMiddleware)

# Include API Routers
app.include_router(api_v1_router, prefix="/api")

# --- Global Exception Handlers ---

@app.exception_handler(StarletteHTTPException)
async def http_exception_handler(request: Request, exc: StarletteHTTPException) -> JSONResponse:
    """
    Custom exception handler to return structured JSON response for HTTPExceptions.
    """
    logger.warning(
        f"HTTP error occurred: status={exc.status_code} path={request.url.path} detail={exc.detail}"
    )
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "messageId": get_message_id() or "",
            "timestamp": datetime.now(timezone.utc).isoformat().replace("+00:00", "Z"),
            "response": {
                "error": {
                    "code": "HTTP_ERROR",
                    "message": exc.detail,
                    "request_id": get_request_id(),
                    "correlation_id": get_correlation_id(),
                }
            }
        },
    )

@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError) -> JSONResponse:
    """
    Custom exception handler to return structured validation errors.
    """
    logger.warning(
        f"Request validation failed: path={request.url.path} errors={exc.errors()}"
    )
    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content={
            "messageId": get_message_id() or "",
            "timestamp": datetime.now(timezone.utc).isoformat().replace("+00:00", "Z"),
            "response": {
                "error": {
                    "code": "VALIDATION_ERROR",
                    "message": "Input validation failed.",
                    "details": exc.errors(),
                    "request_id": get_request_id(),
                    "correlation_id": get_correlation_id(),
                }
            }
        },
    )

@app.exception_handler(Exception)
async def unhandled_exception_handler(request: Request, exc: Exception) -> JSONResponse:
    """
    Global catch-all exception handler to mask system-level tracebacks from end-users,
    while logging complete stack trace with tracing context variables.
    """
    logger.error(
        f"Unhandled exception encountered: {str(exc)}",
        exc_info=True,
        extra={"path": request.url.path, "method": request.method},
    )
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={
            "messageId": get_message_id() or "",
            "timestamp": datetime.now(timezone.utc).isoformat().replace("+00:00", "Z"),
            "response": {
                "error": {
                    "code": "INTERNAL_SERVER_ERROR",
                    "message": "An unexpected error occurred. Please contact support.",
                    "request_id": get_request_id(),
                    "correlation_id": get_correlation_id(),
                }
            }
        },
    )

@app.get("/health", tags=["System"])
async def health_check() -> dict:
    """
    System health check endpoint.
    """
    return {
        "messageId": get_message_id() or "",
        "timestamp": datetime.now(timezone.utc).isoformat().replace("+00:00", "Z"),
        "response": {"status": "healthy", "project": settings.PROJECT_NAME}
    }
