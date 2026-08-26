# 🔌 PRATIBHA'S TASK — Frontend API Integration
**Assigned To:** Pratibha  
**Project:** Avyron Studio Interior Design CRM  
**Stack:** Next.js 14+ (App Router) · TypeScript · Axios · React Hook Form · Zod  
**Priority:** 🟡 High — Depends on Parth (backend up) and Rimesh (auth session)  

---

## 📋 Overview

Your task is to:
1. **Create a typed API client** (`axios` instance) that includes the auth token from Rimesh's Google Auth session.
2. **Wire up the Project Planner form** (9-step lead generation form) to submit data to `POST /api/v1/leads/`.
3. **Build the Admin CRM Dashboard** page that fetches, displays, and manages leads.
4. **Integrate Worker Registration** form with `POST /api/v1/workers/`.
5. **Create Portfolio & Testimonial** management API calls.

---

## 🗺️ Integration Architecture

```
React Component (frontend)
        │
        ▼
Custom React Hook (useLead, useWorker, etc.)
        │
        ▼
API Client Layer (src/lib/api.ts) ← Axios with JWT auth header
        │
        ▼
FastAPI Backend (Parth's work)  →  PostgreSQL Database
```

---

## 🛠️ Step 1 — Install Dependencies

```bash
cd frontend
npm install axios react-hook-form @hookform/resolvers zod
npm install @tanstack/react-query
```

---

## 🛠️ Step 2 — Create the API Client

### `frontend/src/lib/api.ts` *(create this file)*

```typescript
import axios, { AxiosError, InternalAxiosRequestConfig } from "axios"
import { getSession } from "next-auth/react"

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

/**
 * Axios instance pre-configured for the Avyron CRM API.
 * Automatically attaches the JWT access token from Rimesh's auth session.
 */
export const api = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
})

// ── Request Interceptor ──────────────────────────────────────────────────────
// Automatically attach JWT token to every outgoing request
api.interceptors.request.use(async (config: InternalAxiosRequestConfig) => {
  const session = await getSession()
  if (session?.accessToken) {
    config.headers.Authorization = `Bearer ${session.accessToken}`
  }
  return config
})

// ── Response Interceptor ─────────────────────────────────────────────────────
// Centralized error handling
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      // Token expired — redirect to login
      window.location.href = "/auth/signin"
    }
    return Promise.reject(error)
  }
)
```

---

## 🛠️ Step 3 — TypeScript Types for API

### `frontend/src/types/crm.ts` *(create this file)*

```typescript
// ── Lead Types ───────────────────────────────────────────────────────────────

export type ServiceType = "complete_interior" | "design_only" | "consultancy"
export type PropertyType = "apartment" | "villa" | "office" | "shop" | "restaurant" | "hotel"
export type MeetingPreference = "site_visit" | "video_call" | "phone_call" | "office_visit"
export type LeadStatus = "new" | "contacted" | "site_visit_scheduled" | "quoted" | "negotiating" | "won" | "lost"

export interface LeadCreatePayload {
  service_type: ServiceType
  property_type: PropertyType
  city: string
  address?: string
  pincode?: string
  carpet_area?: number
  num_rooms?: number
  budget_min?: number
  budget_max?: number
  required_work?: string[]
  client_name: string
  client_email: string
  client_phone: string
  meeting_preference?: MeetingPreference
}

export interface Lead {
  id: string
  status: LeadStatus
  service_type: ServiceType
  property_type: PropertyType
  city: string
  client_name: string
  client_email: string
  client_phone: string
  budget_min?: number
  budget_max?: number
  required_work?: string[]
  created_at: string
  updated_at?: string
}

// ── Worker Types ─────────────────────────────────────────────────────────────

export interface WorkerCreatePayload {
  name: string
  phone: string
  email?: string
  address?: string
  city?: string
  experience_years?: number
  daily_wage?: number
  worker_type: string
  skills?: string[]
}

// ── Pagination ───────────────────────────────────────────────────────────────

export interface PaginatedResponse<T> {
  total: number
  items: T[]
}
```

---

## 🛠️ Step 4 — API Service Functions

### `frontend/src/services/leadService.ts` *(create this file)*

