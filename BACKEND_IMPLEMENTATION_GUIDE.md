# 🏗️ AVYRON STUDIO — CRM Backend Implementation Master Guide
**Project:** Avyron Studio Interior Design CRM Platform  
**Phase:** Backend API + Database + Google Auth  
**Last Updated:** 2026-08-26  

---

## 👥 Team Task Assignments

| Member | Task | Priority | Depends On |
|---|---|---|---|
| **Rimesh** | Google OAuth Authentication | 🔴 Critical | Parth's `POST /api/v1/auth/google` |
| **Parth** | Database Config + Backend API | 🔴 Critical | Nothing (start first) |
| **Pratibha** | Frontend API Integration (CRM Forms) | 🟡 High | Rimesh (auth token) + Parth (API) |

---

## 📂 Detailed Task Documents

| Member | Document | Description |
|---|---|---|
| **Rimesh** | [RIMESH_GOOGLE_AUTH.md](./RIMESH_GOOGLE_AUTH.md) | NextAuth.js v5 + Google OAuth 2.0 setup |
| **Parth** | [PARTH_DATABASE_BACKEND.md](./PARTH_DATABASE_BACKEND.md) | FastAPI + PostgreSQL + Alembic + all CRM endpoints |
| **Pratibha** | [PRATIBHA_API_INTEGRATION.md](./PRATIBHA_API_INTEGRATION.md) | Axios API client, React Query hooks, form submission |

---

## 🗺️ Full System Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                        AVYRON STUDIO CRM                           │
│                                                                     │
│   ┌────────────────────────────────────┐                           │
│   │      Next.js Frontend (Port 3000)  │ ← Pratibha integrates API │
│   │                                    │                           │
│   │  ┌──────────────┐ ┌─────────────┐ │                           │
│   │  │ ProjectPlanner│ │Admin/Leads  │ │                           │
│   │  │  (9-step form)│ │  Dashboard  │ │                           │
│   │  └──────┬───────┘ └──────┬──────┘ │                           │
│   │         │                │        │                           │
│   │  ┌──────▼────────────────▼──────┐ │                           │
│   │  │   src/lib/api.ts (Axios)     │ │                           │
│   │  │   + JWT Bearer Token Header  │ │ ← Rimesh provides token   │
│   │  └──────────────┬───────────────┘ │                           │
│   └─────────────────│──────────────────┘                           │
│                      │                                              │
│                      │ HTTP REST API                                │
│                      ▼                                              │
│   ┌────────────────────────────────────┐                           │
│   │     FastAPI Backend (Port 8000)    │ ← Parth builds this       │
│   │                                    │                           │
│   │  POST /api/v1/auth/google          │                           │
│   │  POST /api/v1/leads/               │                           │
│   │  GET  /api/v1/leads/               │                           │
│   │  POST /api/v1/workers/             │                           │
│   │  GET  /api/v1/portfolio/           │                           │
│   │                                    │                           │
│   │  ┌──────────────────────────────┐  │                           │
│   │  │  PostgreSQL Database         │  │                           │
│   │  │  users | leads | workers     │  │                           │
│   │  │  projects | quotations       │  │                           │
│   │  └──────────────────────────────┘  │                           │
│   └────────────────────────────────────┘                           │
│                      ▲                                              │
│                      │  Verifies id_token                          │
│                      │                                              │
│   ┌────────────────────────────────────┐                           │
│   │         Google OAuth 2.0           │ ← Rimesh configures       │
│   │  (accounts.google.com)             │                           │
│   └────────────────────────────────────┘                           │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 🚦 Development Order (Follow This Sequence)

### Phase 1 — Parth starts FIRST (Day 1-2)

```
1. Install Python, PostgreSQL
2. Set up backend/ folder structure
3. Configure database.py and run migrations
4. Implement POST /api/v1/auth/google
5. Implement POST /api/v1/leads/ and GET /api/v1/leads/
6. Run: python run.py → share http://localhost:8000/docs
```

### Phase 2 — Rimesh (Day 1-2, parallel with Parth)

```
1. Set up Google Cloud Console, get Client ID & Secret
2. Install next-auth@beta
3. Create frontend/src/lib/auth.ts
4. Create API route handler [...nextauth]/route.ts
5. Add GoogleSignInButton component
6. Test: sign in → check session.accessToken is present
7. Share GOOGLE_CLIENT_ID with Parth (must be same value)
```

