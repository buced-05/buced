FROM python:3.11-slim AS base

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PIP_NO_CACHE_DIR=off \
    PIP_DISABLE_PIP_VERSION_CHECK=on \
    PIP_DEFAULT_TIMEOUT=100

WORKDIR /app

RUN apt-get update && \
    apt-get install -y --no-install-recommends build-essential libpq-dev curl && \
    rm -rf /var/lib/apt/lists/*

COPY requirements.txt /tmp/requirements.txt

RUN pip install --upgrade pip && \
    pip install -r /tmp/requirements.txt

COPY . /app

RUN adduser --disabled-password --gecos '' appuser && \
    chown -R appuser:appuser /app && \
    chmod +x /app/start.sh /app/start-celeryworker.sh /app/start-celerybeat.sh

USER appuser

ENV DJANGO_SETTINGS_MODULE=core.settings \
    PYTHONPATH=/app

EXPOSE 8000

CMD ["/app/start.sh"]
FROM python:3.11-slim

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

WORKDIR /app

RUN apt-get update && apt-get install -y build-essential libpq-dev && rm -rf /var/lib/apt/lists/*

COPY requirements.txt /tmp/requirements.txt
RUN pip install --upgrade pip && pip install -r /tmp/requirements.txt

COPY app /app

COPY ./scripts/start.sh /start.sh
COPY ./scripts/start-celeryworker.sh /start-celeryworker.sh
COPY ./scripts/start-celerybeat.sh /start-celerybeat.sh
RUN chmod +x /start.sh /start-celeryworker.sh /start-celerybeat.sh

EXPOSE 8000

CMD ["/start.sh"]
