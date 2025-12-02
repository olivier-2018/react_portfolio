# React / typescript Skill-Craft Portfolio

## Project Overview

This website is a modern, interactive portfolio designed to showcase your technical skills, projects, and client feedback in a visually engaging way. Built with Vite, React, TypeScript, Tailwind CSS, and shadcn-ui, it features smooth animations, category filtering, and dynamic content loading for a delightful user experience.

### Key Features

-  **Animated Hero Section:** Eye-catching introduction with floating gradients and smooth transitions.
-  **Skills Showcase:** Filterable, animated skills display with mastery levels and seamless scrolling.
-  **Projects Gallery:** Browse featured projects by category, view demos, and like your favorites.
-  **Client Testimonials:** Constant-speed scrolling feedback carousel with popup details.
-  **Contact & Feedback:** Dual-form section for direct contact or submitting feedback, with instant notifications.
-  **Responsive Design:** Looks great on all devices.

---

## How to Get Started

### Prerequisites

-  [Node.js](https://nodejs.org/) (v22+ recommended)
-  [npm](https://www.npmjs.com/) (comes with Node.js)

### Local Development

```sh
# 1. Clone the repository
git clone git@github.com:olivier-2018/react_portfolio.git
git lfs fetch --all && git lfs checkout

# 2. Navigate to the project directory
cd react_portfolio

# 3. Install node.js
nvm install v22
nvm use lts/jod

# 4. Install package dependencies
npm install

# 5. Start the development server
npm run dev

```

## Frontend and Backend Interactions

### In Production

-  In Production, the Frontend is build as Static React files and included in the same container as the Backend server.
-  The Backend (Express server) runs on port VITE_BACKEND_PORT (3003 by default) and serves Frontend requests as React static files.
-  External requests to the Frontend are much faster as a result and content is delivered by the Backend as required.

**Visual Flow:**

```bash
Browser Request → http://localhost:3003
                     ↓
            Express Backend (port 3003)
                     ↓
        Serves static files from client/dist/
                     ↓
            Browser loads React app
                     ↓
        React app makes API calls to /api/v1/*
                     ↓
            Express Backend handles API requests
```

**Notes on local vs VPS Production deployments**

-  In a local deployment (using npm or docker), the backend server port (VITE_BACKEND_PORT) is exposed to the local host so that the backend server is reachable via the browser (default endpoint localhost:3003).

-  In VPS deployment (docker only), the docker container should be located behind a nginx reverse proxy that will handle external requests and redirect them to the web app inside the container network. The portfolio web app is therefore not exposed to the local host and is only available within the docker network for security.

## In Development

-  In Development, Frontend and Backend servers are running independently from each other and on different ports.
-  The ensures a smooth and interactive development session where changes to either frontend and backend are immediately visible on the LIVE server.
-  API calls to the backend endpoints can be monitored in the browser console or in the server logs.

**Visual Flow:**

```bash
User opens browser → http://localhost:5173
                        ↓
Vite Dev Server (Frontend, port 5173)
                        ↓
Serves React App (from src/ with hot reload)
                        ↓
Browser loads React App
                        ↓
React App makes API call to /api/v1/projects
                        ↓
Vite Proxy intercepts request (configured in vite.config.ts)
                        ↓
Proxy forwards to http://localhost:3003/api/v1/projects
                        ↓
Express Backend Server (port 3003)
                        ↓
Backend processes request and returns JSON
                        ↓
Response sent back to Frontend
                        ↓
React App updates UI with new data
```

## Production Deployment (Local or on VPS)

### Using docker

```sh
# Build Docker image
docker build -t portfolio:dev -f Dockerfile .
# Create network if not existing
docker network create net_portfolio
# Start container (check port values match your .env file)
docker run -it --rm -p "5173:5173" --network net_portfolio --name portfolio portfolio:dev
```

### Using docker compose file

**Warning:** Ensure the PORT value in the docker-compose YAML files matches the value in your .env file.

```sh
# Local deployment
docker compose -f docker-compose.local.yml up -d
# VPS deployment
docker compose -f docker-compose.prod.yml up -d

```

### Using npm

Docker deployment is for local or VPS Production deployments.  
**Warning:** Ensure the PORT value in the docker-compose YAML files matches the value in your .env file.

```sh
# Build and deploy
npm run docker:build
npm run docker:up
#
# Check logs
npm run docker:logs
# Shut-down
npm run docker:down
```

## Development Deployment (Local only)

The Frontend & Backend development servers are launched on their respective ports, as specified in the .env file.

```sh
# Build and deploy
npm run dev
```

## Testing

```sh
# For backend testing:
npm test
#
# For backend-client testing:
npx testcafe chromium:headless ./tests/api-client_e2e.ts
```

## Port Configuration Guide

The portfolio application uses parameterized port configuration to support different deployment environments. Frontend and backend ports are controlled via environment variables.

### Port Environment Variables

-  **`VITE_FRONTEND_PORT`** — Frontend dev server port (dev environment only). Default: `5173`
-  **`VITE_BACKEND_PORT`** — Backend Express server port (all environments). Default: `3003`
-  **`VITE_BACKEND_URL`** — Backend API URL for frontend requests. Default: `http://localhost:{VITE_BACKEND_PORT}`

### Port Configuration by Environment

| Environment                                    | Frontend Port | Backend Port | Frontend+Backend | Notes                                                          |
| ---------------------------------------------- | ------------- | ------------ | ---------------- | -------------------------------------------------------------- |
| **Local Dev** (`npm run dev`)                  | 5173          | 3003         | ✗ Separate       | Vite proxy forwards `/api/*` to backend                        |
| **Local Docker Prod** (`docker compose up`)    | N/A           | 3003         | ✓ Same (3003)    | Single container serves both on port 3003                      |
| **VPS Production** (`docker-compose.prod.yml`) | N/A           | 5173         | ✓ Same (5173)    | Single container, Nginx reverse proxy handles external routing |

**Notes:** Ports are configurable in the .env file.

### How Ports Work

**Local Development** (`npm run dev`):

-  Frontend (Vite dev server) runs on port 5173
-  Backend (Express) runs on port 3003
-  Vite proxy intercepts `/api/*` requests and forwards them to `http://localhost:3003`
-  Frontend and backend are **separate processes** for fast iterative development

**Docker Deployments** (local and VPS) and **NPM Production environment** (local):

-  Frontend (React static files in `client/dist/`) and backend (Express) run in the **same container** on the **same port**
-  Express server serves both static frontend files and API endpoints on the same port
-  Frontend makes API calls to `http://localhost:{VITE_BACKEND_PORT}/api/v1/*`

## Tech Stack

-  Vite
-  React
-  TypeScript
-  Tailwind CSS
-  shadcn-ui

---

## TODOs

-  implement dynamic server for local postgres queries and optimization of static content serving
-  implement Bot Assistant
