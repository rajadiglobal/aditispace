export const metadata = {
  title: "Authentication Error | Avyron Studio",
}

interface AuthErrorPageProps {
  searchParams: Promise<{ error?: string }>
}

const ERROR_MESSAGES: Record<string, string> = {
  Configuration: "There is a problem with the server configuration.",
  AccessDenied: "You do not have permission to sign in.",
  Verification: "The sign-in link is invalid or has expired.",
  OAuthSignin: "Error starting Google sign-in. Please try again.",
  OAuthCallback: "Error during Google sign-in callback. Please try again.",
  OAuthCreateAccount: "Could not create a user account. Please try again.",
  EmailCreateAccount: "Could not create a user account. Please try again.",
  Callback: "An unexpected error occurred during sign-in.",
  Default: "An unexpected error occurred. Please try again.",
}

export default async function AuthErrorPage({ searchParams }: AuthErrorPageProps) {
  const params = await searchParams
  const errorKey = params.error || "Default"
  const message = ERROR_MESSAGES[errorKey] || ERROR_MESSAGES.Default

  return (
    <main className="min-h-screen flex items-center justify-center bg-background px-4">
      <div
        style={{
          width: "100%",
          maxWidth: 420,
          textAlign: "center",
          background: "var(--card, #fff)",
          border: "1px solid #fecaca",
          borderRadius: 16,
          padding: "48px 40px",
          boxShadow: "0 8px 32px rgba(0,0,0,0.10)",
        }}
      >
        <div
          style={{
            width: 56,
            height: 56,
            borderRadius: "50%",
            background: "#fef2f2",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 24px",
          }}
        >
          <span style={{ fontSize: 28 }}>⚠️</span>
        </div>
        <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 12 }}>Sign-in Error</h1>
        <p style={{ color: "var(--muted-foreground)", fontSize: 14, marginBottom: 28 }}>
          {message}
        </p>
        <a
          href="/auth/signin"
          style={{
            display: "inline-block",
            padding: "10px 28px",
            background: "#111",
            color: "#fff",
            borderRadius: 8,
            textDecoration: "none",
            fontSize: 14,
            fontWeight: 500,
          }}
        >
          Try Again
        </a>
      </div>
    </main>
  )
}
