"use client";

/**
 * EditorToolbar — Run button, debug controls, exercise navigation
 */

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import {
  Square,
  ArrowDownToLine,
  ArrowUpFromLine,
  Bug,
  ChevronLeft,
  ChevronRight,
  Wand2,
  Timer,
} from "lucide-react";
import { useEditorStore, useExecutionStore } from "@/stores";
import { getLayer } from "@/data/curriculum";
import { cn } from "@/lib/utils";

interface EditorToolbarProps {
  onExecute: () => void;
}

export default function EditorToolbar({ onExecute }: EditorToolbarProps) {
  const {
    activeLayerId,
    activeExerciseIndex,
    setActiveExerciseIndex,
    practiceMode,
    challengeStartTime,
  } = useEditorStore();
  const {
    isRunning,
    debuggerActive,
    toggleDebugger,
    stepForward,
    stepBackward,
    currentStep,
    totalSteps,
  } = useExecutionStore();

  const layer = getLayer(activeLayerId);
  const totalExercises = layer?.exercises.length || 0;
  const currentExercise = layer?.exercises[activeExerciseIndex];

  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  useEffect(() => {
    if (practiceMode === "challenge" && challengeStartTime) {
      setElapsedSeconds(Math.floor((Date.now() - challengeStartTime) / 1000));

      const interval = setInterval(() => {
        setElapsedSeconds(Math.floor((Date.now() - challengeStartTime) / 1000));
      }, 1000);
      return () => clearInterval(interval);
    } else {
      setElapsedSeconds(0);
    }
  }, [practiceMode, challengeStartTime]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <div
      className="flex items-center justify-between px-4 py-2 shrink-0"
      style={{
        background: "var(--color-deep)",
        borderBottom: "1px solid var(--color-border)",
      }}
    >
      {/* ── Left: Exercise navigation ── */}
      <div className="flex items-center gap-2">
        {practiceMode !== "playground" ? (
          <>
            <button
              onClick={() =>
                setActiveExerciseIndex(Math.max(0, activeExerciseIndex - 1))
              }
              disabled={activeExerciseIndex === 0}
              className="p-1.5 rounded-md hover:bg-(--color-surface-hover) disabled:opacity-30 transition-colors"
              aria-label="Previous exercise"
            >
              <ChevronLeft size={14} />
            </button>

            <span
              className="text-xs font-medium"
              style={{ color: "var(--color-text-secondary)" }}
            >
              {currentExercise?.title || "Exercise"}{" "}
              <span style={{ color: "var(--color-text-muted)" }}>
                ({activeExerciseIndex + 1}/{totalExercises})
              </span>
            </span>

            <button
              onClick={() =>
                setActiveExerciseIndex(
                  Math.min(totalExercises - 1, activeExerciseIndex + 1),
                )
              }
              disabled={activeExerciseIndex >= totalExercises - 1}
              className="p-1.5 rounded-md hover:bg-(--color-surface-hover) disabled:opacity-30 transition-colors"
              aria-label="Next exercise"
            >
              <ChevronRight size={14} />
            </button>

            {/* Difficulty dots */}
            {currentExercise && (
              <div className="flex items-center gap-0.5 ml-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div
                    key={i}
                    className="w-1.5 h-1.5 rounded-full"
                    style={{
                      background:
                        i < currentExercise.difficulty
                          ? "var(--color-gold)"
                          : "var(--color-surface-active)",
                    }}
                  />
                ))}
              </div>
            )}
          </>
        ) : (
          <span
            className="text-xs font-medium"
            style={{ color: "var(--color-text-secondary)" }}
          >
            Playground
          </span>
        )}
      </div>

      {/* ── Center: Run Button ── */}
      <div className="flex items-center gap-2">
        {/* Debug toggle */}
        <button
          onClick={toggleDebugger}
          className={cn(
            "p-1.5 rounded-md transition-colors",
            debuggerActive
              ? "bg-neon-cyan-glow text-neon-cyan"
              : "hover:bg-neon-cyan-glow text-neon-cyan",
          )}
          aria-label="Toggle debugger"
          title="Toggle Debugger"
        >
          <Bug size={14} />
        </button>

        {/* Debug step controls */}
        {debuggerActive && (
          <div className="flex items-center gap-1">
            <button
              onClick={stepBackward}
              disabled={currentStep <= 0}
              className="p-1.5 rounded-md hover:bg-neon-cyan-glow text-neon-cyan disabled:opacity-30 transition-colors"
              title="Step Backward"
            >
              <ArrowUpFromLine size={13} />
            </button>
            <span
              className="text-[10px] font-mono"
              style={{ color: "var(--color-text-muted)" }}
            >
              {currentStep + 1}/{totalSteps || "—"}
            </span>
            <button
              onClick={stepForward}
              disabled={currentStep >= totalSteps - 1}
              className="p-1.5 rounded-md hover:bg-neon-cyan-glow text-neon-cyan disabled:opacity-30 transition-colors"
              title="Step Forward (F10)"
            >
              <ArrowDownToLine size={13} />
            </button>
          </div>
        )}

        {/* Challenge Timer */}
        {practiceMode === "challenge" && (
          <div
            className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-surface"
            style={{ border: "1px solid var(--color-border)" }}
          >
            <Timer size={12} style={{ color: "var(--color-neon-cyan)" }} />
            <span
              className="text-xs font-mono font-medium"
              style={{
                color:
                  elapsedSeconds < 60
                    ? "var(--color-success)"
                    : "var(--color-warning)",
              }}
            >
              {formatTime(elapsedSeconds)}
            </span>
          </div>
        )}

        {/* ── Transmute & Run button ── */}
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={onExecute}
          disabled={isRunning}
          className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all",
            isRunning
              ? "opacity-70 cursor-not-allowed"
              : "glow-gold-sm hover:glow-gold",
          )}
          style={{
            background:
              "linear-gradient(135deg, var(--color-gold-dim), var(--color-gold))",
            color: "var(--color-text-inverse)",
          }}
        >
          {isRunning ? (
            <>
              <Square size={14} /> Running...
            </>
          ) : (
            <>
              <Wand2 size={14} /> Transmute & Run
            </>
          )}
        </motion.button>
      </div>

      {/* ── Right: Hint ── */}
      <div className="flex items-center gap-2">
        {practiceMode === "guided" &&
          currentExercise &&
          currentExercise.hints.length > 0 && (
            <button
              className="text-xs px-2 py-1 rounded-md hover:bg-surface-hover transition-colors"
              style={{ color: "var(--color-text-muted)" }}
              title="Show hint"
            >
              💡 Hint
            </button>
          )}
      </div>
    </div>
  );
}
