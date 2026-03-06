import { redirect } from "next/navigation"
import { headers } from "next/headers"
import { auth } from "@/lib/auth"
import WorkspaceClient from "@/components/workspace/WorkspaceClient"

export default async function WorkspacePage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  }).catch(() => null)

  if (!session) {
    redirect("/sign-in?callbackUrl=/workspace")
  }

  return <WorkspaceClient 
    initialLayerId={1} 
    initialExerciseIndex={0} 
    initialLanguage="python"
  />
}
