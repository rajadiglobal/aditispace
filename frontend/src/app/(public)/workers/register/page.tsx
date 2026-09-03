"use client"

/**
 * Worker Registration Form
 * Route: /workers/register
 *
 * Public page — any contractor/tradesperson can self-register.
 * Submits to POST /api/v1/workers/
 */

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { workerService } from "@/services/workerService"

// ── Schema ────────────────────────────────────────────────────────────────────

const workerSchema = z.object({
  name: z.string().min(2, "Full name is required"),
  phone: z.string().regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit mobile number"),
  email: z.string().email("Enter a valid email").optional().or(z.literal("")),
  city: z.string().min(2, "City is required"),
  experience_years: z.number().int().min(0).max(50, "Max 50 years"),
  daily_wage: z.number().positive("Enter your daily wage"),
  worker_type: z.string().min(2, "Trade is required"),
  skills: z.array(z.string()).min(1, "Select at least one skill"),
})

type WorkerFormData = z.infer<typeof workerSchema>

const SKILL_OPTIONS = [
  "Modular Kitchen",
  "Wardrobe",
  "TV Unit",
  "False Ceiling",
  "Wallpaper",
  "Painting",
  "Tiles",
  "Civil Work",
  "Electrical",
  "Plumbing",
  "Furniture",
  "Flooring",
]

const WORKER_TYPES = [
  "Carpenter",
  "Painter",
  "Electrician",
  "Plumber",
  "Tiler",
  "Civil Contractor",
  "Interior Decorator",
  "False Ceiling Installer",
]

// ── Page ──────────────────────────────────────────────────────────────────────

