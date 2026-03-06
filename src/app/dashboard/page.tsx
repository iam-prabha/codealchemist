import { redirect } from "next/navigation"
import { headers } from "next/headers"
import { auth } from "@/lib/auth"
import Link from "next/link"
import { ArrowRight, BookOpen, Code, Trophy, Zap } from "lucide-react"
import { motion } from "framer-motion"

export default async function DashboardPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  }).catch(() => null)

  if (!session) {
    redirect("/sign-in?callbackUrl=/dashboard")
  }

  const user = session.user

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4"
        >
          <h1 className="text-4xl font-bold" style={{ 
            fontFamily: "var(--font-cinzel)",
            color: "var(--color-text-primary)"
          }}>
            Welcome back, {user.name?.split(" ")[0] || "Alchemist"}! ⚗️
          </h1>
          <p style={{ color: "var(--color-text-muted)", fontSize: 18 }}>
            Ready to continue your coding journey? Choose a language and start practicing.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          <div className="glass p-6 rounded-xl">
            <div className="flex items-center gap-3 mb-2">
              <Zap size={24} style={{ color: "var(--color-gold)" }} />
              <h3 style={{ fontWeight: 600, color: "var(--color-text-primary)" }}>XP Earned</h3>
            </div>
            <p style={{ fontSize: 28, fontWeight: 700, color: "var(--color-gold)" }}>0</p>
            <p style={{ fontSize: 14, color: "var(--color-text-muted)" }}>Start learning to earn XP!</p>
          </div>

          <div className="glass p-6 rounded-xl">
            <div className="flex items-center gap-3 mb-2">
              <Trophy size={24} style={{ color: "var(--color-gold)" }} />
              <h3 style={{ fontWeight: 600, color: "var(--color-text-primary)" }}>Current Streak</h3>
            </div>
            <p style={{ fontSize: 28, fontWeight: 700, color: "var(--color-gold)" }}>0 days</p>
            <p style={{ fontSize: 14, color: "var(--color-text-muted)" }}>Keep it going!</p>
          </div>

          <div className="glass p-6 rounded-xl">
            <div className="flex items-center gap-3 mb-2">
              <Code size={24} style={{ color: "var(--color-gold)" }} />
              <h3 style={{ fontWeight: 600, color: "var(--color-text-primary)" }}>Exercises</h3>
            </div>
            <p style={{ fontSize: 28, fontWeight: 700, color: "var(--color-gold)" }}>0</p>
            <p style={{ fontSize: 14, color: "var(--color-text-muted)" }}>Across all languages</p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-6"
        >
          <h2 style={{ 
            fontSize: 24, 
            fontWeight: 700, 
            textAlign: "center",
            fontFamily: "var(--font-cinzel)",
            color: "var(--color-text-primary)"
          }}>
            Choose Your Language
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { name: "Python", icon: "🐍", description: "Perfect for beginners", href: "/workspace" },
              { name: "Rust", icon: "🦀", description: "Memory-safe systems", href: "/workspace" },
              { name: "TypeScript", icon: "🔷", description: "JavaScript with types", href: "/workspace" },
            ].map((lang, index) => (
              <motion.div
                key={lang.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
              >
                <Link
                  href={lang.href}
                  className="block glass p-6 rounded-xl transition-all duration-200 hover:scale-[1.02]"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <span style={{ fontSize: 32 }}>{lang.icon}</span>
                      <div>
                        <h3 style={{ fontWeight: 600, color: "var(--color-text-primary)" }}>
                          {lang.name}
                        </h3>
                      </div>
                    </div>
                    <ArrowRight size={20} style={{ color: "var(--color-text-muted)" }} />
                  </div>
                  <p style={{ color: "var(--color-text-secondary)" }}>{lang.description}</p>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="glass p-6 rounded-xl"
        >
          <h3 style={{ fontWeight: 600, color: "var(--color-text-primary)", marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
            <BookOpen size={20} style={{ color: "var(--color-gold)" }} />
            Quick Start
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link
              href="/workspace"
              className="flex items-center gap-3 p-4 rounded-lg glass transition-all duration-200 hover:bg-[var(--color-overlay)]"
            >
              <span style={{ fontSize: 24 }}>🚀</span>
              <div>
                <p style={{ fontWeight: 500, color: "var(--color-text-primary)" }}>Jump into Python</p>
                <p style={{ fontSize: 14, color: "var(--color-text-muted)" }}>Start with beginner exercises</p>
              </div>
            </Link>
            <Link
              href="/workspace"
              className="flex items-center gap-3 p-4 rounded-lg glass transition-all duration-200 hover:bg-[var(--color-overlay)]"
            >
              <span style={{ fontSize: 24 }}>⚡</span>
              <div>
                <p style={{ fontWeight: 500, color: "var(--color-text-primary)" }}>Challenge with Rust</p>
                <p style={{ fontSize: 14, color: "var(--color-text-muted)" }}>Tackle systems programming</p>
              </div>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