```typescript
import { api } from "@/lib/api"
import { Lead, LeadCreatePayload, PaginatedResponse } from "@/types/crm"

export const leadService = {
  /**
   * Submit the 9-step Project Planner form.
   * Called from the ProjectPlanner component final step.
   */
  async createLead(payload: LeadCreatePayload): Promise<{ id: string; message: string }> {
    const response = await api.post("/api/v1/leads/", payload)
    return response.data
  },

  /**
   * Admin: Fetch all CRM leads with optional filters.
   */
  async getLeads(params?: {
    status?: string
    limit?: number
    offset?: number
  }): Promise<PaginatedResponse<Lead>> {
    const response = await api.get("/api/v1/leads/", { params })
    return response.data
  },

  /**
   * Admin: Update a lead's CRM pipeline status.
   */
  async updateLeadStatus(leadId: string, newStatus: string): Promise<void> {
    await api.patch(`/api/v1/leads/${leadId}/status`, null, {
      params: { new_status: newStatus },
    })
  },

  /**
   * Admin: Get a single lead's full details.
   */
  async getLead(leadId: string): Promise<Lead> {
    const response = await api.get(`/api/v1/leads/${leadId}`)
    return response.data
  },
}
```

### `frontend/src/services/workerService.ts` *(create this file)*

```typescript
import { api } from "@/lib/api"
import { WorkerCreatePayload } from "@/types/crm"

export const workerService = {
  async registerWorker(payload: WorkerCreatePayload): Promise<{ id: string }> {
    const response = await api.post("/api/v1/workers/", payload)
    return response.data
  },

  async getWorkers(params?: { is_available?: boolean; worker_type?: string }) {
    const response = await api.get("/api/v1/workers/", { params })
    return response.data
  },
}
```

---

## 🛠️ Step 5 — React Query Setup

### `frontend/src/app/layout.tsx` — add QueryClientProvider

```typescript
"use client"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { useState } from "react"

const queryClient = new QueryClient()

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  )
}
```

---

## 🛠️ Step 6 — Custom React Hooks

### `frontend/src/hooks/useLeads.ts` *(create this file)*

```typescript
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { leadService } from "@/services/leadService"
import { LeadCreatePayload } from "@/types/crm"

// Hook to fetch leads list (for admin dashboard)
export function useLeads(filters?: { status?: string }) {
  return useQuery({
    queryKey: ["leads", filters],
    queryFn: () => leadService.getLeads(filters),
    staleTime: 1000 * 60 * 2,   // Cache for 2 minutes
  })
}

// Hook to submit the project planner form
export function useCreateLead() {
  return useMutation({
    mutationFn: (payload: LeadCreatePayload) => leadService.createLead(payload),
    onSuccess: (data) => {
      console.log("Lead created:", data.id)
    },
    onError: (error) => {
      console.error("Lead submission failed:", error)
    },
  })
}

// Hook to update lead status (admin)
export function useUpdateLeadStatus() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ leadId, status }: { leadId: string; status: string }) =>
      leadService.updateLeadStatus(leadId, status),
    onSuccess: () => {
      // Refresh the leads list after status update
      queryClient.invalidateQueries({ queryKey: ["leads"] })
    },
  })
}
```

---

## 🛠️ Step 7 — Project Planner Form Integration

### Zod Schema for Form Validation

Create `frontend/src/schemas/leadSchema.ts`:

```typescript
import { z } from "zod"

export const leadSchema = z.object({
  service_type: z.enum(["complete_interior", "design_only", "consultancy"]),
  property_type: z.enum(["apartment", "villa", "office", "shop", "restaurant", "hotel"]),
  city: z.string().min(2, "City is required"),
  address: z.string().optional(),
  pincode: z.string().regex(/^\d{6}$/, "Enter valid 6-digit pincode").optional(),
  carpet_area: z.number().positive().optional(),
  num_rooms: z.number().int().positive().optional(),
  budget_min: z.number().positive().optional(),
  budget_max: z.number().positive().optional(),
  required_work: z.array(z.string()).optional(),
  client_name: z.string().min(2, "Name is required"),
  client_email: z.string().email("Enter a valid email"),
  client_phone: z.string().regex(/^[6-9]\d{9}$/, "Enter valid 10-digit mobile number"),
  meeting_preference: z.enum(["site_visit", "video_call", "phone_call", "office_visit"]).optional(),
})

export type LeadFormData = z.infer<typeof leadSchema>
```

### Integrate into ProjectPlanner Component

Find the existing `ProjectPlanner` component and update the final submission step:

