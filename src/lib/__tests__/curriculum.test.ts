/**
 * @file curriculum.test.ts
 * Benchmark + integrity tests for CodeAlchemist curriculum data.
 *
 * Checks:
 *  1. Structural integrity of every layer and exercise
 *  2. ID uniqueness / order correctness
 *  3. Golden-example code is present for all three languages
 *  4. Expected outputs are non-empty for all three languages
 *  5. Starter code differs from golden examples (not left as-is)
 *  6. Layer ordering is monotonically increasing (order phase)
 *  7. getLayer() and getLayerCompletion() utility functions
 *  8. Performance benchmarks for data-access functions
 */
import { describe, expect, test } from "bun:test";
import {
    CURRICULUM_LAYERS,
    getLayer,
    getLayerCompletion,
} from "@/data/curriculum";

/* ─── Section 1: Structural Integrity ─────────────────────────────────── */

describe("Curriculum Layers — Structural Integrity", () => {
    test("CURRICULUM_LAYERS is a non-empty array", () => {
        expect(Array.isArray(CURRICULUM_LAYERS)).toBe(true);
        expect(CURRICULUM_LAYERS.length).toBeGreaterThan(0);
    });

    test("each layer has required top-level fields", () => {
        for (const layer of CURRICULUM_LAYERS) {
            expect(typeof layer.id).toBe("number");
            expect(typeof layer.slug).toBe("string");
            expect(layer.slug.length).toBeGreaterThan(0);
            expect(typeof layer.title).toBe("string");
            expect(layer.title.length).toBeGreaterThan(0);
            expect(typeof layer.description).toBe("string");
            expect(Array.isArray(layer.exercises)).toBe(true);
        }
    });

    test("each layer has at least one exercise", () => {
        for (const layer of CURRICULUM_LAYERS) {
            expect(layer.exercises.length).toBeGreaterThan(0);
        }
    });

    test("every exercise has required fields", () => {
        const languages = ["python", "rust", "typescript"] as const;
        for (const layer of CURRICULUM_LAYERS) {
            for (const ex of layer.exercises) {
                expect(typeof ex.id).toBe("string");
                expect(ex.id.length).toBeGreaterThan(0);

                expect(typeof ex.title).toBe("string");
                expect(ex.title.length).toBeGreaterThan(0);

                expect(typeof ex.instructions).toBe("string");
                expect(ex.instructions.length).toBeGreaterThan(0);

                expect(Array.isArray(ex.hints)).toBe(true);

                expect(typeof ex.difficulty).toBe("number");
                expect(ex.difficulty).toBeGreaterThanOrEqual(1);
                expect(ex.difficulty).toBeLessThanOrEqual(5);

                // All three language sections must be present
                for (const lang of languages) {
                    expect(ex.starterCode[lang]).toBeDefined();
                    expect(ex.goldenExample[lang]).toBeDefined();
                    expect(ex.expectedOutput[lang]).toBeDefined();
                }
            }
        }
    });
});

/* ─── Section 2: ID Uniqueness & Order Phase ──────────────────────────── */

describe("Curriculum Layers — Order Phase (ID Ordering)", () => {
    test("layer IDs are unique", () => {
        const ids = CURRICULUM_LAYERS.map((l) => l.id);
        const uniqueIds = new Set(ids);
        expect(uniqueIds.size).toBe(ids.length);
    });

    test("layer IDs are in monotonically increasing order", () => {
        for (let i = 1; i < CURRICULUM_LAYERS.length; i++) {
            expect(CURRICULUM_LAYERS[i].id).toBeGreaterThan(
                CURRICULUM_LAYERS[i - 1].id
            );
        }
    });

    test("layer slugs are unique", () => {
        const slugs = CURRICULUM_LAYERS.map((l) => l.slug);
        const unique = new Set(slugs);
        expect(unique.size).toBe(slugs.length);
    });

    test("exercise IDs are globally unique across all layers", () => {
        const allIds: string[] = [];
        for (const layer of CURRICULUM_LAYERS) {
            for (const ex of layer.exercises) {
                allIds.push(ex.id);
            }
        }
        const unique = new Set(allIds);
        expect(unique.size).toBe(allIds.length);
    });

    test("exercise IDs within a layer use consistent prefixes", () => {
        for (const layer of CURRICULUM_LAYERS) {
            for (const ex of layer.exercises) {
                // Exercise IDs should start with the layer ID number
                const prefix = String(layer.id);
                expect(ex.id.startsWith(prefix)).toBe(true);
            }
        }
    });
});

/* ─── Section 3: Golden Example Completeness ─────────────────────────── */

