#!/bin/sh
# Nginx entrypoint script - substitutes environment variables in config template

set -e

# Default values if not set
VITE_FRONTEND_PORT=${VITE_FRONTEND_PORT:-5173}
VITE_BACKEND_PORT=${VITE_BACKEND_PORT:-3003}
NGINX_PORT=${NGINX_PORT:-5173}

# Export variables so envsubst can access them
export VITE_FRONTEND_PORT
export VITE_BACKEND_PORT
export NGINX_PORT

echo "Generating nginx config from template..."
echo "  VITE_FRONTEND_PORT: $VITE_FRONTEND_PORT"
echo "  VITE_BACKEND_PORT: $VITE_BACKEND_PORT"
echo "  NGINX_PORT: $NGINX_PORT"

# Substitute environment variables in template and write to nginx config directory
envsubst '${VITE_FRONTEND_PORT},${VITE_BACKEND_PORT},${NGINX_PORT}' \
  < /etc/nginx/nginx.conf.template \
  > /etc/nginx/conf.d/default.conf

echo "Nginx config generated successfully."

# Start nginx
exec nginx -g "daemon off;"
