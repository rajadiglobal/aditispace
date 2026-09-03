/**
 * CRM TypeScript types — Pratibha's task.
 *
 * These types are shared across:
 *  - API service functions (leadService, workerService)
 *  - React Query hooks (useLeads, etc.)
 *  - Admin CRM dashboard components
 *  - Form validation schemas (Zod)
 */

// ── Lead ───────────────────────────────────────────────────────────────────────

export type ServiceType = "complete_interior" | "design_only" | "consultancy"

export type PropertyType =
  | "apartment"
  | "villa"
  | "office"
  | "shop"
  | "restaurant"
  | "hotel"

export type MeetingPreference =
  | "site_visit"
  | "video_call"
  | "phone_call"
  | "office_visit"

export type LeadStatus =
  | "new"
  | "contacted"
  | "site_visit_scheduled"
  | "quoted"
  | "negotiating"
  | "won"
  | "lost"

/** Payload sent to POST /api/v1/leads/ */
export interface LeadCreatePayload {
  // Step 1
  service_type: ServiceType
  // Step 2
  property_type?: PropertyType
  // Step 3
  city: string
  address?: string
  pincode?: string
  // Step 4
  carpet_area?: number
  buildup_area?: number
  num_rooms?: number
  budget_min?: number
  budget_max?: number
  expected_start_date?: string
  expected_end_date?: string
  // Step 5
  required_work?: string[]
  // Step 7
  client_name: string
  client_email: string
  client_phone: string
  // Step 8
  meeting_preference?: MeetingPreference
}

/** Lead as returned by the API */
export interface Lead {
  id: string
  status: LeadStatus
  service_type: ServiceType
  property_type?: PropertyType
  city?: string
  address?: string
  pincode?: string
  carpet_area?: number
  num_rooms?: number
  budget_min?: number
  budget_max?: number
  required_work?: string[]
  client_name?: string
  client_email?: string
  client_phone?: string
  meeting_preference?: MeetingPreference
  notes?: string
  source?: string
  created_at: string
  updated_at?: string
}

export interface LeadStatusUpdate {
  status: LeadStatus
  notes?: string
}

// ── Worker ────────────────────────────────────────────────────────────────────

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

export interface Worker {
  id: string
  name: string
  phone: string
  email?: string
  city?: string
  worker_type?: string
  skills?: string[]
  experience_years?: number
  daily_wage?: number
  is_available: boolean
  is_verified: boolean
  created_at: string
}

// ── Pagination ────────────────────────────────────────────────────────────────

export interface PaginatedLeadResponse {
  total: number
  leads: Lead[]
}

export interface PaginatedWorkerResponse {
  total: number
  workers: Worker[]
}

// ── Portfolio ─────────────────────────────────────────────────────────────────

export interface PortfolioItem {
  id: string
  title: string
  description?: string
  category?: string
  location?: string
  image_url: string
  before_image_url?: string
  after_image_url?: string
  video_url?: string
  tags?: string[]
  budget_display?: string
  is_featured: boolean
}
