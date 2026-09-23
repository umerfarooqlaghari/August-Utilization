import { useState } from "react";
import ArcGauge from "../ArcGauge";
import {
  C, DEPARTMENTS, LEVELS, HEATMAP_BY_LEVEL, HEATMAP_BY_WEEK, WEEKS,
  WORK_SPLITS, FIRM_KPIS, utilColor, CellPerson,
} from "./data";

// ── KPI card ──────────────────────────────────────────────────────────────────
function KpiCard({ label, children, accent }: { label: string; children: React.ReactNode; accent?: boolean }) {
  const [hov, setHov] = useState(false);
  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: C.paper, border: `1px solid ${C.hairline}`, borderRadius: 8,
        padding: "20px 22px", display: "flex", flexDirection: "column", alignItems: "center", gap: 8,
        flex: 1,
        boxShadow: hov ? "0 6px 20px rgba(22,48,63,0.10)" : "none",
        transform: hov ? "translateY(-2px)" : "none",
        transition: "box-shadow 0.18s, transform 0.18s",
        cursor: "default",
      }}>
      <div style={{ fontFamily: C.sans, fontSize: 10, fontWeight: 600, color: C.graphite, letterSpacing: "0.08em", textTransform: "uppercase" as const, textAlign: "center" }}>
        {label}
      </div>
      {children}
    </div>
  );
}

