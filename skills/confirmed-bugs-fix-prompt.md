═══════════════════════════════════════════════════════════════════
  CODEALCHEMIST — 3 CONFIRMED BUGS FROM SCREENSHOTS
  Fix exactly these issues, nothing else
═══════════════════════════════════════════════════════════════════

CONFIRMED FROM SCREENSHOTS:
  Image 1 (desktop): Instructions panel completely missing.
                     Editor is rendered TWICE side by side.
                     Two sets of Python/Rust/TypeScript tabs visible.
  Image 2 (mobile):  Instructions panel gone entirely.
                     No 📖 toggle visible in bottom bar.
  Image 3 (landing): PricingSection still rendered on landing page.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
BUG 1 — DESKTOP: Editor rendered twice, Instructions missing
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

ROOT CAUSE:
EditorPanel is rendering INSIDE the instructions grid slot.
The grid has 3 columns but EditorPanel is mounted twice —
once in "ins" position and once in "ed" position.
OR the AppShell grid only has 2 columns and EditorPanel
spans both remaining columns.

STEP 1 — Open src/components/shell/AppShell.tsx

Find the grid container. It currently looks like one of these:

  // WRONG VERSION A — only 2 columns, no ins slot
  gridTemplateColumns: "220px 1fr"
  gridTemplateAreas: '"tn tn" "sb ed"'

  // WRONG VERSION B — 3 cols but EditorPanel fills ins slot too
  gridTemplateColumns: "220px 300px 1fr"
  gridTemplateAreas: '"tn tn tn" "sb ins ed"'
  // but <InstructionsPanel /> is missing from JSX
  // so EditorPanel bleeds left OR is duplicated

STEP 2 — Replace the entire grid container with this exact code:

```tsx
// src/components/shell/AppShell.tsx
<div
  style={{
    display: "grid",
    gridTemplateRows: "52px 1fr",
    gridTemplateColumns: "220px 300px 1fr",
    gridTemplateAreas: '"tn tn tn" "sb ins ed"',
    height: "100vh",
    overflow: "hidden",
    background: "var(--bg-void)",
  }}
>
  {/* gridArea on wrapper div — never on the component itself */}
  <div style={{ gridArea: "tn", overflow: "hidden" }}>
    <TopNav />
  </div>

  <div style={{ gridArea: "sb", overflow: "hidden" }}>
    <Sidebar />
  </div>

  <div style={{ gridArea: "ins", overflow: "hidden" }}>
    <InstructionsPanel />
  </div>

  <div style={{ gridArea: "ed", overflow: "hidden", display: "flex", flexDirection: "column" }}>
    <EditorPanel onTransmute={onTransmute} />
  </div>
</div>
```

STEP 3 — Verify InstructionsPanel is imported at the top:

```tsx
import InstructionsPanel from "@/components/panels/InstructionsPanel"
```

If this import doesn't exist → that is the entire bug.
Add the import and add <InstructionsPanel /> in the "ins" slot.

STEP 4 — Make InstructionsPanel self-contained (no required props)

InstructionsPanel must read its own data from useEditorStore.
It cannot require layerId or exerciseIndex as required props
because AppShell doesn't pass them.

```tsx
// src/components/panels/InstructionsPanel.tsx
"use client"

import { useEditorStore } from "@/stores"

// Props are ALL optional — component reads from store directly
interface InstructionsPanelProps {
  layerId?: string
  exerciseIndex?: number
}

export default function InstructionsPanel({
  layerId,
  exerciseIndex,
}: InstructionsPanelProps = {}) {
  const { activeLayerId, activeExerciseIndex } = useEditorStore()

  // Use passed props if provided, otherwise fall back to store
  const id = layerId ?? activeLayerId
  const idx = exerciseIndex ?? activeExerciseIndex

  // ... rest of component
}
```

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
BUG 2 — MOBILE: Instructions completely gone
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

ROOT CAUSE:
Looking at screenshot 2 — the bottom bar shows only language
emoji pills + Transmute. The 📖 (BookOpen) toggle button is
missing entirely. mobileView state or the toggle was never
added to MobileActionBar.

STEP 1 — Open src/components/editor/MobileActionBar.tsx

Check if mobileView and setMobileView are imported from store:

```tsx
const { mobileView, setMobileView, activeLanguage, setActiveLanguage } = useEditorStore()
```

If mobileView does not exist in the store → Bug 1 of mobile.
Add it now to src/stores/index.ts:

