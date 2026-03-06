export default function DashboardLoading() {
  return (
    <div 
      className="flex items-center justify-center h-screen"
      style={{ background: "var(--color-void)" }}
    >
      <div className="flex flex-col items-center gap-3">
        <div style={{ fontSize: 32, animation: "pulse 2s infinite" }}>⚗️</div>
        <p style={{ 
          color: "var(--color-text-muted)", 
          fontFamily: "var(--font-cinzel)",
          fontSize: 13 
        }}>
          Preparing the Circle...
        </p>
      </div>
    </div>
  )
}
