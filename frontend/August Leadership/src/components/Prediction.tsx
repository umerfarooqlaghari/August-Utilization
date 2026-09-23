import { useState, useRef } from "react";
import {
  C,
  FORECAST_WEEKS,
  CAPACITY_DEMAND,
  DEPT_OPTIONS,
  BANDWIDTH_MEMBERS,
  BandwidthMember,
  PROJECT_HEALTH,
  ProjectHealth,
  RiskLevel,
  RECOMMENDED_ACTIONS,
} from "./prediction/data";

// ─── Shared primitives ────────────────────────────────────────────────────────

const RISK_COLOR: Record<RiskLevel, string> = {
  "Low Risk":    C.green,
  "Medium Risk": C.amber,
  "High Risk":   C.red,
};
const RISK_BG: Record<RiskLevel, string> = {
  "Low Risk":    C.greenBg,
  "Medium Risk": C.amberBg,
  "High Risk":   C.redBg,
};
const PRIORITY_DOT: Record<string, string> = { high: C.red, medium: C.amber, low: C.graphite };

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ fontFamily: C.sans, fontSize: 10, fontWeight: 700, letterSpacing: "0.10em", textTransform: "uppercase" as const, color: C.graphite, marginBottom: 14 }}>
      {children}
    </div>
  );
}

function EstimatePill() {
  return (
    <span style={{ fontFamily: C.sans, fontSize: 10, fontWeight: 500, letterSpacing: "0.04em", color: C.graphite, background: C.mist, border: `1px solid ${C.hairline}`, borderRadius: 3, padding: "2px 7px", marginLeft: 8 }}>
      Estimated
    </span>
  );
}

// ─── Skeleton shimmer ─────────────────────────────────────────────────────────
const SHIMMER_CSS = `@keyframes shimmer{0%{background-position:200% 0}100%{background-position:-200% 0}}`;
function ShimmerBlock({ w, h, r = 4 }: { w: number | string; h: number; r?: number }) {
  return (
    <div style={{
      width: w, height: h, borderRadius: r,
      background: "linear-gradient(90deg,#E4E9EC 25%,#EFF2F4 50%,#E4E9EC 75%)",
      backgroundSize: "200% 100%", animation: "shimmer 1.4s infinite",
    }} />
  );
}

