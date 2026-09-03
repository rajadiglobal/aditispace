"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { format } from "date-fns";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

type RequirementStatus = "new" | "contacted" | "site_visit" | "in_progress" | "converted" | "closed";

const STATUS_OPTIONS: RequirementStatus[] = [
  "new",
  "contacted",
  "site_visit",
  "in_progress",
  "converted",
  "closed",
];

const STATUS_CONFIG: Record<string, { label: string; bg: string; color: string }> = {
  new: { label: "New", bg: "#dbeafe", color: "#1d4ed8" },
  contacted: { label: "Contacted", bg: "#fef3c7", color: "#92400e" },
  site_visit: { label: "Site Visit", bg: "#ede9fe", color: "#5b21b6" },
  in_progress: { label: "In Progress", bg: "#cffafe", color: "#0e7490" },
  converted: { label: "Converted ✓", bg: "#dcfce7", color: "#15803d" },
  closed: { label: "Closed", bg: "#fee2e2", color: "#dc2626" },
};

function StatusBadge({ status }: { status: string }) {
  const cfg = STATUS_CONFIG[status] ?? { label: status, bg: "#f3f4f6", color: "#374151" };
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
  );
}

export default function RequirementsAdminPage() {
  const [requirements, setRequirements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string | undefined>(undefined);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  
  // Dialog state
  const [selectedReq, setSelectedReq] = useState<any | null>(null);
  const [notes, setNotes] = useState("");
  const [savingNotes, setSavingNotes] = useState(false);

  const fetchRequirements = async () => {
    try {
      const res = await api.get("/api/v1/requirements");
      setRequirements(res.data);
    } catch (err) {
      console.error("Failed to fetch requirements", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequirements();
  }, []);

  const handleStatusUpdate = async (id: string, status: string) => {
    setUpdatingId(id);
    try {
      await api.patch(`/api/v1/requirements/${id}`, { status });
      await fetchRequirements();
      if (selectedReq && selectedReq.id === id) {
        setSelectedReq({ ...selectedReq, status });
      }
    } catch (err) {
      console.error("Failed to update status", err);
    } finally {
      setUpdatingId(null);
    }
  };

  const saveNotes = async () => {
    if (!selectedReq) return;
    setSavingNotes(true);
    try {
      await api.patch(`/api/v1/requirements/${selectedReq.id}`, { additional_notes: notes });
      await fetchRequirements();
      setSelectedReq({ ...selectedReq, additional_notes: notes });
    } catch (err) {
      console.error("Failed to save notes", err);
    } finally {
      setSavingNotes(false);
    }
  };

  const openDetails = (req: any) => {
    setSelectedReq(req);
    setNotes(req.additional_notes || "");
  };

  const filteredRequirements = statusFilter 
    ? requirements.filter(r => r.status === statusFilter) 
    : requirements;

  return (
    <div style={{ padding: "32px 28px", minHeight: "100vh" }}>
      {/* Header */}
      <div style={{ marginBottom: 28, display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, margin: 0, color: "var(--foreground)" }}>
            Project Requirements
          </h1>
          <p style={{ fontSize: 13, color: "var(--muted-foreground)", margin: "4px 0 0" }}>
            {loading ? "Loading…" : `${requirements.length} total requirements`}
          </p>
        </div>
        <button
          onClick={() => { setLoading(true); fetchRequirements(); }}
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
      <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginBottom: 28 }}>
        {(["new", "contacted", "site_visit", "converted"] as RequirementStatus[]).map((s) => {
          const count = requirements.filter((r) => r.status === s).length;
          const cfg = STATUS_CONFIG[s];
          return (
            <button
              key={s}
              onClick={() => setStatusFilter(statusFilter === s ? undefined : s)}
              style={{
                flex: "1 1 120px",
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
          );
        })}
        <button
          onClick={() => setStatusFilter(undefined)}
          style={{
            flex: "1 1 120px",
            padding: "14px 16px",
            borderRadius: 10,
            border: !statusFilter ? "2px solid #6366f1" : "1px solid var(--border, #e5e7eb)",
            background: !statusFilter ? "#eef2ff" : "var(--card, #fff)",
            cursor: "pointer",
            textAlign: "left",
          }}
        >
          <div style={{ fontSize: 22, fontWeight: 700, color: "#4f46e5" }}>{requirements.length}</div>
          <div style={{ fontSize: 11, color: "var(--muted-foreground)", textTransform: "uppercase", letterSpacing: 0.5, marginTop: 2 }}>All Requirements</div>
        </button>
      </div>

      {/* Table */}
      <div
        style={{
          background: "var(--card, #fff)",
          borderRadius: 12,
          border: "1px solid var(--border, #e5e7eb)",
          overflow: "hidden",
          boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
        }}
      >
        {loading ? (
          <div style={{ textAlign: "center", padding: "60px 0", color: "var(--muted-foreground)" }}>
            <div style={{ fontSize: 32, marginBottom: 12 }}>⏳</div>
            Loading requirements…
          </div>
        ) : filteredRequirements.length === 0 ? (
          <div style={{ textAlign: "center", padding: "60px 0", color: "var(--muted-foreground)" }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>📭</div>
            <p>No requirements found{statusFilter ? ` with status "${STATUS_CONFIG[statusFilter]?.label}"` : ""}.</p>
          </div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
              <thead>
                <tr style={{ background: "var(--muted, #f9fafb)", borderBottom: "1px solid var(--border, #e5e7eb)" }}>
                  {["Date", "Customer", "Property", "Scope & Size", "Budget", "Status", "Actions"].map((h) => (
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
                {filteredRequirements.map((req, idx) => (
                  <tr
                    key={req.id}
                    style={{
                      borderBottom: "1px solid var(--border, #f3f4f6)",
                      background: idx % 2 === 0 ? "transparent" : "var(--muted, #fafafa)",
                      transition: "background 0.1s",
                    }}
                  >
                    <td style={{ padding: "14px 16px", whiteSpace: "nowrap", color: "var(--muted-foreground)" }}>
                      {format(new Date(req.created_at), "MMM d, yyyy")}
                    </td>
                    <td style={{ padding: "14px 16px" }}>
                      <div style={{ fontWeight: 600, color: "var(--foreground)" }}>{req.customer_name}</div>
                      <div style={{ fontSize: 12, color: "var(--muted-foreground)", marginTop: 2 }}>{req.customer_phone}</div>
                    </td>
                    <td style={{ padding: "14px 16px" }}>
                      <div style={{ color: "var(--foreground)", fontWeight: 500 }}>{req.property_type}</div>
                      <div style={{ fontSize: 12, color: "var(--muted-foreground)" }}>{req.location_city}</div>
                    </td>
                    <td style={{ padding: "14px 16px" }}>
                      <div style={{ color: "var(--foreground)", fontWeight: 500 }}>{req.scope}</div>
                      <div style={{ fontSize: 12, color: "var(--muted-foreground)" }}>{req.property_size}</div>
                    </td>
                    <td style={{ padding: "14px 16px", fontWeight: 500, color: "#92400e" }}>
                      {req.budget_range}
                    </td>
                    <td style={{ padding: "14px 16px" }}>
                      <StatusBadge status={req.status} />
                    </td>
                    <td style={{ padding: "14px 16px", minWidth: 200 }}>
                      <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                        <select
                          value={req.status}
                          onChange={(e) => handleStatusUpdate(req.id, e.target.value)}
                          disabled={updatingId === req.id}
                          style={{
                            border: "1px solid #e5e7eb",
                            borderRadius: 6,
                            padding: "5px 8px",
                            fontSize: 12,
                            background: "#fff",
                            cursor: updatingId === req.id ? "not-allowed" : "pointer",
                            width: "120px",
                          }}
                        >
                          {STATUS_OPTIONS.map((s) => (
                            <option key={s} value={s}>
                              {STATUS_CONFIG[s]?.label ?? s}
                            </option>
                          ))}
                        </select>
                        <button
                          onClick={() => openDetails(req)}
                          style={{
                            padding: "5px 10px",
                            fontSize: 12,
                            background: "#0f0f0f",
                            color: "#fff",
                            borderRadius: 6,
                            cursor: "pointer",
                            fontWeight: 500,
                          }}
                        >
                          Details
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Details Dialog */}
      <Dialog open={!!selectedReq} onOpenChange={(open) => !open && setSelectedReq(null)}>
        <DialogContent className="sm:max-w-[700px] bg-white text-gray-900 border border-gray-200 shadow-xl max-h-[90vh] overflow-y-auto">
          {selectedReq && (
            <div className="space-y-6">
              <DialogHeader>
                <div className="flex justify-between items-center pr-6">
                  <div>
                    <DialogTitle className="text-xl font-bold">Requirement Details</DialogTitle>
                    <p className="text-sm text-gray-500 mt-1">Submitted on {format(new Date(selectedReq.created_at), "PPP p")}</p>
                  </div>
                  <StatusBadge status={selectedReq.status} />
                </div>
              </DialogHeader>
              
              <div className="grid grid-cols-2 gap-6 bg-gray-50 p-4 rounded-lg border border-gray-100">
                <div>
                  <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Customer Info</h4>
                  <div className="space-y-1">
                    <p className="text-sm"><span className="font-medium">Name:</span> {selectedReq.customer_name}</p>
                    <p className="text-sm"><span className="font-medium">Email:</span> {selectedReq.customer_email || "N/A"}</p>
                    <p className="text-sm"><span className="font-medium">Phone:</span> {selectedReq.customer_phone || "N/A"}</p>
                    <p className="text-sm"><span className="font-medium">WhatsApp:</span> {selectedReq.customer_whatsapp || "N/A"}</p>
                  </div>
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Location</h4>
                  <div className="space-y-1">
                    <p className="text-sm"><span className="font-medium">City:</span> {selectedReq.location_city || "N/A"}</p>
                    <p className="text-sm"><span className="font-medium">State:</span> {selectedReq.location_state || "N/A"}</p>
                    <p className="text-sm"><span className="font-medium">Locality:</span> {selectedReq.location_locality || "N/A"}</p>
                    <p className="text-sm"><span className="font-medium">Pincode:</span> {selectedReq.pincode || "N/A"}</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6 p-4 border border-gray-100 rounded-lg">
                <div>
                  <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Project Specs</h4>
                  <div className="space-y-1">
                    <p className="text-sm"><span className="font-medium">Type:</span> {selectedReq.property_type || "N/A"}</p>
                    <p className="text-sm"><span className="font-medium">Status:</span> {selectedReq.property_status || "N/A"}</p>
                    <p className="text-sm"><span className="font-medium">Size:</span> {selectedReq.property_size || "N/A"}</p>
                    <p className="text-sm"><span className="font-medium">Scope:</span> {selectedReq.scope || "N/A"}</p>
                  </div>
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Timeline & Budget</h4>
                  <div className="space-y-1">
                    <p className="text-sm"><span className="font-medium">Timeline:</span> {selectedReq.timeline || "N/A"}</p>
                    <p className="text-sm"><span className="font-medium">Budget:</span> <span className="text-[#92400e] font-semibold">{selectedReq.budget_range || "N/A"}</span></p>
                  </div>
                </div>
              </div>

              {selectedReq.design_preferences && (
                <div className="p-4 border border-gray-100 rounded-lg">
                  <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Design Preferences</h4>
                  <p className="text-sm text-gray-700 whitespace-pre-wrap">{selectedReq.design_preferences}</p>
                </div>
              )}

              <div className="pt-2 border-t border-gray-100">
                <h4 className="text-sm font-semibold text-gray-900 mb-2">Internal Support Notes</h4>
                <textarea 
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Add notes for your support team..."
                  className="w-full min-h-[100px] p-3 text-sm border border-gray-200 rounded-lg focus:ring-1 focus:ring-primary focus:border-primary outline-none"
                />
                <div className="mt-3 flex justify-end">
                  <button
                    onClick={saveNotes}
                    disabled={savingNotes}
                    className="px-4 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary/90 disabled:opacity-50"
                  >
                    {savingNotes ? "Saving..." : "Save Notes"}
                  </button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
