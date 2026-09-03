/**
 * Zod validation schema for the 9-step Project Planner form.
 *
 * Mirrors the FastAPI LeadCreate Pydantic schema exactly.
 * Used with react-hook-form's zodResolver.
 */

import { z } from "zod"

export const leadSchema = z.object({
  // Step 1 — Service Type
  service_type: z.enum(["complete_interior", "design_only", "consultancy"], {
    message: "Please select a service type",
  }),

  // Step 2 — Property
  property_type: z
    .enum(["apartment", "villa", "office", "shop", "restaurant", "hotel"])
    .optional(),

  // Step 3 — Location
  city: z.string().min(2, "City is required"),
  address: z.string().optional(),
  pincode: z
    .string()
    .regex(/^\d{6}$/, "Enter a valid 6-digit pincode")
    .optional()
    .or(z.literal("")),

  // Step 4 — Scope & Budget
  carpet_area: z.number().positive("Enter a valid area").optional(),
  buildup_area: z.number().positive("Enter a valid area").optional(),
  num_rooms: z.number().int().min(1).optional(),
  budget_min: z.number().min(0, "Enter a valid budget").optional(),
  budget_max: z.number().min(0, "Enter a valid budget").optional(),
  expected_start_date: z.string().optional(),
  expected_end_date: z.string().optional(),

  // Step 5 — Required Work
  required_work: z.array(z.string()).optional().default([]),

  // Step 7 — Contact Details
  client_name: z.string().min(2, "Full name is required"),
  client_email: z.string().email("Enter a valid email address"),
  client_phone: z
    .string()
    .regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit Indian mobile number"),

  // Step 8 — Meeting Preference
  meeting_preference: z
    .enum(["site_visit", "video_call", "phone_call", "office_visit"])
    .optional(),
})

export type LeadFormData = z.infer<typeof leadSchema>