// ── Cell click side panel ─────────────────────────────────────────────────────
function CellPanel({ label, util, people, onClose }: { label: string; util: number; people: CellPerson[]; onClose: () => void }) {
  const col = utilColor(util);
  return (
    <>
      <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(22,48,63,0.18)", zIndex: 100 }} />
      <div style={{
        position: "fixed", top: 0, right: 0, bottom: 0, width: 300,
        background: C.paper, borderLeft: `1px solid ${C.hairline}`,
        boxShadow: "-6px 0 24px rgba(22,48,63,0.12)",
        zIndex: 101, display: "flex", flexDirection: "column",
      }}>
        <div style={{ padding: "18px 20px", borderBottom: `1px solid ${C.hairline}`, display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <div style={{ fontFamily: C.sans, fontWeight: 600, fontSize: 14, color: C.ink, marginBottom: 2 }}>{label}</div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontFamily: C.mono, fontSize: 18, fontWeight: 600, color: col.bg.includes("F") ? C.ink : col.bg }}>
                {util}%
              </span>
              <span style={{ fontFamily: C.sans, fontSize: 11, color: C.graphite }}>utilization</span>
            </div>
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: C.graphite, fontSize: 20, lineHeight: 1 }}>×</button>
        </div>
        <div style={{ flex: 1, overflowY: "auto", padding: "16px 20px" }}>
          {people.length === 0 ? (
            <div style={{ textAlign: "center", paddingTop: 32, fontFamily: C.sans, fontSize: 12, color: C.graphite }}>No staff in this cell.</div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {people.map((p, i) => (
                <div key={i} style={{ padding: "12px 14px", background: C.bg, border: `1px solid ${C.hairline}`, borderRadius: 7 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                    <div style={{ width: 28, height: 28, borderRadius: "50%", background: C.mist, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: C.sans, fontSize: 10, fontWeight: 600, color: C.slate, flexShrink: 0 }}>
                      {p.name.split(" ").map((n: string) => n[0]).join("")}
                    </div>
                    <span style={{ fontFamily: C.sans, fontWeight: 500, fontSize: 13, color: C.ink }}>{p.name}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                    <span style={{ fontFamily: C.sans, fontSize: 11, color: C.graphite }}>Utilization</span>
                    <span style={{ fontFamily: C.mono, fontSize: 12, fontWeight: 600, color: utilColor(Math.round((p.hours / p.capacity) * 100) || 0).bg }}>
                      {p.capacity > 0 ? Math.round((p.hours / p.capacity) * 100) : 0}%
                    </span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ fontFamily: C.sans, fontSize: 11, color: C.graphite }}>Hours</span>
                    <span style={{ fontFamily: C.mono, fontSize: 12, color: C.ink }}>{p.hours} / {p.capacity}h</span>
                  </div>
                  {p.capacity > 0 && (
                    <div style={{ marginTop: 8, height: 3, background: C.mist, borderRadius: 2 }}>
                      <div style={{
                        height: "100%",
                        width: `${Math.min((p.hours / p.capacity) * 100, 100)}%`,
                        background: utilColor(Math.round((p.hours / p.capacity) * 100)).bg,
                        borderRadius: 2,
                      }} />
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

// ── Stacked horizontal bar chart ──────────────────────────────────────────────
const STACKED_COLORS = { client: C.ink, bd: C.slate, internal: "#7A95A8" };
type SegKey = "client" | "bd" | "internal";
const SEG_LABELS: Record<SegKey, string> = { client: "Client", bd: "BD", internal: "Internal" };

function StackedRow({ d, maxTotal }: { d: typeof WORK_SPLITS[0]; maxTotal: number }) {
  const [hovSeg, setHovSeg] = useState<SegKey | null>(null);
  const total = d.client + d.bd + d.internal;
  const scale = (n: number) => `${Math.round((n / maxTotal) * 100)}%`;
  const segs: { key: SegKey; hours: number }[] = [
    { key: "client", hours: d.client },
    { key: "bd", hours: d.bd },
    { key: "internal", hours: d.internal },
  ];
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, position: "relative" }}>
      <div style={{ width: 130, flexShrink: 0, fontFamily: C.sans, fontSize: 11, color: C.graphite, textAlign: "right" }}>
        {d.dept}
      </div>
      <div style={{ flex: 1, height: 20, display: "flex", borderRadius: 3, overflow: "hidden" }}>
        {segs.map(({ key, hours }) => hours > 0 && (
          <div
            key={key}
            onMouseEnter={() => setHovSeg(key)}
            onMouseLeave={() => setHovSeg(null)}
            style={{
              width: scale(hours),
              background: STACKED_COLORS[key],
              transition: "width 0.4s, opacity 0.15s",
              opacity: hovSeg && hovSeg !== key ? 0.4 : 1,
              cursor: "default",
            }}
          />
        ))}
      </div>
      {hovSeg && (
        <div style={{
          position: "absolute",
          left: 148,
          top: -30,
          background: C.ink,
          color: "#fff",
          borderRadius: 4,
          padding: "3px 9px",
          fontFamily: C.mono,
          fontSize: 10,
          fontWeight: 600,
          whiteSpace: "nowrap",
          pointerEvents: "none",
          zIndex: 20,
          boxShadow: "0 2px 8px rgba(22,48,63,0.18)",
        }}>
          {SEG_LABELS[hovSeg]}: {segs.find((s) => s.key === hovSeg)?.hours ?? 0}h
        </div>
      )}
      <span style={{ fontFamily: C.mono, fontSize: 11, color: C.graphite, flexShrink: 0, width: 36, textAlign: "right" }}>{total}h</span>
    </div>
  );
}

function StackedBars() {
  const maxTotal = Math.max(...WORK_SPLITS.map((d) => d.client + d.bd + d.internal));
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      {WORK_SPLITS.map((d) => <StackedRow key={d.dept} d={d} maxTotal={maxTotal} />)}
      <div style={{ display: "flex", gap: 20, marginTop: 8, paddingLeft: 142 }}>
        {[
          { color: STACKED_COLORS.client, label: "Client Project" },
          { color: STACKED_COLORS.bd,     label: "BD Opportunity" },
          { color: STACKED_COLORS.internal, label: "Internal Work" },
        ].map((l) => (
          <div key={l.label} style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <div style={{ width: 10, height: 10, background: l.color, borderRadius: 2 }} />
            <span style={{ fontFamily: C.sans, fontSize: 11, color: C.graphite }}>{l.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Filter chip ───────────────────────────────────────────────────────────────
function Chip({ label, value, onChange, options }: { label: string; value: string; onChange: (v: string) => void; options: string[] }) {
  return (
    <div style={{ position: "relative" }}>
      <select value={value} onChange={(e) => onChange(e.target.value)} style={{
        fontFamily: C.sans, fontSize: 12, cursor: "pointer", appearance: "none" as const,
        color: value ? C.ink : C.graphite, fontWeight: value ? 500 : 400,
        background: value ? C.mist : C.paper,
        border: `1px solid ${value ? C.slate : C.hairline}`,
        borderRadius: 5, padding: "5px 24px 5px 10px", outline: "none",
      }}>
        <option value="">{label}</option>
        {options.map((o) => <option key={o}>{o}</option>)}
      </select>
      <svg width="9" height="9" viewBox="0 0 9 9" fill="none" style={{ position: "absolute", right: 7, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}>
        <path d="M1.5 3l3 3 3-3" stroke={C.graphite} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );
}

// ── Main FirmWide tab ─────────────────────────────────────────────────────────
export default function FirmWide() {
  const [heatmapAxis, setHeatmapAxis] = useState<"level" | "week">("level");
  const [openCell, setOpenCell] = useState<{ label: string; util: number; people: CellPerson[] } | null>(null);
  const [fDept, setFDept]   = useState("");
  const [fLevel, setFLevel] = useState("");
  const [fWork, setFWork]   = useState("");

  const visibleDepts = fDept ? [fDept] : [...DEPARTMENTS];
  const visibleLevels = fLevel ? [fLevel] : [...LEVELS];

  return (
    <div style={{ padding: "22px 28px 48px", maxWidth: 1200 }}>

      {/* filter bar */}
      <div style={{ display: "flex", gap: 8, marginBottom: 20, alignItems: "center" }}>
        <Chip label="Department" value={fDept}  onChange={setFDept}  options={[...DEPARTMENTS]} />
        <Chip label="Level"      value={fLevel} onChange={setFLevel} options={[...LEVELS]} />
        <Chip label="Work Type"  value={fWork}  onChange={setFWork}  options={["Client Project", "BD Opportunity", "Internal Work"]} />
        {(fDept || fLevel || fWork) && (
          <button onClick={() => { setFDept(""); setFLevel(""); setFWork(""); }}
            style={{ fontFamily: C.sans, fontSize: 12, color: C.graphite, background: "none", border: "none", cursor: "pointer", textDecoration: "underline" }}>
            Clear
          </button>
        )}
      </div>

      {/* KPI row */}
      <div style={{ display: "flex", gap: 14, marginBottom: 24 }}>
        <KpiCard label="Overall Utilization">
          <ArcGauge value={FIRM_KPIS.overallUtil} size={96} color={C.green} />
          <div style={{ fontFamily: C.sans, fontSize: 11, color: C.graphite }}>of 760 hrs / week</div>
        </KpiCard>

        <KpiCard label="Total Hours Logged">
          <div style={{ fontFamily: C.mono, fontSize: 40, fontWeight: 600, color: C.ink, lineHeight: 1 }}>
            {FIRM_KPIS.totalHours}
          </div>
          <div style={{ fontFamily: C.sans, fontSize: 11, color: C.graphite }}>this period</div>
        </KpiCard>

        <KpiCard label="Available Capacity">
          <div style={{ fontFamily: C.mono, fontSize: 40, fontWeight: 600, color: C.slate, lineHeight: 1 }}>
            {FIRM_KPIS.availableCapacity}
          </div>
          <div style={{ fontFamily: C.sans, fontSize: 11, color: C.graphite }}>hours remaining</div>
        </KpiCard>

        <KpiCard label="People Over Capacity">
          <div style={{ fontFamily: C.mono, fontSize: 40, fontWeight: 600, color: FIRM_KPIS.overCapacityCount > 0 ? C.red : C.green, lineHeight: 1 }}>
            {FIRM_KPIS.overCapacityCount}
          </div>
          <div style={{ fontFamily: C.sans, fontSize: 11, color: FIRM_KPIS.overCapacityCount > 0 ? C.red : C.graphite }}>
            {FIRM_KPIS.overCapacityCount > 0 ? "require attention" : "all within capacity"}
          </div>
        </KpiCard>
      </div>

      {/* Heatmap */}
      <div style={{ background: C.paper, border: `1px solid ${C.hairline}`, borderRadius: 8, overflow: "hidden", marginBottom: 20 }}>
        <div style={{ padding: "13px 18px", borderBottom: `1px solid ${C.hairline}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontFamily: C.sans, fontWeight: 600, fontSize: 13, color: C.ink }}>Utilization Heatmap</span>
          <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
            {/* axis toggle */}
            <div style={{ display: "flex", border: `1px solid ${C.hairline}`, borderRadius: 5, overflow: "hidden" }}>
              {(["level", "week"] as const).map((axis) => (
                <button key={axis} onClick={() => setHeatmapAxis(axis)} style={{
                  padding: "4px 12px", border: "none", cursor: "pointer",
                  background: heatmapAxis === axis ? C.ink : C.paper,
                  fontFamily: C.sans, fontSize: 11, fontWeight: 500,
                  color: heatmapAxis === axis ? "#D9E2E8" : C.graphite,
                  transition: "all 0.12s",
                }}
                  onMouseEnter={(e) => { if (heatmapAxis !== axis) (e.currentTarget as HTMLElement).style.background = C.mist; }}
                  onMouseLeave={(e) => { if (heatmapAxis !== axis) (e.currentTarget as HTMLElement).style.background = C.paper; }}
                >
                  By {axis === "level" ? "Level" : "Week"}
                </button>
              ))}
            </div>
            {/* colour scale legend */}
            <div style={{ display: "flex", alignItems: "center", gap: 4, marginLeft: 10 }}>
              {[
                { bg: "#DCE4E9", label: "Low" },
                { bg: "#A8BEC9", label: ""    },
                { bg: C.slate,   label: ""    },
                { bg: C.ink,     label: "Target" },
                { bg: C.amber,   label: ""    },
                { bg: C.red,     label: "Over" },
              ].map((s, i) => (
                <div key={i} title={s.label} style={{ width: 16, height: 16, background: s.bg, borderRadius: 2 }} />
              ))}
              <span style={{ fontFamily: C.sans, fontSize: 9, color: C.graphite, marginLeft: 2 }}>← under / over →</span>
            </div>
          </div>
        </div>

        <div style={{ overflowX: "auto", padding: "14px 18px" }}>
          {heatmapAxis === "level" ? (
            <table style={{ borderCollapse: "collapse", width: "100%" }}>
              <thead>
                <tr>
                  <th style={{ padding: "6px 12px 6px 0", fontFamily: C.sans, fontSize: 10, fontWeight: 600, color: C.graphite, textAlign: "left", letterSpacing: "0.06em", textTransform: "uppercase" as const, whiteSpace: "nowrap" as const }}>
                    Department
                  </th>
                  {visibleLevels.map((l) => (
                    <th key={l} style={{ padding: "6px 8px", fontFamily: C.sans, fontSize: 10, fontWeight: 600, color: C.graphite, textAlign: "center", letterSpacing: "0.06em", textTransform: "uppercase" as const, whiteSpace: "nowrap" as const }}>
                      {l}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {visibleDepts.map((dept) => (
                  <tr key={dept}>
                    <td style={{ padding: "5px 12px 5px 0", fontFamily: C.sans, fontSize: 12, color: C.ink, whiteSpace: "nowrap" as const }}>
                      {dept}
                    </td>
                    {visibleLevels.map((level) => {
                      const cell = HEATMAP_BY_LEVEL[dept]?.[level];
                      const util = cell?.util ?? 0;
                      const col  = utilColor(util);
                      return (
                        <td key={level} style={{ padding: "3px 4px" }}>
                          <div
                            onClick={() => cell && cell.capacity > 0 && setOpenCell({ label: `${dept} · ${level}`, util, people: cell.people })}
                            style={{
                              width: 72, height: 36,
                              background: cell?.capacity === 0 ? C.bg : col.bg,
                              borderRadius: 4,
                              display: "flex", alignItems: "center", justifyContent: "center",
                              cursor: cell?.capacity > 0 ? "pointer" : "default",
                              transition: "opacity 0.12s",
                            }}
                            onMouseEnter={(e) => { if (cell?.capacity > 0) (e.currentTarget as HTMLElement).style.opacity = "0.82"; }}
                            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.opacity = "1"; }}
                          >
                            {cell?.capacity > 0 ? (
                              <span style={{ fontFamily: C.mono, fontSize: 12, fontWeight: 600, color: col.text }}>{util}%</span>
                            ) : (
                              <span style={{ fontFamily: C.mono, fontSize: 10, color: C.hairline }}>—</span>
                            )}
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            /* by-week heatmap */
            <table style={{ borderCollapse: "collapse", width: "100%" }}>
              <thead>
                <tr>
                  <th style={{ padding: "6px 12px 6px 0", fontFamily: C.sans, fontSize: 10, fontWeight: 600, color: C.graphite, textAlign: "left", letterSpacing: "0.06em", textTransform: "uppercase" as const }}>
                    Department
                  </th>
                  {WEEKS.map((w) => (
                    <th key={w} style={{ padding: "6px 8px", fontFamily: C.mono, fontSize: 9, fontWeight: 600, color: C.graphite, textAlign: "center", whiteSpace: "nowrap" as const }}>
                      {w}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {visibleDepts.map((dept) => {
                  const weeks = HEATMAP_BY_WEEK[dept] ?? [];
                  return (
                    <tr key={dept}>
                      <td style={{ padding: "5px 12px 5px 0", fontFamily: C.sans, fontSize: 12, color: C.ink, whiteSpace: "nowrap" as const }}>{dept}</td>
                      {weeks.map((util, wi) => {
                        const col = utilColor(util);
                        return (
                          <td key={wi} style={{ padding: "3px 4px" }}>
                            <div
                              style={{ width: 80, height: 36, background: col.bg, borderRadius: 4, display: "flex", alignItems: "center", justifyContent: "center", transition: "opacity 0.12s", cursor: "default" }}
                              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.opacity = "0.75"; }}
                              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.opacity = "1"; }}
                            >
                              <span style={{ fontFamily: C.mono, fontSize: 12, fontWeight: 600, color: col.text }}>{util}%</span>
                            </div>
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Stacked bar chart */}
      <div style={{ background: C.paper, border: `1px solid ${C.hairline}`, borderRadius: 8, padding: "16px 20px" }}>
        <div style={{ fontFamily: C.sans, fontWeight: 600, fontSize: 13, color: C.ink, marginBottom: 16 }}>
          Hours by Work Type · by Department
        </div>
        <StackedBars />
      </div>

      {/* cell panel */}
      {openCell && (
        <CellPanel
          label={openCell.label}
          util={openCell.util}
          people={openCell.people}
          onClose={() => setOpenCell(null)}
        />
      )}
    </div>
  );
}
