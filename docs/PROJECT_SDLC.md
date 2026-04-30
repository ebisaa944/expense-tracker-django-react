# Expense Tracker SDLC and Project Documentation

## 1. Project Overview

The Expense Tracker project is a full-stack personal finance management system built to help users record and monitor their incomes, expenses, budgets, savings goals, and dashboard summaries in one place.

The application is designed for individual users who want a simple digital tool for daily financial tracking and visibility.

## 2. Important Stack Note

This project is **not a MEAN application**.

MEAN stands for:

- MongoDB
- Express.js
- Angular
- Node.js

The actual stack used in this project is:

- Frontend: React + Vite
- Backend: Django + Django REST Framework
- Database: SQLite
- Authentication: JWT using `djangorestframework-simplejwt`
- Styling: Tailwind CSS

## 3. Problem Statement

Many users struggle to keep track of personal spending, income sources, savings goals, and budget limits using manual methods. This project provides a centralized web application that improves financial visibility and supports better decision-making.

## 4. Project Goals

- Provide secure user authentication
- Allow users to manage expense records
- Allow users to manage income records
- Support budgeting by category and date range
- Track savings goals and progress
- Present a dashboard summary for monthly finance insights
- Organize financial data with reusable categories

## 5. Project Scope

### In Scope

- Login-based access control
- CRUD operations for categories, expenses, incomes, budgets, and goals
- Dashboard summary API
- User-specific data isolation
- Frontend pages for all main finance modules

### Out of Scope for Current Version

- User registration UI
- Password reset flow
- Advanced analytics and exports
- Payment integrations
- Production deployment automation
- Complete automated test coverage

## 6. Stakeholders

- End users managing their personal finances
- Developers maintaining the frontend and backend
- Project reviewer, trainer, or instructor evaluating the application

## 7. Functional Requirements

- The system shall authenticate users using JWT tokens.
- The system shall allow authenticated users to create, view, and delete categories.
- The system shall allow authenticated users to create, view, and delete expenses.
- The system shall allow authenticated users to create, view, and delete incomes.
- The system shall allow authenticated users to create, view, and delete budgets.
- The system shall allow authenticated users to create, view, and delete goals.
- The system shall display dashboard totals for monthly income and expenses.
- The system shall show budget alerts when spending exceeds an active budget limit.
- The system shall keep each user’s data private from other users.

## 8. Non-Functional Requirements

- The system should provide a responsive web interface for desktop and mobile users.
- The system should return API responses in JSON format.
- The system should protect endpoints with authentication and authorization.
- The system should maintain simple and readable module separation.
- The system should be easy to run in a local development environment.

## 9. System Architecture

The project follows a client-server architecture:

1. The React frontend sends HTTP requests to the Django REST API.
2. The backend validates JWT authentication for protected endpoints.
3. The backend reads and writes user-owned financial data in SQLite.
4. The frontend renders module pages and dashboard summaries based on API responses.

### Architecture Layers

- Presentation layer: React pages, layout, shared UI components
- Application layer: Django REST Framework viewsets and API views
- Business logic layer: user-scoped query logic and category defaults service
- Data layer: Django models and SQLite database

## 10. Main Modules

### Frontend Modules

- `auth`: login page and authentication state management
- `dashboard`: finance summary view
- `categories`: category management
- `expenses`: expense management
- `incomes`: income management
- `budgets`: budget management
- `goals`: savings goal management
- `services`: centralized API communication
- `layout`: protected application shell and navigation

### Backend Modules

- `accounts`: custom user model and JWT auth routes
- `categories`: category model, serializer, viewset, and default-category support
- `expenses`: expense CRUD API
- `incomes`: income CRUD API
- `budgets`: budget CRUD API
- `goals`: goal CRUD API
- `core`: dashboard summary endpoint
- `common`: shared serializer and user-scoped viewset base classes
- `reports`: placeholder app for future reporting features

## 11. Database Entities

### User

- Based on Django `AbstractUser`
- Owns all finance data

