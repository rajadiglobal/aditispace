import { GoogleSignInButton } from "@/components/auth/GoogleSignInButton"
import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"

interface SignInPageProps {
  searchParams: Promise<{ callbackUrl?: string; error?: string }>
}

export const metadata = {
  title: "Sign In | Aditi Studio",
  description: "Sign in to your Aditi Studio account",
}

export default async function SignInPage({ searchParams }: SignInPageProps) {
  const session = await auth()
  const params = await searchParams

  // Already logged in — redirect to callbackUrl or home
  if (session) {
    redirect(params.callbackUrl || "/")
  }

  const callbackUrl = params.callbackUrl || "/"
  const errorMessage =
    params.error === "OAuthSignin" || params.error === "OAuthCallback"
      ? "Sign-in failed. Please try again."
      : params.error === "AccessDenied"
        ? "Access denied. You may not have the required permissions."
        : null

  return (
    <main className="min-h-screen flex items-center justify-center bg-background px-4">
      <div
        style={{
          width: "100%",
          maxWidth: 420,
          background: "var(--card, #fff)",
          border: "1px solid var(--border, #e5e7eb)",
          borderRadius: 16,
          padding: "48px 40px",
          boxShadow: "0 8px 32px rgba(0,0,0,0.10)",
        }}
      >
        {/* Logo / Brand */}
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <h1
            style={{
              fontFamily: "var(--font-heading)",
              fontSize: 26,
              fontWeight: 700,
              letterSpacing: "-0.5px",
              margin: 0,
            }}
          >
            ADITI STUDIO
          </h1>
          <p style={{ color: "var(--muted-foreground)", marginTop: 8, fontSize: 14 }}>
            Sign in to continue
          </p>
        </div>

        {/* Error message */}
        {errorMessage && (
          <div
            role="alert"
            style={{
              background: "#fef2f2",
              border: "1px solid #fecaca",
              borderRadius: 8,
              padding: "10px 14px",
              marginBottom: 20,
              color: "#dc2626",
              fontSize: 13,
            }}
          >
            {errorMessage}
          </div>
        )}

        {/* Sign-in button */}
        <GoogleSignInButton callbackUrl={callbackUrl} label="Continue with Google" />

        <p
          style={{
            marginTop: 20,
            fontSize: 11,
            color: "var(--muted-foreground)",
            textAlign: "center",
            lineHeight: 1.6,
          }}
        >
          By signing in, you agree to our privacy policy and terms of service.
        </p>
      </div>
    </main>
  )
}