```typescript
"use client"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { leadSchema, LeadFormData } from "@/schemas/leadSchema"
import { useCreateLead } from "@/hooks/useLeads"
import { useSession } from "next-auth/react"

export function ProjectPlannerForm() {
  const { mutateAsync: createLead, isPending, isSuccess, isError } = useCreateLead()
  const { data: session } = useSession()

  const form = useForm<LeadFormData>({
    resolver: zodResolver(leadSchema),
    defaultValues: {
      // Pre-fill from Google auth session if available
      client_name: session?.user?.name || "",
      client_email: session?.user?.email || "",
    },
  })

  const onSubmit = async (data: LeadFormData) => {
    try {
      const result = await createLead(data)
      // Show success screen with lead ID
      console.log("Lead submitted successfully! ID:", result.id)
    } catch (error) {
      console.error("Submission failed:", error)
    }
  }

  if (isSuccess) {
    return (
      <div className="success-screen">
        <h2>🎉 Thank You!</h2>
        <p>Your project request has been submitted. Our team will contact you within 24 hours.</p>
      </div>
    )
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      {/* Step 7: Contact Details */}
      <input {...form.register("client_name")} placeholder="Your Name" />
      {form.formState.errors.client_name && (
        <span>{form.formState.errors.client_name.message}</span>
      )}

      <input {...form.register("client_email")} type="email" placeholder="Email" />
      <input {...form.register("client_phone")} placeholder="Mobile Number" />

      <button type="submit" disabled={isPending}>
        {isPending ? "Submitting…" : "Submit & Book Consultation"}
      </button>

      {isError && <p>Something went wrong. Please try again.</p>}
    </form>
  )
}
```

---

## 🛠️ Step 8 — Admin CRM Dashboard Page

Create `frontend/src/app/admin/leads/page.tsx`:

```typescript
"use client"
import { useLeads, useUpdateLeadStatus } from "@/hooks/useLeads"
import { Lead, LeadStatus } from "@/types/crm"

const STATUS_OPTIONS: LeadStatus[] = [
  "new", "contacted", "site_visit_scheduled", "quoted", "negotiating", "won", "lost"
]

const STATUS_COLORS: Record<LeadStatus, string> = {
  new: "#3b82f6",
  contacted: "#f59e0b",
  site_visit_scheduled: "#8b5cf6",
  quoted: "#06b6d4",
  negotiating: "#f97316",
  won: "#10b981",
  lost: "#ef4444",
}

export default function AdminLeadsPage() {
  const { data, isLoading, error } = useLeads()
  const { mutate: updateStatus } = useUpdateLeadStatus()

  if (isLoading) return <div className="loading">Loading leads…</div>
  if (error) return <div className="error">Failed to load leads</div>

  return (
    <div className="admin-leads-page">
      <h1>CRM — Lead Management</h1>
      <p>Total Leads: {data?.total}</p>

      <table className="leads-table">
        <thead>
          <tr>
            <th>Client</th>
            <th>Service</th>
            <th>City</th>
            <th>Budget</th>
            <th>Status</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {data?.leads?.map((lead: Lead) => (
            <tr key={lead.id}>
              <td>
                <strong>{lead.client_name}</strong>
                <br />{lead.client_phone}
              </td>
              <td>{lead.service_type?.replace("_", " ")}</td>
              <td>{lead.city}</td>
              <td>
                {lead.budget_min && lead.budget_max
                  ? `₹${lead.budget_min.toLocaleString()} – ₹${lead.budget_max.toLocaleString()}`
                  : "—"}
              </td>
              <td>
                <select
                  value={lead.status}
                  onChange={(e) =>
                    updateStatus({ leadId: lead.id, status: e.target.value })
                  }
                  style={{
                    background: STATUS_COLORS[lead.status],
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    padding: "4px 8px",
                  }}
                >
                  {STATUS_OPTIONS.map((s) => (
                    <option key={s} value={s}>{s.replace(/_/g, " ")}</option>
                  ))}
                </select>
              </td>
              <td>{new Date(lead.created_at).toLocaleDateString("en-IN")}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
```

---

## 🛠️ Step 9 — Worker Registration Form

Create `frontend/src/app/workers/register/page.tsx`:

