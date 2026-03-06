import { redirect } from "next/navigation"
import { headers } from "next/headers"
import { auth } from "@/lib/auth"
import DashboardClient from "@/components/dashboard/DashboardClient"

export default async function DashboardPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  }).catch(() => null)

  if (!session) {
    redirect("/sign-in?callbackUrl=/dashboard")
  }

  return (
    <DashboardClient
      user={{
        name: session.user.name,
        email: session.user.email,
      }}
    />
  )
}
