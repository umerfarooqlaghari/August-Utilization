import { useState } from "react";
import { PROJECTS, RISK_COLOR, RISK_LABEL, RISK_BG, TIER_BADGE, OnboardingItem, DeptHours, StageRecord } from "./data";
import StageStepper from "./StageStepper";
import ArcGauge from "../ArcGauge";
import PlannedActualBar from "./PlannedActualBar";
import { useViewport } from "../../hooks/useViewport";

// ── tokens ────────────────────────────────────────────────────────────────────
const INK      = "#16303F";
const SLATE    = "#3E5568";
const PAPER    = "#FFFFFF";
const MIST     = "#E4E9EC";
const GRAPHITE = "#5B6472";
const HAIRLINE = "#DAD7CF";
const BG       = "#F8FAFB";
const AMBER    = "#B8875A";
const GREEN    = "#3F7A5D";
const RED      = "#B14A3D";
const SANS     = "'IBM Plex Sans', sans-serif";
const MONO     = "'IBM Plex Mono', monospace";
const TODAY    = "2024-08-24";

// ── helpers ───────────────────────────────────────────────────────────────────
function daysBetween(a: string, b: string) {
  return Math.round((new Date(b).getTime() - new Date(a).getTime()) / 86400000);
}

// ── card shell ────────────────────────────────────────────────────────────────
function Card({ title, children, right }: { title: React.ReactNode; children: React.ReactNode; right?: React.ReactNode }) {
  return (
    <div style={{ background: PAPER, border: `1px solid ${HAIRLINE}`, borderRadius: 8, overflow: "hidden", marginBottom: 16 }}>
      <div style={{
        padding: "13px 20px", borderBottom: `1px solid ${HAIRLINE}`,
        display: "flex", justifyContent: "space-between", alignItems: "center",
      }}>
        <span style={{ fontFamily: SANS, fontWeight: 600, fontSize: 13, color: INK }}>{title}</span>
        {right}
      </div>
      <div style={{ padding: "18px 20px" }}>{children}</div>
    </div>
  );
}

