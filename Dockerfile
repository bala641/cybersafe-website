FROM node:18-alpine AS frontend-build

WORKDIR /app/frontend

COPY frontend/package*.json ./

RUN npm install

COPY frontend . .

RUN npm run build

FROM python:3.11-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    gcc \
    nodejs \
    npm \
    && rm -rf /var/lib/apt/lists/*

# Setup backend
COPY backend/requirements.txt ./backend/

RUN pip install --no-cache-dir -r ./backend/requirements.txt gunicorn

COPY backend ./backend

# Copy frontend build
COPY --from=frontend-build /app/frontend/dist ./frontend/dist

# Expose ports
EXPOSE 3000 5001

# Create startup script
RUN echo '#!/bin/bash\ncd /app/backend\npython app.py &\ncd /app\nserve -s frontend/dist -l 3000' > /app/start.sh
RUN chmod +x /app/start.sh

CMD ["/app/start.sh"]
