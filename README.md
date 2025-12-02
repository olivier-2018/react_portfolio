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

## Docker containerization: Frontend and Backend Interaction

If using a docker image, the frontend and backend are served from the SAME container on the SAME port (VITE_BACKEND_PORT, 3003 by default):

**Overview:**

-  Backend (Express server) runs on port 3003
-  Frontend (React static files) are built to client/dist/ and served by the Express backend
-  When visiting http://localhost:3003, the Express backend serves the static React files from client/dist/
-  React frontend then makes API calls to http://localhost:3003/api/v1/\* endpoints (same server)

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

**Note on local vs VPS deployment**

-  In local deployment (npm or docker), the backend server port (VITE_BACKEND_PORT) is exposed to the local host so that the backend server is reachable via the browser on localhost:3003.

-  In VPS deployment (docker only), the docker container should be located behind a nginx reverse proxy that will handle external requests and redirect them to the web app inside the container network. The portfolio web app is therefore not exposed to the local host and is only available within the docker network for security.

## Docker Deployment

### Using docker

```sh
docker build -t portfolio:dev -f Dockerfile .

docker network create net_portfolio
docker run -it --rm -p "5173:5173" --network net_portfolio --name portfolio portfolio:dev
```

### Using docker compose file

```sh
# Local deployment
docker compose -f docker-compose.local.yml up -d
# VPS deployment
docker compose -f docker-compose.prod.yml up -d

```

### Using npm

```sh
# Build and deploy (Prod)
npm run docker:build
npm run docker:up
#
# Check logs
npm run docker:logs
# Shut-down
npm run docker:down
```

## Testing

```sh
# For backend testing:
npm test
#
# For backend-client testing:
npx testcafe chromium:headless ./tests/api-client_e2e.ts
```

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
