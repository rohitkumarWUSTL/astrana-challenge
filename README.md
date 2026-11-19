# Fullstack Scaffold

A fullstack CRUD scaffold with a music domain as the starter. The design goal is **domain-swappable**: replace `backend/app/domains/music/` and `frontend/src/domains/music/` with another domain and the rest of the app keeps working unchanged.

## Stack

**Backend**
- Python 3.11+
- FastAPI
- SQLAlchemy 2.x (async)
- SQLite via `aiosqlite`
- Alembic (migrations)
- Pydantic v2 + pydantic-settings

**Frontend**
- React 18
- TypeScript
- Vite
- React Router
- TanStack Query
- Tailwind CSS

## Repo Layout

