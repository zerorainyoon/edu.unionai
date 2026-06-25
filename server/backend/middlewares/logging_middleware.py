import time
import uuid
import logging
from fastapi import Request
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.responses import Response
from backend.core.logging import set_request_id, set_correlation_id, set_message_id

import base64

logger = logging.getLogger("backend.middleware")

class LoggingMiddleware(BaseHTTPMiddleware):
    """
    Middleware to handle tracing context (Request-ID / Correlation-ID / Message-ID)
    and perform structured JSON logging for HTTP requests and responses.
    """
    async def dispatch(self, request: Request, call_next) -> Response:
        # Extract headers (case-insensitive) or generate new UUIDs
        request_id = request.headers.get("x-request-id") or str(uuid.uuid4())
        correlation_id = request.headers.get("x-correlation-id") or request_id
        
        # If X-Message-Id is absent, generate a 22-char Base64 encoded UUID string (Short UUID)
        message_id = (
            request.headers.get("x-message-id")
            or base64.b64encode(uuid.uuid4().bytes).decode("utf-8")[:-2]
        )

        # Set IDs in thread-safe context variables
        set_request_id(request_id)
        set_correlation_id(correlation_id)
        set_message_id(message_id)

        # Log Request entry
        logger.info(
            f"HTTP Request: {request.method} {request.url.path}",
            extra={
                "http_method": request.method,
                "path": request.url.path,
                "query_params": str(request.query_params),
                "client_ip": request.client.host if request.client else None,
            }
        )

        start_time = time.perf_counter()
        try:
            response: Response = await call_next(request)
            process_time_ms = (time.perf_counter() - start_time) * 1000.0

            # Inject tracking IDs into the response headers
            response.headers["X-Request-ID"] = request_id
            response.headers["X-Correlation-ID"] = correlation_id
            response.headers["X-Message-ID"] = message_id

            # Log Response exit
            logger.info(
                f"HTTP Response: {request.method} {request.url.path} - Status: {response.status_code} - Duration: {process_time_ms:.2f}ms",
                extra={
                    "status_code": response.status_code,
                    "duration_ms": round(process_time_ms, 2),
                }
            )
            return response

        except Exception as e:
            process_time_ms = (time.perf_counter() - start_time) * 1000.0
            logger.error(
                f"HTTP Request Error: {request.method} {request.url.path} - Detail: {str(e)}",
                exc_info=True,
                extra={
                    "duration_ms": round(process_time_ms, 2),
                }
            )
            raise e