// ── onboarding checklist ──────────────────────────────────────────────────────
function OnboardingCard({ initialItems }: { initialItems: OnboardingItem[] }) {
  const [items, setItems] = useState(initialItems);
  const done = items.filter((i) => i.done).length;
  const pct  = Math.round((done / items.length) * 100);

  const toggle = (id: string) =>
    setItems((prev) => prev.map((it) => it.id === id ? { ...it, done: !it.done } : it));

  if (pct === 100) return null;

  return (
    <div style={{
      background: "#FBF6F0", border: "1px solid #E8C9A0", borderRadius: 8,
      overflow: "hidden", marginBottom: 16,
    }}>
      {/* header */}
      <div style={{
        padding: "13px 20px", borderBottom: "1px solid #E8C9A0",
        display: "flex", justifyContent: "space-between", alignItems: "center",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontFamily: SANS, fontWeight: 600, fontSize: 13, color: "#7A5030" }}>
            Onboarding Checklist
          </span>
          <span style={{ fontFamily: MONO, fontSize: 11, fontWeight: 600, color: AMBER }}>{pct}%</span>
        </div>
        {/* arc gauge — consistent with the 270° arc used everywhere */}
        <ArcGauge value={pct} size={32} color={AMBER} label=" " />
      </div>
      {/* items */}
      <div style={{ padding: "14px 20px" }}>
        <p style={{ fontFamily: SANS, fontSize: 12, color: "#7A5030", margin: "0 0 12px", lineHeight: 1.55 }}>
          Complete all setup items before this project transitions to full delivery tracking.
          <br />
          <em style={{ fontStyle: "normal", fontWeight: 500 }}>Onboarding % is independent of Delivery %.</em>
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {items.map((item) => (
            <label key={item.id} style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}>
              <input type="checkbox" checked={item.done} onChange={() => toggle(item.id)}
                style={{ width: 15, height: 15, accentColor: AMBER, cursor: "pointer", flexShrink: 0 }} />
              <span style={{
                fontFamily: SANS, fontSize: 13, color: item.done ? GRAPHITE : "#7A5030",
                textDecoration: item.done ? "line-through" : "none",
              }}>
                {item.label}
              </span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── dept bar chart ─────────────────────────────────────────────────────────────
function DeptChart({ deptHours }: { deptHours: DeptHours[] }) {
  const [scope, setScope] = useState<"cumulative" | "stage">("cumulative");
  const CHART_H = 96;
  // "this stage" approximation: show 35–45% of cumulative as illustrative
  const vals = deptHours.map((d) => ({
    ...d,
    p: scope === "cumulative" ? d.planned : Math.round(d.planned * 0.38),
    a: scope === "cumulative" ? d.actual  : Math.round(d.actual  * 0.35),
  }));
  const max = Math.max(...vals.flatMap((d) => [d.p, d.a])) * 1.18 || 1;

  return (
    <div>
      {/* toggle */}
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 16 }}>
        <div style={{ display: "flex", border: `1px solid ${HAIRLINE}`, borderRadius: 5, overflow: "hidden" }}>
          {(["cumulative", "stage"] as const).map((s) => (
            <button key={s} onClick={() => setScope(s)} style={{
              padding: "4px 13px", border: "none", cursor: "pointer",
              background: scope === s ? INK : PAPER,
              fontFamily: SANS, fontSize: 11, fontWeight: 500,
              color: scope === s ? "#D9E2E8" : GRAPHITE,
              transition: "all 0.12s",
            }}
              onMouseEnter={(e) => { if (scope !== s) (e.currentTarget as HTMLElement).style.background = MIST; }}
              onMouseLeave={(e) => { if (scope !== s) (e.currentTarget as HTMLElement).style.background = PAPER; }}
            >
              {s === "cumulative" ? "Cumulative" : "This Stage"}
            </button>
          ))}
        </div>
      </div>

      {/* bars */}
      <div style={{ display: "flex", alignItems: "flex-end", gap: 14 }}>
        {vals.map((d) => {
          const isOver = d.a > d.p;
          const pH = Math.round((d.p / max) * CHART_H);
          const aH = Math.round((Math.min(d.a, d.p) / max) * CHART_H);
          const oH = isOver ? Math.round(((d.a - d.p) / max) * CHART_H) : 0;
          return (
            <div key={d.dept} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
              {/* grouped bars */}
              <div style={{ display: "flex", alignItems: "flex-end", gap: 3, height: CHART_H }}>
                {/* planned (outline) */}
                <div style={{ width: 16, height: pH, border: `1.5px solid ${INK}`, borderRadius: "3px 3px 0 0", background: "transparent" }} />
                {/* actual */}
                <div style={{ position: "relative", width: 16 }}>
                  <div style={{ width: 16, height: aH, background: isOver ? RED : GREEN, borderRadius: "3px 3px 0 0" }} />
                  {oH > 0 && (
                    <div style={{
                      position: "absolute", bottom: aH, left: 0, width: 16, height: oH,
                      background: RED, opacity: 0.55, borderRadius: "3px 3px 0 0",
                    }} />
                  )}
                </div>
              </div>
              {/* hr labels */}
              <div style={{ display: "flex", gap: 2, alignItems: "baseline" }}>
                <span style={{ fontFamily: MONO, fontSize: 9, color: GRAPHITE }}>{d.a}</span>
                <span style={{ fontSize: 9, color: HAIRLINE }}>/</span>
                <span style={{ fontFamily: MONO, fontSize: 9, color: GRAPHITE }}>{d.p}</span>
              </div>
              <span style={{ fontFamily: SANS, fontSize: 9, color: GRAPHITE, textAlign: "center" }}>{d.dept}</span>
            </div>
          );
        })}
      </div>

      {/* legend */}
      <div style={{ display: "flex", gap: 16, marginTop: 14, justifyContent: "center" }}>
        {[
          { swatch: <div style={{ width: 12, height: 8, border: `1.5px solid ${INK}`, borderRadius: 2 }} />, label: "Planned" },
          { swatch: <div style={{ width: 12, height: 8, background: GREEN, borderRadius: 2 }} />, label: "Actual" },
          { swatch: <div style={{ width: 12, height: 8, background: RED,   borderRadius: 2 }} />, label: "Over plan" },
        ].map((l) => (
          <div key={l.label} style={{ display: "flex", alignItems: "center", gap: 5 }}>
            {l.swatch}
            <span style={{ fontFamily: SANS, fontSize: 10, color: GRAPHITE }}>{l.label}</span>
          </div>
        ))}
      </div>

      {/* totals row */}
      <div style={{
        display: "grid", gridTemplateColumns: "repeat(3,1fr)",
        gap: 12, marginTop: 18, paddingTop: 16, borderTop: `1px solid ${MIST}`,
      }}>
        {[
          { label: "Planned Total", value: `${deptHours.reduce((s, d) => s + d.planned, 0)}h`, color: INK },
          { label: "Actual Total",  value: `${deptHours.reduce((s, d) => s + d.actual, 0)}h`,
            color: deptHours.reduce((s, d) => s + d.actual, 0) > deptHours.reduce((s, d) => s + d.planned, 0) ? RED : GREEN },
          { label: (() => {
              const diff = deptHours.reduce((s, d) => s + d.actual, 0) - deptHours.reduce((s, d) => s + d.planned, 0);
              return diff > 0 ? "Over Plan" : "Under Plan";
            })(),
            value: `${Math.abs(deptHours.reduce((s, d) => s + d.actual - d.planned, 0))}h`,
            color: GRAPHITE },
        ].map((s) => (
          <div key={s.label}>
            <div style={{ fontFamily: SANS, fontSize: 10, fontWeight: 600, color: GRAPHITE, letterSpacing: "0.07em", textTransform: "uppercase" as const, marginBottom: 4 }}>{s.label}</div>
            <div style={{ fontFamily: MONO, fontSize: 20, fontWeight: 600, color: s.color }}>{s.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── stage history timeline ─────────────────────────────────────────────────────
function StageHistory({ history }: { history: StageRecord[] }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
      {history.map((s, i) => {
        const end     = s.exitDate ?? TODAY;
        const actual  = daysBetween(s.enteredDate, end);
        const isOver  = actual > s.expectedDays;
        const isLive  = !s.exitDate;
        return (
          <div key={i} style={{ display: "flex", gap: 14 }}>
            {/* spine */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: 16, flexShrink: 0 }}>
              <div style={{
                width: 12, height: 12, borderRadius: "50%", flexShrink: 0, marginTop: 2,
                background: isLive ? INK : GREEN,
              }} />
              {i < history.length - 1 && (
                <div style={{ width: 1, flex: 1, background: HAIRLINE, margin: "3px 0" }} />
              )}
            </div>
            {/* content */}
            <div style={{ paddingBottom: i < history.length - 1 ? 18 : 0, flex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 3 }}>
                <span style={{ fontFamily: SANS, fontWeight: 500, fontSize: 13, color: INK }}>{s.name}</span>
                {isLive && (
                  <span style={{ fontFamily: SANS, fontSize: 10, fontWeight: 600, color: INK, background: MIST, padding: "1px 6px", borderRadius: 3 }}>Active</span>
                )}
                {isOver && (
                  <span style={{ display: "flex", alignItems: "center", gap: 4, fontFamily: SANS, fontSize: 10, fontWeight: 600, color: AMBER }}
                    title={`Ran ${actual - s.expectedDays}d over expected ${s.expectedDays}d`}>
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                      <line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" />
                    </svg>
                    +{actual - s.expectedDays}d over expected
                  </span>
                )}
              </div>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" as const }}>
                <span style={{ fontFamily: MONO, fontSize: 11, color: GRAPHITE }}>Entered {s.enteredDate}</span>
                {s.exitDate && (
                  <>
                    <span style={{ color: HAIRLINE }}>→</span>
                    <span style={{ fontFamily: MONO, fontSize: 11, color: GRAPHITE }}>Exited {s.exitDate}</span>
                  </>
                )}
                <span style={{ fontFamily: MONO, fontSize: 11, color: isOver ? AMBER : GRAPHITE }}>
                  {actual}d {isLive ? "so far" : ""}{" "}
                  {isOver ? `(expected ${s.expectedDays}d)` : `/ ${s.expectedDays}d exp.`}
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ── staffed team ──────────────────────────────────────────────────────────────
function StaffedTeam({ team, loading }: { team: { id: string; name: string; department: string; level: string; hoursThisPeriod: number }[]; loading?: boolean }) {
  if (loading) {
    return (
      <>
        <style>{`@keyframes shimmer{0%{background-position:200% 0}100%{background-position:-200% 0}}`}</style>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {[1,2,3].map((i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 32, height: 32, borderRadius: "50%", flexShrink: 0, background: "linear-gradient(90deg,#E4E9EC 25%,#EFF2F4 50%,#E4E9EC 75%)", backgroundSize: "200% 100%", animation: "shimmer 1.4s infinite" }} />
              <div style={{ flex: 1 }}>
                <div style={{ height: 10, borderRadius: 3, marginBottom: 5, width: "60%", background: "linear-gradient(90deg,#E4E9EC 25%,#EFF2F4 50%,#E4E9EC 75%)", backgroundSize: "200% 100%", animation: "shimmer 1.4s infinite" }} />
                <div style={{ height: 8,  borderRadius: 3, width: "40%", background: "linear-gradient(90deg,#E4E9EC 25%,#EFF2F4 50%,#E4E9EC 75%)", backgroundSize: "200% 100%", animation: "shimmer 1.4s infinite" }} />
              </div>
            </div>
          ))}
        </div>
      </>
    );
  }

  if (team.length === 0) {
    return (
      <div style={{ textAlign: "center", padding: "18px 0" }}>
        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke={HAIRLINE} strokeWidth="1.5" style={{ marginBottom: 10 }}>
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" />
          <line x1="19" y1="8" x2="19" y2="14" /><line x1="22" y1="11" x2="16" y2="11" />
        </svg>
        <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: 12, color: INK, marginBottom: 4 }}>No team staffed yet</div>
        <div style={{ fontFamily: SANS, fontSize: 11, color: GRAPHITE, lineHeight: 1.5, maxWidth: 200, margin: "0 auto" }}>
          Assign team members via the Onboarding Checklist to begin tracking utilisation.
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 11 }}>
      {team.map((m) => (
        <div key={m.id} style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 32, height: 32, borderRadius: "50%", flexShrink: 0, background: MIST,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontFamily: SANS, fontSize: 10, fontWeight: 600, color: SLATE,
          }}>
            {m.name.split(" ").map((n) => n[0]).join("")}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontFamily: SANS, fontSize: 12, fontWeight: 500, color: INK }}>{m.name}</div>
            <div style={{ fontFamily: SANS, fontSize: 10, color: GRAPHITE, marginTop: 1 }}>{m.level} · {m.department}</div>
          </div>
          <div style={{ flexShrink: 0, textAlign: "right" }}>
            <span style={{ fontFamily: MONO, fontSize: 13, fontWeight: 600, color: INK }}>{m.hoursThisPeriod}</span>
            <span style={{ fontFamily: SANS, fontSize: 10, color: GRAPHITE }}> hrs</span>
          </div>
        </div>
      ))}
    </div>
  );
}

// ── main export ───────────────────────────────────────────────────────────────
interface Props {
  projectId: string;
  onBack: () => void;
}

export default function ProjectDetail({ projectId, onBack }: Props) {
  const { isTablet } = useViewport();
  const p = PROJECTS.find((x) => x.id === projectId);
  if (!p) return (
    <div style={{ padding: "60px 28px", textAlign: "center" }}>
      <div style={{ fontFamily: SANS, fontSize: 13, color: GRAPHITE, marginBottom: 12 }}>Project not found.</div>
      <button onClick={onBack} style={{ fontFamily: SANS, fontSize: 13, color: SLATE, background: "none", border: "none", cursor: "pointer", textDecoration: "underline" }}>← Back</button>
    </div>
  );

  // build stageDates map for full stepper
  const stageDates: Record<string, string> = {};
  p.stageHistory.forEach((s) => { stageDates[s.name] = s.enteredDate; });

  const caption =
    p.status === "green" ? `On pace for ${p.tier} timeline` :
    p.status === "amber" ? `At risk — review ${p.currentStage} stage` :
    "Behind plan — intervention recommended";

  const totalActual  = p.deptHours.reduce((s, d) => s + d.actual, 0);
  const totalPlanned = p.deptHours.reduce((s, d) => s + d.planned, 0);

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column", overflow: "hidden" }}>

      {/* ── sticky header ─────────────────────────────────────────────────── */}
      <div style={{
        flexShrink: 0, background: PAPER, borderBottom: `1px solid ${HAIRLINE}`,
        padding: "18px 28px 0", zIndex: 5,
      }}>
        {/* back + title row */}
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 16 }}>
          <div style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
            <button onClick={onBack} style={{
              display: "flex", alignItems: "center", gap: 4,
              fontFamily: SANS, fontSize: 12, color: GRAPHITE,
              background: "none", border: "none", cursor: "pointer", marginTop: 4, padding: 0,
            }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = INK; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = GRAPHITE; }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6" />
              </svg>
              All Projects
            </button>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" as const }}>
                <h1 style={{ fontFamily: SANS, fontWeight: 600, fontSize: 21, color: INK, margin: 0, letterSpacing: "-0.02em" }}>
                  {p.name}
                </h1>
                <span style={{ fontFamily: SANS, fontSize: 11, fontWeight: 500, padding: "2px 8px", borderRadius: 3, ...TIER_BADGE[p.tier] }}>
                  {p.tier}
                </span>
                <span style={{ fontFamily: SANS, fontSize: 11, fontWeight: 500, color: RISK_COLOR[p.status], background: RISK_BG[p.status], padding: "2px 8px", borderRadius: 3 }}>
                  {RISK_LABEL[p.status]}
                </span>
              </div>
              <div style={{ fontFamily: SANS, fontSize: 13, color: GRAPHITE, marginTop: 4 }}>
                {p.type} · Partner: <strong style={{ fontWeight: 500, color: INK }}>{p.partnerFull}</strong>
                {" · "}Client: {p.client}
                <span style={{ fontFamily: MONO, fontSize: 11, marginLeft: 10, color: GRAPHITE }}>{p.id}</span>
              </div>
            </div>
          </div>
          <div style={{ fontFamily: SANS, fontSize: 11, color: GRAPHITE, flexShrink: 0, marginTop: 4 }}>
            Started <span style={{ fontFamily: MONO }}>{p.startDate}</span>
          </div>
        </div>

        {/* full-width stage stepper */}
        <div style={{ paddingBottom: 22 }}>
          <StageStepper currentStage={p.currentStage} variant="full" stageDates={stageDates} />
        </div>
      </div>

      {/* ── scrollable body ────────────────────────────────────────────────── */}
      <div style={{ flex: 1, overflowY: "auto", padding: "22px 28px 48px" }}>
        <div style={{ display: "grid", gridTemplateColumns: isTablet ? "1fr" : "1fr 300px", gap: 20, alignItems: "start" }}>

          {/* LEFT col ─────────────────────────────────────────────── */}
          <div>
            {/* onboarding checklist — disappears when complete */}
            {p.onboardingPct < 100 && <OnboardingCard initialItems={p.onboardingItems} />}

            {/* planned vs actual dept chart */}
            <Card title="Planned vs Actual Hours">
              <DeptChart deptHours={p.deptHours} />
            </Card>

            {/* stage history */}
            <Card title="Stage History">
              <StageHistory history={p.stageHistory} />
            </Card>
          </div>

          {/* RIGHT col ────────────────────────────────────────────── */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

            {/* large completion gauge */}
            <div style={{ background: PAPER, border: `1px solid ${HAIRLINE}`, borderRadius: 8, padding: "24px 20px 20px", display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
              <ArcGauge value={p.completion} size={120} color={RISK_COLOR[p.status]} />
              <div style={{ fontFamily: SANS, fontSize: 12, color: GRAPHITE, textAlign: "center", lineHeight: 1.45 }}>
                {caption}
              </div>
              {/* delivery vs onboarding distinction panel */}
              <div style={{ width: "100%", background: BG, border: `1px solid ${HAIRLINE}`, borderRadius: 6, padding: "12px 14px", marginTop: 4 }}>
                {/* delivery bar */}
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                  <span style={{ fontFamily: SANS, fontSize: 10, fontWeight: 600, color: GRAPHITE, letterSpacing: "0.07em", textTransform: "uppercase" as const }}>Delivery</span>
                  <span style={{ fontFamily: MONO, fontSize: 11, fontWeight: 600, color: RISK_COLOR[p.status] }}>{p.completion}%</span>
                </div>
                <div style={{ height: 4, background: MIST, borderRadius: 2, marginBottom: p.onboardingPct < 100 ? 10 : 0 }}>
                  <div style={{ height: "100%", width: `${p.completion}%`, background: RISK_COLOR[p.status], borderRadius: 2 }} />
                </div>
                {/* onboarding bar — only shown when incomplete */}
                {p.onboardingPct < 100 && (
                  <>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                      <span style={{ fontFamily: SANS, fontSize: 10, fontWeight: 600, color: GRAPHITE, letterSpacing: "0.07em", textTransform: "uppercase" as const }}>Onboarding</span>
                      <span style={{ fontFamily: MONO, fontSize: 11, fontWeight: 600, color: AMBER }}>{p.onboardingPct}%</span>
                    </div>
                    <div style={{ height: 4, background: "#F2E0CC", borderRadius: 2 }}>
                      <div style={{ height: "100%", width: `${p.onboardingPct}%`, background: AMBER, borderRadius: 2 }} />
                    </div>
                  </>
                )}
                <p style={{ fontFamily: SANS, fontSize: 10, color: GRAPHITE, margin: "8px 0 0", lineHeight: 1.55 }}>
                  {p.onboardingPct < 100
                    ? "Delivery tracks stage progress. Onboarding tracks initial setup. These are independent."
                    : "Delivery % is weighted progress through all project stages."}
                </p>
              </div>
            </div>

            {/* staffed team */}
            <Card
              title="Staffed Team"
              right={
                <span style={{ fontFamily: MONO, fontSize: 11, color: GRAPHITE }}>
                  {p.team.reduce((s, m) => s + m.hoursThisPeriod, 0)} hrs this period
                </span>
              }
            >
              <StaffedTeam team={p.team} />
            </Card>

            {/* quick-stats dark card */}
            <div style={{ background: INK, borderRadius: 8, padding: "18px 18px 16px" }}>
              <div style={{ fontFamily: SANS, fontSize: 9, fontWeight: 600, color: "rgba(217,226,232,0.55)", letterSpacing: "0.09em", textTransform: "uppercase" as const, marginBottom: 12 }}>
                At a Glance
              </div>
              {[
                { l: "Start Date", v: p.startDate },
                { l: "Stage",      v: p.currentStage },
                { l: "Type",       v: p.type },
                { l: "Client",     v: p.client },
              ].map((row) => (
                <div key={row.l} style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                  <span style={{ fontFamily: SANS, fontSize: 11, color: "rgba(217,226,232,0.55)" }}>{row.l}</span>
                  <span style={{ fontFamily: MONO, fontSize: 11, color: "#D9E2E8" }}>{row.v}</span>
                </div>
              ))}
              <div style={{ marginTop: 12, paddingTop: 12, borderTop: "1px solid rgba(217,226,232,0.1)" }}>
                <PlannedActualBar planned={totalPlanned} actual={totalActual} width={264} height={6} showLabels />
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
