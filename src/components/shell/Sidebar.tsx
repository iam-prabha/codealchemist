"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { useEditorStore } from "@/store/useEditorStore";
import { useUIStore } from "@/store/useUIStore";
import { sampleChapters } from "@/lib/sampleData";
import XPBadge from "./XPBadge";
import SidebarChapterItem from "./SidebarChapterItem";

interface SidebarProps {
    isMobile?: boolean;
}

export default function Sidebar({ isMobile }: SidebarProps) {
    const { activeChapterId, setChapter } = useEditorStore();
    const { sidebarExpanded, toggleSidebarExpanded, setSidebarOpen, sidebarOpen } = useUIStore();

    const sidebarContent = (
        <div className="flex flex-col h-full bg-surface">
            {/* Logo */}
            <div className="flex items-center h-14 px-4 border-b border-border shrink-0">
                <motion.div
                    className="flex items-center gap-2 overflow-hidden"
                    animate={{ width: sidebarExpanded ? "auto" : "auto" }}
                >
                    <span className="text-xl">⚗️</span>
                    {sidebarExpanded && (
                        <motion.span
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="font-bold text-gold whitespace-nowrap"
                        >
                            CodeAlchemist
                        </motion.span>
                    )}
                </motion.div>
            </div>

            {/* Chapter List */}
            <div className="flex-1 overflow-y-auto custom-scrollbar py-2">
                {sampleChapters.map((chapter) => (
                    <SidebarChapterItem
                        key={chapter.id}
                        chapter={chapter}
                        isActive={activeChapterId === chapter.id}
                        onClick={() => {
                            setChapter(chapter.id);
                            if (isMobile) {
                                setSidebarOpen(false);
                            }
                        }}
                        expanded={sidebarExpanded}
                    />
                ))}
            </div>

            {/* Bottom XP Badge */}
            <div className="shrink-0 border-t border-border">
                <XPBadge />
            </div>
        </div>
    );

    if (isMobile) {
        return (
            <AnimatePresence>
                {sidebarOpen && (
                    <>
                        {/* Overlay */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 lg:hidden"
                            onClick={() => setSidebarOpen(false)}
                        />
                        {/* Drawer */}
                        <motion.div
                            initial={{ y: "100%" }}
                            animate={{ y: 0 }}
                            exit={{ y: "100%" }}
                            transition={{ type: "spring", damping: 25, stiffness: 300 }}
                            className="fixed bottom-0 left-0 right-0 bg-surface border-t border-border rounded-t-2xl z-50 max-h-[80vh] lg:hidden"
                        >
                            <div className="flex justify-between items-center p-4 border-b border-border">
                                <div className="text-lg font-bold text-gold">
                                    ⚗️ CodeAlchemist
                                </div>
                                <button
                                    onClick={() => setSidebarOpen(false)}
                                    className="p-2 hover:bg-panel rounded-lg transition-colors"
                                    aria-label="Close menu"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                            <div className="overflow-y-auto max-h-[calc(80vh-80px)]">
                                <div className="py-2">
                                    {sampleChapters.map((chapter) => (
                                        <SidebarChapterItem
                                            key={chapter.id}
                                            chapter={chapter}
                                            isActive={activeChapterId === chapter.id}
                                            onClick={() => {
                                                setChapter(chapter.id);
                                                setSidebarOpen(false);
                                            }}
                                            expanded={true}
                                        />
                                    ))}
                                </div>
                            </div>
                            <div className="border-t border-border p-4">
                                <XPBadge />
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        );
    }

    return (
        <div
            className="h-full bg-surface border-r border-border flex flex-col"
            onMouseEnter={() => {
                if (!sidebarExpanded) {
                    toggleSidebarExpanded();
                }
            }}
            onMouseLeave={() => {
                if (sidebarExpanded && window.innerWidth < 1280) {
                    toggleSidebarExpanded();
                }
            }}
        >
            {sidebarContent}
        </div>
    );
}
