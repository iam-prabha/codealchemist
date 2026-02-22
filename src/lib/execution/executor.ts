/* ============================================================
   CodeAlchemist — Execution Engine
   Client wrapper that sends code to our Next.js backend proxy.
   ============================================================ */

import type { Language, ExecutionResult } from "@/types";

export async function executeCode(
    code: string,
    language: Language,
    debug: boolean = false
): Promise<ExecutionResult> {
    const startTime = performance.now();

    try {
        if (!code || !code.trim()) {
            return {
                success: false,
                output: "",
                error: "No code provided to execute.",
                executionTimeMs: 0,
            };
        }

        const response = await fetch("/api/execute", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ code, language, debug }),
        });

        const data = await response.json();

        // If our Next.js proxy route threw a hard error (e.g. 500)
        if (!response.ok) {
            return {
                success: false,
                output: "",
                error: data.error || `Server proxy error: ${response.status}`,
                executionTimeMs: Math.round(performance.now() - startTime),
            };
        }

        // Return the successfully proxied payload from Piston
        return {
            success: data.success,
            output: data.output || "",
            error: data.error || null,
            executionTimeMs: data.executionTimeMs || Math.round(performance.now() - startTime),
            steps: data.steps,
        };
    } catch (err) {
        return {
            success: false,
            output: "",
            error: `Failed to connect to execution proxy: ${err instanceof Error ? err.message : "Network error"}`,
            executionTimeMs: Math.round(performance.now() - startTime),
        };
    }
}
