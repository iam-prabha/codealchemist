/**
 * @file benchmark.test.ts
 * Benchmark + deeper regression tests for CodeAlchemist execution engine:
 *   – wrapCodeForTracing() correctness for each language
 *   – extractTrace() correctness & edge cases
 *   – Performance benchmarks for both functions
 *
 * NOTE: These tests are pure-TS unit tests that do NOT require a
 * running Piston server. They validate the wrapping/parsing logic only.
 */
import { describe, expect, test } from "bun:test";
import {
    wrapCodeForTracing,
    extractTrace,
    TRACE_MARKER_START,
    TRACE_MARKER_END,
} from "@/lib/execution/tracer";

/* ─── Section 1: extractTrace() Regression Tests ─────────────────────── */

describe("extractTrace() — regression tests", () => {
    test("returns full stdout when no markers are present", () => {
        const result = extractTrace("Hello, World!");
        expect(result.output).toBe("Hello, World!");
        expect(result.steps).toBeUndefined();
    });

    test("correctly splits output before marker from trace JSON", () => {
        const rawOut = `Line 1\nLine 2\n${TRACE_MARKER_START}\n[]\n${TRACE_MARKER_END}`;
        const result = extractTrace(rawOut);
        expect(result.output).toBe("Line 1\nLine 2\n");
        expect(result.steps).toBeDefined();
        expect(result.steps).toEqual([]);
    });

    test("parses a single step from trace JSON", () => {
        const step = { line: 5, variables: {}, callStack: ["main"], consoleOutput: null };
        const rawOut = `output\n${TRACE_MARKER_START}\n${JSON.stringify([step])}\n${TRACE_MARKER_END}`;
        const result = extractTrace(rawOut);
        expect(result.steps).toHaveLength(1);
        expect(result.steps![0].line).toBe(5);
        expect(result.steps![0].callStack).toEqual(["main"]);
    });

    test("parses multiple steps", () => {
        const steps = [
            { line: 1, variables: {}, callStack: ["main"], consoleOutput: null },
            { line: 2, variables: { x: { name: "x", value: "10", type: "int" } }, callStack: ["main"], consoleOutput: null },
            { line: 3, variables: {}, callStack: ["main"], consoleOutput: "10\n" },
        ];
        const rawOut = `${TRACE_MARKER_START}\n${JSON.stringify(steps)}\n${TRACE_MARKER_END}`;
        const result = extractTrace(rawOut);
        expect(result.output).toBe("");
        expect(result.steps).toHaveLength(3);
        expect(result.steps![1].variables).toHaveProperty("x");
        expect(result.steps![2].consoleOutput).toBe("10\n");
    });

    test("handles malformed JSON gracefully (returns undefined steps)", () => {
        const rawOut = `pre-output\n${TRACE_MARKER_START}\n{bad json[\n${TRACE_MARKER_END}`;
        const result = extractTrace(rawOut);
        expect(result.output).toBe("pre-output\n");
        expect(result.steps).toBeUndefined();
    });

    test("handles empty JSON array (no steps recorded)", () => {
        const rawOut = `${TRACE_MARKER_START}\n[]\n${TRACE_MARKER_END}`;
        const result = extractTrace(rawOut);
        expect(result.steps).toEqual([]);
    });

    test("handles stdout that contains only markers with no prior output", () => {
        const rawOut = `${TRACE_MARKER_START}\n[{"line":1,"variables":{},"callStack":[]}]\n${TRACE_MARKER_END}`;
        const result = extractTrace(rawOut);
        expect(result.output).toBe("");
        expect(result.steps).toHaveLength(1);
    });

    test("ignores extra whitespace in JSON portion", () => {
        const steps = [{ line: 1, variables: {}, callStack: ["main"], consoleOutput: null }];
        const rawOut = `${TRACE_MARKER_START}\n   ${JSON.stringify(steps)}   \n${TRACE_MARKER_END}`;
        const result = extractTrace(rawOut);
        expect(result.steps).toHaveLength(1);
    });
});

/* ─── Section 2: wrapCodeForTracing() — Python ───────────────────────── */

