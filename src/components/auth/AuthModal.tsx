"use client";

/**
 * AuthModal — Full-screen authentication modal with Sign In / Sign Up tabs
 * Alchemical theme: glass morphism, gold accents, glow effects
 */

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Mail, Lock, User, Github, Loader2 } from "lucide-react";
import { signIn, signUp } from "@/lib/auth-client";
import { cn } from "@/lib/utils";

type AuthTab = "signin" | "signup";

interface AuthModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
    const [activeTab, setActiveTab] = useState<AuthTab>("signin");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const resetForm = useCallback(() => {
        setEmail("");
        setPassword("");
        setName("");
        setError(null);
        setSuccess(null);
    }, []);

    const handleTabSwitch = (tab: AuthTab) => {
        setActiveTab(tab);
        resetForm();
    };

    const handleEmailAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);
        setIsLoading(true);

        try {
            if (activeTab === "signup") {
                const result = await signUp.email({
                    email,
                    password,
                    name: name || email.split("@")[0],
                });
                if (result.error) {
                    setError(result.error.message || "Sign up failed. Please try again.");
                } else {
                    setSuccess("Account created! You are now signed in.");
                    setTimeout(onClose, 1500);
                }
            } else {
                const result = await signIn.email({
                    email,
                    password,
                });
                if (result.error) {
                    setError(result.error.message || "Invalid email or password.");
                } else {
                    setSuccess("Welcome back!");
                    setTimeout(onClose, 1000);
                }
            }
        } catch {
            setError("An unexpected error occurred. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleOAuth = async (provider: "google" | "github") => {
        setError(null);
        try {
            await signIn.social({
                provider,
                callbackURL: "/",
            });
        } catch {
            setError(`Failed to connect with ${provider}. Please try again.`);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="fixed inset-0 z-50 flex items-center justify-center p-4"
                    style={{ background: "rgba(10, 6, 18, 0.85)", backdropFilter: "blur(12px)" }}
                    onClick={(e) => e.target === e.currentTarget && onClose()}
                >
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        transition={{ duration: 0.3, ease: "easeOut" }}
                        className="relative w-full max-w-md rounded-2xl overflow-hidden"
                        style={{
                            background: "linear-gradient(135deg, rgba(26, 16, 48, 0.95), rgba(34, 24, 66, 0.95))",
                            border: "1px solid var(--color-border)",
                            boxShadow: "0 0 60px rgba(245, 197, 66, 0.1), 0 25px 50px rgba(0, 0, 0, 0.5)",
                        }}
                    >
                        {/* Glow accent at top */}
                        <div
                            className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-1 rounded-b-full"
                            style={{
                                background: "linear-gradient(90deg, transparent, var(--color-gold), transparent)",
                                boxShadow: "0 0 20px var(--color-gold-glow)",
                            }}
                        />

                        {/* Close button */}
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 p-1.5 rounded-lg transition-colors z-10"
                            style={{ color: "var(--color-text-muted)" }}
                            aria-label="Close"
                        >
                            <X size={18} />
                        </button>

                        {/* Header */}
                        <div className="pt-8 pb-4 px-8 text-center">
                            <h2
                                className="text-2xl font-bold mb-1"
                                style={{
                                    fontFamily: "Space Grotesk, sans-serif",
                                    color: "var(--color-text-primary)",
                                }}
                            >
                                {activeTab === "signin" ? "Welcome Back" : "Begin Your Journey"}
                            </h2>
                            <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>
                                {activeTab === "signin"
                                    ? "Sign in to continue your transmutation"
                                    : "Create an account to start mastering code"}
                            </p>
                        </div>

                        {/* Tabs */}
                        <div className="flex mx-8 mb-6 rounded-lg p-0.5" style={{ background: "var(--color-surface)" }}>
                            {(["signin", "signup"] as const).map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => handleTabSwitch(tab)}
                                    className={cn(
                                        "flex-1 py-2 text-sm font-medium rounded-md transition-all duration-200",
                                        activeTab === tab
                                            ? "text-[var(--color-gold)]"
                                            : "text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)]"
                                    )}
                                    style={
                                        activeTab === tab
                                            ? { background: "var(--color-surface-active)" }
                                            : undefined
                                    }
                                >
                                    {tab === "signin" ? "Sign In" : "Sign Up"}
                                </button>
                            ))}
                        </div>

                        {/* OAuth Providers */}
                        <div className="px-8 space-y-3">
                            <button
                                onClick={() => handleOAuth("google")}
                                className="w-full flex items-center justify-center gap-2.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 glass glass-hover"
                                style={{ color: "var(--color-text-primary)" }}
                            >
                                <svg width="18" height="18" viewBox="0 0 24 24">
                                    <path
                                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                                        fill="#4285F4"
                                    />
                                    <path
                                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                        fill="#34A853"
                                    />
                                    <path
                                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                        fill="#FBBC05"
                                    />
                                    <path
                                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                        fill="#EA4335"
                                    />
                                </svg>
                                Continue with Google
                            </button>

                            <button
                                onClick={() => handleOAuth("github")}
                                className="w-full flex items-center justify-center gap-2.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 glass glass-hover"
                                style={{ color: "var(--color-text-primary)" }}
                            >
                                <Github size={18} />
                                Continue with GitHub
                            </button>
                        </div>

                        {/* Divider */}
                        <div className="flex items-center gap-3 px-8 my-5">
                            <div className="flex-1 h-px" style={{ background: "var(--color-border)" }} />
                            <span className="text-xs" style={{ color: "var(--color-text-muted)" }}>
                                or
                            </span>
                            <div className="flex-1 h-px" style={{ background: "var(--color-border)" }} />
                        </div>

                        {/* Email/Password Form */}
                        <form onSubmit={handleEmailAuth} className="px-8 pb-8 space-y-4">
                            {activeTab === "signup" && (
                                <div className="relative">
                                    <User
                                        size={16}
                                        className="absolute left-3 top-1/2 -translate-y-1/2"
                                        style={{ color: "var(--color-text-muted)" }}
                                    />
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        placeholder="Display name"
                                        className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm outline-none transition-all duration-200"
                                        style={{
                                            background: "var(--color-surface)",
                                            border: "1px solid var(--color-border)",
                                            color: "var(--color-text-primary)",
                                        }}
                                    />
                                </div>
                            )}

                            <div className="relative">
                                <Mail
                                    size={16}
                                    className="absolute left-3 top-1/2 -translate-y-1/2"
                                    style={{ color: "var(--color-text-muted)" }}
                                />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Email address"
                                    required
                                    className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm outline-none transition-all duration-200"
                                    style={{
                                        background: "var(--color-surface)",
                                        border: "1px solid var(--color-border)",
                                        color: "var(--color-text-primary)",
                                    }}
                                />
                            </div>

                            <div className="relative">
                                <Lock
                                    size={16}
                                    className="absolute left-3 top-1/2 -translate-y-1/2"
                                    style={{ color: "var(--color-text-muted)" }}
                                />
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Password"
                                    required
                                    minLength={8}
                                    className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm outline-none transition-all duration-200"
                                    style={{
                                        background: "var(--color-surface)",
                                        border: "1px solid var(--color-border)",
                                        color: "var(--color-text-primary)",
                                    }}
                                />
                            </div>

                            {/* Error / Success messages */}
                            <AnimatePresence mode="wait">
                                {error && (
                                    <motion.p
                                        initial={{ opacity: 0, y: -4 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -4 }}
                                        className="text-xs px-3 py-2 rounded-lg"
                                        style={{
                                            color: "var(--color-error)",
                                            background: "rgba(255, 59, 92, 0.1)",
                                            border: "1px solid rgba(255, 59, 92, 0.2)",
                                        }}
                                    >
                                        {error}
                                    </motion.p>
                                )}
                                {success && (
                                    <motion.p
                                        initial={{ opacity: 0, y: -4 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -4 }}
                                        className="text-xs px-3 py-2 rounded-lg"
                                        style={{
                                            color: "var(--color-success)",
                                            background: "rgba(57, 255, 20, 0.1)",
                                            border: "1px solid rgba(57, 255, 20, 0.2)",
                                        }}
                                    >
                                        {success}
                                    </motion.p>
                                )}
                            </AnimatePresence>

                            {/* Submit button */}
                            <motion.button
                                whileHover={{ scale: 1.01 }}
                                whileTap={{ scale: 0.99 }}
                                type="submit"
                                disabled={isLoading}
                                className="w-full py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 flex items-center justify-center gap-2"
                                style={{
                                    background: isLoading
                                        ? "var(--color-gold-dim)"
                                        : "linear-gradient(135deg, var(--color-gold), var(--color-gold-bright))",
                                    color: "var(--color-text-inverse)",
                                    boxShadow: isLoading
                                        ? "none"
                                        : "0 0 20px var(--color-gold-glow)",
                                }}
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 size={16} className="animate-spin" />
                                        {activeTab === "signin" ? "Signing in..." : "Creating account..."}
                                    </>
                                ) : (
                                    activeTab === "signin" ? "Sign In" : "Create Account"
                                )}
                            </motion.button>
                        </form>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