```ts
// src/stores/index.ts — inside useEditorStore state:
mobileView: "editor" as "editor" | "instructions",
setMobileView: (v: "editor" | "instructions") => set({ mobileView: v }),
```

STEP 2 — Add the 📖 toggle button to MobileActionBar

The full correct MobileActionBar:

```tsx
// src/components/editor/MobileActionBar.tsx
"use client"

import { BookOpen, Sparkles, Loader2 } from "lucide-react"
import { useEditorStore, useExecutionStore } from "@/stores"

const LANGS = {
  python:     { emoji: "🐍", bg: "rgba(59,130,246,.15)",  border: "rgba(59,130,246,.35)"  },
  rust:       { emoji: "🦀", bg: "rgba(249,115,22,.15)",  border: "rgba(249,115,22,.35)"  },
  typescript: { emoji: "🔷", bg: "rgba(139,92,246,.15)",  border: "rgba(139,92,246,.35)"  },
} as const

export default function MobileActionBar({
  onTransmute,
}: {
  onTransmute: () => void
}) {
  const {
    activeLanguage, setActiveLanguage,
    mobileView, setMobileView,
  } = useEditorStore()
  const { isRunning } = useExecutionStore()
  const isInstr = mobileView === "instructions"

  return (
    <div
      style={{
        height: 52,
        background: "var(--bg-panel)",
        borderTop: "1px solid var(--border-mid)",
        display: "flex",
        alignItems: "center",
        padding: "0 10px",
        gap: 8,
        flexShrink: 0,
      }}
    >
      {/* 📖 Instructions toggle */}
      <button
        onClick={() => setMobileView(isInstr ? "editor" : "instructions")}
        style={{
          width: 34, height: 30, borderRadius: 8,
          background: isInstr ? "rgba(245,197,24,.12)" : "transparent",
          border: isInstr
            ? "1px solid rgba(245,197,24,.35)"
            : "1px solid var(--border-dim)",
          color: isInstr ? "var(--gold)" : "var(--text-muted)",
          display: "flex", alignItems: "center", justifyContent: "center",
          cursor: "pointer", flexShrink: 0,
        }}
        aria-label="Toggle instructions"
      >
        <BookOpen size={14} />
      </button>

      {/* Language pills — hidden when instructions open */}
      {!isInstr && (
        <div style={{ display: "flex", gap: 4 }}>
          {(Object.keys(LANGS) as (keyof typeof LANGS)[]).map(lang => {
            const cfg = LANGS[lang]
            const active = activeLanguage === lang
            return (
              <button
                key={lang}
                onClick={() => setActiveLanguage(lang)}
                style={{
                  width: 32, height: 28, borderRadius: 7, fontSize: 14,
                  background: active ? cfg.bg : "transparent",
                  border: active ? `1px solid ${cfg.border}` : "1px solid transparent",
                  cursor: "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}
              >
                {cfg.emoji}
              </button>
            )
          })}
        </div>
      )}

      {/* Transmute — always visible */}
      <button
        onClick={() => {
          if (isInstr) setMobileView("editor")
          onTransmute()
        }}
        disabled={isRunning}
        style={{
          flex: 1, height: 34, borderRadius: 99,
          background: isRunning
            ? "rgba(245,197,24,.4)"
            : "linear-gradient(135deg,#C49A0E,#F5C518,#FFD700)",
          border: "none",
          fontFamily: "var(--font-cinzel, serif)",
          fontSize: 11, fontWeight: 600,
          color: "var(--text-inverse, #05050F)",
          display: "flex", alignItems: "center",
          justifyContent: "center", gap: 6,
          boxShadow: isRunning ? "none" : "0 2px 12px rgba(245,197,24,.28)",
          cursor: isRunning ? "not-allowed" : "pointer",
          opacity: isRunning ? 0.7 : 1,
        }}
      >
        {isRunning
          ? <><Loader2 size={12} className="animate-spin" /> Transmuting...</>
          : <><Sparkles size={12} /> ✦ Transmute</>}
      </button>
    </div>
  )
}
```

STEP 3 — Verify MobileWorkspace AnimatePresence keys are unique

