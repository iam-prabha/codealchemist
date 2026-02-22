"use client";

/**
 * Navbar — Transparent floating nav for landing page
 * Glass morphism on scroll, auth-aware (Sign In vs UserMenu + Open Workspace)
 */

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useSession } from "@/lib/auth-client";
import UserMenu from "@/components/auth/UserMenu";
import AuthModal from "@/components/auth/AuthModal";

export default function Navbar() {
    const { data: session, isPending } = useSession();
    const [scrolled, setScrolled] = useState(false);
    const [authModalOpen, setAuthModalOpen] = useState(false);

    const isAuthenticated = !!session?.user;

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 40);
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    const NAV_LINKS = [
        { label: "Languages", href: "#languages" },
        { label: "Features", href: "#features" },
        { label: "Curriculum", href: "#curriculum" },
    ];

    return (
        <>
            <motion.nav
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
                style={{
                    background: scrolled
                        ? "linear-gradient(135deg, rgba(17, 11, 32, 0.92), rgba(10, 6, 18, 0.92))"
                        : "transparent",
                    backdropFilter: scrolled ? "blur(20px)" : "none",
                    borderBottom: scrolled ? "1px solid var(--color-border)" : "1px solid transparent",
                }}
            >
                <div className="max-w-7xl mx-auto px-6 h-16 flex items-center gap-8">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2 shrink-0">
                        <span className="text-xl">⚗️</span>
                        <span
                            className="text-base font-bold shimmer-gold"
                            style={{ fontFamily: "Space Grotesk, sans-serif" }}
                        >
                            CodeAlchemist
                        </span>
                    </Link>

                    {/* Nav links */}
                    <div className="hidden md:flex items-center gap-6 ml-8">
                        {NAV_LINKS.map((link) => (
                            <a
                                key={link.href}
                                href={link.href}
                                className="text-sm transition-colors duration-200"
                                style={{ color: "var(--color-text-secondary)" }}
                                onMouseEnter={(e) => (e.currentTarget.style.color = "var(--color-gold)")}
                                onMouseLeave={(e) => (e.currentTarget.style.color = "var(--color-text-secondary)")}
                            >
                                {link.label}
                            </a>
                        ))}
                    </div>

                    {/* Spacer */}
                    <div className="flex-1" />

                    {/* Auth area */}
                    {isPending ? (
                        <div
                            className="w-24 h-8 rounded-lg animate-pulse"
                            style={{ background: "var(--color-surface)" }}
                        />
                    ) : isAuthenticated ? (
                        <div className="flex items-center gap-3">
                            <Link
                                href="/workspace"
                                className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200"
                                style={{
                                    background: "linear-gradient(135deg, var(--color-gold), var(--color-gold-bright))",
                                    color: "var(--color-text-inverse)",
                                    boxShadow: "0 0 20px var(--color-gold-glow)",
                                }}
                            >
                                Open Workspace
                                <ArrowRight size={14} />
                            </Link>
                            <UserMenu />
                        </div>
                    ) : (
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => setAuthModalOpen(true)}
                                className="text-sm transition-colors duration-200 px-3 py-1.5"
                                style={{ color: "var(--color-text-secondary)" }}
                                onMouseEnter={(e) => (e.currentTarget.style.color = "var(--color-gold)")}
                                onMouseLeave={(e) => (e.currentTarget.style.color = "var(--color-text-secondary)")}
                            >
                                Sign In
                            </button>
                            <motion.button
                                whileHover={{ scale: 1.03 }}
                                whileTap={{ scale: 0.97 }}
                                onClick={() => setAuthModalOpen(true)}
                                className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200"
                                style={{
                                    background: "linear-gradient(135deg, var(--color-gold), var(--color-gold-bright))",
                                    color: "var(--color-text-inverse)",
                                    boxShadow: "0 0 20px var(--color-gold-glow)",
                                }}
                            >
                                Get Started
                                <ArrowRight size={14} />
                            </motion.button>
                        </div>
                    )}
                </div>
            </motion.nav>

            <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} />
        </>
    );
}
