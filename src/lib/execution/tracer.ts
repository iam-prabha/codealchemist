import type { Language, ExecutionStep } from "@/types";

/**
 * Tracing utilities for CodeAlchemist.
 * Wraps user code with language-specific tracing instrumentation.
 * The wrapped code outputs a JSON payload at the end of execution
 * containing the execution trace (steps, variables, stdout).
 */

export const TRACE_MARKER_START = "===CODEALCHEMIST_TRACE_START===";
export const TRACE_MARKER_END = "===CODEALCHEMIST_TRACE_END===";

/**
 * Wraps user code based on the language.
 */
export function wrapCodeForTracing(code: string, language: Language): string {
    switch (language) {
        case "python":
            return wrapPythonTrace(code);
        case "typescript":
            return wrapTypeScriptTrace(code);
        case "rust":
            return wrapRustTrace(code);
        default:
            return code; // Fallback
    }
}

/**
 * Parses the stdout from Piston to extract the original output and the trace JSON.
 */
export function extractTrace(stdout: string): { output: string; steps?: ExecutionStep[] } {
    const startIndex = stdout.indexOf(TRACE_MARKER_START);
    const endIndex = stdout.indexOf(TRACE_MARKER_END);

    if (startIndex === -1 || endIndex === -1) {
        // No trace found, just return the raw stdout
        return { output: stdout };
    }

    const rawOutput = stdout.substring(0, startIndex);
    const jsonStr = stdout.substring(startIndex + TRACE_MARKER_START.length, endIndex).trim();

    try {
        const steps = JSON.parse(jsonStr) as ExecutionStep[];
        return { output: rawOutput, steps };
    } catch (e) {
        console.error("Failed to parse execution trace JSON:", e);
        return { output: rawOutput };
    }
}

/**
 * ── Python ──
 * Uses sys.settrace to track line-by-line execution and local variables.
 */
function wrapPythonTrace(code: string): string {
    return `
import sys
import json
import traceback

__ca_steps = []
__ca_user_stdout = []

# Redirect stdout to capture prints
class StdoutInterceptor:
    def write(self, text):
        sys.__stdout__.write(text) # Still print to real stdout
        if text:
            __ca_user_stdout.append(text)
    def flush(self):
        sys.__stdout__.flush()

sys.stdout = StdoutInterceptor()

def __ca_trace_calls(frame, event, arg):
    if event != 'line':
        return __ca_trace_calls

    # Ignore frames that aren't from the main script
    if frame.f_code.co_filename != '<string>' and frame.f_code.co_filename != 'main.py':
        return __ca_trace_calls

    line_no = frame.f_lineno
    
    # Extract variables
    vars_snapshot = {}
    for k, v in frame.f_locals.items():
        if not k.startswith('__') and not hasattr(v, '__call__') and type(v).__name__ != 'module':
            val_str = str(v)
            if len(val_str) > 100:
                 val_str = val_str[:97] + "..."
            vars_snapshot[k] = {
                "name": k,
                "value": val_str,
                "type": type(v).__name__
            }
            
    # Extract call stack
    stack = []
    f = frame
    while f:
        if f.f_code.co_name == '<module>':
            stack.insert(0, "main")
        else:
            stack.insert(0, f.f_code.co_name)
        f = f.f_back

    # Capture any stdout since the last step
    stdout_str = "".join(__ca_user_stdout)
    __ca_user_stdout.clear()

    __ca_steps.append({
        "line": line_no,
        "variables": vars_snapshot,
        "callStack": stack,
        "consoleOutput": stdout_str if stdout_str else None
    })
    
    return __ca_trace_calls

# Start tracing
sys.settrace(__ca_trace_calls)

try:
${code.split('\\n').map(line => '    ' + line).join('\\n')}
except Exception as e:
    sys.settrace(None)
    traceback.print_exc(file=sys.stderr)
finally:
    sys.settrace(None)
    sys.stdout = sys.__stdout__
    
    # Print the trace JSON
    print("${TRACE_MARKER_START}")
    print(json.dumps(__ca_steps))
    print("${TRACE_MARKER_END}")
`;
}

/**
 * ── TypeScript ──
 * Since we can't easily hook V8 line execution in a generic way inside Piston,
 * we will wrap console.log to capture "steps" whenever the user prints something.
 * This is "basic" tracing.
 */
function wrapTypeScriptTrace(code: string): string {
    return `
const __ca_steps: any[] = [];
let __ca_lineCounter = 0;

const originalLog = console.log;
console.log = (...args) => {
    // Call original
    originalLog(...args);
    
    // Create a step
    __ca_lineCounter++;
    const output = args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' ');
    
    __ca_steps.push({
        line: 0, // We don't have true line numbers in TS without a babel transform
        variables: {}, // We can't automatically grab locals in JS
        callStack: ["main"],
        consoleOutput: output + "\\n"
    });
};

try {
    // --- USER CODE START ---
${code}
    // --- USER CODE END ---
} catch (e: any) {
    console.error(e);
} finally {
    originalLog("${TRACE_MARKER_START}");
    originalLog(JSON.stringify(__ca_steps));
    originalLog("${TRACE_MARKER_END}");
}
`;
}

/**
 * ── Rust ──
 * Just return the code as-is for now. Full tracing requires compiling with debug 
 * symbols and wrapping with a debugger. For now, we'll just parse the stdout.
 */
function wrapRustTrace(code: string): string {
    return code;
}
