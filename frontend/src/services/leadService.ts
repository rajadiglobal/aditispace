/**
 * Lead service — API calls for the Lead resource.
 *
 * Used by:
 *  - useLeads hook (admin dashboard)
 *  - useCreateLead hook (Project Planner form submission)
 *  - Consultation modal (quick lead submission)
 */

import { api } from "@/lib/api"
import type {
  Lead,
  LeadCreatePayload,
  LeadStatusUpdate,
  PaginatedLeadResponse,
} from "@/types/crm"

export const leadService = {
  /**
   * Submit the 9-step Project Planner form.
   * Public endpoint — no auth token required.
   */
  async createLead(
    payload: LeadCreatePayload
  ): Promise<{ id: string; message: string }> {
    const { data } = await api.post<{ id: string; message: string }>(
      "/api/v1/leads/",
      payload
    )
    return data
  },

  /**
   * Admin: Fetch all CRM leads with optional status filter and pagination.
   * Requires admin or staff JWT token.
   */
  async getLeads(params?: {
    status?: string
    limit?: number
    offset?: number
  }): Promise<PaginatedLeadResponse> {
    const { data } = await api.get<PaginatedLeadResponse>("/api/v1/leads/", {
      params,
    })
    return data
  },

  /**
   * Admin: Get full details of a single lead.
   */
  async getLead(leadId: string): Promise<Lead> {
    const { data } = await api.get<Lead>(`/api/v1/leads/${leadId}`)
    return data
  },

  /**
   * Admin: Move a lead through the CRM pipeline.
   */
  async updateLeadStatus(
    leadId: string,
    update: LeadStatusUpdate
  ): Promise<void> {
    await api.patch(`/api/v1/leads/${leadId}/status`, update)
  },
}
