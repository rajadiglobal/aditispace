# 🔐 RIMESH'S TASK — Google OAuth Authentication Integration
**Assigned To:** Rimesh  
**Project:** Avyron Studio Interior Design CRM  
**Stack:** Next.js 14+ (App Router) · NextAuth.js v5 · FastAPI Backend  
**Priority:** 🔴 Critical — All other CRM features depend on Auth  

---

## 📋 Overview

Your task is to wire up **Google OAuth 2.0** login so that:
1. Users (clients) can sign in via **"Continue with Google"** inside the Project Planner form (Step 7).
2. Admin users can sign in via a dedicated **`/admin/login`** page.
3. On successful login, a **JWT token** is issued by the FastAPI backend and stored securely for API calls.
4. The session is shared between the Next.js frontend and the FastAPI backend.

---

## 🗺️ Architecture Flow

```
User clicks "Continue with Google"
        │
        ▼
NextAuth.js (frontend)
        │  ── Google OAuth 2.0 ──▶  Google
        │  ◀── id_token, email ───  Google
        │
        ▼
NextAuth sends id_token to FastAPI  POST /api/v1/auth/google
        │
FastAPI verifies token with Google
        │  ── calls Google tokeninfo ──▶
        │
        ▼
FastAPI creates/finds User in DB
        │
        ▼
FastAPI returns { access_token, user }
        │
        ▼
NextAuth stores access_token in session
        │
        ▼
Frontend uses session.accessToken for all API calls
```

---

## 🛠️ Step 1 — Google Cloud Console Setup

> **Do this FIRST before writing any code.**

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project OR select existing one → name it **"Avyron Studio CRM"**
3. Navigate to **APIs & Services → Credentials**
4. Click **Create Credentials → OAuth 2.0 Client ID**
5. Application type: **Web Application**
6. Name: `Avyron Studio Web`
7. Add **Authorized Redirect URIs**:
   ```
   http://localhost:3000/api/auth/callback/google
   https://yourdomain.com/api/auth/callback/google
   ```
8. Click **Create** → Copy the `Client ID` and `Client Secret`
9. Navigate to **OAuth consent screen**:
   - User Type: **External**
   - App name: `Avyron Studio`
   - Add scopes: `email`, `profile`, `openid`
   - Add test users (your Gmail accounts for dev)
10. Navigate to **APIs & Services → Library** → Enable:
    - **Google+ API**
    - **People API**

---

## 🛠️ Step 2 — Environment Variables

Create/update **`frontend/.env.local`** (never commit this file):

```env
# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-super-secret-32-char-string-here

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-google-client-secret

# FastAPI Backend URL
NEXT_PUBLIC_API_URL=http://localhost:8000
BACKEND_API_URL=http://localhost:8000
```

Generate NEXTAUTH_SECRET with:
```bash
openssl rand -base64 32
```

---

## 🛠️ Step 3 — Install Dependencies (Frontend)

```bash
cd frontend
npm install next-auth@beta
```

---

## 🛠️ Step 4 — NextAuth Configuration

### 4.1 — Create: `frontend/src/lib/auth.ts`

```typescript
import NextAuth, { NextAuthConfig } from "next-auth"
import GoogleProvider from "next-auth/providers/google"

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
    async signIn({ account, profile }) {
      if (account?.provider === "google") {
        try {
          const response = await fetch(
            `${process.env.BACKEND_API_URL}/api/v1/auth/google`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                id_token: account.id_token,
                email: profile?.email,
                name: profile?.name,
              }),
            }
          )
          if (!response.ok) return false
          return true
        } catch (error) {
          console.error("Backend auth error:", error)
          return false
        }
      }
      return true
    },

    async jwt({ token, account, profile }) {
      if (account?.provider === "google" && account.id_token) {
        try {
          const response = await fetch(
            `${process.env.BACKEND_API_URL}/api/v1/auth/google`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                id_token: account.id_token,
                email: profile?.email,
                name: profile?.name,
                picture: (profile as Record<string, string>)?.picture,
              }),
            }
          )
          const data = await response.json()
          token.accessToken = data.access_token
          token.userId = data.user.id
          token.role = data.user.role
        } catch (error) {
          console.error("JWT callback error:", error)
        }
      }
      return token
    },

    async session({ session, token }) {
      session.accessToken = token.accessToken as string
      session.user.id = token.userId as string
      session.user.role = token.role as string
      return session
    },
  },

  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },

  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },
}

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig)
```

### 4.2 — Create: `frontend/src/app/api/auth/[...nextauth]/route.ts`

```typescript
import { handlers } from "@/lib/auth"
export const { GET, POST } = handlers
```

### 4.3 — Create: `frontend/src/types/next-auth.d.ts`

```typescript
import { DefaultSession } from "next-auth"

declare module "next-auth" {
  interface Session {
    accessToken: string
    user: {
      id: string
      role: "client" | "admin"
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
```

