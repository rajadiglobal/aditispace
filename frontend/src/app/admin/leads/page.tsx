"use client"

/**
 * Admin CRM — Lead Management Dashboard.
 * Route: /admin/leads
 *
 * Features:
 *  - Real-time lead list from GET /api/v1/leads/
 *  - Inline status dropdown (PATCH /api/v1/leads/{id}/status)
 *  - Status filter tabs
 *  - Color-coded pipeline stages
 *  - Responsive table with key lead details
 */

import { useState } from "react"
import { useLeads, useUpdateLeadStatus } from "@/hooks/useLeads"
import type { Lead, LeadStatus } from "@/types/crm"

// ── Constants ────────────────────────────────────────────────────────────────

const STATUS_OPTIONS: LeadStatus[] = [
  "new",
  "contacted",
  "site_visit_scheduled",
  "quoted",
  "negotiating",
  "won",
  "lost",
]

const STATUS_CONFIG: Record<LeadStatus, { label: string; bg: string; color: string }> = {
  new: { label: "New", bg: "#dbeafe", color: "#1d4ed8" },
  contacted: { label: "Contacted", bg: "#fef3c7", color: "#92400e" },
  site_visit_scheduled: { label: "Site Visit", bg: "#ede9fe", color: "#5b21b6" },
  quoted: { label: "Quoted", bg: "#cffafe", color: "#0e7490" },
  negotiating: { label: "Negotiating", bg: "#ffedd5", color: "#c2410c" },
  won: { label: "Won ✓", bg: "#dcfce7", color: "#15803d" },
  lost: { label: "Lost", bg: "#fee2e2", color: "#dc2626" },
}

const SERVICE_LABELS: Record<string, string> = {
  complete_interior: "Complete Interior",
  design_only: "Design Only",
  consultancy: "Consultancy",
}

// ── Components ────────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: LeadStatus }) {
  const cfg = STATUS_CONFIG[status] ?? { label: status, bg: "#f3f4f6", color: "#374151" }
  return (
    <span
      style={{
        display: "inline-block",
        padding: "3px 10px",
        borderRadius: 999,
        background: cfg.bg,
        color: cfg.color,
        fontSize: 11,
        fontWeight: 600,
        whiteSpace: "nowrap",
        textTransform: "uppercase",
        letterSpacing: 0.5,
      }}
    >
      {cfg.label}
    </span>
  )
}

