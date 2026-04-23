# Expense Tracker

A full-stack personal finance tracker built with Django REST Framework and React.

The project includes JWT-based authentication, expense and income tracking, budgeting, savings goals, and a dashboard summary for day-to-day financial visibility.

## Stack

- Backend: Django, Django REST Framework, Simple JWT, SQLite
- Frontend: React 19, Vite, React Router, Axios, Tailwind CSS v4
- Auth: JWT access/refresh tokens
- Async config present: Celery + Redis settings

## Core Features

- User authentication with JWT
- Expense management
- Income management
- Budget planning by category and date range
- Savings goals tracking
- Dashboard summary with monthly totals and budget alerts
- Category-based data organization

## Project Structure

```text
expense-tracker/
├── backend/
│   ├── accounts/
│   ├── budgets/
│   ├── categories/
│   ├── common/        # shared backend serializers/viewsets
│   ├── config/        # Django settings and root urls
│   ├── core/          # dashboard summary APIs
│   ├── expenses/
│   ├── goals/
│   ├── incomes/
│   ├── reports/
│   └── manage.py
├── frontend/
│   ├── src/
│   │   ├── app/       # route guards and app wiring
│   │   ├── components/
│   │   │   ├── finance/
│   │   │   └── ui/
│   │   ├── context/
│   │   ├── features/  # feature-based pages
│   │   ├── hooks/
│   │   ├── layout/
│   │   ├── lib/
│   │   └── services/
│   └── package.json
└── README.md
```

## Backend Apps

- `accounts`: custom user model and auth routes
- `expenses`: expense CRUD
- `incomes`: income CRUD
- `budgets`: budget CRUD
- `categories`: user-owned categories
- `goals`: savings goal CRUD
- `core`: dashboard summary endpoint
- `reports`: placeholder for reporting/export features
- `common`: shared base serializer and user-scoped viewset logic

## API Routes

Base URL:

```text
http://localhost:8000/api/
```

Available route groups:

- `auth/token/`
- `auth/refresh/`
- `categories/`
- `expenses/`
- `incomes/`
- `budgets/`
- `goals/`
- `dashboard/summary/`

## Frontend Architecture

The frontend has been reorganized into a more professional feature-first structure:

- `features/`: page-level feature modules
- `components/ui/`: reusable UI primitives such as cards, buttons, modals, and loaders
- `components/finance/`: shared finance-specific page/table/form patterns
- `services/`: centralized API clients
- `layout/`: application shell and navigation
- `context/`: authentication state
- `hooks/`: shared React hooks

## Local Development

### 1. Backend setup

Create and activate a virtual environment, then install the required Python packages.

Example packages currently expected by the project:

```bash
pip install django djangorestframework djangorestframework-simplejwt django-cors-headers celery redis
```

Run migrations and start the backend:

```bash
cd backend
python manage.py migrate
python manage.py runserver
```

Backend runs on:

```text
http://localhost:8000
```

### 2. Frontend setup

Install dependencies and start the Vite dev server:

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on:

```text
http://localhost:5173
```

## Frontend Scripts

From the `frontend/` directory:

```bash
npm run dev
npm run build
npm run lint
npm run preview
```

## Authentication Flow

- User signs in from the React frontend
- Frontend requests JWT tokens from `api/auth/token/`
- Access token is stored in `localStorage`
- Axios attaches the bearer token automatically to protected API requests

## Current Configuration Notes

- Database: SQLite
- Time zone: `UTC`
- CORS currently allows `http://localhost:5173`
- Custom user model: `accounts.User`
- Media files are served in development

## Recent Improvements

- Reorganized frontend into a feature-based structure
- Added shared UI and finance-specific reusable components
- Reworked layout and UI/UX for a more professional dashboard experience
- Centralized frontend service/API access
- Added shared backend base classes for user-scoped CRUD modules
- Reduced repetition across serializers and viewsets

## Known Setup Note

If backend checks fail with:

```text
ModuleNotFoundError: No module named 'corsheaders'
```

install:

```bash
pip install django-cors-headers
```

## Suggested Next Improvements

- Add a `requirements.txt` or `pyproject.toml` for backend dependency management
- Add environment-variable based settings for secrets and API URLs
- Add tests for API and frontend flows
- Add category creation and report/export UI
- Add Docker support for full local setup
