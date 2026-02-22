"use client";

/**
 * Footer — Final CTA + copyright
 */

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useSession } from "@/lib/auth-client";

interface FooterProps {
    onGetStarted: () => void;
}

export default function Footer({ onGetStarted }: FooterProps) {
    const { data: session } = useSession();
    const isAuthenticated = !!session?.user;

    return (
        <footer className="py-24 px-6">
            <div className="max-w-3xl mx-auto text-center">
                {/* CTA */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-80px" }}
                    transition={{ duration: 0.6 }}
                >
                    <h2
                        className="text-3xl md:text-4xl font-bold mb-4"
                        style={{ fontFamily: "Space Grotesk, sans-serif", color: "var(--color-text-primary)" }}
                    >
                        Ready to Start Your{" "}
                        <span className="shimmer-gold">Transmutation</span>?
                    </h2>
                    <p className="text-base mb-8" style={{ color: "var(--color-text-secondary)" }}>
                        Join CodeAlchemist and master three languages with one platform.
                    </p>

                    {isAuthenticated ? (
                        <Link
                            href="/workspace"
                            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl text-base font-semibold transition-all duration-200"
                            style={{
                                background: "linear-gradient(135deg, var(--color-gold), var(--color-gold-bright))",
                                color: "var(--color-text-inverse)",
                                boxShadow: "0 0 30px var(--color-gold-glow), 0 4px 20px rgba(0,0,0,0.3)",
                            }}
                        >
                            Open Workspace
                            <ArrowRight size={18} />
                        </Link>
                    ) : (
                        <motion.button
                            whileHover={{ scale: 1.04 }}
                            whileTap={{ scale: 0.97 }}
                            onClick={onGetStarted}
                            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl text-base font-semibold transition-all duration-200"
                            style={{
                                background: "linear-gradient(135deg, var(--color-gold), var(--color-gold-bright))",
                                color: "var(--color-text-inverse)",
                                boxShadow: "0 0 30px var(--color-gold-glow), 0 4px 20px rgba(0,0,0,0.3)",
                            }}
                        >
                            Get Started Free
                            <ArrowRight size={18} />
                        </motion.button>
                    )}
                </motion.div>

                {/* Divider */}
                <div
                    className="my-16 h-px mx-auto max-w-xs"
                    style={{
                        background: "linear-gradient(90deg, transparent, var(--color-border), transparent)",
                    }}
                />

                {/* Copyright */}
                <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>
                    Built with ⚗️ by CodeAlchemist
                </p>
            </div>
        </footer>
    );
}