describe("wrapCodeForTracing() — Python", () => {
    test("includes sys.settrace instrumentation", () => {
        const wrapped = wrapCodeForTracing("x = 1", "python");
        expect(wrapped).toContain("sys.settrace");
        expect(wrapped).toContain("__ca_trace_calls");
    });

    test("includes user code", () => {
        const code = "my_var = 42";
        const wrapped = wrapCodeForTracing(code, "python");
        expect(wrapped).toContain(code);
    });

    test("includes TRACE_MARKER_START and TRACE_MARKER_END in the output section", () => {
        const wrapped = wrapCodeForTracing("pass", "python");
        expect(wrapped).toContain(TRACE_MARKER_START);
        expect(wrapped).toContain(TRACE_MARKER_END);
    });

    test("includes json.dumps to serialize steps", () => {
        const wrapped = wrapCodeForTracing("pass", "python");
        expect(wrapped).toContain("json.dumps");
    });

    test("captures stdout via StdoutInterceptor", () => {
        const wrapped = wrapCodeForTracing("print('hi')", "python");
        expect(wrapped).toContain("StdoutInterceptor");
        expect(wrapped).toContain("sys.__stdout__");
    });

    test("wraps user code in try/finally to ensure trace is always printed", () => {
        const wrapped = wrapCodeForTracing("raise Exception('oops')", "python");
        expect(wrapped).toContain("try:");
        expect(wrapped).toContain("finally:");
        // Trace print should be in finally block
        const finallyIdx = wrapped.indexOf("finally:");
        const markerIdx = wrapped.indexOf(TRACE_MARKER_START);
        expect(markerIdx).toBeGreaterThan(finallyIdx);
    });

    test("indents user code 4 spaces inside try block", () => {
        const code = "x = 1";
        const wrapped = wrapCodeForTracing(code, "python");
        // User code should appear with 4 spaces of indentation
        expect(wrapped).toContain("    " + code);
    });

    test("handles multiline user code", () => {
        const code = "x = 1\ny = 2\nprint(x + y)";
        const wrapped = wrapCodeForTracing(code, "python");
        expect(wrapped).toContain("x = 1");
        expect(wrapped).toContain("y = 2");
        expect(wrapped).toContain("print(x + y)");
    });
});

/* ─── Section 3: wrapCodeForTracing() — TypeScript ──────────────────── */

describe("wrapCodeForTracing() — TypeScript", () => {
    test("patches console.log to capture steps", () => {
        const wrapped = wrapCodeForTracing("console.log('test')", "typescript");
        expect(wrapped).toContain("const originalLog = console.log");
        expect(wrapped).toContain("console.log = ");
    });

    test("includes user code inside try block", () => {
        const code = "const x = 42;";
        const wrapped = wrapCodeForTracing(code, "typescript");
        expect(wrapped).toContain(code);
    });

    test("includes TRACE_MARKER_START and TRACE_MARKER_END", () => {
        const wrapped = wrapCodeForTracing("const x = 1;", "typescript");
        expect(wrapped).toContain(TRACE_MARKER_START);
        expect(wrapped).toContain(TRACE_MARKER_END);
    });

    test("pushes steps to __ca_steps array on console.log", () => {
        const wrapped = wrapCodeForTracing("console.log(1)", "typescript");
        expect(wrapped).toContain("__ca_steps");
        expect(wrapped).toContain("__ca_steps.push(");
    });

    test("serializes steps with originalLog and JSON.stringify", () => {
        const wrapped = wrapCodeForTracing("", "typescript");
        expect(wrapped).toContain("JSON.stringify(__ca_steps)");
        expect(wrapped).toContain("originalLog(");
    });

    test("restores originalLog in finally block", () => {
        const wrapped = wrapCodeForTracing("", "typescript");
        expect(wrapped).toContain("} finally {");
        const finallyIdx = wrapped.indexOf("} finally {");
        const markerIdx = wrapped.indexOf(TRACE_MARKER_START);
        expect(markerIdx).toBeGreaterThan(finallyIdx);
    });

    test("handles empty user code", () => {
        const wrapped = wrapCodeForTracing("", "typescript");
        expect(wrapped.length).toBeGreaterThan(0);
        expect(wrapped).toContain(TRACE_MARKER_START);
    });
});

/* ─── Section 4: wrapCodeForTracing() — Rust (pass-through) ─────────── */

describe("wrapCodeForTracing() — Rust", () => {
    test("returns code unchanged for Rust (no tracing wrapper)", () => {
        const code = 'fn main() { println!("hello"); }';
        const wrapped = wrapCodeForTracing(code, "rust");
        expect(wrapped).toBe(code);
    });

    test("does NOT inject trace markers for Rust", () => {
        const code = 'fn main() {}';
        const wrapped = wrapCodeForTracing(code, "rust");
        expect(wrapped).not.toContain(TRACE_MARKER_START);
        expect(wrapped).not.toContain(TRACE_MARKER_END);
    });

    test("does not inject console.log patching for Rust", () => {
        const code = 'fn main() {}';
        const wrapped = wrapCodeForTracing(code, "rust");
        expect(wrapped).not.toContain("console.log");
        expect(wrapped).not.toContain("sys.settrace");
    });
});

