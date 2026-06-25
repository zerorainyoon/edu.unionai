import json
from datetime import datetime, timezone
from typing import Callable
from fastapi import Request, Response
from fastapi.routing import APIRoute
from backend.core.logging import get_message_id

class UnifiedResponseRoute(APIRoute):
    """
    Custom APIRoute class that automatically wraps all successful API JSON responses
    into the format: {"messageId": ..., "timestamp": ..., "response": ...}.
    """
    def get_route_handler(self) -> Callable:
        original_route_handler = super().get_route_handler()

        async def custom_route_handler(request: Request) -> Response:
            response: Response = await original_route_handler(request)

            # We only wrap JSON responses
            content_type = response.headers.get("content-type", "")
            if "application/json" in content_type:
                body = response.body
                try:
                    data = json.loads(body)

                    # Prevent double wrapping
                    if isinstance(data, dict) and "messageId" in data and "timestamp" in data and "response" in data:
                        wrapped_data = data
                    else:
                        wrapped_data = {
                            "messageId": get_message_id() or "",
                            "timestamp": datetime.now(timezone.utc).isoformat().replace("+00:00", "Z"),
                            "response": data
                        }

                    # Update response body and content length header
                    new_body = json.dumps(wrapped_data, ensure_ascii=False).encode("utf-8")
                    response.body = new_body
                    response.headers["content-length"] = str(len(new_body))
                except Exception:
                    # Fallback to the original response in case of parsing errors
                    pass
            return response

        return custom_route_handler
