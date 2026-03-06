"use client";

/**
 * EditorPanel — The Signature Component
 * Three Monaco editors side by 🐍 | Rust side: Python 🦀 | TypeScript 🔷
 * Each with language-colored aura, only the active one glows
 */

import { useEffect, useCallback } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import dynamic from "next/dynamic";
import { useEditorStore, useExecutionStore } from "@/stores";
import type { Language } from "@/types";
import { cn } from "@/lib/utils";

const LANGUAGES: { id: Language; label: string; emoji: string; color: string }[] = [
  { id: "python", label: "Python", emoji: "🐍", color: "var(--color-python)" },
  { id: "rust", label: "Rust", emoji: "🦀", color: "var(--color-rust)" },
  { id: "typescript", label: "TypeScript", emoji: "🔷", color: "var(--color-typescript)" },
];

const CodeEditor = dynamic(
  () => import("@/components/editor/CodeEditor"),
  { 
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center h-full w-full bg-[var(--color-surface)]">
        <div className="flex gap-1">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-2 h-2 rounded-full"
              style={{ background: "var(--color-gold-dim)" }}
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.15 }}
            />
          ))}
        </div>
      </div>
    ),
  }
);

interface EditorPanelProps {
  onExecute: () => void;
}

export default function EditorPanel({ onExecute }: EditorPanelProps) {
  const reduced = useReducedMotion();
  const { activeLanguage, setActiveLanguage, editorCode } = useEditorStore();
  const { isRunning, error } = useExecutionStore();

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
      e.preventDefault();
      onExecute();
    }
  }, [onExecute]);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  return (
    <div
      className="h-full w-full flex flex-col overflow-hidden"
      style={{ background: "var(--color-surface)" }}
    >
      {/* Editor Panels - 3 side by side */}
      <div 
        className="flex-1 grid grid-cols-3 min-h-0"
        style={{ borderBottom: "1px solid var(--color-border-dim)" }}
      >
        {LANGUAGES.map((lang, index) => {
          const isActive = lang.id === activeLanguage;
          const code = editorCode[lang.id] || "";
          
          return (
            <motion.div
              key={lang.id}
              initial={!reduced ? { opacity: 0, scale: 0.98 } : undefined}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ 
                duration: 0.3, 
                delay: reduced ? 0 : index * 0.05 
              }}
              className={cn(
                "relative flex flex-col min-h-0 border-r last:border-r-0",
                isActive && "z-10"
              )}
              style={{
                borderColor: isActive ? lang.color : "var(--color-border-dim)",
              }}
            >
              {/* Language Header */}
              <div
                className={cn(
                  "shrink-0 h-7 flex items-center justify-between px-3 cursor-pointer transition-all duration-200",
                  isActive ? "border-b-2" : "border-b"
                )}
                style={{
                  background: isActive ? `${lang.color}15` : "var(--color-panel)",
                  borderColor: isActive ? lang.color : "var(--color-border-dim)",
                }}
                onClick={() => setActiveLanguage(lang.id)}
              >
                <div className="flex items-center gap-2">
                  <span className="text-xs">{lang.emoji}</span>
                  <span 
                    className="text-xs font-medium"
                    style={{ color: isActive ? lang.color : "var(--color-text-muted)" }}
                  >
                    {lang.label}
                  </span>
                </div>
                {isActive && (
                  <motion.div
                    layoutId="active-indicator"
                    className="w-1.5 h-1.5 rounded-full"
                    style={{ background: lang.color }}
                  />
                )}
              </div>

              {/* Editor - click to focus */}
              <div 
                className={cn(
                  "flex-1 min-h-0 relative transition-all duration-300",
                  isActive && "ring-1 ring-offset-1 ring-offset-[var(--color-surface)]"
                )}
                style={{
                  boxShadow: isActive 
                    ? `0 0 0 1px ${lang.color}, 0 0 20px ${lang.color}25` 
                    : "none",
                }}
                onClick={() => setActiveLanguage(lang.id)}
              >
                {/* Loading state or actual editor */}
                {code || isActive ? (
                  <CodeEditor
                    language={lang.id}
                    onExecute={onExecute}
                    defaultCode={code}
                  />
                ) : (
                  <div 
                    className="flex items-center justify-center h-full w-full"
                    style={{ background: "var(--color-surface)", color: "var(--color-text-muted)" }}
                  >
                    <span className="text-xs">Click to activate</span>
                  </div>
                )}
              </div>

              {/* Success/Error Flash Overlay */}
              <AnimatePresence>
                {isActive && !isRunning && error && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      boxShadow: "inset 0 0 0 2px var(--color-error), inset 0 0 30px rgba(239, 68, 68, 0.15)",
                    }}
                  />
                )}
                {isActive && !isRunning && !error && editorCode[lang.id] && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0 }}
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      boxShadow: "inset 0 0 0 2px var(--color-gold), inset 0 0 30px var(--color-gold-glow)",
                    }}
                  />
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