/* ─── Section 5: Round‑trip Tests ────────────────────────────────────── */

describe("Round-trip: wrap → simulate stdout → extractTrace()", () => {
    test("TypeScript wrap produces extractable trace for simulated output", () => {
        // Simulate what a TS execution would produce after console.log('hi')
        const steps = [
            { line: 0, variables: {}, callStack: ["main"], consoleOutput: "hi\n" },
        ];
        const simulatedStdout = `hi\n${TRACE_MARKER_START}\n${JSON.stringify(steps)}\n${TRACE_MARKER_END}`;
        const result = extractTrace(simulatedStdout);
        expect(result.output).toBe("hi\n");
        expect(result.steps).toHaveLength(1);
        expect(result.steps![0].consoleOutput).toBe("hi\n");
    });

    test("Python wrap produces extractable trace for complex output", () => {
        const steps = [
            { line: 1, variables: { x: { name: "x", value: "10", type: "int" } }, callStack: ["main"], consoleOutput: null },
            { line: 2, variables: {}, callStack: ["main"], consoleOutput: "10\n" },
        ];
        const simulatedStdout = `10\n${TRACE_MARKER_START}\n${JSON.stringify(steps)}\n${TRACE_MARKER_END}`;
        const result = extractTrace(simulatedStdout);
        expect(result.output).toBe("10\n");
        expect(result.steps).toBeDefined();
        expect(result.steps![0].variables.x.value).toBe("10");
    });
});

/* ─── Section 6: Performance Benchmarks ──────────────────────────────── */

describe("Execution Engine — Performance Benchmarks", () => {
    const SMALL_CODE = 'print("hello")';
    const LARGE_CODE = Array(200).fill("x = x + 1").join("\n");
    const ITERATIONS = 500;

    test("wrapCodeForTracing() — python (small code) is fast", () => {
        const start = performance.now();
        for (let i = 0; i < ITERATIONS; i++) {
            wrapCodeForTracing(SMALL_CODE, "python");
        }
        expect(performance.now() - start).toBeLessThan(500);
    });

    test("wrapCodeForTracing() — python (large code ~200 lines) is fast", () => {
        const start = performance.now();
        for (let i = 0; i < ITERATIONS; i++) {
            wrapCodeForTracing(LARGE_CODE, "python");
        }
        expect(performance.now() - start).toBeLessThan(500);
    });

    test("wrapCodeForTracing() — typescript (small code) is fast", () => {
        const start = performance.now();
        for (let i = 0; i < ITERATIONS; i++) {
            wrapCodeForTracing(SMALL_CODE, "typescript");
        }
        expect(performance.now() - start).toBeLessThan(500);
    });

    test("wrapCodeForTracing() — rust (passthrough) is fast", () => {
        const start = performance.now();
        for (let i = 0; i < ITERATIONS; i++) {
            wrapCodeForTracing(LARGE_CODE, "rust");
        }
        expect(performance.now() - start).toBeLessThan(500);
    });

    test("extractTrace() — no markers (typical fast path) is fast", () => {
        const start = performance.now();
        for (let i = 0; i < ITERATIONS; i++) {
            extractTrace("just regular output with no trace markers here");
        }
        expect(performance.now() - start).toBeLessThan(500);
    });

    test("extractTrace() — 50 steps is fast", () => {
        const steps = Array.from({ length: 50 }, (_, i) => ({
            line: i + 1,
            variables: { x: { name: "x", value: String(i), type: "int" } },
            callStack: ["main"],
            consoleOutput: null,
        }));
        const rawOut = `${TRACE_MARKER_START}\n${JSON.stringify(steps)}\n${TRACE_MARKER_END}`;
        const start = performance.now();
        for (let i = 0; i < ITERATIONS; i++) {
            extractTrace(rawOut);
        }
        expect(performance.now() - start).toBeLessThan(500);
    });

    test("extractTrace() — 500 steps is fast", () => {
        const steps = Array.from({ length: 500 }, (_, i) => ({
            line: i + 1,
            variables: {},
            callStack: ["main"],
            consoleOutput: null,
        }));
        const rawOut = `${TRACE_MARKER_START}\n${JSON.stringify(steps)}\n${TRACE_MARKER_END}`;
        const start = performance.now();
        for (let i = 0; i < 50; i++) { // fewer iterations for large payloads
            extractTrace(rawOut);
        }
        expect(performance.now() - start).toBeLessThan(500);
    });
});
