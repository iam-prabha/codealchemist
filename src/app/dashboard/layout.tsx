import { redirect } from "next/navigation"
import { headers } from "next/headers"
import { auth } from "@/lib/auth"
import { DashboardHeader } from "@/components/dashboard/DashboardHeader"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  }).catch(() => null)

  if (!session) {
    redirect("/sign-in?callbackUrl=/dashboard")
  }

  return (
    <div style={{ background: "var(--color-void)", minHeight: "100vh" }}>
      <DashboardHeader />
      <main style={{ paddingTop: "64px" }}>
        {children}
      </main>
    </div>
  )
}
