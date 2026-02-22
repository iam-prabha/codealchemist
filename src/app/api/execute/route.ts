import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import type { Language } from "@/types";
import { wrapCodeForTracing, extractTrace } from "@/lib/execution/tracer";

/**
 * Code Execution Proxy Route
 * Supports both Piston (Self-hosted) and Judge0 (RapidAPI Free Tier).
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

const PISTON_VERSIONS: Record<Language, string> = {
    python: "3.10.0",
    rust: "1.68.2",
    typescript: "5.0.3",
};

// Judge0 Language IDs (CE Edition)
const JUDGE0_LANGUAGES: Record<Language, number> = {
    python: 71,      // Python 3.8.1
    rust: 73,        // Rust 1.40.0
    typescript: 74,  // TypeScript 3.7.4
};

export async function POST(request: Request) {
    try {
        /* ── 1. Auth check ────────────────────────────────────── */
        const cookieStore = await cookies();
        const sessionToken = cookieStore.get("better-auth.session_token");
        if (!sessionToken) {
            return NextResponse.json({ error: "Authentication required" }, { status: 401 });
        }

        /* ── 2. Rate limiting ─────────────────────────────────── */
        const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || 
                   request.headers.get("x-real-ip") || "unknown";

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

        /* ── 4. Determine Execution Engine ─────────────────────── */
        const judge0Key = process.env.JUDGE0_API_KEY;
        const startTime = performance.now();

        // ROUTE A: Judge0 via RapidAPI (Option 1)
        if (judge0Key) {
            const langId = JUDGE0_LANGUAGES[language as Language];
            if (!langId) return NextResponse.json({ error: `Unsupported language: ${language}` }, { status: 400 });

            const response = await fetch("https://judge0-ce.p.rapidapi.com/submissions?base64_encoded=false&wait=true", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "x-rapidapi-host": "judge0-ce.p.rapidapi.com",
                    "x-rapidapi-key": judge0Key,
                },
                body: JSON.stringify({
                    source_code: finalCode,
                    language_id: langId,
                }),
            });

            const executionTimeMs = Math.round(performance.now() - startTime);
            if (!response.ok) {
                const errText = await response.text();
                return NextResponse.json({ success: false, output: "", error: `Judge0 error: ${errText}`, executionTimeMs }, { status: 500 });
            }

            const data = await response.json();
            
            // Judge0 returns compilation errors in 'compile_output' and runtime errors in 'stderr'
            const hasError = data.status?.id !== 3; // 3 = Accepted
            const rawStdout = data.stdout || "";
            const rawStderr = data.stderr || data.compile_output || data.message || `Process exited with status: ${data.status?.description}`;

            let output = "";
            let steps = undefined;

            if (debug && !hasError) {
                const traceResult = extractTrace(rawStdout);
                output = traceResult.output;
                steps = traceResult.steps;
            } else {
                output = rawStdout;
            }

            return NextResponse.json({
                success: !hasError,
                output: output.trim(),
                error: hasError ? rawStderr.trim() : null,
                executionTimeMs,
                steps,
            });
        }

        // ROUTE B: Piston (Option 2 - Local or Fly.io)
        const pistonUrl = process.env.PISTON_API_URL || "http://127.0.0.1:2000/api/v2/execute";
        const version = PISTON_VERSIONS[language as Language];
        if (!version) return NextResponse.json({ error: `Unsupported language: ${language}` }, { status: 400 });

        const response = await fetch(pistonUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "User-Agent": "CodeAlchemist-NextJs/1.0",
            },
            body: JSON.stringify({
                language,
                version,
                files: [{ content: finalCode }],
                compile_timeout: 10000,
                run_timeout: 3000,
            }),
        });

        const executionTimeMs = Math.round(performance.now() - startTime);

        if (!response.ok) {
            const errText = await response.text();
            return NextResponse.json({ success: false, output: "", error: `Piston error: ${errText}`, executionTimeMs }, { status: 500 });
        }

        const data = await response.json();
        let output = "";
        let error: string | null = null;
        let success = true;
        let steps = undefined;

        if (data.compile && data.compile.code !== 0) {
            success = false;
            error = data.compile.stderr || data.compile.output || "Compilation failed";
        } else if (data.run) {
            success = data.run.code === 0 && !data.run.signal;
            const rawStdout = data.run.stdout || "";
            
            if (debug) {
                const traceResult = extractTrace(rawStdout);
                output = traceResult.output;
                steps = traceResult.steps;
            } else {
                output = rawStdout;
            }

            if (!success) {
                error = data.run.stderr || data.run.output || `Process exited with code ${data.run.code}`;
            }
        }

        return NextResponse.json({
            success,
            output: output.trim(),
            error: error ? error.trim() : null,
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