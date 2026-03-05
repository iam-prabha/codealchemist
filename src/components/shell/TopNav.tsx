"use client";

import * as Tabs from "@radix-ui/react-tabs";
import * as ToggleGroup from "@radix-ui/react-toggle-group";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { Menu, User, Settings, Zap, ChevronDown } from "lucide-react";
import { useEditorStore } from "@/store/useEditorStore";
import { useUIStore } from "@/store/useUIStore";
import { motion } from "framer-motion";
import type { Language, PracticeMode } from "@/types";

const languages: { id: Language; label: string; icon: string; color: string }[] = [
    { id: "python", label: "Python", icon: "🐍", color: "#3776ab" },
    { id: "rust", label: "Rust", icon: "🦀", color: "#ce422b" },
    { id: "typescript", label: "TypeScript", icon: "🔷", color: "#3178c6" },
];

const modes: { id: PracticeMode; label: string }[] = [
    { id: "guided", label: "Guided" },
    { id: "challenge", label: "Challenge" },
    { id: "playground", label: "Playground" },
];

export default function TopNav() {
    const { activeLanguage, activeMode, setLanguage, setMode } = useEditorStore();
    const { toggleSidebar, sidebarOpen, setSidebarOpen } = useUIStore();

    return (
        <div className="flex items-center justify-between h-full px-4">
            {/* Left: Menu button + Logo */}
            <div className="flex items-center gap-3">
                <button
                    onClick={() => {
                        if (window.innerWidth < 1024) {
                            setSidebarOpen(!sidebarOpen);
                        } else {
                            toggleSidebar();
                        }
                    }}
                    className="p-2 hover:bg-panel rounded-lg transition-colors lg:hidden"
                    aria-label="Toggle menu"
                >
                    <Menu className="w-5 h-5" />
                </button>
                <span className="text-gold font-bold hidden sm:block">⚗️ CodeAlchemist</span>
            </div>

            {/* Center: Language Tabs */}
            <Tabs.Root
                value={activeLanguage}
                onValueChange={(value) => setLanguage(value as Language)}
                className="flex items-center"
            >
                <Tabs.List className="flex items-center bg-panel rounded-full p-1 gap-1">
                    {languages.map((lang) => (
                        <Tabs.Trigger
                            key={lang.id}
                            value={lang.id}
                            className="flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-all data-[state=active]:bg-surface"
                        >
                            <span
                                className="w-2 h-2 rounded-full"
                                style={{ backgroundColor: lang.color }}
                            />
                            <span className="hidden sm:inline">{lang.icon} {lang.label}</span>
                            <span className="sm:hidden">{lang.icon}</span>
                        </Tabs.Trigger>
                    ))}
                </Tabs.List>
            </Tabs.Root>

            {/* Right: Mode Switcher + Actions */}
            <div className="flex items-center gap-3">
                {/* Mode Switcher - hidden on mobile */}
                <ToggleGroup.Root
                    type="single"
                    value={activeMode}
                    onValueChange={(value) => value && setMode(value as PracticeMode)}
                    className="hidden md:flex items-center bg-panel rounded-lg p-1"
                >
                    {modes.map((mode) => (
                        <ToggleGroup.Item
                            key={mode.id}
                            value={mode.id}
                            className="px-3 py-1 text-sm rounded-md transition-colors data-[state=on]:bg-surface data-[state=on]:text-gold text-text-muted hover:text-text-primary"
                        >
                            {mode.label}
                        </ToggleGroup.Item>
                    ))}
                </ToggleGroup.Root>

                {/* Reveal Button */}
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="hidden sm:flex items-center gap-2 px-4 py-2 bg-gold/20 hover:bg-gold/30 text-gold rounded-full text-sm font-medium transition-colors"
                >
                    Reveal
                </motion.button>

                {/* XP Badge */}
                <div className="hidden sm:flex items-center gap-1 px-3 py-1.5 bg-panel rounded-full">
                    <Zap className="w-4 h-4 text-gold" />
                    <span className="text-sm font-bold text-gold">180</span>
                </div>

                {/* User Menu */}
                <DropdownMenu.Root>
                    <DropdownMenu.Trigger asChild>
                        <button
                            className="flex items-center gap-2 p-1 hover:bg-panel rounded-full transition-colors"
                            aria-label="User menu"
                        >
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gold to-purple-500 flex items-center justify-center">
                                <User className="w-4 h-4 text-white" />
                            </div>
                            <ChevronDown className="w-4 h-4 text-text-muted hidden sm:block" />
                        </button>
                    </DropdownMenu.Trigger>

                    <DropdownMenu.Portal>
                        <DropdownMenu.Content
                            className="min-w-[200px] bg-surface border border-border rounded-xl p-2 shadow-xl z-50"
                            sideOffset={8}
                        >
                            <DropdownMenu.Item className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-panel cursor-pointer outline-none">
                                <User className="w-4 h-4" />
                                <span>Profile</span>
                            </DropdownMenu.Item>
                            <DropdownMenu.Item className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-panel cursor-pointer outline-none">
                                <Settings className="w-4 h-4" />
                                <span>Settings</span>
                            </DropdownMenu.Item>
                            <DropdownMenu.Separator className="h-px bg-border my-2" />
                            <DropdownMenu.Item className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-panel cursor-pointer outline-none text-red-400">
                                <span>Sign Out</span>
                            </DropdownMenu.Item>
                        </DropdownMenu.Content>
                    </DropdownMenu.Portal>
                </DropdownMenu.Root>
            </div>
        </div>
    );
}
