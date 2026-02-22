"use client";

/**
 * TopBar — Application header with breadcrumb, practice mode toggle, and auth controls
 */

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
    EyeOff,
    Menu,
    Zap,
    FlaskConical,
    LogIn,
} from "lucide-react";
import { useEditorStore, useProgressStore } from "@/stores";
import { CURRICULUM_LAYERS } from "@/data/curriculum";
import { cn } from "@/lib/utils";
import { useSession } from "@/lib/auth-client";
import UserMenu from "@/components/auth/UserMenu";
import AuthModal from "@/components/auth/AuthModal";

export default function TopBar() {
    const {
        activeLayerId,
        exampleRevealed,
        toggleExample,
        toggleSidebar,
    } = useEditorStore();
    const { xp } = useProgressStore();
    const { data: session, isPending } = useSession();
    const [authModalOpen, setAuthModalOpen] = useState(false);

    const activeLayer = CURRICULUM_LAYERS.find((l) => l.id === activeLayerId);
    const isAuthenticated = !!session?.user;

    return (
        <>
            <header className="app-topbar gap-4">
                {/* -- Mobile menu button -- */}
                <button
                    onClick={toggleSidebar}
                    className="flex lg:hidden p-2 rounded-md hover:bg-[var(--color-surface-hover)] mr-2"
                    aria-label="Toggle sidebar"
                >
                    <Menu size={18} />
                </button>

                {/* -- Breadcrumb (links back to landing page) -- */}
                <Link
                    href="/"
                    className="flex items-center gap-2 mr-auto group"
                    title="Back to home"
                >
                    <span className="text-lg">{activeLayer?.icon || "⚗️"}</span>
                    <div>
                        <h2
                            className="text-sm font-semibold leading-tight group-hover:text-[var(--color-gold)] transition-colors"
                            style={{ fontFamily: "Space Grotesk, sans-serif" }}
                        >
                            {activeLayer?.title || "CodeAlchemist"}
                        </h2>
                        <p className="text-[10px]" style={{ color: "var(--color-text-muted)" }}>
                            {activeLayer?.subtitle || "Select a lesson"}
                        </p>
                    </div>
                </Link>

                {/* -- Toggle Golden Example -- */}
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={toggleExample}
                    className={cn(
                        "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all",
                        exampleRevealed
                            ? "bg-[var(--color-gold)] text-[var(--color-text-inverse)]"
                            : "glass glass-hover text-[var(--color-gold)]"
                    )}
                    title="Toggle Golden Example (Cmd+B)"
                >
                    {exampleRevealed ? (
                        <>
                            <EyeOff size={14} /> Hide Example
                        </>
                    ) : (
                        <>
                            <FlaskConical size={14} /> Reveal Golden Example
                        </>
                    )}
                </motion.button>

                {/* -- Auth: UserMenu or Sign In button -- */}
                {isPending ? (
                    /* Skeleton placeholder while session loads */
                    <div
                        className="w-20 h-8 rounded-lg animate-pulse"
                        style={{ background: "var(--color-surface)" }}
                    />
                ) : isAuthenticated ? (
                    <UserMenu />
                ) : (
                    <>
                        {/* XP Badge (unauthenticated — show local XP) */}
                        <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg glass">
                            <Zap size={14} style={{ color: "var(--color-gold)" }} />
                            <span className="text-xs font-mono" style={{ color: "var(--color-gold)" }}>
                                {xp}
                            </span>
                        </div>

                        {/* Sign In button */}
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setAuthModalOpen(true)}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all glass glass-hover"
                            style={{ color: "var(--color-gold)" }}
                        >
                            <LogIn size={14} />
                            Sign In
                        </motion.button>
                    </>
                )}
            </header>

            {/* Auth Modal */}
            <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} />
        </>
    );
}
