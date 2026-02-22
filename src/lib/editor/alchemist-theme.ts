/* ============================================================
   CodeAlchemist — Custom Monaco Editor Theme
   Deep purple + gold + neon accents to match alchemical aesthetic
   ============================================================ */

import type { editor } from "monaco-editor";

export const ALCHEMIST_THEME: editor.IStandaloneThemeData = {
    base: "vs-dark",
    inherit: true,
    rules: [
        // ── General ──
        { token: "", foreground: "e8e0f0", background: "110b20" },
        { token: "comment", foreground: "6b5f82", fontStyle: "italic" },
        { token: "comment.doc", foreground: "7d6fa0", fontStyle: "italic" },

        // ── Keywords ──
        { token: "keyword", foreground: "ff79c6", fontStyle: "bold" },
        { token: "keyword.control", foreground: "ff79c6" },
        { token: "keyword.operator", foreground: "ff79c6" },

        // ── Strings ──
        { token: "string", foreground: "f5c542" },
        { token: "string.escape", foreground: "ffd966" },

        // ── Numbers ──
        { token: "number", foreground: "bd93f9" },
        { token: "number.float", foreground: "bd93f9" },

        // ── Types ──
        { token: "type", foreground: "00f0ff" },
        { token: "type.identifier", foreground: "00f0ff" },

        // ── Functions ──
        { token: "function", foreground: "50fa7b" },
        { token: "function.declaration", foreground: "50fa7b", fontStyle: "bold" },

        // ── Variables ──
        { token: "variable", foreground: "e8e0f0" },
        { token: "variable.predefined", foreground: "bd93f9" },

        // ── Operators ──
        { token: "operator", foreground: "ff79c6" },
        { token: "delimiter", foreground: "a89bc2" },
        { token: "delimiter.bracket", foreground: "a89bc2" },

        // ── Decorators / Attributes ──
        { token: "annotation", foreground: "ffd966" },
        { token: "tag", foreground: "ff79c6" },
        { token: "attribute.name", foreground: "50fa7b" },
        { token: "attribute.value", foreground: "f5c542" },

        // ── Constants ──
        { token: "constant", foreground: "bd93f9" },

        // ── Rust-specific ──
        { token: "keyword.unsafe", foreground: "ff3b5c", fontStyle: "bold" },
        { token: "lifetime", foreground: "ffa726" },
    ],
    colors: {
        "editor.background": "#110b20",
        "editor.foreground": "#e8e0f0",
        "editorCursor.foreground": "#f5c542",
        "editor.lineHighlightBackground": "#1a103033",
        "editor.selectionBackground": "#f5c54233",
        "editor.inactiveSelectionBackground": "#f5c54222",
        "editorLineNumber.foreground": "#6b5f82",
        "editorLineNumber.activeForeground": "#f5c542",
        "editorIndentGuide.background": "#2d205533",
        "editorIndentGuide.activeBackground": "#f5c54244",
        "editorBracketMatch.background": "#f5c54233",
        "editorBracketMatch.border": "#f5c54266",
        "editorGutter.background": "#0a0612",
        "editorWidget.background": "#1a1030",
        "editorWidget.border": "#2d2055",
        "editorSuggestWidget.background": "#1a1030",
        "editorSuggestWidget.border": "#2d2055",
        "editorSuggestWidget.selectedBackground": "#2d2055",
        "editorSuggestWidget.highlightForeground": "#f5c542",
        "minimap.background": "#0a0612",
        "scrollbar.shadow": "#00000044",
        "scrollbarSlider.background": "#2d205566",
        "scrollbarSlider.hoverBackground": "#38286888",
        "scrollbarSlider.activeBackground": "#f5c54244",
    },
};

export const THEME_NAME = "codealchemist-dark";