```tsx
// src/components/editor/MobileWorkspace.tsx
<AnimatePresence mode="wait" initial={false}>
  {mobileView === "editor" ? (
    <motion.div key="editor" ...>   {/* ← must be "editor" */}
      <LanguageSwitcher />
      <div style={{ flex: 1, overflow: "hidden" }}>
        <CodeEditor language={activeLanguage} />
      </div>
      <TerminalPanel />
    </motion.div>
  ) : (
    <motion.div key="instructions" ...>  {/* ← must be "instructions" */}
      {/* Back button strip */}
      <div
        style={{
          height: 36, background: "var(--bg-panel)",
          borderBottom: "1px solid var(--border-dim)",
          display: "flex", alignItems: "center",
          padding: "0 16px", flexShrink: 0,
        }}
      >
        <button
          onClick={() => setMobileView("editor")}
          style={{
            background: "none", border: "none",
            color: "var(--text-muted)", fontSize: 11,
            fontFamily: "var(--font-dm-sans, sans-serif)",
            cursor: "pointer", display: "flex",
            alignItems: "center", gap: 6, padding: 0,
          }}
        >
          ← Back to Editor
        </button>
      </div>

      {/* Instructions fills remaining space */}
      <div style={{ flex: 1, overflowY: "auto" }}>
        <InstructionsPanel />   {/* no props required */}
      </div>
    </motion.div>
  )}
</AnimatePresence>
```

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
BUG 3 — REMOVE ALL PRICING UI FROM PROJECT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Screenshot 3 confirms PricingSection is still rendering.
Remove ALL pricing-related UI from the entire project.
CodeAlchemist is free — no pricing, no plans, no upgrade CTAs.

FILES TO UPDATE:

1. src/app/page.tsx
   Remove: import PricingSection from "@/components/marketing/PricingSection"
   Remove: <PricingSection />

2. Search entire codebase for any other pricing references:

   grep -r "pricing\|Pricing\|upgrade\|Upgrade\|Pro plan\|Free plan\|per month\|/month\|\$12\|\$0" \
     src/ --include="*.tsx" --include="*.ts" -l

   For each file found:
   - If it IS PricingSection.tsx → leave the file, just don't import it
   - If it's another marketing component with an "Upgrade to Pro" CTA
     or a pricing badge → remove that specific element
   - If it's a nav link to /pricing → remove the link

3. Common places pricing sneaks in — check and clean:
   - MarketingNav.tsx: remove any "Pricing" nav link
   - HeroSection.tsx: remove any "$12/month" or plan mention
   - CTABannerSection.tsx: remove any plan comparison text
   - MarketingFooter.tsx: remove any "Pricing" footer link
   - Any page that renders at /pricing → redirect to /

4. If /pricing route exists:
   // src/app/pricing/page.tsx — replace with redirect
   import { redirect } from "next/navigation"
   export default function PricingPage() {
     redirect("/")
   }

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
EXECUTION ORDER
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1.  Add mobileView + setMobileView to src/stores/index.ts
2.  Fix AppShell.tsx grid — 3 columns, add InstructionsPanel
3.  Add InstructionsPanel import to AppShell.tsx
4.  Make InstructionsPanel props optional (reads from store)
5.  Rewrite MobileActionBar.tsx with 📖 toggle button
6.  Fix MobileWorkspace.tsx AnimatePresence keys
7.  Remove PricingSection from src/app/page.tsx
8.  Run grep for all pricing references → remove each one
9.  bun tsc --noEmit → 0 errors
10. bun run build → success
11. git push

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
VERIFY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Desktop /workspace:
  [ ] 3 columns: Layers sidebar | Instructions | Editor
  [ ] Instructions shows formula text, step navigator, hints
  [ ] Editor NOT duplicated — only one Monaco instance visible
  [ ] No double tab bar (Python/Rust/TypeScript shown once only)

Mobile /workspace:
  [ ] Default: editor + language switcher + bottom bar
  [ ] Bottom bar has 📖 icon on the left
  [ ] Tap 📖 → instructions fills screen, editor gone
  [ ] Back button visible in instructions view
  [ ] Tap Back → editor returns
  [ ] Transmute always works from both views

Landing /:
  [ ] Pricing section completely gone
  [ ] No "Upgrade to Pro", "$12", "Most Popular" anywhere
  [ ] No "Pricing" link in nav or footer

COMMIT MESSAGE:
fix: instructions panel, mobile view toggle, remove all pricing

- AppShell: fix 3-column grid, add InstructionsPanel to ins slot
- InstructionsPanel: make props optional, reads from useEditorStore
- useEditorStore: add mobileView state (editor | instructions)
- MobileActionBar: add 📖 BookOpen toggle for instructions view
- MobileWorkspace: fix AnimatePresence keys editor/instructions
- Remove PricingSection from landing page
- Remove all pricing/upgrade/plan references across codebase
═══════════════════════════════════════════════════════════════════
