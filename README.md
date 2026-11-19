# Fullstack App

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

## Project Structure

```
astrana-challenge/
├── backend/
│   ├── app/
│   │   ├── main.py                 # FastAPI app, CORS, /health, mounts /api router
│   │   ├── core/
│   │   │   ├── config.py           # Settings (DATABASE_URL, CORS_ORIGINS) from .env
│   │   │   ├── database.py         # async engine, SessionLocal, Base, get_session
│   │   │   └── registry.py         # auto-discovers domain packages, mounts each at /api/<name>
│   │   └── domains/
│   │       └── music/              # <- swappable domain
│   │           ├── __init__.py     # imports models (registers them) and exports `router`
│   │           ├── models.py       # SQLAlchemy models: Song, Playlist, PlaylistSong
│   │           ├── schemas.py      # Pydantic request/response models
│   │           ├── service.py      # data-access / business logic
│   │           └── router.py       # FastAPI endpoints (no prefix; mounted by registry)
│   ├── alembic/
│   │   ├── env.py                  # async migrations, reads URL from settings, imports domains
│   │   └── versions/               # migration scripts
│   ├── alembic.ini
│   ├── scripts/seed.py             # inserts sample songs + playlists
│   ├── tests/
│   │   ├── conftest.py             # temp SQLite DB + httpx AsyncClient fixture
│   │   └── test_music.py
│   ├── .env.example
│   └── pyproject.toml
├── frontend/
│   ├── src/
│   │   ├── main.tsx                # React root + providers
│   │   ├── App.tsx                 # Layout + routes from every domain
│   │   ├── core/
│   │   │   ├── domains.ts          # domain registry (DomainModule[]) rendered by App.tsx
│   │   │   └── api/
│   │   │       ├── client.ts       # apiRequest<T>(), ApiError, uses VITE_API_URL
│   │   │       └── types.ts
│   │   ├── domains/
│   │   │   └── music/              # <- swappable domain
│   │   │       ├── index.ts        # exports `musicDomain` { name, navLabel, basePath, routes }
│   │   │       ├── api.ts          # typed calls into /api/music
│   │   │       ├── types.ts
│   │   │       ├── pages/          # SongList, SongDetail, PlaylistList, PlaylistDetail
│   │   │       └── components/     # SongForm, PlaylistForm
│   │   └── shared/components/      # Button, Input, Layout, Modal
│   ├── .env.example
│   ├── vite.config.ts              # port 5173, "@" alias -> ./src
│   ├── tailwind.config.js
│   └── package.json
├── opencode/opencode.json          # OpenCode provider config
└── .gitignore
```

## Getting Started

### Backend (port 8000)

```bash
cd backend
python -m venv .venv
source .venv/bin/activate        # Windows: .venv\Scripts\activate
pip install -e ".[dev]"
cp .env.example .env             # Windows: copy .env.example .env
alembic revision --autogenerate -m "initial music schema"   # once, while versions/ is empty
alembic upgrade head
python -m scripts.seed           # optional sample data
uvicorn app.main:app --reload --port 8000
```

> `alembic/versions/` starts empty, so the first run must generate the initial migration.

API docs: http://localhost:8000/docs

### Frontend (port 5173)

```bash
cd frontend
npm install
cp .env.example .env             # Windows: copy .env.example .env
npm run dev
```

App runs at http://localhost:5173. The backend allows the frontend origin via `CORS_ORIGINS`.

## Common Commands

All backend commands run from `backend/`, all frontend commands from `frontend/`.

### Backend

| Command | Description |
| --- | --- |
| `uvicorn app.main:app --reload --port 8000` | Run the API with auto-reload |
| `pytest` | Run the full test suite |
| `pytest tests/test_music.py -v` | Run one test file, verbose |
| `pytest -k playlist` | Run tests whose name matches `playlist` |
| `alembic revision --autogenerate -m "message"` | Create a migration from model changes |
| `alembic revision -m "message"` | Create an empty migration |
| `alembic upgrade head` | Apply all migrations |
| `alembic downgrade -1` | Roll back one migration |
| `alembic current` / `alembic history` | Show current revision / migration history |
| `python -m scripts.seed` | Seed sample songs and playlists (no-op if data exists) |

### Frontend

| Command | Description |
| --- | --- |
| `npm run dev` | Start the Vite dev server (port 5173) |
| `npm run build` | Type-check (`tsc -b`) and build for production |
| `npm run preview` | Serve the production build locally |
| `npm test` | Run tests with Vitest |

### Config

| Variable | Where | Default | Purpose |
| --- | --- | --- | --- |
| `DATABASE_URL` | `backend/.env` | `sqlite+aiosqlite:///./app.db` | SQLAlchemy async database URL |
| `CORS_ORIGINS` | `backend/.env` | `http://localhost:5173` | Comma-separated allowed origins |
| `VITE_API_URL` | `frontend/.env` | `http://localhost:8000` | Base URL for API requests |

## Adding a Domain

Domains are discovered automatically; no central wiring beyond the frontend registry.

**Backend**
1. Create `backend/app/domains/<name>/` with `models.py`, `schemas.py`, `service.py`, `router.py`.
2. In `__init__.py`, import the models (so they register with `Base.metadata`) and export `router`.
3. Endpoints are mounted at `/api/<name>` automatically. Run `alembic revision --autogenerate` to create tables.

**Frontend**
1. Create `frontend/src/domains/<name>/index.ts` exporting a `DomainModule` (`name`, `navLabel`, `basePath`, `routes`).
2. Add it to the `domains` array in `frontend/src/core/domains.ts`.

## API Surface (music)

- `GET /health`
- `GET|POST /api/music/songs`, `GET|PATCH|DELETE /api/music/songs/{id}`
- `GET|POST /api/music/playlists`, `GET|PATCH|DELETE /api/music/playlists/{id}`
- `POST /api/music/playlists/{id}/songs`, `DELETE /api/music/playlists/{id}/songs/{song_id}`
