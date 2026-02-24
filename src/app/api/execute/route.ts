import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import type { Language } from "@/types";
import { wrapCodeForTracing, extractTrace } from "@/lib/execution/tracer";

/**
 * Code Execution Proxy Route
 * Supports both Piston (Self-hosted) and CustomRunner (RapidAPI Free Tier).
 *
 * Security: Requires authentication + rate limiting (30 req/min per IP).
 */

/* ── Rate Limiter (in-memory, per-IP) ─────────────────────────── */
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT = 30;
const RATE_WINDOW = 60_000;

function checkRateLimit(ip: string): boolean {
    const now = Date.now();
    const entry = rateLimitMap.get(ip);

    if (!entry || now > entry.resetTime) {
        rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_WINDOW });
        return true;
    }
    if (entry.count >= RATE_LIMIT) return false;
    entry.count++;
    return true;
}

setInterval(() => {
    const now = Date.now();
    for (const [ip, entry] of rateLimitMap) {
        if (now > entry.resetTime) rateLimitMap.delete(ip);
    }
}, 5 * 60_000);

/* ── Engine Configs ─────────────────────────────────────────── */
const MAX_CODE_LENGTH = 50_000;

export async function POST(request: Request) {
    try {
        /* ── 1. Auth check (Strict validation via Better Auth) ──────── */
        const session = await auth.api.getSession({
            headers: await headers(),
        });

        if (!session || !session.user) {
            return NextResponse.json({ error: "Authentication required or session invalid." }, { status: 401 });
        }

        /* ── 2. Rate limiting ─────────────────────────────────── */
        const reqHeaders = await headers();
        const ip = reqHeaders.get("x-forwarded-for")?.split(",")[0]?.trim() || 
                   reqHeaders.get("x-real-ip") || "unknown";

        if (!checkRateLimit(ip)) {
            return NextResponse.json({ error: "Rate limit exceeded. Try again in a minute." }, { status: 429 });
        }

        /* ── 3. Parse & validate ──────────────────────────────── */
        const body = await request.json();
        const { code, language, debug = false } = body;

        if (!code || !language) return NextResponse.json({ error: "Missing 'code' or 'language'" }, { status: 400 });
        if (typeof code !== "string" || code.length > MAX_CODE_LENGTH) {
            return NextResponse.json({ error: `Code must be under ${MAX_CODE_LENGTH} chars` }, { status: 400 });
        }

        const finalCode = debug ? wrapCodeForTracing(code, language as Language) : code;

        /* ── 4. Execute via Custom Runner ─────────────────────── */
        const runnerUrl = process.env.RUNNER_API_URL || "http://localhost:2358";
        const runnerToken = process.env.RUNNER_AUTH_TOKEN || "";
        const startTime = performance.now();

        const fetchHeaders: Record<string, string> = {
            "Content-Type": "application/json",
        };
        
        if (runnerToken) {
            fetchHeaders["X-Auth-Token"] = runnerToken;
        }

        const response = await fetch(`${runnerUrl}/execute`, {
            method: "POST",
            headers: fetchHeaders,
            body: JSON.stringify({
                language,
                code: finalCode,
            }),
        });

        const executionTimeMs = Math.round(performance.now() - startTime);
        if (!response.ok) {
            const errText = await response.text();
            return NextResponse.json({ success: false, output: "", error: `Runner error: ${errText}`, executionTimeMs }, { status: 500 });
        }

        const data = await response.json();
        
        let output = "";
        let steps = undefined;

        if (debug && data.success) {
            const traceResult = extractTrace(data.output || "");
            output = traceResult.output;
            steps = traceResult.steps;
        } else {
            output = data.output || "";
        }

        return NextResponse.json({
            success: data.success,
            output: output.trim(),
            error: data.error ? data.error.trim() : null,
            executionTimeMs,
            steps,
        });
    } catch (err) {
        return NextResponse.json({
            success: false,
            output: "",
            error: `Failed to proxy execution: ${err instanceof Error ? err.message : String(err)}`,
            executionTimeMs: 0,
        }, { status: 500 });
    }
}