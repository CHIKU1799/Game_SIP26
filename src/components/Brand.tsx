export function Brand({ compact = false }: { compact?: boolean }) {
  return (
    <div className="flex items-center gap-3">
      {/* Emblem (CSS-only; swap for the official IITM logo image when available) */}
      <div className="relative grid h-11 w-11 place-items-center rounded-full border border-neon/40 bg-panel shadow-glow">
        <span className="text-lg font-bold tracking-tight text-neon">IITM</span>
        <span className="absolute inset-0 animate-pulseGlow rounded-full ring-1 ring-neon2/30" />
      </div>
      <div className="leading-tight">
        <div className="text-sm font-semibold text-white">
          Indian Institute of Technology Madras
        </div>
        {!compact && (
          <div className="text-xs text-slate-400">
            Department of Management Studies (DoMS)
          </div>
        )}
      </div>
    </div>
  );
}
