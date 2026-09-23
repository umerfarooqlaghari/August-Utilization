interface Props {
  planned: number;
  actual: number;
  width?: number;
  height?: number;
  showLabels?: boolean;
}

const GREEN = "#3F7A5D";
const RED   = "#B14A3D";
const INK   = "#16303F";
const MIST  = "#E4E9EC";
const GRAY  = "#5B6472";
const MONO  = "'IBM Plex Mono', monospace";
const SANS  = "'IBM Plex Sans', sans-serif";

export default function PlannedActualBar({ planned, actual, width = 96, height = 7, showLabels = false }: Props) {
  const max       = Math.max(planned, actual) * 1.18 || 1;
  const planPct   = Math.min((planned / max) * 100, 100);
  const actPct    = (actual / max) * 100;
  const isOver    = actual > planned;
  // capped fill up to planned line
  const fillPct   = Math.min(actPct, planPct);
  // overflow beyond planned
  const overPct   = isOver ? actPct - planPct : 0;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: showLabels ? 4 : 0 }}>
      {/* bar */}
      <div style={{ position: "relative", width, height: height + 4 }}>
        {/* track */}
        <div style={{
          position: "absolute", left: 0, top: 2,
          width: "100%", height,
          background: MIST, borderRadius: height,
        }} />
        {/* filled actual (within plan) */}
        <div style={{
          position: "absolute", left: 0, top: 2,
          width: `${fillPct}%`, height,
          background: isOver ? RED : GREEN,
          borderRadius: height,
        }} />
        {/* overflow bar beyond plan */}
        {overPct > 0 && (
          <div style={{
            position: "absolute", left: `${planPct}%`, top: 2,
            width: `${Math.min(overPct, 100 - planPct)}%`, height,
            background: RED, opacity: 0.55,
            borderRadius: `0 ${height}px ${height}px 0`,
          }} />
        )}
        {/* planned outline box */}
        <div style={{
          position: "absolute", left: 0, top: 0,
          width: `${planPct}%`, height: height + 4,
          border: `1.5px solid ${INK}`,
          borderRadius: height + 2,
          pointerEvents: "none",
        }} />
      </div>
      {showLabels && (
        <div style={{ display: "flex", justifyContent: "space-between", width }}>
          <span style={{ fontFamily: MONO, fontSize: 9, color: GRAY }}>{actual}h actual</span>
          <span style={{ fontFamily: MONO, fontSize: 9, color: GRAY }}>{planned}h plan</span>
        </div>
      )}
    </div>
  );
}
