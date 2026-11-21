# NutriFlex

NutriFlex is a React and Flask wellness project. It includes the existing public information pages, account registration and login, personal onboarding, and a database-backed user dashboard for food, water, and weight tracking. Nutrition values are estimates.

## Start locally

### Backend

```powershell
cd backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
Copy-Item .env.example .env
python seed.py
python run.py
```

The API runs at `http://127.0.0.1:5000`. SQLite is stored in `backend/nutriflex.db` and persists between restarts. The seed script is additive; it does not delete existing data.

### Frontend

In another terminal:

```powershell
cd frontend
npm install
npm run dev
```

Vite serves the app at `http://localhost:5173`. The API address is configured in `frontend/src/services/api.js`.

## Demonstration account

Running `python seed.py` creates the admin account if it does not exist:

- Email: `admin@example.com`
- Password: `admin123`

Change this password before using the application outside a local demonstration. New users register through the website and complete onboarding after logging in.

## Environment

Set strong random values for `SECRET_KEY` and `JWT_SECRET_KEY` in `backend/.env` before deployment. Keep `.env` out of source control. `DATABASE_URL` may be set to another SQLAlchemy SQLite URL, and `CORS_ORIGINS` accepts a comma-separated list.

## Current API areas

- `/api/auth`: register, login, logout, and current account
- `/api/profile`: create, read, and update personal onboarding details
- `/api/tracking`: food search, meal logs, water logs, weight logs, and dashboard aggregates
- `/api/diet`: generated weekly meal plans based on dietary preference and allergy keywords, with meal completion tracking
- `/api/nutritionists`: public nutritionist directory
- `/api/appointments`: authenticated appointment listing, confirmation, and cancellation
- `/api/payments`: server-created checkout orders, signature verification, and payment history; mock mode is clearly labelled and does not charge money
- `/api/admin`: admin-only overview, account and appointment lists, nutritionist management, and appointment status updates
- `/api/contact`: validated contact form submissions

## Project notes

The reference preview URL supplied with the design brief could not be loaded in the available readers. The existing pages and the brief's palette remain the visual guide. Mock checkout is available for a local demonstration and never counts toward revenue. For Razorpay test mode, set `PAYMENT_MODE=razorpay` and add test credentials to `backend/.env`; the backend verifies the signature and fetched payment amount before confirming a booking.

## Technical structure

- `frontend/`: React, Vite, Tailwind CSS, React Router, Axios, Recharts, Lucide, and Framer Motion
- `backend/`: Flask REST API, Flask-SQLAlchemy, Flask-JWT-Extended, Flask-CORS, and SQLite
- `backend/seed.py`: additive demonstration data setup
