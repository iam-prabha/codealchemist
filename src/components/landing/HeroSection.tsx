"use client";

/**
 * HeroSection — Full-viewport hero with shimmer headline, tagline, CTAs, and floating code card
 */

import { motion } from "framer-motion";
import { ArrowRight, ChevronDown } from "lucide-react";

interface HeroSectionProps {
    onGetStarted: () => void;
}

export default function HeroSection({ onGetStarted }: HeroSectionProps) {
    return (
        <section className="relative min-h-screen flex flex-col items-center justify-center px-6 pt-20 pb-16 overflow-hidden">
            {/* Radial glow behind hero */}
            <div
                className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] pointer-events-none"
                style={{
                    background: "radial-gradient(ellipse at center, rgba(245, 197, 66, 0.06) 0%, transparent 70%)",
                }}
            />

            {/* Badge */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="flex items-center gap-2 px-4 py-1.5 rounded-full mb-8 text-xs font-medium"
                style={{
                    background: "rgba(245, 197, 66, 0.08)",
                    border: "1px solid rgba(245, 197, 66, 0.2)",
                    color: "var(--color-gold)",
                }}
            >
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-neon-green)] animate-pulse" />
                Learn Python, Rust & TypeScript — side by side
            </motion.div>

            {/* Headline */}
            <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.2 }}
                className="text-center max-w-4xl"
                style={{ fontFamily: "Space Grotesk, sans-serif" }}
            >
                <span
                    className="block text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.1] tracking-tight shimmer-gold"
                >
                    Transmute Code
                </span>
                <span
                    className="block text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.1] tracking-tight mt-1"
                    style={{ color: "var(--color-text-primary)" }}
                >
                    Into Mastery
                </span>
            </motion.h1>

            {/* Tagline */}
            <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="text-center max-w-2xl mt-6 text-base md:text-lg leading-relaxed"
                style={{ color: "var(--color-text-secondary)" }}
            >
                Master <span style={{ color: "var(--color-python)" }}>Python</span>,{" "}
                <span style={{ color: "var(--color-rust)" }}>Rust</span> &{" "}
                <span style={{ color: "var(--color-typescript)" }}>TypeScript</span>{" "}
                with golden toggleable examples, real-time execution, and stunning debugging visualization.
            </motion.p>

            {/* CTAs */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="flex flex-col sm:flex-row items-center gap-4 mt-10"
            >
                <motion.button
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={onGetStarted}
                    className="flex items-center gap-2 px-8 py-3.5 rounded-xl text-base font-semibold transition-all duration-200"
                    style={{
                        background: "linear-gradient(135deg, var(--color-gold), var(--color-gold-bright))",
                        color: "var(--color-text-inverse)",
                        boxShadow: "0 0 30px var(--color-gold-glow), 0 4px 20px rgba(0,0,0,0.3)",
                    }}
                >
                    Get Started Free
                    <ArrowRight size={18} />
                </motion.button>

                <a
                    href="#languages"
                    className="flex items-center gap-2 px-6 py-3.5 rounded-xl text-base font-medium transition-all duration-200 glass glass-hover"
                    style={{ color: "var(--color-text-secondary)" }}
                >
                    Explore Languages
                    <ChevronDown size={16} />
                </a>
            </motion.div>

            {/* Floating code card */}
            <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.9 }}
                className="relative mt-16 w-full max-w-2xl"
            >
                <div
                    className="rounded-2xl overflow-hidden p-6"
                    style={{
                        background: "linear-gradient(135deg, rgba(26, 16, 48, 0.9), rgba(17, 11, 32, 0.9))",
                        border: "1px solid var(--color-border)",
                        boxShadow: "0 0 60px rgba(245, 197, 66, 0.06), 0 20px 60px rgba(0,0,0,0.4)",
                    }}
                >
                    {/* Window dots */}
                    <div className="flex items-center gap-2 mb-4">
                        <div className="w-3 h-3 rounded-full" style={{ background: "#ff5f57" }} />
                        <div className="w-3 h-3 rounded-full" style={{ background: "#ffbd2e" }} />
                        <div className="w-3 h-3 rounded-full" style={{ background: "#28c840" }} />
                        <span className="ml-3 text-xs" style={{ color: "var(--color-text-muted)" }}>
                            transmute.py
                        </span>
                    </div>

                    {/* Code */}
                    <pre className="text-sm leading-relaxed overflow-x-auto">
                        <code>
                            <span style={{ color: "var(--color-text-muted)" }}>{"# A taste of alchemy..."}</span>{"\n"}
                            <span style={{ color: "var(--color-neon-magenta)" }}>def</span>{" "}
                            <span style={{ color: "var(--color-gold)" }}>get_grade</span>
                            <span style={{ color: "var(--color-text-primary)" }}>(</span>
                            <span style={{ color: "var(--color-neon-cyan)" }}>score</span>
                            <span style={{ color: "var(--color-text-muted)" }}>:</span>{" "}
                            <span style={{ color: "var(--color-neon-cyan)" }}>int</span>
                            <span style={{ color: "var(--color-text-primary)" }}>)</span>{" "}
                            <span style={{ color: "var(--color-text-muted)" }}>{"->"}</span>{" "}
                            <span style={{ color: "var(--color-neon-cyan)" }}>str</span>
                            <span style={{ color: "var(--color-text-primary)" }}>:</span>{"\n"}
                            {"    "}<span style={{ color: "var(--color-neon-magenta)" }}>match</span>{" "}
                            <span style={{ color: "var(--color-neon-cyan)" }}>score</span>
                            <span style={{ color: "var(--color-text-primary)" }}>:</span>{"\n"}
                            {"        "}<span style={{ color: "var(--color-neon-magenta)" }}>case</span>{" "}
                            <span style={{ color: "var(--color-neon-cyan)" }}>s</span>{" "}
                            <span style={{ color: "var(--color-neon-magenta)" }}>if</span>{" "}
                            <span style={{ color: "var(--color-neon-cyan)" }}>s</span>{" "}
                            <span style={{ color: "var(--color-text-primary)" }}>{">="}</span>{" "}
                            <span style={{ color: "var(--color-gold)" }}>90</span>
                            <span style={{ color: "var(--color-text-primary)" }}>:</span>{" "}
                            <span style={{ color: "var(--color-neon-magenta)" }}>return</span>{" "}
                            <span style={{ color: "var(--color-neon-green)" }}>{'"A"'}</span>{"\n"}
                            {"        "}<span style={{ color: "var(--color-neon-magenta)" }}>case</span>{" "}
                            <span style={{ color: "var(--color-neon-cyan)" }}>s</span>{" "}
                            <span style={{ color: "var(--color-neon-magenta)" }}>if</span>{" "}
                            <span style={{ color: "var(--color-neon-cyan)" }}>s</span>{" "}
                            <span style={{ color: "var(--color-text-primary)" }}>{">="}</span>{" "}
                            <span style={{ color: "var(--color-gold)" }}>80</span>
                            <span style={{ color: "var(--color-text-primary)" }}>:</span>{" "}
                            <span style={{ color: "var(--color-neon-magenta)" }}>return</span>{" "}
                            <span style={{ color: "var(--color-neon-green)" }}>{'"B"'}</span>{"\n"}
                            {"        "}<span style={{ color: "var(--color-neon-magenta)" }}>case</span>{" "}
                            <span style={{ color: "var(--color-neon-cyan)" }}>_</span>
                            <span style={{ color: "var(--color-text-primary)" }}>:</span>{" "}
                            <span style={{ color: "var(--color-neon-magenta)" }}>return</span>{" "}
                            <span style={{ color: "var(--color-neon-green)" }}>{'"F"'}</span>{"\n\n"}
                            <span style={{ color: "var(--color-neon-cyan)" }}>print</span>
                            <span style={{ color: "var(--color-text-primary)" }}>(</span>
                            <span style={{ color: "var(--color-gold)" }}>get_grade</span>
                            <span style={{ color: "var(--color-text-primary)" }}>(</span>
                            <span style={{ color: "var(--color-gold)" }}>95</span>
                            <span style={{ color: "var(--color-text-primary)" }}>))</span>{" "}
                            <span style={{ color: "var(--color-text-muted)" }}>{"# -> A"}</span>
                        </code>
                    </pre>
                </div>

                {/* Floating language badges */}
                <motion.div
                    animate={{ y: [0, -6, 0] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute -top-4 -right-3 px-3 py-1.5 rounded-lg text-xs font-bold"
                    style={{ background: "var(--color-python)", color: "#fff", boxShadow: "0 0 20px var(--color-python-glow)" }}
                >
                    Python
                </motion.div>
                <motion.div
                    animate={{ y: [0, -6, 0] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                    className="absolute top-12 -left-3 px-3 py-1.5 rounded-lg text-xs font-bold"
                    style={{ background: "var(--color-rust)", color: "#fff", boxShadow: "0 0 20px var(--color-rust-glow)" }}
                >
                    Rust
                </motion.div>
                <motion.div
                    animate={{ y: [0, -6, 0] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 2 }}
                    className="absolute bottom-6 -right-3 px-3 py-1.5 rounded-lg text-xs font-bold"
                    style={{ background: "var(--color-typescript)", color: "#fff", boxShadow: "0 0 20px var(--color-typescript-glow)" }}
                >
                    TypeScript
                </motion.div>
            </motion.div>
        </section>
    );
}
