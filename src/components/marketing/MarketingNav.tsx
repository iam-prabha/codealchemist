"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useScroll, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import * as Sheet from "@radix-ui/react-dialog";
import { useSession } from "@/lib/auth-client";

const navItems = [
    { label: "Features", href: "#features" },
    { label: "How It Works", href: "#how-it-works" },
    { label: "Languages", href: "#languages" },
    { label: "FAQ", href: "#faq" },
];

export default function MarketingNav() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const { scrollY } = useScroll();
    const { data: session } = useSession();

    useEffect(() => {
        const unsubscribe = scrollY.on("change", (latest) => {
            setIsScrolled(latest > 60);
        });
        return unsubscribe;
    }, [scrollY]);

    return (
        <motion.header
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
                isScrolled ? "bg-surface/80 backdrop-blur-md border-b border-border/50" : "bg-transparent"
            }`}
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.6 }}
        >
            <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                        <span className="text-2xl">⚗️</span>
                        <span className="font-bold text-gold text-lg">CodeAlchemist</span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-8">
                        {navItems.map((item) => (
                            <a
                                key={item.label}
                                href={item.href}
                                className="text-text-secondary hover:text-text-primary transition-colors"
                            >
                                {item.label}
                            </a>
                        ))}
                    </div>

                    {/* Desktop Actions */}
                    <div className="hidden md:flex items-center gap-4">
                        {session ? (
                            <Link
                                href="/dashboard"
                                className="px-4 py-2 bg-gold hover:bg-gold/90 text-text-inverse rounded-full font-medium transition-colors"
                            >
                                Go to Dashboard →
                            </Link>
                        ) : (
                            <>
                                <Link
                                    href="/sign-in"
                                    className="text-text-secondary hover:text-text-primary transition-colors"
                                >
                                    Sign In
                                </Link>
                                <Link
                                    href="/sign-up"
                                    className="px-4 py-2 bg-gold hover:bg-gold/90 text-text-inverse rounded-full font-medium transition-colors"
                                >
                                    Get Started
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setIsMobileMenuOpen(true)}
                        className="md:hidden p-2 hover:bg-panel rounded-lg transition-colors"
                        aria-label="Open menu"
                    >
                        <Menu className="w-5 h-5" />
                    </button>
                </div>
            </nav>

            {/* Mobile Menu */}
            <Sheet.Root open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                <Sheet.Portal>
                    <Sheet.Overlay className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 md:hidden" />
                    <Sheet.Content className="fixed top-0 right-0 h-full w-80 bg-surface border-l border-border z-50 md:hidden">
                        <div className="flex flex-col h-full">
                            {/* Header */}
                            <div className="flex items-center justify-between p-6 border-b border-border">
                                <div className="flex items-center gap-2">
                                    <span className="text-xl">⚗️</span>
                                    <span className="font-bold text-gold">CodeAlchemist</span>
                                </div>
                                <Sheet.Close asChild>
                                    <button
                                        className="p-2 hover:bg-panel rounded-lg transition-colors"
                                        aria-label="Close menu"
                                    >
                                        <X className="w-5 h-5" />
                                    </button>
                                </Sheet.Close>
                            </div>

                            {/* Navigation */}
                            <div className="flex-1 px-6 py-8">
                                <nav className="space-y-4">
                                    {navItems.map((item) => (
                                        <a
                                            key={item.label}
                                            href={item.href}
                                            onClick={() => setIsMobileMenuOpen(false)}
                                            className="block text-lg text-text-secondary hover:text-text-primary transition-colors"
                                        >
                                            {item.label}
                                        </a>
                                    ))}
                                </nav>
                            </div>

                            {/* Actions */}
                            <div className="px-6 pb-8 space-y-4">
                                {session ? (
                                    <Link
                                        href="/dashboard"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className="block w-full text-center py-3 bg-gold hover:bg-gold/90 text-text-inverse rounded-lg font-medium transition-colors"
                                    >
                                        Go to Dashboard →
                                    </Link>
                                ) : (
                                    <>
                                        <Link
                                            href="/sign-in"
                                            onClick={() => setIsMobileMenuOpen(false)}
                                            className="block w-full text-center py-3 text-text-secondary hover:text-text-primary transition-colors"
                                        >
                                            Sign In
                                        </Link>
                                        <Link
                                            href="/sign-up"
                                            onClick={() => setIsMobileMenuOpen(false)}
                                            className="block w-full text-center py-3 bg-gold hover:bg-gold/90 text-text-inverse rounded-lg font-medium transition-colors"
                                        >
                                            Get Started
                                        </Link>
                                    </>
                                )}
                            </div>
                        </div>
                    </Sheet.Content>
                </Sheet.Portal>
            </Sheet.Root>
        </motion.header>
    );
}