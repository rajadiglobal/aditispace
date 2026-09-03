This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Run backend and frontend together on Windows

From the repository root, run:

```powershell
.\start.ps1
```

The launcher creates `backend\.venv` when neither `backend\.venv` nor
`backend\venv` exists, installs the backend requirements, verifies or installs
the frontend packages, and starts both services.

If PowerShell blocks the script for the current session, run:

```powershell
Set-ExecutionPolicy -Scope Process Bypass
.\start.ps1
```

The backend is available at `http://localhost:8000/docs` and the frontend at
`http://localhost:3000`.

## Run in Docker

Copy `.env.docker.example` to `.env`, set your host MySQL password and JWT
secret, then start the application stack:

```powershell
docker compose up --build
```

The backend connects to your existing host MySQL through
`host.docker.internal:3306`, using the `aditi_store` database. No Docker MySQL
container is created, so stopping Docker does not delete or reset your database.

Docker Compose starts the backend and frontend containers. The backend runs
Alembic migrations against the host database before starting FastAPI.
The backend Swagger UI is available at `http://localhost:8000/docs`.
Auth.js is configured with `AUTH_TRUST_HOST=true` for Docker's internal
container hostname. Keep the frontend behind a trusted reverse proxy in
production and set its public `AUTH_URL`/`AUTH_TRUST_HOST` configuration there.
For local Google OAuth, set the real `GOOGLE_CLIENT_ID` and
`GOOGLE_CLIENT_SECRET` in the ignored root `.env`, and add this exact authorized
redirect URI in Google Cloud:
`http://localhost:3000/api/auth/callback/google`

The complete MySQL setup script is available at
`backend/sql/schema.sql`. It is generated from all current Alembic migrations
and includes the project tables, indexes, foreign keys, and the Alembic version
table. Docker uses the migrations directly, so future schema changes should be
added as new files under `backend/alembic/versions/` and the SQL snapshot can
be regenerated with:

```powershell
Push-Location backend
.\.venv\Scripts\python.exe -m alembic upgrade head --sql |
  Out-File -Encoding utf8 .\sql\schema.sql
Pop-Location
```

Stop the services with:

```powershell
docker compose down
```

The upload volume is persisted by Docker. Your MySQL data remains in the host
MySQL installation.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
