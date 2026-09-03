/**
 * NextAuth.js v5 route handler.
 * Handles all /api/auth/* routes (callback, signIn, signOut, session, etc.)
 */
import { handlers } from "@/lib/auth"

export const { GET, POST } = handlers
