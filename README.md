# React / typescript Skill-Craft Portfolio

## Project Overview

This website is a modern, interactive portfolio designed to showcase your technical skills, projects, and client feedback in a visually engaging way. Built with Vite, React, TypeScript, Tailwind CSS, and shadcn-ui, it features smooth animations, category filtering, and dynamic content loading for a delightful user experience.

### Key Features

- **Animated Hero Section:** Eye-catching introduction with floating gradients and smooth transitions.
- **Skills Showcase:** Filterable, animated skills display with mastery levels and seamless scrolling.
- **Projects Gallery:** Browse featured projects by category, view demos, and like your favorites.
- **Client Testimonials:** Constant-speed scrolling feedback carousel with popup details.
- **Contact & Feedback:** Dual-form section for direct contact or submitting feedback, with instant notifications.
- **Responsive Design:** Looks great on all devices.

---

## How to Get Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v22+ recommended)
- [npm](https://www.npmjs.com/) (comes with Node.js)

### Local Development

```sh
# 1. Clone the repository
git clone git@github.com:olivier-2018/react_portfolio.git

# 2. Navigate to the project directory
cd react_portfolio

# 3. Install dependencies
npm install

# 4. Start the development server
npm run dev

```
The app will be available at [http://localhost:5173](http://localhost:5173) by default.
---

## Docker Deployment

```sh
docker build -t react_portfolio:latest .

docker network create net_portfolio
docker run -it --rm -p "5173:5173" --network net_portfolio --name react_portfolio react_portfolio:latest
```

**alternative:** Use docker compose file
```sh
docker compose -f docker-compose.yaml up -d
```

**optional:** postgres deployment with Docker
```sh
docker compose -f docker-compose_postgres.yml up -d
```

---

## Tech Stack

- Vite
- React
- TypeScript
- Tailwind CSS
- shadcn-ui

---
