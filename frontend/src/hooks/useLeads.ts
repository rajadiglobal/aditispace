/**
 * React Query hooks for Lead management — Pratibha's task.
 *
 * useLeads          → Admin dashboard: fetch paginated lead list
 * useCreateLead     → Project Planner form: submit new lead
 * useUpdateLeadStatus → Admin CRM: change lead pipeline stage
 */

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

import { leadService } from "@/services/leadService"
import type { LeadCreatePayload, LeadStatus } from "@/types/crm"

// ── Query Keys ────────────────────────────────────────────────────────────────

export const LEAD_KEYS = {
  all: ["leads"] as const,
  list: (filters?: { status?: string }) => ["leads", "list", filters] as const,
  detail: (id: string) => ["leads", "detail", id] as const,
}

// ── useLeads ──────────────────────────────────────────────────────────────────

export function useLeads(filters?: { status?: string; limit?: number }) {
  return useQuery({
    queryKey: LEAD_KEYS.list(filters),
    queryFn: () => leadService.getLeads(filters),
    staleTime: 1000 * 60 * 2, // 2 minutes
    retry: 1,
  })
}

// ── useCreateLead ─────────────────────────────────────────────────────────────

export function useCreateLead() {
  return useMutation({
    mutationFn: (payload: LeadCreatePayload) => leadService.createLead(payload),
    onError: (error) => {
      console.error("[useCreateLead] Lead submission failed:", error)
    },
  })
}

// ── useUpdateLeadStatus ───────────────────────────────────────────────────────

export function useUpdateLeadStatus() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ leadId, status, notes }: { leadId: string; status: LeadStatus; notes?: string }) =>
      leadService.updateLeadStatus(leadId, { status, notes }),
    onSuccess: () => {
      // Refresh all lead queries so the table reflects the new status immediately
      queryClient.invalidateQueries({ queryKey: LEAD_KEYS.all })
    },
    onError: (error) => {
      console.error("[useUpdateLeadStatus] Status update failed:", error)
    },
  })
}
