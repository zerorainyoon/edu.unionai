# ==========================================
# Builder Stage
# ==========================================
FROM python:3.11-slim AS builder

WORKDIR /build

# Install build dependencies if any are needed (e.g. gcc, default-libmysqlclient-dev, etc.)
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    pkg-config \
    && rm -rf /var/lib/apt/lists/*

# Install python requirements into a local directory
COPY requirements.txt ./requirements.txt
RUN pip install --no-cache-dir --user -r ./requirements.txt

# ==========================================
# Runtime Stage
# ==========================================
FROM python:3.11-slim AS runner

WORKDIR /app

ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    PATH="/home/appuser/.local/bin:${PATH}" \
    PYTHONPATH="/app:${PYTHONPATH}"

# Install runtime dependencies (e.g. MariaDB client shared library)
RUN apt-get update && apt-get install -y --no-install-recommends \
    libmariadb3 \
    && rm -rf /var/lib/apt/lists/*

# Create security-hardened non-root user
RUN groupadd -g 10001 appgroup && \
    useradd -u 10001 -g appgroup -m -s /sbin/nologin appuser

# Copy installed packages from builder stage
COPY --from=builder --chown=appuser:appgroup /root/.local /home/appuser/.local

# Copy application source and configurations
COPY --chown=appuser:appgroup . /app/backend

# Set user context
USER appuser

# Expose backend port
EXPOSE 8000

# Run uvicorn server
CMD ["uvicorn", "backend.main:app", "--host", "0.0.0.0", "--port", "8000"]
