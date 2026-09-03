/**
 * NextAuth.js v5 (beta) configuration — Rimesh's task.
 *
 * Flow:
 *  1. User clicks "Continue with Google" → Google OAuth consent
 *  2. Google returns id_token + profile
 *  3. signIn callback sends id_token to FastAPI POST /api/v1/auth/google
 *  4. FastAPI verifies token, upserts user, returns { access_token, user }
 *  5. jwt callback stores access_token + role in the NextAuth JWT
 *  6. session callback exposes them as session.accessToken and session.user.role
 *  7. Pratibha's API client reads session.accessToken for all API calls
 */

import NextAuth, { type NextAuthConfig } from "next-auth"
import GoogleProvider from "next-auth/providers/google"

const BACKEND_URL = process.env.BACKEND_API_URL || "http://localhost:8000"

export const authConfig: NextAuthConfig = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          access_type: "offline",
          prompt: "consent",
          scope: "openid email profile",
        },
      },
    }),
  ],

  callbacks: {
    /**
     * signIn — called on every Google sign-in attempt.
     * Verifies the backend accepts this token before allowing login.
     */
    async signIn({ account }) {
      if (account?.provider !== "google" || !account.id_token) return false
      try {
        const res = await fetch(`${BACKEND_URL}/api/v1/auth/google`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id_token: account.id_token }),
        })
        if (!res.ok) {
          const errorText = await res.text()
          console.error(`[NextAuth signIn] Backend rejected token. Status: ${res.status}, Body:`, errorText)
        }
        return res.ok
      } catch (err) {
        console.error(`[NextAuth signIn] Failed to contact backend:`, err)
        return false
      }
    },

    /**
     * jwt — called whenever a JWT is created or updated.
     * On first sign-in, exchanges the Google id_token for our backend JWT
     * and stores the access_token + user details in the NextAuth JWT.
     */
    async jwt({ token, account, profile }) {
      if (account?.provider === "google" && account.id_token) {
        try {
          const res = await fetch(`${BACKEND_URL}/api/v1/auth/google`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              id_token: account.id_token,
              email: profile?.email,
              name: profile?.name,
              picture: (profile as Record<string, string>)?.picture,
            }),
          })

          if (res.ok) {
            const data: { access_token: string; user: { id: string; role: string } } =
              await res.json()
            token.accessToken = data.access_token
            token.userId = data.user.id
            token.role = data.user.role
          }
        } catch (err) {
          console.error("[NextAuth] Backend JWT exchange failed:", err)
        }
      }
      return token
    },

    /**
     * session — shapes the session object exposed to client components.
     * Adds accessToken and role to session so Pratibha can use them.
     */
    async session({ session, token }) {
      session.accessToken = token.accessToken as string
      session.user.id = token.userId as string
      session.user.role = token.role as "client" | "admin" | "staff"
      return session
    },
  },

  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },

  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
}

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig)