### Phase 3 — Pratibha starts AFTER Parth + Rimesh confirm working (Day 3-4)

```
1. Create frontend/src/lib/api.ts (Axios with auth interceptor)
2. Create TypeScript types (src/types/crm.ts)
3. Create service functions (leadService, workerService)
4. Wire ProjectPlanner form → POST /api/v1/leads/
5. Build Admin CRM dashboard page
6. Test full flow: form submit → DB → admin sees lead
```

---

## 🔑 Shared Environment Variables

> These values must be identical across frontend and backend `.env` files.

| Variable | Who Sets It | Who Needs It |
|---|---|---|
| `GOOGLE_CLIENT_ID` | Rimesh (from Google Console) | Rimesh (frontend) + Parth (backend) |
| `GOOGLE_CLIENT_SECRET` | Rimesh | Rimesh (frontend ONLY) |
| `NEXT_PUBLIC_API_URL` | Parth (his server URL) | Pratibha (frontend) |
| `BACKEND_API_URL` | Parth | Rimesh (server-side fetch) |
| `JWT_SECRET_KEY` | Parth | Parth (backend only) |
| `NEXTAUTH_SECRET` | Rimesh | Rimesh (frontend only) |

---

## 📊 CRM Database Tables Overview

| Table | Purpose | Owner |
|---|---|---|
| `users` | Stores all users (clients + admins via Google Auth) | Parth |
| `leads` | All CRM inquiries from Project Planner form | Parth |
| `projects` | Active interior design projects | Parth |
| `workers` | Registered contractor/worker profiles | Parth |
| `quotations` | Auto-generated project quotations | Parth |
| `portfolio_items` | Admin-managed portfolio images/videos | Parth |

---

## 🔗 Key API Endpoints Reference

| Method | Endpoint | Description | Used By |
|---|---|---|---|
| `GET` | `/health` | Backend health check | Team |
| `POST` | `/api/v1/auth/google` | Google OAuth login → JWT | Rimesh → Parth |
| `POST` | `/api/v1/leads/` | Submit project planner form | Pratibha |
| `GET` | `/api/v1/leads/` | Admin: list all leads | Pratibha |
| `PATCH` | `/api/v1/leads/{id}/status` | Admin: update lead status | Pratibha |
| `POST` | `/api/v1/workers/` | Register a worker | Pratibha |
| `GET` | `/api/v1/portfolio/` | Fetch portfolio items | Pratibha |

---

## ✅ Final Integration Test (Run Together)

Once all three parts are complete, test the full flow:

1. **Open** `http://localhost:3000` — the Avyron Studio website
2. **Click** "Book Free Consultation" → opens Project Planner
3. **Fill** all 9 steps of the form
4. **Step 7:** Click "Continue with Google" → Google consent screen → returns signed in
5. **Step 9:** Submit → see success screen
6. **Open** `http://localhost:3000/admin/leads` → see new lead appear in CRM table
7. **Change lead status** → verify it updates in the database
8. **Check** `http://localhost:8000/docs` → all endpoints documented in Swagger

---

## 🛠️ Tech Stack Summary

| Layer | Technology | Who |
|---|---|---|
| Frontend | Next.js 14+, TypeScript, TailwindCSS | Pratibha |
| Authentication | NextAuth.js v5, Google OAuth 2.0 | Rimesh |
| Backend API | Python FastAPI, Uvicorn | Parth |
| Database | PostgreSQL 16 | Parth |
| ORM | SQLAlchemy 2.0 + Alembic migrations | Parth |
| HTTP Client | Axios + React Query (TanStack) | Pratibha |
| Token | JWT (python-jose) | Parth |
| Form Validation | React Hook Form + Zod | Pratibha |

---

## 📞 Questions? Contact

- **Technical issues** → create a GitHub issue or message in group chat
- **Env variable sharing** → use a shared `.env.example` file (never commit actual secrets)
- **API not responding** → check if `python run.py` is running and PostgreSQL service is active

---

*Avyron Studio CRM — Backend Implementation Sprint | 2026-08-26*
