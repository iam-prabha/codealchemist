"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const router = useRouter()

  useEffect(() => {
    console.error("Dashboard error digest:", error.digest)
    console.error("Dashboard error:", error)
  }, [error])

  return (
    <div 
      className="flex items-center justify-center h-screen"
      style={{ background: "var(--color-void)" }}
    >
      <div className="flex flex-col items-center gap-4 text-center px-6">
        <div style={{ fontSize: 48 }}>⚗️</div>
        <h2 style={{ 
          fontFamily: "var(--font-cinzel)",
          color: "var(--color-text-primary)", 
          fontSize: 18 
        }}>
          The Transmutation Circle is unstable.
        </h2>
        <p style={{ color: "var(--color-text-muted)", fontSize: 13 }}>
          {error.digest && `Error: ${error.digest}`}
        </p>
        <div className="flex gap-3">
          <button
            onClick={reset}
            style={{ 
              background: "var(--color-gold-subtle)",
              border: "1px solid var(--color-gold-dim)",
              color: "var(--color-gold)",
              borderRadius: "var(--radius-full)",
              padding: "8px 20px",
              fontSize: 13,
              cursor: "pointer",
            }}
          >
            Try Again
          </button>
          <button
            onClick={() => router.push("/")}
            style={{
              border: "1px solid var(--color-border-mid)",
              color: "var(--color-text-muted)",
              borderRadius: "var(--radius-full)",
              padding: "8px 20px",
              fontSize: 13,
              cursor: "pointer",
              background: "transparent",
            }}
          >
            Return Home
          </button>
        </div>
      </div>
    </div>
  )
}
