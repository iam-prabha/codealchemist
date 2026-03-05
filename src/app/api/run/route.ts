import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { NextRequest } from "next/server"

export const maxDuration = 30 // handle Render cold starts

export async function POST(request: NextRequest) {
  // 1. Verify authenticated session
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session) {
    return Response.json(
      { 
        error: "The Circle is sealed. Please sign in.",
        success: false,
      },
      { status: 401 }
    )
  }

  // 2. Parse and validate request body
  let body: { 
    code?: string
    language?: string
    exerciseId?: string 
  }

  try {
    body = await request.json()
  } catch {
    return Response.json(
      { error: "Invalid request formula.", success: false },
      { status: 400 }
    )
  }

  const { code, language, exerciseId } = body

  if (!code || !language) {
    return Response.json(
      { 
        error: "Code and language are required reagents.",
        success: false,
      },
      { status: 400 }
    )
  }

  const validLanguages = ["python", "rust", "typescript"]
  if (!validLanguages.includes(language)) {
    return Response.json(
      { error: `Unknown element: ${language}`, success: false },
      { status: 400 }
    )
  }

  // 3. Forward to Transmutation Engine with timeout
  try {
    const response = await fetch(
      `${process.env.RUNNER_API_URL}/run`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.RUNNER_AUTH_TOKEN}`,
        },
        body: JSON.stringify({ code, language, exerciseId }),
        signal: AbortSignal.timeout(28_000), // 28s — under Vercel 30s limit
      }
    )

    if (!response.ok) {
      const errorText = await response.text()
      console.error("Runner error:", errorText)
      return Response.json(
        {
          error: "The Transmutation Engine returned an error.",
          success: false,
        },
        { status: response.status }
      )
    }

    const result = await response.json()

    return Response.json({
      output: result.output ?? "",
      success: result.success ?? true,
      executionMs: result.executionMs ?? null,
      error: result.error ?? null,
    })

  } catch (error) {
    if (error instanceof Error && error.name === "TimeoutError") {
      return Response.json(
        {
          error: "⏳ The Engine stirs from slumber... please transmute again.",
          success: false,
          timeout: true,
        },
        { status: 504 }
      )
    }

    console.error("Transmutation Engine unreachable:", error)
    return Response.json(
      {
        error: "The Transmutation Circle is unstable. Try again.",
        success: false,
      },
      { status: 502 }
    )
  }
}