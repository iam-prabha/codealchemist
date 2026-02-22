"use client";

/**
 * LanguageShowcase — Three large cards for Python, Rust, TypeScript
 * Each with brand-color glow, code snippet, and description
 */

import { motion, type Variants } from "framer-motion";

const LANGUAGES = [
    {
        name: "Python",
        icon: "\u{1F40D}",
        color: "var(--color-python)",
        glow: "var(--color-python-glow)",
        tagline: "Elegant & Expressive",
        description: "Dynamic typing, rapid prototyping, and a vast ecosystem. From data science to web backends \u2014 Python does it all with clean, readable syntax.",
        code: `numbers = [1, 2, 3, 4, 5]
squares = [n ** 2 for n in numbers]
print(squares)  # [1, 4, 9, 16, 25]`,
    },
    {
        name: "Rust",
        icon: "\u{1F980}",
        color: "var(--color-rust)",
        glow: "var(--color-rust-glow)",
        tagline: "Safe & Blazingly Fast",
        description: "Zero-cost abstractions, memory safety without garbage collection, and fearless concurrency. Performance meets reliability.",
        code: `let numbers = vec![1, 2, 3, 4, 5];
let squares: Vec<i32> = numbers
    .iter().map(|n| n * n).collect();
println!("{:?}", squares);`,
    },
    {
        name: "TypeScript",
        icon: "\u{1F537}",
        color: "var(--color-typescript)",
        glow: "var(--color-typescript-glow)",
        tagline: "Typed & Scalable",
        description: "A type-safe superset of JavaScript with powerful tooling, interfaces, and generics. Build robust apps with confidence.",
        code: `const numbers: number[] = [1, 2, 3, 4, 5];
const squares = numbers.map(n => n ** 2);
console.log(squares); // [1, 4, 9, 16, 25]`,
    },
];

const cardVariants: Variants = {
    hidden: { opacity: 0, y: 40 },
    visible: (i: number) => ({
        opacity: 1,
        y: 0,
        transition: { duration: 0.6, delay: i * 0.15, ease: "easeOut" as const },
    }),
};

export default function LanguageShowcase() {
    return (
        <section id="languages" className="py-24 px-6">
            <div className="max-w-7xl mx-auto">
                {/* Section header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <h2
                        className="text-3xl md:text-4xl font-bold mb-4"
                        style={{ fontFamily: "Space Grotesk, sans-serif", color: "var(--color-text-primary)" }}
                    >
                        Three Languages.{" "}
                        <span className="shimmer-gold">One Platform.</span>
                    </h2>
                    <p className="text-base max-w-xl mx-auto" style={{ color: "var(--color-text-secondary)" }}>
                        Learn each language side by side. See how the same concept translates across Python, Rust, and TypeScript.
                    </p>
                </motion.div>

                {/* Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {LANGUAGES.map((lang, i) => (
                        <motion.div
                            key={lang.name}
                            custom={i}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, margin: "-80px" }}
                            variants={cardVariants}
                            whileHover={{ y: -6, transition: { duration: 0.2 } }}
                            className="group rounded-2xl p-6 flex flex-col transition-all duration-300"
                            style={{
                                background: "linear-gradient(135deg, rgba(26, 16, 48, 0.8), rgba(17, 11, 32, 0.7))",
                                border: "1px solid var(--color-border)",
                                backdropFilter: "blur(12px)",
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.borderColor = lang.color;
                                e.currentTarget.style.boxShadow = `0 0 40px ${lang.glow}, 0 8px 32px rgba(0,0,0,0.3)`;
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.borderColor = "var(--color-border)";
                                e.currentTarget.style.boxShadow = "none";
                            }}
                        >
                            {/* Icon + name */}
                            <div className="flex items-center gap-3 mb-4">
                                <span className="text-3xl">{lang.icon}</span>
                                <div>
                                    <h3
                                        className="text-xl font-bold"
                                        style={{ fontFamily: "Space Grotesk, sans-serif", color: lang.color }}
                                    >
                                        {lang.name}
                                    </h3>
                                    <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>
                                        {lang.tagline}
                                    </p>
                                </div>
                            </div>

                            {/* Description */}
                            <p className="text-sm leading-relaxed mb-5 flex-1" style={{ color: "var(--color-text-secondary)" }}>
                                {lang.description}
                            </p>

                            {/* Code snippet */}
                            <div
                                className="rounded-xl p-4 overflow-x-auto"
                                style={{
                                    background: "var(--color-void)",
                                    border: "1px solid var(--color-border)",
                                }}
                            >
                                <pre className="text-xs leading-relaxed" style={{ color: "var(--color-text-primary)" }}>
                                    <code>{lang.code}</code>
                                </pre>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
