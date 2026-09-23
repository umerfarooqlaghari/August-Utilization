import { useState } from "react";
import { PROJECTS, Project, RISK_COLOR, RISK_LABEL, RISK_BG, TIER_BADGE, relativeTime, ALL_STAGES } from "./data";
import StageStepper from "./StageStepper";
import PlannedActualBar from "./PlannedActualBar";

// ── tokens ────────────────────────────────────────────────────────────────────
const INK      = "#16303F";
const SLATE    = "#3E5568";
const PAPER    = "#FFFFFF";
const MIST     = "#E4E9EC";
const GRAPHITE = "#5B6472";
const HAIRLINE = "#DAD7CF";
const BG       = "#F8FAFB";
const AMBER    = "#B8875A";
const SANS     = "'IBM Plex Sans', sans-serif";
const MONO     = "'IBM Plex Mono', monospace";

// ── tiny arc gauge for table cell ────────────────────────────────────────────
function MiniGauge({ value, color }: { value: number; color: string }) {
  const S = 34; const r = 12; const cx = S / 2; const cy = S / 2;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const start = -225; const sweep = 270;
  const arc = (a1: number, a2: number) => {
    const x1 = cx + r * Math.cos(toRad(a1)); const y1 = cy + r * Math.sin(toRad(a1));
    const x2 = cx + r * Math.cos(toRad(a2)); const y2 = cy + r * Math.sin(toRad(a2));
    return `M${x1} ${y1} A${r} ${r} 0 ${a2 - a1 > 180 ? 1 : 0} 1 ${x2} ${y2}`;
  };
  const end = start + sweep * Math.min(value, 100) / 100;
  return (
    <div style={{ position: "relative", width: S, height: S }}>
      <svg width={S} height={S} viewBox={`0 0 ${S} ${S}`}>
        <path d={arc(start, start + sweep)} fill="none" stroke={MIST}  strokeWidth={3} strokeLinecap="round" />
        {value > 0 && <path d={arc(start, end)} fill="none" stroke={color} strokeWidth={3} strokeLinecap="round" />}
      </svg>
      <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <span style={{ fontFamily: MONO, fontSize: 8, fontWeight: 600, color: INK }}>{value}%</span>
      </div>
    </div>
  );
}

// ── onboarding badge — amber, hidden when pct === 100 ────────────────────────
function OnboardingBadge({ pct }: { pct: number }) {
  if (pct >= 100) return null;
  return (
    <span style={{
      fontFamily: SANS, fontSize: 10, fontWeight: 600,
      color: AMBER, background: "#FBF6F0",
      border: "1px solid #E8C9A0",
      padding: "2px 7px", borderRadius: 3,
      whiteSpace: "nowrap" as const, letterSpacing: "0.01em",
    }}>
      Onboarding · <span style={{ fontFamily: MONO }}>{pct}%</span>
    </span>
  );
}

