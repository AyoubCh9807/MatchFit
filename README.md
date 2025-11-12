# MatchFit Web App

**MatchFit** — Connecting clients with verified fitness experts using AI-driven matching. Full-featured dashboard for clients and experts with fitness tracking, messaging, and plan management.

---

## Table of Contents

- [Features](#features)  
- [Tech Stack](#tech-stack)  
- [Dependencies](#dependencies)  
- [Getting Started](#getting-started)  
- [Environment Variables](#environment-variables)  
- [Scripts](#scripts)  
- [Testing](#testing)  
- [Contributing](#contributing)  

---

## Features

- Client dashboard: view progress, active experts, and matched plans.  
- Expert dashboard: manage client requests and plans.  
- AI-driven fitness matching based on user goals and preferences.  
- Messaging between clients and experts.  
- Track progress logs and fitness plans.  
- Role-based access: Client / Expert.  
- Real-time data updates using React Query.  
- State management with Zustand.  
- Error tracking with Sentry.  
- Fully responsive UI built with TailwindCSS and Next.js.  

---

## Tech Stack

- **Frontend:** Next.js (App Router, React 18+)  
- **Styling:** TailwindCSS, Google Fonts (Geist, Geist Mono)  
- **State Management:** Zustand  
- **Data Fetching:** React Query  
- **Authentication & DB:** Supabase  
- **Error Tracking:** Sentry  
- **Testing:** Playwright (E2E)  
- **Component Library / UI Docs:** Storybook  
- **Animations:** Framer Motion  

---

## Dependencies

# Core
next react react-dom typescript

# Styling
tailwindcss postcss autoprefixer

# State Management
zustand

# Data Fetching
@tanstack/react-query

# Authentication / Database
@supabase/supabase-js

# Error Tracking
@sentry/react @sentry/tracing

# Animations
framer-motion

# Testing
@playwright/test

# UI / Component Docs
@storybook/react @storybook/addon-essentials

##Getting Started

Clone the repo
```
git clone https://github.com/your-username/matchfit.git
cd matchfit
```

Install dependencies
```
npm install
# or
yarn
```

Run dev server
```
npm run dev
# or
yarn dev
```

Access the app
Visit http://localhost:3000 in your browser.

##Environment Variables

Create a .env.local file in the root:
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_SENTRY_DSN=your_sentry_dsn
```

##Scripts

```
npm run dev         # Start development server
npm run build       # Build for production
npm run start       # Start production server
npm run lint        # Lint code
npm run format      # Format code with Prettier

```
##Contributing

1. Fork the repo

2. reate a branch: git checkout -b feature/my-feature

3. Commit changes: git commit -m "Add my feature"

4. Push to branch: git push origin feature/my-feature

5. Open a pull request