// ─── Empty state ──────────────────────────────────────────────────────────────
function EmptyState() {
  return (
    <div style={{ padding: "80px 28px", display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
      <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
        <rect x="8" y="8" width="32" height="32" rx="4" stroke={C.hairline} strokeWidth="1.5" />
        <path d="M16 32 L20 24 L26 30 L30 20 L34 28" stroke={C.hairline} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="36" cy="12" r="6" fill={C.mist} />
        <path d="M36 9v3m0 3v.5" stroke={C.graphite} strokeWidth="1.5" strokeLinecap="round" />
      </svg>
      <div style={{ fontFamily: C.sans, fontWeight: 600, fontSize: 14, color: C.ink }}>No forecast data yet</div>
      <div style={{ fontFamily: C.sans, fontSize: 13, color: C.graphite, textAlign: "center", maxWidth: 340, lineHeight: 1.6 }}>
        Predictions require at least four weeks of utilization history. Add projects and log hours to unlock this view.
      </div>
    </div>
  );
}

// ─── Section 1: Capacity vs Demand Chart ─────────────────────────────────────
function CapacityVsDemand({ loading }: { loading: boolean }) {
  const [dept, setDept] = useState("Firm-wide");
  const [hov, setHov] = useState<number | null>(null);
  const data = CAPACITY_DEMAND[dept];

  // Chart geometry
  const W = 680, H = 200;
  const PAD_L = 52, PAD_R = 12, PAD_T = 16, PAD_B = 38;
  const chartW = W - PAD_L - PAD_R;
  const chartH = H - PAD_T - PAD_B;
  const maxVal = Math.max(...data.flatMap((d) => [d.capacity, d.demand])) * 1.12;
  const scaleY = (v: number) => PAD_T + chartH - (v / maxVal) * chartH;

  const groupW = chartW / FORECAST_WEEKS.length;
  const barW = Math.min(22, groupW * 0.28);
  const gap = barW * 0.35;

  const xGroup = (i: number) => PAD_L + i * groupW + groupW / 2;
  const xCap   = (i: number) => xGroup(i) - gap / 2 - barW;
  const xDem   = (i: number) => xGroup(i) + gap / 2;

  // y-axis ticks
  const ticks = 4;
  const tickStep = Math.ceil(maxVal / ticks / 50) * 50;
  const yTicks = Array.from({ length: ticks + 1 }, (_, i) => i * tickStep).filter((t) => t <= maxVal * 1.05);

  if (loading) {
    return (
      <div style={{ background: C.paper, border: `1px solid ${C.hairline}`, borderRadius: 8, padding: 20 }}>
        <style>{SHIMMER_CSS}</style>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
          <ShimmerBlock w={180} h={12} />
          <ShimmerBlock w={120} h={26} r={5} />
        </div>
        <ShimmerBlock w="100%" h={220} r={6} />
      </div>
    );
  }

  return (
    <div style={{ background: C.paper, border: `1px solid ${C.hairline}`, borderRadius: 8, overflow: "hidden" }}>
      <div style={{ padding: "14px 20px", borderBottom: `1px solid ${C.hairline}`, display: "flex", alignItems: "center", gap: 10 }}>
        <span style={{ fontFamily: C.sans, fontWeight: 600, fontSize: 13, color: C.ink }}>
          Capacity vs Projected Demand
        </span>
        <EstimatePill />
        <div style={{ flex: 1 }} />
        {/* dept selector */}
        <div style={{ position: "relative" }}>
          <select value={dept} onChange={(e) => setDept(e.target.value)} style={{
            fontFamily: C.sans, fontSize: 12, color: C.ink,
            background: C.bg, border: `1px solid ${C.hairline}`, borderRadius: 5,
            padding: "5px 24px 5px 10px", outline: "none", cursor: "pointer", appearance: "none" as const,
          }}>
            {DEPT_OPTIONS.map((d) => <option key={d}>{d}</option>)}
          </select>
          <svg width="9" height="9" viewBox="0 0 9 9" fill="none" style={{ position: "absolute", right: 7, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}>
            <path d="M1.5 3l3 3 3-3" stroke={C.graphite} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>

      <div style={{ padding: "16px 20px 12px" }}>
        <svg width="100%" viewBox={`0 0 ${W} ${H}`} style={{ overflow: "visible", display: "block" }}>
          {/* grid lines */}
          {yTicks.map((t) => (
            <g key={t}>
              <line x1={PAD_L} y1={scaleY(t)} x2={W - PAD_R} y2={scaleY(t)}
                stroke={C.hairline} strokeWidth="1" />
              <text x={PAD_L - 6} y={scaleY(t) + 4} textAnchor="end"
                fontFamily={C.mono} fontSize="9" fill={C.graphite}>{t}</text>
            </g>
          ))}

          {/* bars */}
          {data.map((d, i) => {
            const isShortfall = d.demand > d.capacity;
            const capH = (d.capacity / maxVal) * chartH;
            const demH = (d.demand / maxVal) * chartH;
            const capY = PAD_T + chartH - capH;
            const demY = PAD_T + chartH - demH;
            const isHov = hov === i;
            const topY = Math.min(capY, demY);
            const tipCx = Math.min(Math.max(xGroup(i), PAD_L + 42), W - PAD_R - 42);
            const tipY = Math.max(PAD_T + 2, topY - 52);
            const arrowX = Math.min(Math.max(xGroup(i), tipCx - 34), tipCx + 34);

            return (
              <g key={i}
                onMouseEnter={() => setHov(i)}
                onMouseLeave={() => setHov(null)}
                style={{ cursor: "default" }}
              >
                {/* transparent hit area */}
                <rect x={xCap(i) - 4} y={PAD_T} width={barW * 2 + gap + 8} height={chartH} fill="transparent" />
                {/* capacity bar */}
                <rect x={xCap(i)} y={capY} width={barW} height={capH}
                  fill={C.slate} rx="2"
                  opacity={hov !== null && !isHov ? 0.45 : 1} />
                {/* demand bar */}
                <rect x={xDem(i)} y={demY} width={barW} height={demH}
                  fill={isShortfall ? C.red : C.ink} rx="2"
                  opacity={hov !== null && !isHov ? 0.45 : 1} />
                {/* shortfall flag */}
                {isShortfall && (
                  <g transform={`translate(${xDem(i) + barW / 2}, ${demY - 8})`}>
                    <path d="M0 -4 L3 2 L-3 2 Z" fill={C.red} opacity="0.85" />
                  </g>
                )}
                {/* week label */}
                <text x={xGroup(i)} y={H - 4} textAnchor="middle"
                  fontFamily={C.mono} fontSize="8.5"
                  fill={isHov ? C.ink : C.graphite}
                  fontWeight={isHov ? "700" : "400"}>
                  {FORECAST_WEEKS[i]}
                </text>
                {/* tooltip */}
                {isHov && (
                  <g pointerEvents="none">
                    <rect x={tipCx - 40} y={tipY} width={80} height={38} rx={4} fill={C.ink} />
                    <polygon points={`${arrowX - 4},${tipY + 38} ${arrowX + 4},${tipY + 38} ${arrowX},${tipY + 44}`} fill={C.ink} />
                    <text x={tipCx} y={tipY + 14} textAnchor="middle" fontFamily={C.mono} fontSize="9" fontWeight="600" fill="#fff">Cap: {d.capacity}h</text>
                    <text x={tipCx} y={tipY + 28} textAnchor="middle" fontFamily={C.mono} fontSize="9" fontWeight="600" fill={isShortfall ? "#E8A09A" : "#8FBACF"}>Dem: {d.demand}h</text>
                  </g>
                )}
              </g>
            );
          })}

          {/* x baseline */}
          <line x1={PAD_L} y1={PAD_T + chartH} x2={W - PAD_R} y2={PAD_T + chartH}
            stroke={C.hairline} strokeWidth="1" />
        </svg>

        {/* legend */}
        <div style={{ display: "flex", gap: 18, marginTop: 4 }}>
          {[
            { color: C.slate, label: "Available Capacity" },
            { color: C.ink,   label: "Projected Demand" },
            { color: C.red,   label: "Demand exceeds capacity" },
          ].map((l) => (
            <div key={l.label} style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <div style={{ width: 10, height: 10, background: l.color, borderRadius: 2 }} />
              <span style={{ fontFamily: C.sans, fontSize: 10, color: C.graphite }}>{l.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Section 2: Team Bandwidth Grid ──────────────────────────────────────────
function cellStyle(pct: number): { bg: string; text: string } {
  if (pct > 100) return { bg: "#FBF0EF", text: C.red };
  if (pct >= 90) return { bg: "#FBF6F0", text: C.amber };
  return { bg: "#EBF4EF", text: C.green };
}

function BandwidthGrid({ loading }: { loading: boolean }) {
  type SortKey = "name" | "avg" | `w${number}`;
  const [sortKey, setSortKey] = useState<SortKey>("avg");
  const [sortDir, setSortDir] = useState<1 | -1>(-1);

  const avgUtil = (m: BandwidthMember) =>
    Math.round(m.weeklyUtil.reduce((s, v) => s + v, 0) / m.weeklyUtil.length);

  const handleSort = (k: SortKey) => {
    if (sortKey === k) setSortDir((d) => (d === 1 ? -1 : 1));
    else { setSortKey(k); setSortDir(-1); }
  };

  const sorted = [...BANDWIDTH_MEMBERS].sort((a, b) => {
    if (sortKey === "name") return a.name.localeCompare(b.name) * sortDir;
    if (sortKey === "avg")  return (avgUtil(a) - avgUtil(b)) * sortDir;
    const wi = parseInt((sortKey as string).replace("w", ""));
    return ((a.weeklyUtil[wi] ?? 0) - (b.weeklyUtil[wi] ?? 0)) * sortDir;
  });

  const SortBtn = ({ sk, label }: { sk: SortKey; label: string }) => {
    const active = sortKey === sk;
    return (
      <th onClick={() => handleSort(sk)}
        style={{
          padding: "9px 12px", fontFamily: C.sans, fontSize: 10, fontWeight: 600,
          color: active ? C.ink : C.graphite, letterSpacing: "0.07em", textTransform: "uppercase" as const,
          cursor: "pointer", userSelect: "none" as const, whiteSpace: "nowrap" as const, textAlign: "center" as const,
          transition: "color 0.12s",
        }}
        onMouseEnter={(e) => { if (!active) (e.currentTarget as HTMLElement).style.color = C.ink; }}
        onMouseLeave={(e) => { if (!active) (e.currentTarget as HTMLElement).style.color = C.graphite; }}
      >
        {label}
        <span style={{ marginLeft: 3, opacity: active ? 1 : 0.3 }}>{active && sortDir === -1 ? "↓" : "↑"}</span>
      </th>
    );
  };

  if (loading) {
    return (
      <div style={{ background: C.paper, border: `1px solid ${C.hairline}`, borderRadius: 8, overflow: "hidden" }}>
        <style>{SHIMMER_CSS}</style>
        <div style={{ padding: 20 }}><ShimmerBlock w={200} h={12} /></div>
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} style={{ padding: "12px 20px", borderTop: `1px solid ${C.mist}`, display: "flex", gap: 12 }}>
            <ShimmerBlock w={120} h={10} />{Array.from({ length: 6 }).map((_, j) => <ShimmerBlock key={j} w={44} h={24} r={3} />)}
          </div>
        ))}
      </div>
    );
  }

  return (
    <div style={{ background: C.paper, border: `1px solid ${C.hairline}`, borderRadius: 8, overflow: "hidden" }}>
      <div style={{ padding: "14px 20px", borderBottom: `1px solid ${C.hairline}`, display: "flex", alignItems: "center", gap: 8 }}>
        <span style={{ fontFamily: C.sans, fontWeight: 600, fontSize: 13, color: C.ink }}>Team Bandwidth</span>
        <EstimatePill />
        <span style={{ fontFamily: C.sans, fontSize: 11, color: C.graphite, marginLeft: 4 }}>· next 6 weeks</span>
      </div>
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 640 }}>
          <thead>
            <tr style={{ background: C.bg, borderBottom: `1px solid ${C.hairline}` }}>
              <th onClick={() => handleSort("name")} style={{ padding: "9px 16px", fontFamily: C.sans, fontSize: 10, fontWeight: 600, color: sortKey === "name" ? C.ink : C.graphite, letterSpacing: "0.07em", textTransform: "uppercase" as const, cursor: "pointer", userSelect: "none" as const, textAlign: "left" as const }}>
                Team Member {<span style={{ marginLeft: 3, opacity: sortKey === "name" ? 1 : 0.3 }}>{sortKey === "name" && sortDir === -1 ? "↓" : "↑"}</span>}
              </th>
              {FORECAST_WEEKS.slice(0, 6).map((w, i) => <SortBtn key={i} sk={`w${i}`} label={w} />)}
              <SortBtn sk="avg" label="6-Wk Avg" />
            </tr>
          </thead>
          <tbody>
            {sorted.map((m, ri) => {
              const avg = avgUtil(m);
              return (
                <tr key={m.id} style={{ borderBottom: ri < sorted.length - 1 ? `1px solid ${C.mist}` : "none" }}>
                  <td style={{ padding: "10px 16px", verticalAlign: "middle" }}>
                    <div style={{ fontFamily: C.sans, fontWeight: 500, fontSize: 13, color: C.ink }}>{m.name}</div>
                    <div style={{ fontFamily: C.sans, fontSize: 10, color: C.graphite, marginTop: 1 }}>{m.department}</div>
                  </td>
                  {m.weeklyUtil.map((pct, wi) => {
                    const cs = cellStyle(pct);
                    return (
                      <td key={wi} style={{ padding: "10px 12px", verticalAlign: "middle", textAlign: "center" as const }}>
                        <div style={{
                          display: "inline-flex", alignItems: "center", justifyContent: "center",
                          width: 44, height: 26, borderRadius: 4,
                          background: cs.bg,
                          fontFamily: C.mono, fontSize: 11, fontWeight: 600, color: cs.text,
                        }}>
                          {pct}%
                        </div>
                      </td>
                    );
                  })}
                  <td style={{ padding: "10px 12px", verticalAlign: "middle", textAlign: "center" as const }}>
                    <div style={{
                      display: "inline-flex", alignItems: "center", justifyContent: "center",
                      width: 44, height: 26, borderRadius: 4, border: `1.5px solid ${cellStyle(avg).text}`,
                      fontFamily: C.mono, fontSize: 11, fontWeight: 700, color: cellStyle(avg).text,
                    }}>
                      {avg}%
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {/* legend */}
      <div style={{ padding: "10px 20px", borderTop: `1px solid ${C.mist}`, display: "flex", gap: 20 }}>
        {[
          { color: C.green, bg: C.greenBg, label: "Available  (<90%)" },
          { color: C.amber, bg: C.amberBg, label: "Tight  (90–100%)" },
          { color: C.red,   bg: C.redBg,   label: "Over-booked  (>100%)" },
        ].map((l) => (
          <div key={l.label} style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <div style={{ width: 10, height: 10, borderRadius: 2, background: l.bg, border: `1.5px solid ${l.color}` }} />
            <span style={{ fontFamily: C.sans, fontSize: 10, color: C.graphite }}>{l.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Section 3: Project Health ────────────────────────────────────────────────
function FactorBar({ label, value, unit, description }: { label: string; value: number; unit: string; description: string }) {
  const isNeg = value < 0;
  const absPct = Math.min(Math.abs(value), 100);
  const barColor = isNeg ? C.red : value > 10 ? C.amber : C.green;

  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
        <span style={{ fontFamily: C.sans, fontSize: 11, fontWeight: 600, color: C.ink }}>{label}</span>
        <span style={{ fontFamily: C.mono, fontSize: 11, color: barColor, fontWeight: 600 }}>
          {value > 0 ? "+" : ""}{value}{unit}
        </span>
      </div>
      {/* centered variance bar — zero at center */}
      <div style={{ position: "relative", height: 5, background: C.mist, borderRadius: 3 }}>
        {/* zero center tick */}
        <div style={{ position: "absolute", left: "50%", top: -1, width: 1.5, height: 7, background: C.hairline }} />
        <div style={{
          position: "absolute",
          [isNeg ? "right" : "left"]: "50%",
          top: 0, height: "100%",
          width: `${absPct / 2}%`,
          background: barColor, borderRadius: 3,
        }} />
      </div>
      <div style={{ fontFamily: C.sans, fontSize: 10, color: C.graphite, marginTop: 5, lineHeight: 1.5 }}>
        {description}
      </div>
    </div>
  );
}

function HealthDrawer({ project, onClose }: { project: ProjectHealth; onClose: () => void }) {
  const rc = RISK_COLOR[project.risk];
  return (
    <>
      <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(22,48,63,0.2)", zIndex: 100 }} />
      <div style={{
        position: "fixed", top: 0, right: 0, bottom: 0, width: 360,
        background: C.paper, borderLeft: `1px solid ${C.hairline}`,
        boxShadow: "-8px 0 32px rgba(22,48,63,0.14)",
        zIndex: 101, display: "flex", flexDirection: "column",
      }}>
        <div style={{ padding: "18px 22px 16px", borderBottom: `1px solid ${C.hairline}`, flexShrink: 0 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div style={{ flex: 1, marginRight: 12 }}>
              <div style={{ fontFamily: C.sans, fontSize: 11, color: C.graphite, marginBottom: 3 }}>{project.client}</div>
              <div style={{ fontFamily: C.sans, fontWeight: 700, fontSize: 14, color: C.ink, lineHeight: 1.3 }}>{project.name.replace(`${project.client} – `, "")}</div>
              <div style={{ marginTop: 8, display: "flex", gap: 6 }}>
                <span style={{ fontFamily: C.sans, fontSize: 10, fontWeight: 700, color: rc, background: RISK_BG[project.risk], padding: "2px 7px", borderRadius: 3 }}>{project.risk}</span>
                <span style={{ fontFamily: C.sans, fontSize: 10, color: C.graphite, background: C.mist, padding: "2px 7px", borderRadius: 3 }}>{project.stage}</span>
              </div>
            </div>
            <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: C.graphite, fontSize: 20, lineHeight: 1, flexShrink: 0 }}>×</button>
          </div>
        </div>

        <div style={{ flex: 1, overflowY: "auto", padding: "20px 22px" }}>
          <div style={{ fontFamily: C.sans, fontSize: 12, color: C.slate, lineHeight: 1.6, padding: "10px 14px", background: C.bg, borderRadius: 6, marginBottom: 20, borderLeft: `2px solid ${rc}` }}>
            {project.summary}
          </div>

          <div style={{ fontFamily: C.sans, fontSize: 10, fontWeight: 600, color: C.graphite, letterSpacing: "0.08em", textTransform: "uppercase" as const, marginBottom: 14 }}>
            Contributing Factors
          </div>
          {project.factors.map((f, i) => (
            <FactorBar key={i} {...f} />
          ))}

          <div style={{ marginTop: 16, padding: "10px 12px", background: C.bg, border: `1px solid ${C.hairline}`, borderRadius: 6 }}>
            <div style={{ fontFamily: C.sans, fontSize: 10, color: C.graphite, lineHeight: 1.5 }}>
              <strong style={{ color: C.ink }}>How health is assessed:</strong> each factor is measured against plan at the current stage. Positive values indicate over-burn or ahead of schedule; negative values indicate under-burn or delay. The overall risk label is set by the worst single factor.
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function HealthCard({ project, onClick }: { project: ProjectHealth; onClick: () => void }) {
  const rc = RISK_COLOR[project.risk];
  const worst = project.factors.reduce((a, b) => Math.abs(b.value) > Math.abs(a.value) ? b : a);
  return (
    <div
      onClick={onClick}
      style={{
        background: C.paper, border: `1px solid ${C.hairline}`, borderRadius: 8,
        padding: "16px 18px", cursor: "pointer",
        borderTop: `3px solid ${rc}`,
        transition: "box-shadow 0.15s",
      }}
      onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.boxShadow = "0 4px 16px rgba(22,48,63,0.08)"; }}
      onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.boxShadow = "none"; }}
    >
      <div style={{ marginBottom: 8 }}>
        <div style={{ fontFamily: C.sans, fontSize: 10, color: C.graphite, marginBottom: 3 }}>{project.client}</div>
        <div style={{ fontFamily: C.sans, fontWeight: 600, fontSize: 13, color: C.ink, lineHeight: 1.3 }}>
          {project.name.replace(`${project.client} – `, "")}
        </div>
      </div>
      <div style={{ marginBottom: 10, display: "flex", gap: 6 }}>
        <span style={{ fontFamily: C.sans, fontSize: 10, fontWeight: 700, color: rc, background: RISK_BG[project.risk], padding: "2px 7px", borderRadius: 3 }}>{project.risk}</span>
        <span style={{ fontFamily: C.sans, fontSize: 10, color: C.graphite, background: C.mist, padding: "2px 7px", borderRadius: 3 }}>{project.stage}</span>
      </div>
      <div style={{ fontFamily: C.sans, fontSize: 11, color: C.slate, lineHeight: 1.55, marginBottom: 10 }}>
        {project.summary}
      </div>
      {/* worst factor mini preview */}
      <div style={{ paddingTop: 10, borderTop: `1px solid ${C.mist}` }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
          <span style={{ fontFamily: C.sans, fontSize: 10, color: C.graphite }}>{worst.label}</span>
          <span style={{ fontFamily: C.mono, fontSize: 10, color: rc, fontWeight: 600 }}>
            {worst.value > 0 ? "+" : ""}{worst.value}{worst.unit}
          </span>
        </div>
        <div style={{ height: 2.5, background: C.mist, borderRadius: 2 }}>
          <div style={{ height: "100%", width: `${Math.min(Math.abs(worst.value), 100)}%`, background: rc, borderRadius: 2 }} />
        </div>
      </div>
      <div style={{ marginTop: 10, fontFamily: C.sans, fontSize: 10, color: C.graphite, opacity: 0.8 }}>
        Click to see full breakdown →
      </div>
    </div>
  );
}

function ProjectHealthSection({ loading }: { loading: boolean }) {
  const [drawerProject, setDrawerProject] = useState<ProjectHealth | null>(null);

  if (loading) {
    return (
      <div>
        <style>{SHIMMER_CSS}</style>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12 }}>
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} style={{ background: C.paper, border: `1px solid ${C.hairline}`, borderRadius: 8, padding: 18 }}>
              <ShimmerBlock w="60%" h={10} /><div style={{ height: 8 }} />
              <ShimmerBlock w="90%" h={12} /><div style={{ height: 12 }} />
              <ShimmerBlock w={72} h={18} r={3} /><div style={{ height: 12 }} />
              <ShimmerBlock w="100%" h={10} /><div style={{ height: 4 }} /><ShimmerBlock w="80%" h={10} />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12 }}>
        {PROJECT_HEALTH.map((p) => (
          <HealthCard key={p.id} project={p} onClick={() => setDrawerProject(p)} />
        ))}
      </div>
      {drawerProject && <HealthDrawer project={drawerProject} onClose={() => setDrawerProject(null)} />}
    </>
  );
}

// ─── Section 4: Recommended Actions ──────────────────────────────────────────
const TAG_STYLE: Record<string, { color: string; bg: string }> = {
  "Hire":    { color: C.red,     bg: "#FBF0EF" },
  "Monitor": { color: C.graphite, bg: C.mist },
  "Escalate":{ color: C.amber,   bg: C.amberBg },
};
function tagStyle(tag: string) {
  if (tag.startsWith("Reallocate")) return { color: C.slate, bg: C.mist };
  return TAG_STYLE[tag] ?? { color: C.graphite, bg: C.mist };
}

function RecommendedActionsSection({ loading }: { loading: boolean }) {
  if (loading) {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        <style>{SHIMMER_CSS}</style>
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} style={{ background: C.paper, border: `1px solid ${C.hairline}`, borderRadius: 8, padding: 16 }}>
            <div style={{ display: "flex", gap: 12 }}>
              <ShimmerBlock w={6} h={48} r={3} />
              <div style={{ flex: 1 }}>
                <ShimmerBlock w="40%" h={10} /><div style={{ height: 8 }} /><ShimmerBlock w="85%" h={12} />
              </div>
              <ShimmerBlock w={80} h={22} r={4} />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      {RECOMMENDED_ACTIONS.map((a, i) => {
        const ts = tagStyle(a.tag);
        return (
          <div key={a.id} style={{
            background: C.paper, border: `1px solid ${C.hairline}`, borderRadius: 8,
            padding: "14px 18px", display: "flex", alignItems: "flex-start", gap: 14,
          }}>
            {/* priority bar */}
            <div style={{ width: 3, alignSelf: "stretch", borderRadius: 2, background: PRIORITY_DOT[a.priority], flexShrink: 0, minHeight: 36 }} />
            {/* rank */}
            <div style={{ fontFamily: C.mono, fontSize: 11, fontWeight: 600, color: C.graphite, minWidth: 20, paddingTop: 2, flexShrink: 0 }}>
              {String(i + 1).padStart(2, "0")}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" as const, marginBottom: 4 }}>
                <span style={{ fontFamily: C.sans, fontWeight: 600, fontSize: 12, color: C.ink }}>{a.department}</span>
                {a.relatedProject && (
                  <span style={{ fontFamily: C.sans, fontSize: 10, color: C.graphite, background: C.mist, padding: "1px 6px", borderRadius: 3 }}>
                    re: {a.relatedProject}
                  </span>
                )}
              </div>
              <div style={{ fontFamily: C.sans, fontSize: 12, color: C.slate, lineHeight: 1.55 }}>{a.description}</div>
            </div>
            <div style={{ flexShrink: 0 }}>
              <span style={{ fontFamily: C.sans, fontSize: 10, fontWeight: 600, color: ts.color, background: ts.bg, padding: "4px 9px", borderRadius: 4, whiteSpace: "nowrap" as const }}>
                {a.tag}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ─── Methodology footnote ─────────────────────────────────────────────────────
function MethodologyNote() {
  const [open, setOpen] = useState(false);

  return (
    <div style={{ border: `1px solid ${C.hairline}`, borderRadius: 8, overflow: "hidden", background: C.paper }}>
      <button
        onClick={() => setOpen((v) => !v)}
        style={{
          width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "12px 18px", background: "none", border: "none", cursor: "pointer",
          transition: "background 0.15s",
        }}
        onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = C.bg; }}
        onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "none"; }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={C.graphite} strokeWidth="1.8" strokeLinecap="round">
            <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          <span style={{ fontFamily: C.sans, fontSize: 12, color: C.graphite }}>How this forecast is calculated</span>
        </div>
        <svg width="10" height="10" viewBox="0 0 10 10" fill="none" style={{ transform: open ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}>
          <path d="M1.5 3.5l3.5 3.5 3.5-3.5" stroke={C.graphite} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      {open && (
        <div style={{ padding: "0 18px 16px", borderTop: `1px solid ${C.mist}` }}>
          <div style={{ paddingTop: 14, fontFamily: C.sans, fontSize: 12, color: C.slate, lineHeight: 1.7, maxWidth: 720 }}>
            <p style={{ margin: "0 0 10px" }}>
              <strong style={{ color: C.ink }}>Capacity</strong> is drawn from each team member's contracted weekly hours, adjusted for confirmed leave. <strong style={{ color: C.ink }}>Projected demand</strong> is extrapolated from the current hours burn rate of each active project, weighted by stage position and the resourcing template for that project type. Shortfalls occur when the sum of projected demand across all projects exceeds available capacity for a given department and week.
            </p>
            <p style={{ margin: "0 0 10px" }}>
              <strong style={{ color: C.ink }}>Project health</strong> scores compare actual hours logged and stage elapsed time against the planned resourcing template. The worst single factor drives the overall risk label. <strong style={{ color: C.ink }}>Recommended actions</strong> are generated from the capacity model and health flags — they are planning prompts, not directives.
            </p>
            <div style={{ fontFamily: C.mono, fontSize: 10, color: C.graphite, marginTop: 8 }}>
              Last recalculated: Today at 9:14 AM · All figures are estimates and should be interpreted alongside qualitative partner judgment.
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
interface PredictionProps { period: string; }

export default function Prediction({ period: _period }: PredictionProps) {
  const [loading] = useState(false);
  const [isEmpty]  = useState(false);

  // ESC key closes any drawer — handled by individual drawers

  if (isEmpty) {
    return (
      <div style={{ background: C.paper, margin: 28, borderRadius: 8, border: `1px solid ${C.hairline}` }}>
        <EmptyState />
      </div>
    );
  }

  return (
    <div style={{ padding: "24px 28px 56px", maxWidth: 1200, display: "flex", flexDirection: "column", gap: 32 }}>

      {/* ── Section 1 ── */}
      <section>
        <SectionLabel>01 · Capacity vs Demand</SectionLabel>
        <CapacityVsDemand loading={loading} />
      </section>

      {/* ── Section 2 ── */}
      <section>
        <SectionLabel>02 · Team Bandwidth</SectionLabel>
        <BandwidthGrid loading={loading} />
      </section>

      {/* ── Section 3 ── */}
      <section>
        <SectionLabel>03 · Project Health</SectionLabel>
        <ProjectHealthSection loading={loading} />
      </section>

      {/* ── Section 4 ── */}
      <section>
        <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 14 }}>
          <SectionLabel>04 · Recommended Actions</SectionLabel>
        </div>
        <div style={{ fontFamily: C.sans, fontSize: 11, color: C.graphite, marginBottom: 14, marginTop: -10 }}>
          Planning prompts based on the capacity model and project health flags — not directives.
        </div>
        <RecommendedActionsSection loading={loading} />
      </section>

      {/* ── Footnote ── */}
      <MethodologyNote />
    </div>
  );
}
