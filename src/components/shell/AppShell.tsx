"use client";

import { useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import { useUIStore } from "@/store/useUIStore";
import Sidebar from "./Sidebar";
import TopNav from "./TopNav";

interface AppShellProps {
    children: React.ReactNode;
}

export default function AppShell({ children }: AppShellProps) {
    const { sidebarOpen, sidebarExpanded } = useUIStore();

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 1280) {
                useUIStore.getState().setSidebarOpen(true);
            } else if (window.innerWidth < 768) {
                useUIStore.getState().setSidebarOpen(false);
            }
        };

        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const sidebarWidth = sidebarExpanded ? 220 : 56;

    return (
        <div className="min-h-screen bg-background text-text-primary overflow-hidden">
            {/* Mobile drawer sidebar */}
            <AnimatePresence>
                {sidebarOpen && (
                    <div className="lg:hidden">
                        <Sidebar isMobile />
                    </div>
                )}
            </AnimatePresence>

            {/* Desktop sidebar */}
            <AnimatePresence>
                {sidebarOpen && (
                    <aside
                        className="hidden lg:block fixed left-0 top-0 h-full z-40 transition-all duration-300"
                        style={{ width: sidebarWidth }}
                    >
                        <Sidebar />
                    </aside>
                )}
            </AnimatePresence>

            {/* Top Navigation */}
            <header className="fixed top-0 left-0 right-0 z-30 h-14 bg-surface border-b border-border">
                <TopNav />
            </header>

            {/* Main content area */}
            <main
                className="pt-14 min-h-screen transition-all duration-300"
            >
                <div className="h-[calc(100vh-3.5rem)]">
                    {children}
                </div>
            </main>
        </div>
    );
}
