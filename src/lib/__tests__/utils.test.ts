import { describe, expect, test } from "bun:test";
import { cn } from "../utils";

describe("Utils - cn()", () => {
    test("merges basic tailwind classes", () => {
        expect(cn("p-4", "m-2")).toBe("p-4 m-2");
    });

    test("handles conditional classes", () => {
        const isActive = true;
        expect(cn("btn", isActive && "bg-blue-500")).toBe("btn bg-blue-500");
    });

    test("resolves tailwind conflicts correctly via tailwind-merge", () => {
        // px-4 should override p-2 padding on the x-axis
        expect(cn("p-2", "px-4")).toBe("p-2 px-4");
        
        // text-red-500 should be overridden by text-blue-500
        expect(cn("text-red-500", "text-blue-500")).toBe("text-blue-500");
    });

    test("handles arrays and objects", () => {
        expect(cn(["p-1", "m-1"], { "bg-red": false, "bg-blue": true })).toBe("p-1 m-1 bg-blue");
    });
});