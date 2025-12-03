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

# 5. Set your environmental variable
cp .env.sample .env
# then update .env with your own data

# 6. Start the development server
npm run dev

# 7. Check portfolio webapp on browser on localhost:5173 (frontend) or localhost:3003 (backend)

```

## Frontend and Backend Interactions

## In Development

-  In Development Mode, the Frontend and Backend servers are both running live and concurrently but on different ports (specified in .env.sample).
-  The ensures a smooth and interactive development session where changes to either frontend and backend are immediately visible on the LIVE server.
-  API calls from the frontend to the backend can be monitored in the browser console or in the server logs.

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

### In Production

-  In Production, the Frontend and backend are build into separate docker containers and must deployed in the same docker network.
-  The frontend (REACT VITE) is listening on port VITE_FRONTEND_PORT (5173 by default)
-  The Backend (Express server) runs on port VITE_BACKEND_PORT (3003 by default) and serves Frontend requests internally.

-  If deployed locally,

   -  you will first need to create a docker network, then update the docker-compose file with the network name.
   -  You will then need to ensure the port mapping is uncommented in the docker-compose file to expose the frontend and/or the backend to your localhost.
   -  Providing you have build the docker images using the respective Dockerfiles, you will be able to deploy bothe containers using the docker-compose file.

-  If deployed on a VPS, possibly behind a nginx reverse proxy (running in the same docker network):
   -  it is recommended to comment out the port binding to isolate the container services to the docker network.
   -  you may want to update the network name to match your nginx docker network

**Warning** Regardless of deployment destination, you will need to edit the Dockerfiles to match the ports the container are listening to, to match the value specified in the .env.sample.

## Deployments

First check the validity of the Dockerfiles with regard to port mapping.  
Second, check the validity of the docker-compose file with regard to:

-  docker image names & tags
-  port mapping enabled for local deployment only
-  docker network name

### Production Deployments (Local or on VPS)

```sh
# Build Frontend Docker image
docker build -t portfolio-frontend:dev -f Dockerfile.frontend .
# Build Backend Docker image
docker build -t portfolio-backend:dev -f Dockerfile.backend .
# Create network if not existing
docker network create net_portfolio
# Start container (check port values match your .env file)
docker compose -f docker-compose.yml up -f
```

### Development Deployment (Local only)

The Frontend & Backend development servers are launched on their respective ports, as specified in the .env file.

```sh
# Build and deploy
npm run dev
```

### Testing

```sh
# For backend testing:
npm test
#
# For backend-client testing:
npx testcafe chromium:headless ./tests/api-client_e2e.ts
```

## Nginx

### NPM

Steps in Nginx Proxy Manager UI:

-  Go to your existing proxy host (the one for portfolio.brontechsolutions.ch)
-  Click on it to edit
-  Go to the "Custom Locations" tab
-  Click "Add Custom Location" and add:
-  Location: /api
-  Scheme: http://
-  Forward Hostname/IP: portfolio-backend
-  Forward Port: 3003
-  Check: "Block Common Exploits"

### nginx server

```sh
server {
listen 443 ssl http2;
server_name portfolio.brontechsolutions.ch;

    ssl_certificate ...;
    ssl_certificate_key ...;

    # Serve frontend
    location / {
        proxy_pass http://portfolio-frontend:5173;
    }

    # Proxy API calls to backend (this is the missing piece!)
    location /api/ {
        proxy_pass http://portfolio-backend:3003;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

## Tech Stack

-  Vite
-  React
-  TypeScript
-  Tailwind CSS
-  shadcn-ui

## TODOs

-  implement dynamic server for local postgres queries and optimization of static content serving
-  implement Bot Assistant