```typescript
"use client"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { workerService } from "@/services/workerService"
import { useState } from "react"

const workerSchema = z.object({
  name: z.string().min(2),
  phone: z.string().regex(/^[6-9]\d{9}$/),
  email: z.string().email().optional().or(z.literal("")),
  city: z.string().min(2),
  experience_years: z.number().int().min(0).max(50),
  daily_wage: z.number().positive(),
  worker_type: z.string().min(2),
  skills: z.array(z.string()).min(1, "Select at least one skill"),
})

type WorkerFormData = z.infer<typeof workerSchema>

const SKILL_OPTIONS = [
  "Modular Kitchen", "Wardrobe", "TV Unit", "False Ceiling",
  "Wallpaper", "Painting", "Tiles", "Civil Work", "Electrical", "Plumbing"
]

export default function WorkerRegisterPage() {
  const [isSubmitted, setIsSubmitted] = useState(false)
  const form = useForm<WorkerFormData>({
    resolver: zodResolver(workerSchema),
    defaultValues: { skills: [] },
  })

  const onSubmit = async (data: WorkerFormData) => {
    await workerService.registerWorker(data)
    setIsSubmitted(true)
  }

  if (isSubmitted) {
    return <div>Registration submitted! Our team will verify and contact you.</div>
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <h1>Worker Registration</h1>
      <input {...form.register("name")} placeholder="Full Name" />
      <input {...form.register("phone")} placeholder="Mobile Number" />
      <input {...form.register("city")} placeholder="City" />
      <input {...form.register("worker_type")} placeholder="Trade (e.g., Carpenter)" />
      <input
        type="number"
        {...form.register("experience_years", { valueAsNumber: true })}
        placeholder="Years of Experience"
      />
      <input
        type="number"
        {...form.register("daily_wage", { valueAsNumber: true })}
        placeholder="Daily Wage (₹)"
      />

      {/* Skills checkboxes */}
      <fieldset>
        <legend>Skills</legend>
        {SKILL_OPTIONS.map((skill) => (
          <label key={skill}>
            <input
              type="checkbox"
              value={skill}
              onChange={(e) => {
                const current = form.getValues("skills") || []
                if (e.target.checked) {
                  form.setValue("skills", [...current, skill])
                } else {
                  form.setValue("skills", current.filter((s) => s !== skill))
                }
              }}
            />
            {skill}
          </label>
        ))}
      </fieldset>

      <button type="submit">Register as Worker</button>
    </form>
  )
}
```

---

## ✅ Integration Testing Checklist

| Test | Expected Result |
|---|---|
| Open Project Planner form | All 9 steps render correctly |
| Fill and submit form | `POST /api/v1/leads/` returns 201 with lead ID |
| Success screen shows | "Thank You" message with lead ID appears |
| Visit `/admin/leads` (admin login) | CRM table loads with all leads |
| Change lead status dropdown | Status updates in DB, table refreshes |
| Worker registration form | Submits to `POST /api/v1/workers/` successfully |
| No auth token in session | 401 error handled, redirects to sign-in |
| Network tab validation | All requests include `Authorization: Bearer <token>` |

---

## 📁 Files to Create / Modify

| Action | File Path |
|---|---|
| CREATE | `frontend/src/lib/api.ts` |
| CREATE | `frontend/src/types/crm.ts` |
| CREATE | `frontend/src/services/leadService.ts` |
| CREATE | `frontend/src/services/workerService.ts` |
| CREATE | `frontend/src/hooks/useLeads.ts` |
| CREATE | `frontend/src/schemas/leadSchema.ts` |
| CREATE | `frontend/src/app/admin/leads/page.tsx` |
| CREATE | `frontend/src/app/workers/register/page.tsx` |
| MODIFY | `frontend/src/components/ProjectPlanner.tsx` (add form submission) |
| MODIFY | `frontend/src/app/layout.tsx` (add QueryClientProvider) |

---

## 🤝 Coordination

- **Rimesh** (Auth): You need `session.accessToken` from `useSession()`. Once he confirms auth is working, verify it appears in the Authorization header of API calls.
- **Parth** (DB/Backend): Get the backend URL from him (`http://localhost:8000`). Set it as `NEXT_PUBLIC_API_URL` in `frontend/.env.local`. Test endpoints using Swagger at `http://localhost:8000/docs`.

### Dev Order:
1. Wait for Parth to run `python run.py` and share the API URL.
2. Test each endpoint in Swagger UI first.
3. Wait for Rimesh to confirm `session.accessToken` is available.
4. Then wire up the forms.

---

## ❓ Common Issues & Fixes

| Issue | Fix |
|---|---|
| CORS error in browser | Tell Parth to add your `localhost:3000` to `ALLOWED_ORIGINS` in backend `.env` |
| `session.accessToken` is undefined | Rimesh needs to verify the JWT callback in `auth.ts` is working |
| Form validation not triggering | Ensure `zodResolver(leadSchema)` is passed to `useForm` |
| API returns 422 | Check that field names in payload match FastAPI Pydantic schema exactly |
| `useQuery` not refetching | Add `queryClient.invalidateQueries()` after mutations |

---

*Assigned to: Pratibha | Avyron Studio CRM | 2026-08-26*