export default function WorkerRegisterPage() {
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [submittedId, setSubmittedId] = useState<string>("")

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<WorkerFormData>({
    resolver: zodResolver(workerSchema),
    defaultValues: { skills: [] },
  })

  const selectedSkills = watch("skills") || []

  const toggleSkill = (skill: string) => {
    const current = selectedSkills
    if (current.includes(skill)) {
      setValue("skills", current.filter((s) => s !== skill))
    } else {
      setValue("skills", [...current, skill])
    }
  }

  const onSubmit = async (data: WorkerFormData) => {
    const result = await workerService.registerWorker(data)
    setSubmittedId(result.id)
    setIsSubmitted(true)
  }

  if (isSubmitted) {
    return (
      <main
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "var(--background)",
          padding: 24,
        }}
      >
        <div style={{ textAlign: "center", maxWidth: 420 }}>
          <div style={{ fontSize: 56, marginBottom: 16 }}>🎉</div>
          <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 12 }}>Registration Submitted!</h1>
          <p style={{ color: "var(--muted-foreground)", marginBottom: 8 }}>
            Thank you for registering. Our team will verify your details and contact you shortly.
          </p>
          {submittedId && (
            <p style={{ fontSize: 12, color: "#888", marginTop: 8 }}>
              Reference ID: <code>{submittedId.slice(0, 8)}</code>
            </p>
          )}
          <a
            href="/"
            style={{
              display: "inline-block",
              marginTop: 24,
              padding: "10px 28px",
              background: "#111",
              color: "#fff",
              borderRadius: 8,
              textDecoration: "none",
              fontSize: 14,
            }}
          >
            ← Back to Home
          </a>
        </div>
      </main>
    )
  }

  const fieldStyle = {
    width: "100%",
    padding: "10px 14px",
    border: "1px solid var(--border, #e5e7eb)",
    borderRadius: 8,
    fontSize: 14,
    background: "var(--background)",
    color: "var(--foreground)",
    outline: "none",
    boxSizing: "border-box" as const,
  }

  const labelStyle = {
    display: "block",
    fontSize: 13,
    fontWeight: 600,
    marginBottom: 6,
    color: "var(--foreground)",
  }

  const errorStyle = {
    fontSize: 12,
    color: "#ef4444",
    marginTop: 4,
  }

  return (
    <main style={{ minHeight: "100vh", background: "var(--background)", padding: "48px 16px" }}>
      <div style={{ maxWidth: 680, margin: "0 auto" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <h1
            style={{
              fontFamily: "var(--font-heading)",
              fontSize: 30,
              fontWeight: 700,
              marginBottom: 8,
            }}
          >
            Register as a Worker
          </h1>
          <p style={{ color: "var(--muted-foreground)", fontSize: 15 }}>
            Join the Aditi Studio network of verified craftspeople and interior contractors.
          </p>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          style={{
            background: "var(--card, #fff)",
            border: "1px solid var(--border, #e5e7eb)",
            borderRadius: 16,
            padding: "36px 32px",
            boxShadow: "0 2px 12px rgba(0,0,0,0.07)",
          }}
        >
          {/* Row 1 — Name + Phone */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20 }}>
            <div>
              <label style={labelStyle}>Full Name *</label>
              <input id="worker-name" {...register("name")} placeholder="Ramesh Kumar" style={fieldStyle} />
              {errors.name && <p style={errorStyle}>{errors.name.message}</p>}
            </div>
            <div>
              <label style={labelStyle}>Mobile Number *</label>
              <input id="worker-phone" {...register("phone")} placeholder="9876543210" style={fieldStyle} />
              {errors.phone && <p style={errorStyle}>{errors.phone.message}</p>}
            </div>
          </div>

          {/* Row 2 — Email + City */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20 }}>
            <div>
              <label style={labelStyle}>Email Address</label>
              <input id="worker-email" {...register("email")} type="email" placeholder="you@example.com" style={fieldStyle} />
              {errors.email && <p style={errorStyle}>{errors.email.message}</p>}
            </div>
            <div>
              <label style={labelStyle}>City *</label>
              <input id="worker-city" {...register("city")} placeholder="Noida" style={fieldStyle} />
              {errors.city && <p style={errorStyle}>{errors.city.message}</p>}
            </div>
          </div>

          {/* Row 3 — Trade + Experience + Daily Wage */}
          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr", gap: 16, marginBottom: 20 }}>
            <div>
              <label style={labelStyle}>Primary Trade *</label>
              <select id="worker-type" {...register("worker_type")} style={fieldStyle}>
                <option value="">Select trade…</option>
                {WORKER_TYPES.map((t) => (
                  <option key={t} value={t.toLowerCase()}>{t}</option>
                ))}
              </select>
              {errors.worker_type && <p style={errorStyle}>{errors.worker_type.message}</p>}
            </div>
            <div>
              <label style={labelStyle}>Experience (yrs) *</label>
              <input
                id="worker-experience"
                type="number"
                {...register("experience_years", { valueAsNumber: true })}
                placeholder="5"
                min={0}
                max={50}
                style={fieldStyle}
              />
              {errors.experience_years && <p style={errorStyle}>{errors.experience_years.message}</p>}
            </div>
            <div>
              <label style={labelStyle}>Daily Wage (₹) *</label>
              <input
                id="worker-wage"
                type="number"
                {...register("daily_wage", { valueAsNumber: true })}
                placeholder="1500"
                min={0}
                style={fieldStyle}
              />
              {errors.daily_wage && <p style={errorStyle}>{errors.daily_wage.message}</p>}
            </div>
          </div>

          {/* Skills */}
          <div style={{ marginBottom: 28 }}>
            <label style={labelStyle}>Skills * (select all that apply)</label>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: 8,
                padding: "12px",
                border: "1px solid var(--border, #e5e7eb)",
                borderRadius: 8,
                background: "var(--muted, #f9fafb)",
              }}
            >
              {SKILL_OPTIONS.map((skill) => {
                const selected = selectedSkills.includes(skill)
                return (
                  <button
                    key={skill}
                    type="button"
                    id={`skill-${skill.toLowerCase().replace(/\s+/g, "-")}`}
                    onClick={() => toggleSkill(skill)}
                    style={{
                      padding: "6px 14px",
                      borderRadius: 999,
                      border: selected ? "2px solid #111" : "1px solid #d1d5db",
                      background: selected ? "#111" : "#fff",
                      color: selected ? "#fff" : "#374151",
                      fontSize: 12,
                      fontWeight: 500,
                      cursor: "pointer",
                      transition: "all 0.15s",
                    }}
                  >
                    {selected ? "✓ " : ""}{skill}
                  </button>
                )
              })}
            </div>
            {errors.skills && <p style={errorStyle}>{errors.skills.message}</p>}
          </div>

          {/* Submit */}
          <button
            id="worker-register-submit-btn"
            type="submit"
            disabled={isSubmitting}
            style={{
              width: "100%",
              padding: "14px",
              borderRadius: 10,
              background: isSubmitting ? "#666" : "#111",
              color: "#fff",
              fontSize: 15,
              fontWeight: 600,
              border: "none",
              cursor: isSubmitting ? "not-allowed" : "pointer",
              transition: "background 0.2s",
            }}
          >
            {isSubmitting ? "Submitting…" : "Register as a Worker →"}
          </button>
        </form>
      </div>
    </main>
  )
}
