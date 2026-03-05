"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";

const codeSnippets = {
    python: `def transmute(code):
    """Turn raw code into mastery"""
    result = execute(code)
    return result

# Your coding journey begins
message = "Hello, Alchemist!"
print(message)`,
    rust: `fn transmute(code: &str) -> Result<String, Error> {
    // Turn raw code into mastery
    let result = execute_code(code)?;
    Ok(result)
}

// Your coding journey begins
let message = "Hello, Alchemist!";
println!("{}", message);`,
    typescript: `function transmute(code: string): Promise<string> {
    // Turn raw code into mastery
    const result = await executeCode(code);
    return result;
}

// Your coding journey begins
const message: string = "Hello, Alchemist!";
console.log(message);`,
};

const languages = [
    { id: "python" as const, name: "Python", color: "#3776ab", icon: "🐍" },
    { id: "rust" as const, name: "Rust", color: "#ce422b", icon: "🦀" },
    { id: "typescript" as const, name: "TypeScript", color: "#3178c6", icon: "🔷" },
];

export default function HeroSection() {
    const [currentLang, setCurrentLang] = useState<keyof typeof codeSnippets>("python");
    const [displayText, setDisplayText] = useState("");
    const [currentWordIndex, setCurrentWordIndex] = useState(0);
    const shouldReduceMotion = useReducedMotion();

    const headline = "Turn Code Into Craft. Master Python, Rust & TypeScript.";
    const words = headline.split(" ");

    useEffect(() => {
        if (shouldReduceMotion) {
            setDisplayText(headline);
            return;
        }

        if (currentWordIndex < words.length) {
            const timer = setTimeout(() => {
                setDisplayText(prev => prev + (prev ? " " : "") + words[currentWordIndex]);
                setCurrentWordIndex(prev => prev + 1);
            }, 150);
            return () => clearTimeout(timer);
        }
    }, [currentWordIndex, shouldReduceMotion]);

    useEffect(() => {
        if (shouldReduceMotion) return;

        const interval = setInterval(() => {
            setCurrentLang((prev) => {
                const keys = Object.keys(codeSnippets) as (keyof typeof codeSnippets)[];
                const currentIndex = keys.indexOf(prev);
                return keys[(currentIndex + 1) % keys.length];
            });
        }, 3000);

        return () => clearInterval(interval);
    }, [shouldReduceMotion]);

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2,
            },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
    };

    return (
        <section className="relative min-h-screen flex items-center justify-center px-4 pt-16">
            {/* Background gradient */}
            <div className="absolute inset-0 hero-glow" />

            <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center relative z-10">
                {/* Left Content */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="text-center lg:text-left"
                >
                    {/* Badge */}
                    <motion.div
                        variants={itemVariants}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-gold/10 border border-gold/20 rounded-full text-gold text-sm font-medium mb-6"
                    >
                        <span className="w-2 h-2 bg-gold rounded-full animate-pulse" />
                        ⚗️ Now with AI-powered hints
                    </motion.div>

                    {/* Headline */}
                    <motion.h1
                        variants={itemVariants}
                        className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight min-h-[120px] lg:min-h-[180px]"
                    >
                        {displayText}
                        <span className="animate-pulse text-gold">|</span>
                    </motion.h1>

                    {/* Subtitle */}
                    <motion.p
                        variants={itemVariants}
                        className="text-lg text-text-muted mb-8 max-w-lg mx-auto lg:mx-0"
                    >
                        12 progressive layers. Real code execution. AI-powered hints. Level up faster than ever.
                    </motion.p>

                    {/* CTA Buttons */}
                    <motion.div
                        variants={itemVariants}
                        className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
                    >
                        <Link
                            href="/sign-up"
                            className="px-8 py-4 bg-gold hover:bg-gold/90 text-text-inverse rounded-full font-semibold text-lg transition-colors flex items-center justify-center gap-2"
                        >
                            Start Coding Free →
                        </Link>
                        <a
                            href="#how-it-works"
                            className="px-8 py-4 border border-border hover:bg-panel rounded-full font-semibold text-lg transition-colors flex items-center justify-center gap-2"
                        >
                            See How It Works
                        </a>
                    </motion.div>

                    {/* Social Proof */}
                    <motion.div
                        variants={itemVariants}
                        className="flex items-center justify-center lg:justify-start gap-6 mt-12"
                    >
                        {/* Avatar Stack */}
                        <div className="flex -space-x-2">
                            {[...Array(3)].map((_, i) => (
                                <div
                                    key={i}
                                    className="w-8 h-8 rounded-full bg-gradient-to-br from-gold to-purple-500 border-2 border-surface flex items-center justify-center text-xs font-bold text-white"
                                >
                                    {String.fromCharCode(65 + i)}
                                </div>
                            ))}
                        </div>
                        <div className="text-sm text-text-muted">
                            Join <span className="font-semibold text-text-primary">12,000+</span> developers
                        </div>
                    </motion.div>
                </motion.div>

                {/* Right Content - Code Editor Mockup */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    className="relative"
                >
                    <div className="glass-card rounded-2xl p-6 shadow-2xl">
                        {/* Header */}
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 bg-red-500 rounded-full" />
                                <div className="w-3 h-3 bg-yellow-500 rounded-full" />
                                <div className="w-3 h-3 bg-green-500 rounded-full" />
                            </div>
                            <div className="flex items-center gap-2">
                                {languages.map((lang) => (
                                    <motion.button
                                        key={lang.id}
                                        onClick={() => setCurrentLang(lang.id)}
                                        animate={{
                                            scale: currentLang === lang.id ? 1.05 : 1,
                                            backgroundColor: currentLang === lang.id ? "var(--color-gold-dim)" : "transparent"
                                        }}
                                        className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                                            currentLang === lang.id
                                                ? "text-gold"
                                                : "text-text-muted hover:text-text-primary"
                                        }`}
                                    >
                                        {lang.icon} {lang.name}
                                    </motion.button>
                                ))}
                            </div>
                        </div>

                        {/* Code */}
                        <motion.div
                            key={currentLang}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.5 }}
                            className="font-mono text-sm leading-relaxed"
                        >
                            <pre className="text-text-primary whitespace-pre-wrap">
                                <code>{codeSnippets[currentLang]}</code>
                            </pre>
                        </motion.div>

                        {/* Footer */}
                        <div className="flex items-center justify-between mt-6 pt-4 border-t border-border">
                            <div className="flex items-center gap-2 text-xs text-text-muted">
                                <span>⚡</span>
                                <span>Press Ctrl+Enter to run</span>
                            </div>
                            <div className="text-xs text-text-muted">
                                ✨ AI hints available
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}