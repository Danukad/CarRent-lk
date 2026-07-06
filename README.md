# CarRents.lk

CarRents.lk is a vehicle rental marketplace built with a Node.js/Express backend and a React/Vite frontend. The project includes support for company onboarding, vehicle listings, user authentication, Google Maps integration, image uploads, and launch-ready planning documentation.

## Repository Structure

- `backend/`
  - Express server (`server.js`)
  - MongoDB models and API routes
  - Authentication, file upload, and email support
  - `package.json` with `start` and `dev` scripts

- `frontend/`
  - React application with Vite
  - Pages for landing, login, registration, vehicle browsing, company dashboard, and profiles
  - Firebase auth + Google OAuth support
  - `package.json` with `dev`, `build`, and `preview` scripts

- Root documentation files
  - `QUICK_REFERENCE.md`
  - `LAUNCH_READINESS_REPORT.md`
  - `LAUNCH_ACTION_PLAN.md`
  - `ARCHITECTURE_DATABASE_OVERVIEW.md`
  - `COMPANY_DASHBOARD_GUIDE.md`
  - `CRITICAL_RENTAL_IMPLEMENTATION.md`
  - `README_DOCUMENTATION.md`

## Key Features

- Company and user authentication flows
- Vehicle listing and rental workflows
- Admin/company dashboard support
- Google Maps integration for location services
- File uploads for vehicle images
- Firebase and JWT authorization support
- Backend email and payment preparation

## Setup Instructions

### Backend

1. Open a terminal and go to the backend folder:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file with the required environment variables. Typical variables include:
   - `MONGO_URI`
   - `JWT_SECRET`
   - `FIREBASE_PROJECT_ID`
   - `FIREBASE_CLIENT_EMAIL`
   - `FIREBASE_PRIVATE_KEY`
   - `EMAIL_HOST`
   - `EMAIL_USER`
   - `EMAIL_PASS`
4. Start the backend server:
   ```bash
   npm run dev
   ```

### Frontend

1. Open a terminal and go to the frontend folder:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the frontend:
   ```bash
   npm run dev
   ```
4. Open the displayed Vite URL in a browser.

## Documentation for Team Members

Start with `QUICK_REFERENCE.md` for a one-page overview of the current launch status and action plan.

The repo contains several focused guides:

- `LAUNCH_READINESS_REPORT.md` — full assessment and launch readiness details
- `LAUNCH_ACTION_PLAN.md` — day-by-day launch plan and priorities
- `ARCHITECTURE_DATABASE_OVERVIEW.md` — data model, architecture, and database design
- `COMPANY_DASHBOARD_GUIDE.md` — dashboard layout and frontend implementation guidance
- `CRITICAL_RENTAL_IMPLEMENTATION.md` — backend rental implementation guide and API details
- `README_DOCUMENTATION.md` — documentation index overview

## How to Collaborate

- Work in feature branches and keep `main` stable.
- Reference the relevant doc file before making changes.
- Use the root docs to align on launch priorities and technical scope.

## Notes

- This repo is already configured with a backend server and a React frontend.
- The frontend uses Firebase and Google Maps.
- The backend uses Express, MongoDB, and Firebase Admin.

If you need help with environment variables or deployment, open the relevant documentation files first or ask the project owner for the current `.env` values.
