import { describe, expect, test } from "bun:test";
import { extractTrace, TRACE_MARKER_START, TRACE_MARKER_END, wrapCodeForTracing } from "../tracer";

describe("Tracer", () => {
    describe("extractTrace()", () => {
        test("extracts json and returns cleaned output", () => {
            const rawOutput = `Hello World!
${TRACE_MARKER_START}
[{"line": 1, "variables": {}, "callStack": []}]
${TRACE_MARKER_END}`;

            const result = extractTrace(rawOutput);
            expect(result.output).toBe("Hello World!\n");
            expect(result.steps).toBeDefined();
            expect(result.steps![0].line).toBe(1);
        });

        test("returns full output if no markers are found", () => {
            const result = extractTrace("Just some normal output without markers");
            expect(result.output).toBe("Just some normal output without markers");
            expect(result.steps).toBeUndefined();
        });

        test("handles invalid JSON gracefully", () => {
            const rawOutput = `Output
${TRACE_MARKER_START}
[{ bad_json
${TRACE_MARKER_END}`;
            
            const result = extractTrace(rawOutput);
            expect(result.output).toBe("Output\n");
            expect(result.steps).toBeUndefined();
        });
    });

    describe("wrapCodeForTracing()", () => {
        test("wraps python code correctly", () => {
            const wrapped = wrapCodeForTracing("print('test')", "python");
            expect(wrapped).toContain("sys.settrace");
            expect(wrapped).toContain("print('test')");
            expect(wrapped).toContain(TRACE_MARKER_START);
        });

        test("wraps typescript code correctly", () => {
            const wrapped = wrapCodeForTracing("console.log('test')", "typescript");
            expect(wrapped).toContain("const originalLog = console.log");
            expect(wrapped).toContain("console.log('test')");
            expect(wrapped).toContain(TRACE_MARKER_START);
        });

        test("returns rust code as-is", () => {
            const code = 'fn main() { println!("test"); }';
            const wrapped = wrapCodeForTracing(code, "rust");
            expect(wrapped).toBe(code);
        });
    });
});
