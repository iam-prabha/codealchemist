import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export const maxDuration = 30; // seconds, handles Render cold start

export async function POST(request: Request) {
  // 1. Verify user is authenticated
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  // 2. Validate request body
  const { code, language } = await request.json();
  if (!code || !language) {
    return Response.json({ error: "Missing code or language" }, { status: 400 });
  }

  // 3. Forward to runner with auth token
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 30_000);

  try {
    const response = await fetch(
      `${process.env.RUNNER_API_URL}/run`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${process.env.RUNNER_AUTH_TOKEN}`,
        },
        body: JSON.stringify({ code, language }),
        signal: controller.signal,
      }
    );

    clearTimeout(timeoutId);

    if (!response.ok) {
      return Response.json({
        success: false,
        output: "",
        error: "Runner service unavailable",
        executionMs: 0,
      }, { status: 503 });
    }

    const result = await response.json();
    return Response.json(result);
  } catch (error) {
    clearTimeout(timeoutId);

    if (error instanceof Error && error.name === 'AbortError') {
      return Response.json({
        success: false,
        output: "",
        error: "Runner is warming up. Please try again.",
        code: "RUNNER_TIMEOUT",
        executionMs: 0,
      }, { status: 503 });
    }

    return Response.json({
      success: false,
      output: "",
      error: "Failed to execute code",
      executionMs: 0,
    }, { status: 500 });
  }
}