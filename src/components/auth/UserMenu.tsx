"use client";

/**
 * UserMenu — Avatar + dropdown for authenticated users
 * Shows name, email, XP, and sign out button
 */

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LogOut, Zap, ChevronDown } from "lucide-react";
import { useSession, signOut } from "@/lib/auth-client";
import { useProgressStore } from "@/stores";
import Image from "next/image";

export default function UserMenu() {
    const { data: session } = useSession();
    const { xp } = useProgressStore();
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    const user = session?.user;

    // Close dropdown on outside click
    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    if (!user) return null;

    const initials = user.name
        ? user.name
              .split(" ")
              .map((n) => n[0])
              .join("")
              .toUpperCase()
              .slice(0, 2)
        : user.email?.charAt(0).toUpperCase() || "?";

    const handleSignOut = async () => {
        setIsOpen(false);
        await signOut({
            fetchOptions: {
                onSuccess: () => {
                    window.location.href = "/";
                },
            },
        });
    };

    return (
        <div ref={menuRef} className="relative">
            {/* XP Badge + Avatar trigger */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 rounded-lg transition-all duration-200 glass glass-hover px-2 py-1.5"
            >
                {/* XP */}
                <div className="hidden sm:flex items-center gap-1">
                    <Zap size={14} style={{ color: "var(--color-gold)" }} />
                    <span
                        className="text-xs font-mono"
                        style={{ color: "var(--color-gold)" }}
                    >
                        {xp}
                    </span>
                </div>

                {/* Avatar */}
                <div
                    className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold overflow-hidden"
                    style={{
                        background: user.image
                            ? "transparent"
                            : "linear-gradient(135deg, var(--color-gold-dim), var(--color-gold))",
                        color: "var(--color-text-inverse)",
                    }}
                >
                    {user.image ? (
                        <Image
                            src={user.image}
                            alt={user.name || "User"}
                            width={32}
                            height={32}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        initials
                    )}
                </div>

                <ChevronDown
                    size={12}
                    className="transition-transform duration-200"
                    style={{
                        color: "var(--color-text-muted)",
                        transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                    }}
                />
            </button>

            {/* Dropdown */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -8, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -8, scale: 0.96 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 top-full mt-2 w-64 rounded-xl overflow-hidden z-50"
                        style={{
                            background: "linear-gradient(135deg, rgba(26, 16, 48, 0.98), rgba(34, 24, 66, 0.98))",
                            border: "1px solid var(--color-border)",
                            boxShadow: "0 12px 40px rgba(0, 0, 0, 0.5)",
                            backdropFilter: "blur(16px)",
                        }}
                    >
                        {/* User info */}
                        <div
                            className="px-4 py-3"
                            style={{ borderBottom: "1px solid var(--color-border)" }}
                        >
                            <p
                                className="text-sm font-medium truncate"
                                style={{
                                    color: "var(--color-text-primary)",
                                    fontFamily: "Space Grotesk, sans-serif",
                                }}
                            >
                                {user.name || "Alchemist"}
                            </p>
                            <p
                                className="text-xs truncate mt-0.5"
                                style={{ color: "var(--color-text-muted)" }}
                            >
                                {user.email}
                            </p>
                            <div className="flex items-center gap-1.5 mt-2">
                                <Zap size={12} style={{ color: "var(--color-gold)" }} />
                                <span
                                    className="text-xs font-mono"
                                    style={{ color: "var(--color-gold)" }}
                                >
                                    {xp} XP
                                </span>
                            </div>
                        </div>

                        {/* Sign out */}
                        <button
                            onClick={handleSignOut}
                            className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm transition-colors duration-150 hover:bg-(--color-surface-hover)"
                            style={{ color: "var(--color-error)" }}
                        >
                            <LogOut size={14} />
                            Sign Out
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
