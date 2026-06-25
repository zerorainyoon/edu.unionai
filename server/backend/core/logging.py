import contextvars
import json
import logging
import sys
from datetime import datetime, timezone
from typing import Any, Dict, Optional

# Context variables for request tracing
correlation_id_ctx: contextvars.ContextVar[Optional[str]] = contextvars.ContextVar(
    "correlation_id", default=None
)
request_id_ctx: contextvars.ContextVar[Optional[str]] = contextvars.ContextVar(
    "request_id", default=None
)
message_id_ctx: contextvars.ContextVar[Optional[str]] = contextvars.ContextVar(
    "message_id", default=None
)

def get_correlation_id() -> Optional[str]:
    return correlation_id_ctx.get()

def set_correlation_id(correlation_id: Optional[str]) -> None:
    correlation_id_ctx.set(correlation_id)

def get_request_id() -> Optional[str]:
    return request_id_ctx.get()

def set_request_id(request_id: Optional[str]) -> None:
    request_id_ctx.set(request_id)

def get_message_id() -> Optional[str]:
    return message_id_ctx.get()

def set_message_id(message_id: Optional[str]) -> None:
    message_id_ctx.set(message_id)

class JSONFormatter(logging.Formatter):
    """
    Custom JSON formatter for structured application logging.
    Formats log records into a single-line JSON structure.
    """
    def format(self, record: logging.LogRecord) -> str:
        # Core log fields
        log_data: Dict[str, Any] = {
            "timestamp": datetime.fromtimestamp(record.created, tz=timezone.utc).isoformat(),
            "level": record.levelname,
            "logger": record.name,
            "message": record.getMessage(),
            "request_id": get_request_id(),
            "correlation_id": get_correlation_id(),
            "message_id": get_message_id(),
            "filename": record.filename,
            "lineno": record.lineno,
            "func_name": record.funcName,
        }

        # Handle exceptions if present
        if record.exc_info:
            log_data["exception"] = self.formatException(record.exc_info)

        # Include extra attributes passed via extra={}
        # Exclude standard LogRecord attributes
        standard_attrs = {
            "args", "asctime", "created", "exc_info", "exc_text", "filename",
            "funcName", "levelname", "levelno", "lineno", "module",
            "msecs", "message", "msg", "name", "pathname", "process",
            "processName", "relativeCreated", "stack_info", "thread", "threadName"
        }
        for key, value in record.__dict__.items():
            if key not in standard_attrs and not key.startswith("_"):
                log_data[key] = value

        return json.dumps(log_data, ensure_ascii=False)

def setup_logging(log_level: str = "INFO") -> None:
    """
    Initializes the logging system with our custom JSONFormatter.
    Standardizes standard library logging to print JSON.
    """
    root_logger = logging.getLogger()
    # Remove existing handlers to avoid duplicate logs
    for handler in list(root_logger.handlers):
        root_logger.removeHandler(handler)

    # Console handler
    handler = logging.StreamHandler(sys.stdout)
    handler.setFormatter(JSONFormatter())
    
    root_logger.addHandler(handler)
    root_logger.setLevel(getattr(logging, log_level.upper(), logging.INFO))

    # Optional: Configure third-party loggers to match our logging level
    for logger_name in ("uvicorn", "uvicorn.error", "uvicorn.access", "fastapi", "sqlalchemy"):
        logger = logging.getLogger(logger_name)
        logger.handlers = []
        logger.propagate = True