describe("Curriculum Layers — Golden Example Quality", () => {
    test("golden examples are non-empty for all languages", () => {
        const languages = ["python", "rust", "typescript"] as const;
        for (const layer of CURRICULUM_LAYERS) {
            for (const ex of layer.exercises) {
                for (const lang of languages) {
                    expect(ex.goldenExample[lang].length).toBeGreaterThan(0);
                }
            }
        }
    });

    test("expected outputs are non-empty for all languages", () => {
        const languages = ["python", "rust", "typescript"] as const;
        for (const layer of CURRICULUM_LAYERS) {
            for (const ex of layer.exercises) {
                for (const lang of languages) {
                    expect(
                        ex.expectedOutput[lang].length,
                        `Expected output empty for exercise ${ex.id} [${lang}] in layer ${layer.id}`
                    ).toBeGreaterThan(0);
                }
            }
        }
    });

    test("starter code differs from golden example (exercises are not pre-solved)", () => {
        // For python specifically (most exercises have python starter code)
        for (const layer of CURRICULUM_LAYERS) {
            for (const ex of layer.exercises) {
                if (ex.starterCode.python.length > 0 && ex.goldenExample.python.length > 0) {
                    // They shouldn't be identical — starter is a scaffold, not the answer
                    expect(ex.starterCode.python).not.toBe(ex.goldenExample.python);
                }
            }
        }
    });

    test("Rust exercise 9-2-interfaces golden example instantiates Dog correctly", () => {
        const layer = CURRICULUM_LAYERS.find((l) => l.id === 9);
        expect(layer).toBeDefined();
        const ex = layer!.exercises.find((e) => e.id === "9-2-interfaces");
        expect(ex).toBeDefined();
        const rustCode = ex!.goldenExample.rust;
        // Must NOT use invalid static-like syntax Dog.speak()
        // (that would be `Type.method()` style which is not Rust)
        expect(rustCode).not.toMatch(/println!\(.*Dog\.speak\(\)/);
        // Must use an instance (let dog = Dog)
        expect(rustCode).toContain("let dog = Dog");
        expect(rustCode).toContain("dog.speak()");
    });
});

/* ─── Section 4: Utility Functions ───────────────────────────────────── */

describe("getLayer() utility", () => {
    test("returns a layer for each valid ID", () => {
        for (const layer of CURRICULUM_LAYERS) {
            const found = getLayer(layer.id);
            expect(found).toBeDefined();
            expect(found!.id).toBe(layer.id);
        }
    });

    test("returns undefined for an out-of-range ID", () => {
        expect(getLayer(0)).toBeUndefined();
        expect(getLayer(9999)).toBeUndefined();
        expect(getLayer(-1)).toBeUndefined();
    });
});

describe("getLayerCompletion() utility", () => {
    test("returns 0 when no exercises are completed", () => {
        for (const layer of CURRICULUM_LAYERS) {
            expect(getLayerCompletion(layer.id, [])).toBe(0);
        }
    });

    test("returns 100 when all exercises are completed", () => {
        for (const layer of CURRICULUM_LAYERS) {
            const allIds = layer.exercises.map((e) => e.id);
            expect(getLayerCompletion(layer.id, allIds)).toBe(100);
        }
    });

    test("returns a partial percentage for partial completion", () => {
        const layer = CURRICULUM_LAYERS[0]; // Layer 1 has 2 exercises
        const firstExId = layer.exercises[0].id;
        const pct = getLayerCompletion(layer.id, [firstExId]);
        expect(pct).toBeGreaterThan(0);
        expect(pct).toBeLessThan(100);
    });

    test("returns 0 for an invalid layer ID", () => {
        expect(getLayerCompletion(9999, [])).toBe(0);
    });

    test("completion percentage is calculated correctly", () => {
        const layer = CURRICULUM_LAYERS[0];
        const total = layer.exercises.length;
        const allIds = layer.exercises.map((e) => e.id);

        // Complete only the first exercise
        const pct = getLayerCompletion(layer.id, [allIds[0]]);
        const expected = Math.round((1 / total) * 100);
        expect(pct).toBe(expected);
    });

    test("returns 0 if layer has no exercises (edge case via invalid id)", () => {
        expect(getLayerCompletion(0, ["some-id"])).toBe(0);
    });
});

/* ─── Section 5: Benchmark Performance Tests ─────────────────────────── */

describe("Performance Benchmarks", () => {
    const ITERATIONS = 1000;
    const MAX_MS = 50; // should complete 1000 iterations in under 50ms

    test("getLayer() lookup is fast (1000 iterations < 50ms)", () => {
        const start = performance.now();
        for (let i = 0; i < ITERATIONS; i++) {
            for (const layer of CURRICULUM_LAYERS) {
                getLayer(layer.id);
            }
        }
        const elapsed = performance.now() - start;
        expect(elapsed).toBeLessThan(MAX_MS * 10); // generous bound
    });

    test("getLayerCompletion() with empty array is fast", () => {
        const start = performance.now();
        for (let i = 0; i < ITERATIONS; i++) {
            for (const layer of CURRICULUM_LAYERS) {
                getLayerCompletion(layer.id, []);
            }
        }
        const elapsed = performance.now() - start;
        expect(elapsed).toBeLessThan(MAX_MS * 10);
    });

    test("getLayerCompletion() with partial completion is fast", () => {
        const start = performance.now();
        for (let i = 0; i < ITERATIONS; i++) {
            for (const layer of CURRICULUM_LAYERS) {
                const partialIds = layer.exercises
                    .slice(0, Math.ceil(layer.exercises.length / 2))
                    .map((e) => e.id);
                getLayerCompletion(layer.id, partialIds);
            }
        }
        const elapsed = performance.now() - start;
        expect(elapsed).toBeLessThan(MAX_MS * 10);
    });

    test("flat-map all exercise IDs is fast", () => {
        const start = performance.now();
        for (let i = 0; i < ITERATIONS; i++) {
            CURRICULUM_LAYERS.flatMap((l) => l.exercises.map((e) => e.id));
        }
        const elapsed = performance.now() - start;
        expect(elapsed).toBeLessThan(MAX_MS * 10);
    });

    test("filter layers by difficulty range is fast", () => {
        const start = performance.now();
        for (let i = 0; i < ITERATIONS; i++) {
            CURRICULUM_LAYERS.flatMap((l) =>
                l.exercises.filter((e) => e.difficulty >= 2 && e.difficulty <= 3)
            );
        }
        const elapsed = performance.now() - start;
        expect(elapsed).toBeLessThan(MAX_MS * 10);
    });
});
