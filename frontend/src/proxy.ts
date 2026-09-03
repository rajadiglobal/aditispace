/**
 * Next.js proxy.ts — replaces the deprecated middleware.ts convention.
 *
 * Protects /admin/* routes:
 *   - Unauthenticated users → redirected to /auth/signin
 *   - Authenticated non-admins → redirected to /unauthorized
 *
 * Uses the NextAuth `auth` export which reads the JWT session cookie.
 */

import { auth } from "@/lib/auth"
import { NextResponse } from "next/server"

export const proxy = auth((req) => {
  const { nextUrl } = req
  const session = req.auth
  const isLoggedIn = !!session

  const isAdminRoute = nextUrl.pathname.startsWith("/admin")
  const isDashboardRoute = nextUrl.pathname.startsWith("/dashboard")
  const isProtected = isAdminRoute || isDashboardRoute

  // Redirect unauthenticated users to sign-in
  if (isProtected && !isLoggedIn) {
    const signInUrl = new URL("/auth/signin", nextUrl)
    signInUrl.searchParams.set("callbackUrl", nextUrl.pathname)
    return NextResponse.redirect(signInUrl)
  }

  // Redirect non-admin users away from /admin routes
  if (isAdminRoute && session?.user?.role !== "admin" && session?.user?.role !== "staff") {
    return NextResponse.redirect(new URL("/unauthorized", nextUrl))
  }

  return NextResponse.next()
})

export const config = {
  // Match all admin and dashboard routes — skip static files and API routes
  matcher: ["/admin/:path*", "/dashboard/:path*"],
}
