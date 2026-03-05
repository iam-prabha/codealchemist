"use client";

import { useCallback } from "react";
import AppShell from "@/components/shell/AppShell";
import InstructionsPanel from "@/components/panels/InstructionsPanel";
import EditorPanel from "@/components/editor/EditorPanel";
import TerminalPanel from "@/components/editor/TerminalPanel";
import TransmuteButton from "@/components/editor/TransmuteButton";
import { useEditorStore } from "@/store/useEditorStore";
import { useUIStore } from "@/store/useUIStore";
import { cn } from "@/lib/utils";

export default function CodeAlchemistPage() {
    const { activeChapterId, activeLanguage } = useEditorStore();

    const handleTransmute = useCallback(() => {
        // TODO: Implement code execution
        console.log("Transmuting code...", { activeChapterId, activeLanguage });
    }, [activeChapterId, activeLanguage]);

    return (
        <AppShell>
            <div className="h-full grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-0">
                {/* Instructions Panel - Desktop: left column, Mobile: full width */}
                <div className="h-full lg:border-r lg:border-border">
                    <InstructionsPanel />
                </div>

                {/* Editor Panel - Desktop: right column, Mobile: full width */}
                <div className="h-full flex flex-col">
                    {/* Editor */}
                    <div className="flex-1 min-h-0">
                        <EditorPanel onExecute={handleTransmute} />
                    </div>

                    {/* Terminal */}
                    <div className="shrink-0">
                        <TerminalPanel />
                    </div>

                    {/* Mobile Transmute Button - Fixed at bottom */}
                    <div className="lg:hidden fixed bottom-4 left-4 right-4 z-50">
                        <TransmuteButton
                            onClick={handleTransmute}
                            isLoading={false}
                        />
                    </div>

                    {/* Desktop Transmute Button - Bottom of terminal */}
                    <div className="hidden lg:block px-4 py-3 bg-surface border-t border-border">
                        <div className="flex items-center justify-between">
                            <span className="text-xs text-text-muted">
                                Press [Ctrl+Enter] to transmute & run
                            </span>
                            <div className="w-48">
                                <TransmuteButton
                                    onClick={handleTransmute}
                                    isLoading={false}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppShell>
    );
}
