"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { format } from "date-fns";

type NewsletterStatus = "active" | "unsubscribed";

const STATUS_CONFIG: Record<string, { label: string; bg: string; color: string }> = {
  active: { label: "Active", bg: "#dcfce7", color: "#15803d" },
  unsubscribed: { label: "Unsubscribed", bg: "#fee2e2", color: "#dc2626" },
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

export default function NewsletterAdminPage() {
  const [subscribers, setSubscribers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string | undefined>(undefined);

  const fetchSubscribers = async () => {
    try {
      const res = await api.get("/api/v1/newsletter");
      setSubscribers(res.data);
    } catch (err) {
      console.error("Failed to fetch subscribers", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscribers();
  }, []);

  const filteredSubscribers = statusFilter 
    ? subscribers.filter(s => s.status === statusFilter) 
    : subscribers;

  return (
    <div style={{ padding: "32px 28px", minHeight: "100vh" }}>
      {/* Header */}
      <div style={{ marginBottom: 28, display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, margin: 0, color: "var(--foreground)" }}>
            Newsletter Subscribers
          </h1>
          <p style={{ fontSize: 13, color: "var(--muted-foreground)", margin: "4px 0 0" }}>
            {loading ? "Loading…" : `${subscribers.length} total subscribers`}
          </p>
        </div>
        <button
          onClick={() => { setLoading(true); fetchSubscribers(); }}
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
        {(["active", "unsubscribed"] as NewsletterStatus[]).map((s) => {
          const count = subscribers.filter((c) => c.status === s).length;
          const cfg = STATUS_CONFIG[s];
          return (
            <button
              key={s}
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
          );
        })}
        <button
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
          <div style={{ fontSize: 22, fontWeight: 700, color: "#4f46e5" }}>{subscribers.length}</div>
          <div style={{ fontSize: 11, color: "var(--muted-foreground)", textTransform: "uppercase", letterSpacing: 0.5, marginTop: 2 }}>All Subscribers</div>
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
            Loading subscribers…
          </div>
        ) : filteredSubscribers.length === 0 ? (
          <div style={{ textAlign: "center", padding: "60px 0", color: "var(--muted-foreground)" }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>📭</div>
            <p>No subscribers found{statusFilter ? ` with status "${STATUS_CONFIG[statusFilter]?.label}"` : ""}.</p>
          </div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
              <thead>
                <tr style={{ background: "var(--muted, #f9fafb)", borderBottom: "1px solid var(--border, #e5e7eb)" }}>
                  {["Date", "Email", "Source", "Status"].map((h) => (
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
                {filteredSubscribers.map((sub, idx) => (
                  <tr
                    key={sub.id}
                    style={{
                      borderBottom: "1px solid var(--border, #f3f4f6)",
                      background: idx % 2 === 0 ? "transparent" : "var(--muted, #fafafa)",
                      transition: "background 0.1s",
                    }}
                  >
                    <td style={{ padding: "14px 16px", whiteSpace: "nowrap", color: "var(--muted-foreground)" }}>
                      {format(new Date(sub.created_at), "MMM d, yyyy")}
                    </td>
                    <td style={{ padding: "14px 16px" }}>
                      <div style={{ fontWeight: 600, color: "var(--foreground)" }}>{sub.email}</div>
                    </td>
                    <td style={{ padding: "14px 16px", color: "var(--muted-foreground)" }}>
                      {sub.source}
                    </td>
                    <td style={{ padding: "14px 16px" }}>
                      <StatusBadge status={sub.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
