# Structural Member Prototype

A full-stack prototype for storing and displaying structural building members. The backend exposes structural data from PostgreSQL through a REST API, and the frontend provides a member list and detail view.

## Screenshot

<!-- Add the final application screenshot here before submission. -->

![Structural member list and detail](docs/member-list-detail.png)

## Architecture

```text
React + TypeScript -> FastAPI -> SQLAlchemy -> PostgreSQL
```

- The frontend requests data through the FastAPI endpoints.
- Pydantic defines the API response schema.
- SQLAlchemy maps Python models to PostgreSQL tables.
- Alembic manages database schema migrations.

## Prerequisites

- Python 3.11
- Node.js and npm
- Docker Desktop with Docker Compose
- Git

## Setup

### 1. Clone the repository

```powershell
git clone <repository-url>
cd week-2-deliverables
```

Replace `<repository-url>` with the GitHub repository URL.

### 2. Configure environment variables

Copy `.env.example` to `.env`:

```powershell
Copy-Item .env.example .env
```

Complete the values in `.env`:

```env
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_USER=your_database_user
POSTGRES_PASSWORD=your_database_password
POSTGRES_DB=your_database_name
FRONTEND_ORIGIN=http://localhost:5173
```

### 3. Set up Python

```powershell
py -3.11 -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install -r requirements.txt
```

### 4. Start and prepare the database

```powershell
docker compose up -d
python -m alembic upgrade head
python seed.py
```

### 5. Start the backend

```powershell
python -m fastapi dev main.py
```


### 6. Generate the TypeScript API types

Open another terminal:

```powershell
cd frontend
npm install
npx openapi-typescript http://localhost:8000/openapi.json -o src/types/api-generated.ts
```

The backend must be running while the types are generated.

### 7. Start the frontend

From the `frontend` directory:

```powershell
npm run dev
```

Frontend: `http://localhost:5173`

## Validation

Run the backend checks from the project root:

```powershell
python -m pytest
python -m ruff check .
python -m mypy .
python -m pip_audit
```

Run the frontend checks from the `frontend` directory:

```powershell
npm run lint
npm run build
npm audit
```

## Design Decisions

- Structural geometry is stored as ordered `[x, y, z]` points in millimetres.
- Member dimensions are stored as JSON because their fields vary by member type.
- Member IDs provide readable references to dimension, storey, and grid location.
- Database changes are managed through Alembic migrations.

## Current Limitations

- The prototype provides read-only member list and detail endpoints.
- Synthetic data is loaded through `seed.py`; file upload is not implemented.
- Authentication and user management are outside the current scope.

## Open Questions

- How should production geometry be validated for each member type?
- Should future imports accept CSV, spreadsheet, or direct AISIMS data?
