export const metadata = {
  title: "Access Denied | Avyron Studio",
}

export default function UnauthorizedPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-background px-4">
      <div style={{ textAlign: "center", maxWidth: 480 }}>
        <div style={{ fontSize: 64, marginBottom: 16 }}>🔒</div>
        <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 12 }}>Access Denied</h1>
        <p style={{ color: "var(--muted-foreground)", fontSize: 15, marginBottom: 28 }}>
          You don&apos;t have permission to access this page. This area is restricted to
          Avyron Studio administrators.
        </p>
        <a
          href="/"
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
          ← Back to Home
        </a>
      </div>
    </main>
  )
}