function StatusSelect({
  lead,
  onUpdate,
  isPending,
}: {
  lead: Lead
  onUpdate: (leadId: string, status: LeadStatus) => void
  isPending: boolean
}) {
  return (
    <select
      id={`lead-status-${lead.id}`}
      value={lead.status}
      onChange={(e) => onUpdate(lead.id, e.target.value as LeadStatus)}
      disabled={isPending}
      style={{
        border: "1px solid #e5e7eb",
        borderRadius: 6,
        padding: "5px 8px",
        fontSize: 12,
        background: "#fff",
        cursor: isPending ? "not-allowed" : "pointer",
        width: "100%",
      }}
    >
      {STATUS_OPTIONS.map((s) => (
        <option key={s} value={s}>
          {STATUS_CONFIG[s]?.label ?? s}
        </option>
      ))}
    </select>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function AdminLeadsPage() {
  const [statusFilter, setStatusFilter] = useState<string | undefined>(undefined)
  const { data, isLoading, error, refetch } = useLeads(
    statusFilter ? { status: statusFilter, limit: 50 } : { limit: 50 }
  )
  const { mutate: updateStatus, isPending: isUpdating } = useUpdateLeadStatus()

  const handleStatusUpdate = (leadId: string, status: LeadStatus) => {
    updateStatus({ leadId, status })
  }

  const formatBudget = (min?: number, max?: number) => {
    if (!min && !max) return "—"
    const fmt = (n: number) =>
      n >= 100000 ? `₹${(n / 100000).toFixed(1)}L` : `₹${n.toLocaleString("en-IN")}`
    return min && max ? `${fmt(min)} – ${fmt(max)}` : min ? `From ${fmt(min)}` : `Up to ${fmt(max!)}`
  }

  return (
    <div style={{ padding: "32px 28px", minHeight: "100vh" }}>
      {/* Header */}
      <div style={{ marginBottom: 28, display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, margin: 0, color: "var(--foreground)" }}>
            Lead Management
          </h1>
          <p style={{ fontSize: 13, color: "var(--muted-foreground)", margin: "4px 0 0" }}>
            {isLoading ? "Loading…" : `${data?.total ?? 0} total leads`}
          </p>
        </div>
        <button
          id="admin-leads-refresh-btn"
          onClick={() => refetch()}
          style={{
            padding: "8px 16px",
            borderRadius: 8,
            border: "1px solid var(--border, #e5e7eb)",
            background: "transparent",
            cursor: "pointer",
            fontSize: 13,
            color: "var(--foreground)",
          }}
        >
          ↻ Refresh
        </button>
      </div>

      {/* KPI Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))", gap: 12, marginBottom: 28 }}>
        {(["new", "contacted", "site_visit_scheduled", "won", "lost"] as LeadStatus[]).map((s) => {
          const count = data?.leads?.filter((l) => l.status === s).length ?? 0
          const cfg = STATUS_CONFIG[s]
          return (
            <button
              key={s}
              id={`kpi-${s}`}
              onClick={() => setStatusFilter(statusFilter === s ? undefined : s)}
              style={{
                padding: "14px 16px",
                borderRadius: 10,
                border: statusFilter === s ? `2px solid ${cfg.color}` : "1px solid var(--border, #e5e7eb)",
                background: statusFilter === s ? cfg.bg : "var(--card, #fff)",
                cursor: "pointer",
                textAlign: "left",
                transition: "all 0.15s",
              }}
            >
              <div style={{ fontSize: 22, fontWeight: 700, color: cfg.color }}>{count}</div>
              <div style={{ fontSize: 11, color: "var(--muted-foreground)", textTransform: "uppercase", letterSpacing: 0.5, marginTop: 2 }}>
                {cfg.label}
              </div>
            </button>
          )
        })}
        <button
          id="kpi-all"
          onClick={() => setStatusFilter(undefined)}
          style={{
            padding: "14px 16px",
            borderRadius: 10,
            border: !statusFilter ? "2px solid #6366f1" : "1px solid var(--border, #e5e7eb)",
            background: !statusFilter ? "#eef2ff" : "var(--card, #fff)",
            cursor: "pointer",
            textAlign: "left",
          }}
        >
          <div style={{ fontSize: 22, fontWeight: 700, color: "#4f46e5" }}>{data?.total ?? 0}</div>
          <div style={{ fontSize: 11, color: "var(--muted-foreground)", textTransform: "uppercase", letterSpacing: 0.5, marginTop: 2 }}>All Leads</div>
        </button>
      </div>

      {/* States */}
      {isLoading && (
        <div style={{ textAlign: "center", padding: "60px 0", color: "var(--muted-foreground)" }}>
          <div style={{ fontSize: 32, marginBottom: 12 }}>⏳</div>
          Loading leads…
        </div>
      )}

      {error && (
        <div
          role="alert"
          style={{
            padding: "16px 20px",
            borderRadius: 10,
            background: "#fef2f2",
            border: "1px solid #fecaca",
            color: "#dc2626",
            marginBottom: 20,
          }}
        >
          Failed to load leads. Make sure the backend is running at{" "}
          <code>{process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}</code>
        </div>
      )}

      {/* Leads Table */}
      {!isLoading && !error && (
        <div
          style={{
            background: "var(--card, #fff)",
            borderRadius: 12,
            border: "1px solid var(--border, #e5e7eb)",
            overflow: "hidden",
            boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
          }}
        >
          {data?.leads?.length === 0 ? (
            <div style={{ textAlign: "center", padding: "60px 0", color: "var(--muted-foreground)" }}>
              <div style={{ fontSize: 40, marginBottom: 12 }}>📭</div>
              <p>No leads found{statusFilter ? ` with status "${STATUS_CONFIG[statusFilter as LeadStatus]?.label}"` : ""}.</p>
            </div>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                <thead>
                  <tr style={{ background: "var(--muted, #f9fafb)", borderBottom: "1px solid var(--border, #e5e7eb)" }}>
                    {["Client", "Service", "City", "Budget", "Rooms", "Status", "Received", "Actions"].map((h) => (
                      <th
                        key={h}
                        style={{
                          padding: "12px 16px",
                          textAlign: "left",
                          fontWeight: 600,
                          color: "var(--muted-foreground)",
                          fontSize: 11,
                          textTransform: "uppercase",
                          letterSpacing: 0.5,
                          whiteSpace: "nowrap",
                        }}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {data?.leads?.map((lead: Lead, idx: number) => (
                    <tr
                      key={lead.id}
                      style={{
                        borderBottom: "1px solid var(--border, #f3f4f6)",
                        background: idx % 2 === 0 ? "transparent" : "var(--muted, #fafafa)",
                        transition: "background 0.1s",
                      }}
                    >
                      {/* Client */}
                      <td style={{ padding: "14px 16px" }}>
                        <div style={{ fontWeight: 600, color: "var(--foreground)" }}>
                          {lead.client_name ?? "—"}
                        </div>
                        <div style={{ fontSize: 12, color: "var(--muted-foreground)", marginTop: 2 }}>
                          {lead.client_email ?? ""}
                        </div>
                        <div style={{ fontSize: 12, color: "var(--muted-foreground)" }}>
                          {lead.client_phone ?? ""}
                        </div>
                      </td>

                      {/* Service */}
                      <td style={{ padding: "14px 16px", whiteSpace: "nowrap" }}>
                        {SERVICE_LABELS[lead.service_type] ?? lead.service_type}
                        {lead.property_type && (
                          <div style={{ fontSize: 11, color: "var(--muted-foreground)", marginTop: 2, textTransform: "capitalize" }}>
                            {lead.property_type}
                          </div>
                        )}
                      </td>

                      {/* City */}
                      <td style={{ padding: "14px 16px" }}>{lead.city ?? "—"}</td>

                      {/* Budget */}
                      <td style={{ padding: "14px 16px", whiteSpace: "nowrap" }}>
                        {formatBudget(lead.budget_min, lead.budget_max)}
                      </td>

                      {/* Rooms */}
                      <td style={{ padding: "14px 16px" }}>
                        {lead.num_rooms ? `${lead.num_rooms} BHK` : "—"}
                      </td>

                      {/* Status badge */}
                      <td style={{ padding: "14px 16px" }}>
                        <StatusBadge status={lead.status} />
                      </td>

                      {/* Date */}
                      <td style={{ padding: "14px 16px", whiteSpace: "nowrap", color: "var(--muted-foreground)" }}>
                        {new Date(lead.created_at).toLocaleDateString("en-IN", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </td>

                      {/* Status change dropdown */}
                      <td style={{ padding: "14px 16px", minWidth: 140 }}>
                        <StatusSelect
                          lead={lead}
                          onUpdate={handleStatusUpdate}
                          isPending={isUpdating}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