### Category

- `user`
- `name`
- `type` (`income` or `expense`)

### Expense

- `user`
- `category`
- `amount`
- `description`
- `date`
- `created_at`

### Income

- `user`
- `category`
- `amount`
- `source`
- `date`
- `created_at`

### Budget

- `user`
- `category`
- `limit_amount`
- `period`
- `start_date`
- `end_date`

### Goal

- `user`
- `name`
- `target_amount`
- `current_amount`
- `deadline`
- `created_at`

## 12. API Summary

Base URL:

```text
http://localhost:8000/api/
```

Main route groups:

- `auth/token/`
- `auth/refresh/`
- `categories/`
- `expenses/`
- `incomes/`
- `budgets/`
- `goals/`
- `dashboard/summary/`

## 13. Authentication Flow

1. A user enters login credentials on the frontend.
2. The frontend sends the credentials to `api/auth/token/`.
3. The backend returns access and refresh tokens if the credentials are valid.
4. The frontend stores tokens in `localStorage`.
5. Future requests include the access token in the `Authorization` header.
6. When the frontend receives `401 Unauthorized`, it clears stored auth data and redirects to `/login`.

## 14. SDLC for This Project

### 1. Planning

The project idea focuses on solving a common personal finance tracking problem using a web application with separate frontend and backend layers.

Planning outputs:

- definition of project goals
- selection of Django REST Framework and React
- identification of core modules such as expenses, incomes, budgets, goals, and dashboard

### 2. Requirements Analysis

The system requirements were derived from basic finance management workflows:

- users must log in securely
- users must record money coming in and going out
- users must categorize transactions
- users must define budget limits
- users must monitor savings goals
- users must see a summary dashboard

### 3. System Design

The application was designed as:

- a React frontend for user interaction
- a Django REST API for business logic and persistence
- a relational data model centered around a user owner
- protected endpoints to enforce per-user access

Design choices visible in the codebase:

- feature-based frontend structure
- reusable finance UI components
- shared backend user-scoping base classes
- a dashboard endpoint that aggregates finance data

### 4. Implementation

Implementation includes:

- JWT authentication
- CRUD APIs for core finance entities
- frontend route protection
- reusable API service modules
- dashboard totals and budget alert calculation
- category defaults service

### 5. Testing

Current testing status:

- Django test files exist in several apps
- most test files are still placeholders
- frontend linting is configured through ESLint

This means the project has the structure for quality checks, but automated test coverage is still limited and should be expanded.

### 6. Deployment

The project currently supports local development deployment:

- backend via Django development server
- frontend via Vite development server
- SQLite as the default database

For production readiness, the project would still need:

- environment-based configuration
- secure secret management
- production database selection
- static asset strategy
- deployment pipeline

### 7. Maintenance

Future maintenance should focus on:

- fixing bugs from user feedback
- improving validation and error handling
- increasing automated test coverage
- expanding reporting capabilities
- improving security and production readiness

## 15. Current Strengths

- Clear module separation between frontend and backend
- User-scoped backend logic reduces data leakage risk
- Simple local setup for development
- Modern frontend structure with reusable components
- Dashboard summary adds immediate user value

## 16. Current Limitations

- No visible user registration flow in the frontend
- Many backend test files are not yet implemented
- SQLite is suitable for development but limited for scale
- Secret key and debug settings are still development-oriented
- Reports functionality is only partially prepared

## 17. Suggested Future Enhancements

- Add backend dependency management with `requirements.txt` or `pyproject.toml`
- Add environment variables for secrets and URLs
- Implement full CRUD editing support where needed
- Add user registration and password recovery flows
- Add export/report generation
- Add automated API and frontend tests
- Add Docker support
- Add production deployment documentation

## 18. Conclusion

This Expense Tracker project is a good example of a modern full-stack finance management application built with React and Django REST Framework. From an SDLC perspective, the project has completed major planning, design, and implementation work for its core features, while testing depth, deployment readiness, and reporting features remain the main areas for future improvement.
