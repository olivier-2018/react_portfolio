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
-  **Bot Assistant:** Ask any information about my profile tdirectly to the Bot.

---

## How to Get Started

### Prerequisites

-  [Node.js](https://nodejs.org/) (v22+ recommended)
-  [npm](https://www.npmjs.com/) (comes with Node.js)
- nvm (optional)

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

# 4. Install package dependencies for frontend & backend
npm install
cd client
npm install
cd ..

# 5. Set your environmental variable
cp .env.sample .env
# then update .env with your own data

# 6. Configure Database Selection
# See "Database Selection" section below for more details

# 7. Start the development server
npm run dev

# 8. Check portfolio webapp on browser on localhost:5173 (frontend) or localhost:3003 (backend)

```

## Frontend and Backend Interactions

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

## Database Selection

This project supports two database backends for storing portfolio data (skills, projects, feedback). Select one via the `VITE_DB_SELECT` environment variable in your `.env` file:

The DB schema is available in the postgresDB_init folder.
Follow instructions in the README file in the same folder to setup the postgres DB.


### Option 1: Supabase (Default & Recommended for Production)

**Configuration:**
```env
VITE_DB_SELECT=supabase
VITE_SUPABASE_URL=<your_supabase_url>
VITE_SUPABASE_ANON_KEY=<your_supabase_key>
VITE_DB_SELECT=postgres
VITE_POSTGRES_USER=<your_postgres_user>
VITE_POSTGRES_PASSWORD=<your_postgres_password>
VITE_POSTGRES_DB=<database_name>
VITE_POSTGRES_HOST=localhost
VITE_POSTGRES_PORT=5432
```

**Prerequisites:**
- Supabase account with credentials
- Database tables: `skills`, `skill_categories`, `projects`, `project_categories`, `customer_feedbacks`

**Usage:**
```sh
npm run dev        # Frontend & Backend with Supabase
```

### Option 2: local PostgreSQL (Docker Container)

**Configuration:**
```env
VITE_DB_SELECT=local
VITE_POSTGRES_USER=<your_postgres_user>
VITE_POSTGRES_PASSWORD=<your_postgres_password>
VITE_POSTGRES_DB=<database_name>
VITE_POSTGRES_HOST=<docker_container_name>
VITE_POSTGRES_PORT=5432
```

**Prerequisites:**
- Docker with PostgreSQL container running (e.g., `postgres15`)
- Database tables created with same schema as Supabase
- Container must be accessible on the configured host and port

**Switching Backends:**
Simply update `VITE_DB_SELECT` in your `.env` file and restart the development server (Ctrl+C and `npm run dev`).

## Testing
```sh
# For backend testing:
npm test
#
# For backend-client testing:
npx testcafe chromium:headless ./tests/api-client_e2e.ts
```

## Deployments

The portfolio can be deployed in 3 ways:
- LOCAL DEVELOPMENT mode --> Both Frontend and Backend servers are running live concurrently locally but on different ports (specified in .env.sample).
- LOCAL PRODUCTION mode --> the Frontend and backend servers are build into separate docker containers and deployed locally together with a local nginx reverse proxy server to simulate a real production environment.
- VPS PRODUCTION mode --> the Frontend and backend containers are deployed remotely, assuming a nginx reverse proxy server is already configured.


### 1. Local Development deployment

Simply type:
```sh
# Launch the local DB (if not using supabase)
docker compose --profile local-postgres up portfolio-postgres -d
# Build and deploy
npm run dev
```
**Notes:**
-  The Frontend & Backend development servers are launched concurrently on their respective ports, as specified in the .env file. Any change to either the frontend or backend is visible immediately on the LIVE server.
-  API calls from the frontend to the backend can be monitored in the browser console or in the server logs.
-  Database backend is determined by `VITE_DB_SELECT` in your `.env` file (see "Database Selection" section above).


### 2. Local Production mode

Simply run the sequence:
```sh
# Create network if not existing
docker network create contado_net
# Build Frontend Docker image
docker build -t portfolio-frontend:prod -f Dockerfile.frontend --no-cache .
# Build Backend Docker image
docker build -t portfolio-backend:prod -f Dockerfile.backend --no-cache .
# Start containers using supabase DB and a local nginx reverse proxy
docker compose -f docker-compose.yml  --profile local-nginx up -d
# or using a local docker postgres DB
docker compose -f docker-compose.yml  --profile local-nginx  --profile local-postgres up -d

# Docker Helper
docker compose up -d --build --force-recreate
docker compose build --no-cache && docker compose up -d
```
**Notes:**
-  In Production, the Frontend and backend are build into separate docker containers and must deployed in the same docker network.
-  The frontend (REACT VITE) is listening on port VITE_FRONTEND_PORT (5173 by default)
-  The Backend (Express server) runs on port VITE_BACKEND_PORT (3003 by default) and serves Frontend requests internally.
-  Database backend is determined by `VITE_DB_SELECT` in your `.env` file:
   - Use `VITE_DB_SELECT=supabase` for Supabase backend (recommended for production)
   - Use `VITE_DB_SELECT=local` for local PostgreSQL Docker container
-  Environment variables are passed to containers via docker-compose.yml (see "Environment" section)

### 3. VPS (remote) Production mode

Simply run the sequence:
```sh
# Create network if not existing
docker network create contado_net
# Build Frontend Docker image
docker build -t portfolio-frontend:prod -f Dockerfile.frontend --no-cache .
# Build Backend Docker image
docker build -t portfolio-backend:prod -f Dockerfile.backend --no-cache .
# Start containers using supabase
docker compose -f docker-compose.yml  up -d   
# or using a local docker postgres DB
docker compose -f docker-compose.yml --profile local-postgres up -d
```
**Notes:**
-  This assumes a reverse proxy server is already setup on the VPS.
-  Use --profile local-postgres if you want to setup a local postgres DB in production 


## Tech Stack

-  Vite
-  React
-  TypeScript
-  Tailwind CSS
-  shadcn-ui

## TODOs
NA