// ── filter chip ───────────────────────────────────────────────────────────────
function FilterChip({ label, value, onChange, options }: { label: string; value: string; onChange: (v: string) => void; options: string[] }) {
  return (
    <div style={{ position: "relative" }}>
      <select value={value} onChange={(e) => onChange(e.target.value)} style={{
        fontFamily: SANS, fontSize: 12, cursor: "pointer", appearance: "none" as const,
        color: value ? INK : GRAPHITE, fontWeight: value ? 500 : 400,
        background: value ? MIST : PAPER,
        border: `1px solid ${value ? SLATE : HAIRLINE}`,
        borderRadius: 5, padding: "5px 24px 5px 10px", outline: "none",
      }}>
        <option value="">{label}</option>
        {options.map((o) => <option key={o}>{o}</option>)}
      </select>
      <svg width="9" height="9" viewBox="0 0 9 9" fill="none" style={{ position: "absolute", right: 7, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}>
        <path d="M1.5 3l3 3 3-3" stroke={GRAPHITE} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );
}

// ── view-toggle button ────────────────────────────────────────────────────────
function ViewBtn({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button onClick={onClick} style={{
      width: 32, height: 30, display: "flex", alignItems: "center", justifyContent: "center",
      border: "none", cursor: "pointer",
      background: active ? INK : PAPER,
      color: active ? "#D9E2E8" : GRAPHITE,
      transition: "all 0.12s",
    }}
      onMouseEnter={(e) => { if (!active) (e.currentTarget as HTMLElement).style.background = MIST; }}
      onMouseLeave={(e) => { if (!active) (e.currentTarget as HTMLElement).style.background = PAPER; }}
    >
      {children}
    </button>
  );
}

// ── table view ────────────────────────────────────────────────────────────────
function TableView({ rows, onSelect }: { rows: Project[]; onSelect: (id: string) => void }) {
  const COLS = ["Project / Partner", "Tier", "Stage", "Completion", "Onboarding", "Hrs Plan vs Actual", "Status", "Updated"];
  if (rows.length === 0) return (
    <div style={{ background: PAPER, border: `1px solid ${HAIRLINE}`, borderRadius: 8, padding: "64px 24px", textAlign: "center" }}>
      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke={HAIRLINE} strokeWidth="1.5" style={{ marginBottom: 12 }}>
        <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
      </svg>
      <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: 14, color: INK, marginBottom: 5 }}>No projects match your filters</div>
      <div style={{ fontFamily: SANS, fontSize: 13, color: GRAPHITE }}>Try adjusting the filter bar or clearing your search.</div>
    </div>
  );

  return (
    <div style={{ background: PAPER, border: `1px solid ${HAIRLINE}`, borderRadius: 8, overflow: "hidden" }}>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ background: BG, borderBottom: `1px solid ${HAIRLINE}` }}>
            {COLS.map((h) => (
              <th key={h} style={{
                padding: "10px 14px", textAlign: "left",
                fontFamily: SANS, fontSize: 11, fontWeight: 600, color: GRAPHITE,
                letterSpacing: "0.06em", textTransform: "uppercase" as const, whiteSpace: "nowrap" as const,
              }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((p, i) => (
            <tr
              key={p.id}
              onClick={() => onSelect(p.id)}
              style={{
                borderBottom: i < rows.length - 1 ? `1px solid ${MIST}` : "none",
                background: i % 2 === 0 ? PAPER : BG,
                cursor: "pointer", transition: "background 0.1s",
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "#EDF2F5"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = i % 2 === 0 ? PAPER : BG; }}
            >
              {/* Project / Partner */}
              <td style={{ padding: "12px 14px", verticalAlign: "middle" }}>
                <div style={{ fontFamily: SANS, fontWeight: 500, fontSize: 13, color: INK }}>{p.name}</div>
                <div style={{ fontFamily: SANS, fontSize: 11, color: GRAPHITE, marginTop: 2 }}>{p.partnerFull}</div>
              </td>
              {/* Tier */}
              <td style={{ padding: "12px 14px", verticalAlign: "middle" }}>
                <span style={{ fontFamily: SANS, fontSize: 11, fontWeight: 500, padding: "2px 7px", borderRadius: 3, ...TIER_BADGE[p.tier] }}>
                  {p.tier}
                </span>
              </td>
              {/* Stage stepper */}
              <td style={{ padding: "12px 14px", verticalAlign: "middle" }}>
                <StageStepper currentStage={p.currentStage} variant="compact" />
                <div style={{ fontFamily: SANS, fontSize: 10, color: GRAPHITE, marginTop: 4 }}>{p.currentStage}</div>
              </td>
              {/* Completion gauge */}
              <td style={{ padding: "12px 14px", verticalAlign: "middle" }}>
                <MiniGauge value={p.completion} color={RISK_COLOR[p.status]} />
              </td>
              {/* Onboarding badge */}
              <td style={{ padding: "12px 14px", verticalAlign: "middle" }}>
                <OnboardingBadge pct={p.onboardingPct} />
              </td>
              {/* Planned vs Actual */}
              <td style={{ padding: "12px 14px", verticalAlign: "middle" }}>
                <PlannedActualBar planned={p.plannedHoursTotal} actual={p.actualHoursTotal} width={88} height={6} showLabels />
              </td>
              {/* Status */}
              <td style={{ padding: "12px 14px", verticalAlign: "middle" }}>
                <span style={{
                  fontFamily: SANS, fontSize: 11, fontWeight: 500,
                  color: RISK_COLOR[p.status], background: RISK_BG[p.status],
                  padding: "2px 8px", borderRadius: 3,
                }}>
                  {RISK_LABEL[p.status]}
                </span>
              </td>
              {/* Updated */}
              <td style={{ padding: "12px 14px", verticalAlign: "middle" }}>
                <span style={{ fontFamily: MONO, fontSize: 11, color: GRAPHITE }}>{relativeTime(p.lastUpdated)}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ── board view (kanban by stage) ──────────────────────────────────────────────
function BoardView({ rows, onSelect }: { rows: Project[]; onSelect: (id: string) => void }) {
  return (
    <div style={{ display: "flex", gap: 10, overflowX: "auto", paddingBottom: 4 }}>
      {ALL_STAGES.map((stage) => {
        const cards = rows.filter((p) => p.currentStage === stage);
        return (
          <div key={stage} style={{ minWidth: 210, flex: "0 0 210px" }}>
            {/* column header */}
            <div style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              padding: "7px 10px", marginBottom: 8,
              background: PAPER, border: `1px solid ${HAIRLINE}`, borderRadius: 6,
            }}>
              <span style={{ fontFamily: SANS, fontSize: 11, fontWeight: 600, color: INK }}>{stage}</span>
              <span style={{ fontFamily: MONO, fontSize: 11, color: GRAPHITE }}>{cards.length}</span>
            </div>
            {/* cards */}
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {cards.length === 0 ? (
                <div style={{
                  padding: "18px 10px", borderRadius: 6,
                  border: `1px dashed ${HAIRLINE}`, background: BG,
                  textAlign: "center", fontFamily: SANS, fontSize: 11, color: GRAPHITE,
                }}>—</div>
              ) : cards.map((p) => (
                <button key={p.id} onClick={() => onSelect(p.id)} style={{
                  width: "100%", textAlign: "left", cursor: "pointer",
                  background: PAPER, border: `1px solid ${HAIRLINE}`,
                  borderLeft: `3px solid ${RISK_COLOR[p.status]}`,
                  borderRadius: 7, padding: "11px 12px",
                  transition: "box-shadow 0.14s",
                }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.boxShadow = "0 2px 10px rgba(22,48,63,0.10)"; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.boxShadow = "none"; }}
                >
                  <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: 12, color: INK, marginBottom: 1 }}>{p.name}</div>
                  <div style={{ fontFamily: SANS, fontSize: 11, color: GRAPHITE, marginBottom: 8 }}>{p.partnerFull}</div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                    <span style={{ fontFamily: SANS, fontSize: 10, fontWeight: 500, padding: "1px 6px", borderRadius: 2, ...TIER_BADGE[p.tier] }}>
                      {p.tier}
                    </span>
                    {p.onboardingPct < 100 && (
                      <span style={{ fontFamily: SANS, fontSize: 9, fontWeight: 600, color: AMBER }}>
                        Onboarding <span style={{ fontFamily: MONO }}>{p.onboardingPct}%</span>
                      </span>
                    )}
                  </div>
                  <div style={{ height: 3, background: MIST, borderRadius: 2, marginBottom: 3 }}>
                    <div style={{ height: "100%", width: `${p.completion}%`, background: RISK_COLOR[p.status], borderRadius: 2 }} />
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ fontFamily: MONO, fontSize: 9, color: GRAPHITE }}>{p.completion}% done</span>
                    <span style={{ fontFamily: MONO, fontSize: 9, fontWeight: 600, color: RISK_COLOR[p.status] }}>{RISK_LABEL[p.status]}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ── main export ───────────────────────────────────────────────────────────────
interface ProjectsListProps {
  onSelect: (id: string) => void;
}

export default function ProjectsList({ onSelect }: ProjectsListProps) {
  const [view, setView]         = useState<"table" | "board">("table");
  const [search, setSearch]     = useState("");
  const [fPartner, setFPartner] = useState("");
  const [fTier, setFTier]       = useState("");
  const [fStatus, setFStatus]   = useState("");

  const visible = PROJECTS.filter((p) => {
    const q = search.toLowerCase();
    if (q && !p.name.toLowerCase().includes(q) && !p.client.toLowerCase().includes(q)) return false;
    if (fPartner && p.partner !== fPartner) return false;
    if (fTier && p.tier !== fTier) return false;
    if (fStatus && RISK_LABEL[p.status] !== fStatus) return false;
    return true;
  });

  return (
    <div style={{ padding: "22px 28px 48px", maxWidth: 1300 }}>
      {/* filter + view-toggle bar */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14, flexWrap: "wrap" as const }}>
        {/* search */}
        <div style={{ position: "relative", flex: "0 0 210px" }}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={GRAPHITE} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
            style={{ position: "absolute", left: 9, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}>
            <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Search projects or clients…"
            style={{
              fontFamily: SANS, fontSize: 13, color: INK, background: PAPER,
              border: `1px solid ${HAIRLINE}`, borderRadius: 6,
              padding: "6px 10px 6px 30px", outline: "none", width: "100%",
            }}
            onFocus={(e) => { e.currentTarget.style.borderColor = SLATE; }}
            onBlur={(e)  => { e.currentTarget.style.borderColor = HAIRLINE; }}
          />
        </div>
        <FilterChip label="Partner" value={fPartner} onChange={setFPartner} options={["J. Mercer", "S. Okafor", "L. Vance", "R. Patel"]} />
        <FilterChip label="Tier"    value={fTier}    onChange={setFTier}    options={["Tier 1","Tier 2","Tier 3"]} />
        <FilterChip label="Status"  value={fStatus}  onChange={setFStatus}  options={["On Track","At Risk","Behind"]} />
        {(search || fPartner || fTier || fStatus) && (
          <button onClick={() => { setSearch(""); setFPartner(""); setFTier(""); setFStatus(""); }}
            style={{ fontFamily: SANS, fontSize: 12, color: GRAPHITE, background: "none", border: "none", cursor: "pointer", textDecoration: "underline" }}>
            Clear
          </button>
        )}
        <div style={{ flex: 1 }} />
        <span style={{ fontFamily: SANS, fontSize: 12, color: GRAPHITE }}>
          <span style={{ fontFamily: MONO, fontWeight: 600, color: INK }}>{visible.length}</span> projects
        </span>
        {/* view toggle */}
        <div style={{ display: "flex", border: `1px solid ${HAIRLINE}`, borderRadius: 6, overflow: "hidden" }}>
          <ViewBtn active={view === "table"} onClick={() => setView("table")}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="1" /><line x1="3" y1="9" x2="21" y2="9" /><line x1="3" y1="15" x2="21" y2="15" /><line x1="9" y1="9" x2="9" y2="21" />
            </svg>
          </ViewBtn>
          <ViewBtn active={view === "board"} onClick={() => setView("board")}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="5" height="18" rx="1" /><rect x="10" y="3" width="5" height="18" rx="1" /><rect x="17" y="3" width="5" height="18" rx="1" />
            </svg>
          </ViewBtn>
        </div>
      </div>

      {view === "table"
        ? <TableView rows={visible} onSelect={onSelect} />
        : <BoardView rows={visible} onSelect={onSelect} />
      }
    </div>
  );
}
