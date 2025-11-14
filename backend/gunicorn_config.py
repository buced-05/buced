# Configuration Gunicorn pour la production
import multiprocessing
import os

# Nombre de workers (2 * CPU cores + 1)
workers = multiprocessing.cpu_count() * 2 + 1

# Nombre de threads par worker
threads = 2

# Adresse d'écoute
bind = "127.0.0.1:8000"

# Timeout
timeout = 120
keepalive = 5

# Logging
accesslog = "-"  # stdout
errorlog = "-"   # stderr
loglevel = os.getenv("DJANGO_LOG_LEVEL", "info").lower()

# Process naming
proc_name = "buced"

# Worker class (utiliser sync pour WSGI, uvicorn.workers.UvicornWorker pour ASGI)
worker_class = "sync"

# Preload app pour économiser la mémoire
preload_app = True

# Max requests pour éviter les fuites mémoire
max_requests = 1000
max_requests_jitter = 50

# User/Group (définir dans systemd)
# user = "www-data"
# group = "www-data"

