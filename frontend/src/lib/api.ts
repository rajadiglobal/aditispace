/**
 * Axios API client — Pratibha's task.
 *
 * A pre-configured Axios instance that:
 *  1. Points to the FastAPI backend (NEXT_PUBLIC_API_URL)
 *  2. Automatically attaches Rimesh's JWT token as Bearer auth header
 *  3. Handles 401 errors by redirecting to sign-in
 *
 * Usage:
 *   import { api } from "@/lib/api"
 *   const data = await api.get("/api/v1/leads/")
 */

import axios, { AxiosError, type InternalAxiosRequestConfig } from "axios"
import { getSession } from "next-auth/react"

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000"

export const api = axios.create({
  baseURL: BASE_URL,
  timeout: 15_000,
  headers: {
    "Content-Type": "application/json",
  },
})

// ── Request Interceptor ────────────────────────────────────────────────────────
// Reads the JWT from Rimesh's NextAuth session and attaches it to every request.
api.interceptors.request.use(async (config: InternalAxiosRequestConfig) => {
  const session = await getSession()
  if (session?.accessToken) {
    config.headers.Authorization = `Bearer ${session.accessToken}`
  }
  return config
})

// ── Response Interceptor ──────────────────────────────────────────────────────
// Centralised error handling.
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      // Token expired or invalid — redirect to sign-in
      if (typeof window !== "undefined") {
        window.location.href = "/auth/signin"
      }
    }
    return Promise.reject(error)
  }
)
