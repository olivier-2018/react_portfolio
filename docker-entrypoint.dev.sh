#!/bin/sh

# Start the client development server in the background
cd /app/client && npm run dev &

# Start the server development server
cd /app && npm run dev
