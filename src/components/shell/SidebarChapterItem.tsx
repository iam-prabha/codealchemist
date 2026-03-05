"use client";

import { motion } from "framer-motion";
import type { Chapter } from "@/types";

interface SidebarChapterItemProps {
    chapter: Chapter;
    isActive: boolean;
    onClick: () => void;
    expanded: boolean;
}

export default function SidebarChapterItem({
    chapter,
    isActive,
    onClick,
    expanded,
}: SidebarChapterItemProps) {
    return (
        <motion.button
            onClick={onClick}
            className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors relative ${
                isActive
                    ? "bg-panel text-text-primary"
                    : "text-text-muted hover:bg-panel/50 hover:text-text-primary"
            }`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            aria-label={`Chapter ${chapter.number}: ${chapter.title}`}
        >
            {/* Active indicator */}
            {isActive && (
                <motion.div
                    layoutId="activeChapter"
                    className="absolute left-0 top-0 bottom-0 w-1 bg-gold rounded-r"
                    initial={false}
                />
            )}

            {/* Chapter number */}
            <div
                className={`shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-sm font-mono ${
                    isActive
                        ? "bg-gold/20 text-gold"
                        : "bg-panel text-text-muted"
                }`}
            >
                {chapter.number}
            </div>

            {/* Title and progress */}
            {expanded && (
                <div className="flex-1 min-w-0">
                    <div className="font-medium truncate text-sm">{chapter.title}</div>
                    <div className="flex items-center gap-2 mt-1">
                        <div className="flex-1 h-1 bg-border rounded-full overflow-hidden">
                            <motion.div
                                className="h-full bg-gold"
                                initial={{ width: 0 }}
                                animate={{ width: `${chapter.progress}%` }}
                                transition={{ duration: 0.3 }}
                            />
                        </div>
                        <span className="text-xs text-text-muted">{chapter.progress}%</span>
                    </div>
                </div>
            )}
        </motion.button>
    );
}
