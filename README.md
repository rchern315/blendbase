# BlendBase 🥤

**A full-stack smoothie recipe platform built with React, Supabase, and Vercel.**

[Live Demo](https://blendbase.vercel.app) · [Report a Bug](https://github.com/rchern315/blendbase/issues/new) · [Request a Feature](https://github.com/rchern315/blendbase/issues/new)

## Overview

BlendBase is a full-stack recipe application for discovering, creating, managing, rating, reviewing, and sharing smoothie recipes. I built it to strengthen my work across application architecture, authentication, data persistence, authorization-aware UI flows, file storage, and cloud deployment.

The application uses React on the client and Supabase for PostgreSQL data, authentication, and storage. It is deployed on Vercel.

## Current Features

- Email/password authentication with Supabase Auth
- Google OAuth sign-in
- Email verification and resend flow
- Protected create, edit, and dashboard routes
- Create, edit, and delete recipes
- Recipe image upload and image URL support
- Search, filtering, and sorting
- Star ratings and written reviews
- Per-user recipe dashboard
- Social sharing and copy-link actions
- Responsive desktop and mobile UI
- Supabase-backed persistence
- Vercel deployment

## Architecture

```text
Browser
   |
   v
React 19 + React Router 7
   |
   +----------------------+
   |                      |
   v                      v
Supabase Auth        Supabase PostgreSQL
   |                      |
   |                      +--> recipes
   |                      +--> reviews
   |
   +----------------------+
              |
              v
        Supabase Storage

Deployment: Vercel
```

## Technology Stack

### Application

- **React 19.2** — component-based user interface
- **React Router 7.9** — client-side routing and protected route flows
- **Vite 7.2** — development and production build tooling
- **Tailwind CSS 3.4** — responsive styling
- **React Icons** — UI iconography

### Data & Services

- **Supabase 2.83**
  - PostgreSQL database
  - Authentication
  - OAuth
  - Storage

### Engineering & Deployment

- **ESLint 9** — static analysis and code quality
- **Git / GitHub** — source control
- **Vercel** — hosting and automatic deployments

## Key Engineering Decisions

### Authentication and protected routes

Authentication state is centralized in an `AuthContext`. Routes that require a signed-in user are wrapped by a reusable `ProtectedRoute` component.

```text
Sign in / Sign up
      |
      v
Supabase Auth
      |
      v
AuthContext
      |
      v
ProtectedRoute
      |
      +--> Create Recipe
      +--> Edit Recipe
      +--> Dashboard
```

### Data model

Recipes and reviews are persisted in Supabase. The application calculates aggregate ratings from review data and associates user-owned content with the authenticated Supabase user.

### State management

I intentionally kept state management lightweight:

- Context API for authentication state
- Local React state for page and component interactions
- Supabase as the persistent source of truth

### Image handling

Recipe creation supports either an uploaded image or an external image URL. Uploaded assets are stored through Supabase Storage.

## Project Structure

```text
blendbase/
├── src/
│   ├── components/          # Reusable UI components
│   ├── contexts/            # Authentication context
│   ├── pages/               # Route-level views
│   ├── config/
│   │   └── supabaseClient.js
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── public/
├── .env.example
├── package.json
├── tailwind.config.js
├── vite.config.js
└── README.md
```

## Run Locally

### Prerequisites

- Node.js 20.19+ (or a current Node 22+ release)
- npm
- A Supabase project

### 1. Clone the repository

```bash
git clone https://github.com/rchern315/blendbase.git
cd blendbase
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Copy the example file:

**Windows PowerShell**

```powershell
Copy-Item .env.example .env
```

**macOS / Linux**

```bash
cp .env.example .env
```

Add your Supabase project values:

```text
VITE_SUPABASE_URL=your-supabase-project-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

Only use the public anon/publishable client key here. Never commit service-role keys or other server-side secrets.

### 4. Start the application

```bash
npm run dev
```

Open:

```text
http://localhost:5173
```

## Available Scripts

```bash
npm run dev       # Start the Vite development server
npm run build     # Create a production build
npm run preview   # Preview the production build locally
npm run lint      # Run ESLint
```

## What This Project Demonstrates

BlendBase is one of my portfolio projects for demonstrating work beyond UI implementation, including:

- full-stack application design
- authentication and OAuth integration
- database-backed CRUD workflows
- user-owned data
- reviews and aggregate ratings
- cloud storage
- route protection
- responsive component architecture
- production deployment

## Next Improvements

- Add automated unit and end-to-end tests
- Add stronger form/schema validation
- Add favorites and recipe collections
- Add recipe nutrition data through an external API
- Add monitoring and error reporting
- Add image optimization
- Improve accessibility testing and keyboard interaction
- Add a documented database schema and local seed workflow

## Deployment

**Live application:** https://blendbase.vercel.app

Vercel automatically deploys changes from the connected GitHub repository.

## Developer

**Robin Chernak**

- GitHub: [@rchern315](https://github.com/rchern315)
- LinkedIn: [linkedin.com/in/robin-chernak-967aa1150](https://www.linkedin.com/in/robin-chernak-967aa1150/)