### 4.4 — Create: `frontend/src/middleware.ts`

```typescript
import { auth } from "@/lib/auth"
import { NextResponse } from "next/server"

export default auth((req) => {
  const { nextUrl, auth: session } = req
  const isLoggedIn = !!session
  const isAdminRoute = nextUrl.pathname.startsWith("/admin")

  if (isAdminRoute && !isLoggedIn) {
    return NextResponse.redirect(new URL("/auth/signin?callbackUrl=/admin", nextUrl))
  }

  if (isAdminRoute && session?.user?.role !== "admin") {
    return NextResponse.redirect(new URL("/unauthorized", nextUrl))
  }

  return NextResponse.next()
})

export const config = {
  matcher: ["/admin/:path*", "/dashboard/:path*"],
}
```

---

## 🛠️ Step 5 — Google Sign-In Button Component

Create: `frontend/src/components/auth/GoogleSignInButton.tsx`

```typescript
"use client"

import { signIn } from "next-auth/react"
import { useState } from "react"

interface GoogleSignInButtonProps {
  callbackUrl?: string
  label?: string
}

export function GoogleSignInButton({
  callbackUrl = "/",
  label = "Continue with Google",
}: GoogleSignInButtonProps) {
  const [isLoading, setIsLoading] = useState(false)

  const handleSignIn = async () => {
    setIsLoading(true)
    try {
      await signIn("google", { callbackUrl })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <button
      onClick={handleSignIn}
      disabled={isLoading}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "12px",
        padding: "12px 24px",
        border: "1px solid #dadce0",
        borderRadius: "8px",
        background: "#fff",
        color: "#3c4043",
        fontSize: "14px",
        fontWeight: 500,
        cursor: isLoading ? "not-allowed" : "pointer",
        width: "100%",
        justifyContent: "center",
      }}
    >
      <svg width="18" height="18" viewBox="0 0 48 48">
        <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
        <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
        <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
        <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
      </svg>
      {isLoading ? "Signing in…" : label}
    </button>
  )
}
```

---

## 🛠️ Step 6 — Add SessionProvider to Layout

Modify `frontend/src/app/layout.tsx`:

```typescript
import { SessionProvider } from "next-auth/react"
import { auth } from "@/lib/auth"

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()
  return (
    <html lang="en">
      <body>
        <SessionProvider session={session}>
          {children}
        </SessionProvider>
      </body>
    </html>
  )
}
```

---

## 🛠️ Step 7 — Using Auth in Components

**Client Component:**
```typescript
"use client"
import { useSession } from "next-auth/react"

export function UserProfile() {
  const { data: session, status } = useSession()
  if (status === "loading") return <p>Loading…</p>
  if (!session) return <GoogleSignInButton />
  return <p>Welcome, {session.user.name}!</p>
}
```

**Server Component:**
```typescript
import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"

export default async function AdminPage() {
  const session = await auth()
  if (!session) redirect("/auth/signin")
  return <div>Admin Dashboard</div>
}
```

---

## ✅ Testing Checklist

| Test | Expected Result |
|---|---|
| Click "Continue with Google" | Redirected to Google consent screen |
| Sign in with Google | Session created with `accessToken` and `role` |
| Visit `/admin` when logged out | Redirected to `/auth/signin` |
| Non-admin visits `/admin` | Redirected to `/unauthorized` |
| Sign out | Session cleared |
| Network tab check | `POST /api/v1/auth/google` returns 200 with JWT |

---

## 📁 Files to Create / Modify

| Action | File Path |
|---|---|
| CREATE | `frontend/src/lib/auth.ts` |
| CREATE | `frontend/src/app/api/auth/[...nextauth]/route.ts` |
| CREATE | `frontend/src/types/next-auth.d.ts` |
| CREATE | `frontend/src/middleware.ts` |
| CREATE | `frontend/src/components/auth/GoogleSignInButton.tsx` |
| MODIFY | `frontend/src/app/layout.tsx` |
| MODIFY | `frontend/.env.local` |

---

## 🤝 Coordination

- **Parth** (DB): His FastAPI backend will expose `POST /api/v1/auth/google`. Until ready, mock with a local JSON response.
- **Pratibha** (API): She will use `session.accessToken` to make authenticated API requests. Ensure the token is accessible via `useSession()`.

---

## ❓ Common Issues & Fixes

| Issue | Fix |
|---|---|
| Redirect URI mismatch | Google Console URI must exactly match `NEXTAUTH_URL/api/auth/callback/google` |
| `session` is null | Ensure `SessionProvider` wraps entire component tree in `layout.tsx` |
| Backend returns 401 | Check `id_token` is sent correctly in request body |
| Module not found | Run `npm install next-auth@beta` inside `frontend/` |

---

*Assigned to: Rimesh | Avyron Studio CRM | 2026-08-26*
