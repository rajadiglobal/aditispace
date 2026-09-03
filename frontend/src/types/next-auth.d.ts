/**
 * NextAuth.js type augmentations.
 *
 * Extends the default Session and JWT interfaces to include:
 *   - session.accessToken  → our backend JWT (used by Pratibha's API client)
 *   - session.user.id      → UUID of the user in our PostgreSQL database
 *   - session.user.role    → "client" | "admin" | "staff"
 */

import type { DefaultSession } from "next-auth"

declare module "next-auth" {
  interface Session {
    /** Backend JWT — attach to all API requests as `Authorization: Bearer <token>` */
    accessToken: string
    user: {
      /** User UUID from our PostgreSQL `users` table */
      id: string
      /** Role controls CRM access on the frontend */
      role: "client" | "admin" | "staff"
    } & DefaultSession["user"]
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string
    userId?: string
    role?: string
  }
}
