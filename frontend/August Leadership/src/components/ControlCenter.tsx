import { useState } from "react";
import { useViewport } from "../hooks/useViewport";
import NewProjectForm from "./NewProjectForm";

interface ControlCenterProps { period: string; }

const C = {
  ink: "#16303F", slate: "#3E5568", graphite: "#5B6472",
  paper: "#FFFFFF", mist: "#E4E9EC", bg: "#F8FAFB",
  green: "#3F7A5D", amber: "#B8875A", red: "#B14A3D",
  ivory: "#D9E2E8",
};
const MONO = "'IBM Plex Mono', monospace";
const SANS = "'IBM Plex Sans', sans-serif";

const TOTAL_HOURS = 463;
const AVAIL_HOURS = 459;
const UTIL_PCT    = 101;

const WORK_TYPES = [
  { label: "Search",   hours: 281, pct: 61, color: C.ink      },
  { label: "Internal", hours: 93,  pct: 20, color: C.slate    },
  { label: "BD Pitch", hours: 89,  pct: 19, color: C.graphite },
];

const WEEKLY_BARS = [
  { day: "Mon", h: 88,  current: false },
  { day: "Tue", h: 76,  current: false },
  { day: "Wed", h: 92,  current: false },
  { day: "Thu", h: 71,  current: false },
  { day: "Fri", h: 82,  current: true  },
  { day: "Sat", h: 30,  current: false },
  { day: "Sun", h: 24,  current: false },
];

const DAILY_UTIL = [88, 92, 95, 102, 98, 110, 105, 99, 97, 103, 101, 98, 88, 101];

const ASSIGNMENTS = [
  { initials: "SR", partner: "Sarah Reynolds", client: "Northbridge Capital",  role: "Chief Commercial Officer", value: 52000,  hours: 45 },
  { initials: "JM", partner: "James Mitchell",  client: "Meridian Partners",   role: "VP Strategy & Growth",     value: 168000, hours: 41 },
  { initials: "JM", partner: "James Mitchell",  client: "Atlas Group",         role: "Managing Director, APAC",  value: 315000, hours: 37 },
  { initials: "CL", partner: "Claire Laurent",  client: "Oaktree Ventures",    role: "Head of Data Platforms",   value: 248000, hours: 34 },
];

function InfoBtn() {
  return (
    <button style={{ background: "none", border: "none", cursor: "pointer", color: C.graphite, opacity: 0.45, padding: 2, lineHeight: 0 }}>
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="8" x2="12" y2="12" />
        <circle cx="12" cy="16" r=".5" fill="currentColor" />
      </svg>
    </button>
  );
}

function CardIcon({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ width: 34, height: 34, borderRadius: 8, background: C.bg, border: `1px solid ${C.mist}`, display: "flex", alignItems: "center", justifyContent: "center", color: C.slate, flexShrink: 0 }}>
      {children}
    </div>
  );
}

function LegendDot({ color, label }: { color: string; label: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
      <div style={{ width: 7, height: 7, borderRadius: "50%", background: color }} />
      <span style={{ fontFamily: SANS, fontSize: 11, color: C.graphite }}>{label}</span>
    </div>
  );
}

function WeekBars() {
  const [hov, setHov] = useState<number | null>(null);
  const max = Math.max(...WEEKLY_BARS.map(d => d.h));
  const H = 62, bW = 22, gap = 5;
  const W = WEEKLY_BARS.length * (bW + gap) - gap;
  return (
    <svg viewBox={`0 0 ${W} ${H + 18}`} style={{ width: "100%", display: "block", overflow: "visible", cursor: "default" }}>
      {WEEKLY_BARS.map((d, i) => {
        const bH = (d.h / max) * H;
        const x = i * (bW + gap);
        const isH = hov === i;
        const tipX = Math.min(Math.max(x + bW / 2, 18), W - 18);
        return (
          <g key={i} onMouseEnter={() => setHov(i)} onMouseLeave={() => setHov(null)} style={{ cursor: "pointer" }}>
            {/* hover hit area */}
            <rect x={x - 2} y={0} width={bW + 4} height={H + 14} fill="transparent" />
            <rect x={x} y={H - bH} width={bW} height={bH} rx={3}
              fill={isH ? "#2A5470" : (d.current ? C.ink : "rgba(22,48,63,0.2)")} />
            <text x={x + bW / 2} y={H + 14} textAnchor="middle"
              style={{ fontFamily: MONO, fontSize: "9px", fill: isH ? C.ink : (d.current ? C.ink : C.graphite), fontWeight: isH ? 700 : 400 }}>
              {d.day}
            </text>
            {isH && (
              <g>
                <rect x={tipX - 16} y={H - bH - 24} width={32} height={18} rx={4} fill={C.ink} />
                <polygon points={`${tipX - 4},${H - bH - 6} ${tipX + 4},${H - bH - 6} ${tipX},${H - bH - 2}`} fill={C.ink} />
                <text x={tipX} y={H - bH - 10} textAnchor="middle"
                  style={{ fontFamily: MONO, fontSize: "9px", fill: "#fff", fontWeight: 700 }}>
                  {d.h}h
                </text>
              </g>
            )}
          </g>
        );
      })}
    </svg>
  );
}

function UtilBars() {
  const [hov, setHov] = useState<number | null>(null);
  const H = 62, bW = 11, gap = 3;
  const W = DAILY_UTIL.length * (bW + gap) - gap;
  return (
    <svg viewBox={`0 0 ${W} ${H + 6}`} style={{ width: "100%", display: "block", overflow: "visible", cursor: "default" }}>
      {DAILY_UTIL.map((v, i) => {
        const bH = Math.min(v / 120, 1) * H;
        const x = i * (bW + gap);
        const col = v > 100 ? C.red : v >= 90 ? C.amber : C.slate;
        const isH = hov === i;
        const tipX = Math.min(Math.max(x + bW / 2, 14), W - 14);
        return (
          <g key={i} onMouseEnter={() => setHov(i)} onMouseLeave={() => setHov(null)} style={{ cursor: "pointer" }}>
            <rect x={x - 1} y={0} width={bW + 2} height={H} fill="transparent" />
            <rect x={x} y={H - bH} width={bW} height={bH} rx={2} fill={col} opacity={isH ? 1 : 0.82} />
            {isH && (
              <g>
                <rect x={tipX - 14} y={H - bH - 22} width={28} height={16} rx={3} fill={C.ink} />
                <polygon points={`${tipX - 4},${H - bH - 6} ${tipX + 4},${H - bH - 6} ${tipX},${H - bH - 2}`} fill={C.ink} />
                <text x={tipX} y={H - bH - 10} textAnchor="middle"
                  style={{ fontFamily: MONO, fontSize: "8px", fill: "#fff", fontWeight: 700 }}>
                  {v}%
                </text>
              </g>
            )}
          </g>
        );
      })}
    </svg>
  );
}

function WorkTypeBar({ wt }: { wt: typeof WORK_TYPES[0] }) {
  const [hov, setHov] = useState(false);
  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{ cursor: "default", padding: "6px 8px", borderRadius: 7, background: hov ? C.bg : "none", transition: "background 0.15s", margin: "0 -8px" }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 7 }}>
        <span style={{ fontFamily: SANS, fontSize: 12, color: C.ink, fontWeight: hov ? 600 : 500 }}>{wt.label}</span>
        <div style={{ display: "flex", gap: 10 }}>
          <span style={{ fontFamily: MONO, fontSize: 11, color: C.graphite }}>{wt.hours}h</span>
          <span style={{ fontFamily: MONO, fontSize: 12, fontWeight: 700, color: hov ? wt.color : C.ink, minWidth: 28, textAlign: "right" as const }}>{wt.pct}%</span>
        </div>
      </div>
      <div style={{ height: hov ? 8 : 6, background: C.mist, borderRadius: 3, transition: "height 0.15s" }}>
        <div style={{ height: "100%", width: `${wt.pct}%`, background: wt.color, borderRadius: 3, boxShadow: hov ? `0 0 6px ${wt.color}55` : "none", transition: "box-shadow 0.15s" }} />
      </div>
    </div>
  );
}

function ArcGauge({ value }: { value: number }) {
  const R = 68, cx = 100, cy = 96;
  const rad = (d: number) => (d * Math.PI) / 180;
  const pt  = (a: number): [number, number] => [cx + R * Math.cos(rad(a)), cy + R * Math.sin(rad(a))];
  const [sx, sy] = pt(135);
  const [ex, ey] = pt(45);
  const track = `M ${sx.toFixed(2)} ${sy.toFixed(2)} A ${R} ${R} 0 1 1 ${ex.toFixed(2)} ${ey.toFixed(2)}`;
  const fillPct = Math.min(value / 100, 1);
  const fillSweep = 270 * fillPct;
  const [fx, fy] = pt(135 + fillSweep);
  const largeArc = fillSweep > 180 ? 1 : 0;
  const fillPath = fillPct >= 1 ? track
    : `M ${sx.toFixed(2)} ${sy.toFixed(2)} A ${R} ${R} 0 ${largeArc} 1 ${fx.toFixed(2)} ${fy.toFixed(2)}`;
  const col = value >= 100 ? C.red : value >= 90 ? C.amber : C.green;
  return (
    <svg viewBox="0 0 200 160" width={180} height={144} style={{ display: "block", flexShrink: 0 }}>
      <path d={track} fill="none" stroke={C.mist} strokeWidth="12" strokeLinecap="round" />
      <path d={fillPath} fill="none" stroke={col} strokeWidth="12" strokeLinecap="round" />
      <text x={cx} y={cy + 2} textAnchor="middle" style={{ fontFamily: MONO, fontSize: "28px", fontWeight: 700, fill: C.ink }}>{value}%</text>
      <text x={cx} y={cy + 20} textAnchor="middle" style={{ fontFamily: SANS, fontSize: "10px", fill: C.graphite }}>Utilization Rate</text>
    </svg>
  );
}

export default function ControlCenter({ period }: ControlCenterProps) {
  const [showNewProject, setShowNewProject] = useState(false);
  const { isTablet } = useViewport();

  if (showNewProject) {
    return <NewProjectForm onClose={() => setShowNewProject(false)} />;
  }

  return (
    <div style={{ padding: "28px 28px 48px", maxWidth: 1200 }}>

      {/* Page header */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 28, gap: 16 }}>
        <div>
          <h1 style={{ fontFamily: SANS, fontWeight: 700, fontSize: 26, color: C.ink, margin: 0, letterSpacing: "-0.02em", lineHeight: 1.15 }}>
            Control Center
          </h1>
          <p style={{ fontFamily: SANS, fontSize: 13, color: C.graphite, margin: "5px 0 0" }}>
            Track and manage your executive search pipeline — {period.toLowerCase()}.
          </p>
        </div>
        <div style={{ display: "flex", gap: 8, flexShrink: 0, paddingTop: 2 }}>
          <button
            onClick={() => setShowNewProject(true)}
            style={{ display: "flex", alignItems: "center", gap: 6, height: 36, padding: "0 16px", borderRadius: 8, border: "none", background: C.ink, cursor: "pointer", fontFamily: SANS, fontWeight: 500, fontSize: 13, color: C.ivory, whiteSpace: "nowrap", transition: "background 0.15s" }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "#243F50"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = C.ink; }}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            New Project
          </button>
          <button
            style={{ display: "flex", alignItems: "center", gap: 6, height: 36, padding: "0 14px", borderRadius: 8, border: `1px solid ${C.mist}`, background: C.paper, cursor: "pointer", fontFamily: SANS, fontWeight: 500, fontSize: 13, color: C.slate, whiteSpace: "nowrap", transition: "background 0.15s" }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "#F0F4F6"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = C.paper; }}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
              <polyline points="7 10 12 15 17 10"/>
              <line x1="12" y1="15" x2="12" y2="3"/>
            </svg>
            Export
          </button>
        </div>
      </div>

      {/* Top row — 3 metric cards */}
      <div style={{ display: "grid", gridTemplateColumns: isTablet ? "1fr" : "1fr 1fr 1fr", gap: 16, marginBottom: 16 }}>

        {/* Card 1 — Hours Utilized */}
        <div style={{ background: C.paper, border: `1px solid ${C.mist}`, borderRadius: 12, padding: "20px 22px" }}>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 16 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <CardIcon>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                </svg>
              </CardIcon>
              <div>
                <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: 13, color: C.ink }}>Hours Utilized</div>
                <div style={{ fontFamily: SANS, fontSize: 11, color: C.graphite }}>Billed hours this week</div>
              </div>
            </div>
            <InfoBtn />
          </div>
          <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginBottom: 8 }}>
            <span style={{ fontFamily: MONO, fontWeight: 700, fontSize: 40, color: C.ink, letterSpacing: "-0.02em", lineHeight: 1 }}>{TOTAL_HOURS}</span>
            <span style={{ fontFamily: SANS, fontSize: 11, fontWeight: 600, color: C.green, background: "#EBF3EF", padding: "2px 8px", borderRadius: 20, whiteSpace: "nowrap" }}>+2.1% last month</span>
          </div>
          <div style={{ display: "flex", gap: 14, marginBottom: 14 }}>
            <LegendDot color={C.ink} label="This week" />
            <LegendDot color="rgba(22,48,63,0.2)" label="Prev week" />
          </div>
          <WeekBars />
        </div>

        {/* Card 2 — Utilization Rate */}
        <div style={{ background: C.paper, border: `1px solid ${C.mist}`, borderRadius: 12, padding: "20px 22px" }}>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 16 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <CardIcon>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
                </svg>
              </CardIcon>
              <div>
                <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: 13, color: C.ink }}>Utilization Rate</div>
                <div style={{ fontFamily: SANS, fontSize: 11, color: C.graphite }}>Firm-wide capacity usage</div>
              </div>
            </div>
            <InfoBtn />
          </div>
          <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginBottom: 8 }}>
            <span style={{ fontFamily: MONO, fontWeight: 700, fontSize: 40, color: C.red, letterSpacing: "-0.02em", lineHeight: 1 }}>{UTIL_PCT}%</span>
            <span style={{ fontFamily: SANS, fontSize: 11, fontWeight: 600, color: C.red, background: "#FBEAEA", padding: "2px 8px", borderRadius: 20, whiteSpace: "nowrap" }}>+8.2% over target</span>
          </div>
          <div style={{ display: "flex", gap: 12, marginBottom: 14, flexWrap: "wrap" }}>
            <LegendDot color={C.slate} label="Utilized" />
            <LegendDot color={C.amber} label="At capacity" />
            <LegendDot color={C.red}   label="Over" />
          </div>
          <UtilBars />
        </div>

        {/* Card 3 — Work Type Split */}
        <div style={{ background: C.paper, border: `1px solid ${C.mist}`, borderRadius: 12, padding: "20px 22px" }}>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 16 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <CardIcon>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/>
                </svg>
              </CardIcon>
              <div>
                <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: 13, color: C.ink }}>Work Type Split</div>
                <div style={{ fontFamily: SANS, fontSize: 11, color: C.graphite }}>Hours by engagement type</div>
              </div>
            </div>
            <InfoBtn />
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 16, marginTop: 4 }}>
            {WORK_TYPES.map(wt => (
              <WorkTypeBar key={wt.label} wt={wt} />
            ))}
          </div>
          <div style={{ display: "flex", gap: 14, marginTop: 20 }}>
            {WORK_TYPES.map(wt => <LegendDot key={wt.label} color={wt.color} label={wt.label} />)}
          </div>
        </div>
      </div>

      {/* Middle row — Arc gauge + Assignments */}
      <div style={{ display: "grid", gridTemplateColumns: isTablet ? "1fr" : "420px 1fr", gap: 16, marginBottom: 16 }}>

        {/* Capacity Overview */}
        <div style={{ background: C.paper, border: `1px solid ${C.mist}`, borderRadius: 12, padding: "20px 22px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
            <div>
              <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: 13, color: C.ink }}>Capacity Overview</div>
              <div style={{ fontFamily: SANS, fontSize: 11, color: C.graphite }}>Firm utilization this week</div>
            </div>
            <span style={{ fontFamily: SANS, fontSize: 11, fontWeight: 500, color: C.graphite, background: C.bg, border: `1px solid ${C.mist}`, borderRadius: 6, padding: "3px 10px" }}>{period}</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <ArcGauge value={UTIL_PCT} />
            <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 12 }}>
              <div style={{ display: "flex", gap: 24, paddingBottom: 12, borderBottom: `1px solid ${C.mist}` }}>
                <div>
                  <div style={{ fontFamily: SANS, fontSize: 9, fontWeight: 600, color: C.graphite, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 3 }}>Total</div>
                  <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 20, color: C.ink }}>{TOTAL_HOURS}<span style={{ fontSize: 12, fontWeight: 400, marginLeft: 2 }}>h</span></div>
                </div>
                <div>
                  <div style={{ fontFamily: SANS, fontSize: 9, fontWeight: 600, color: C.graphite, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 3 }}>Available</div>
                  <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 20, color: C.ink }}>{AVAIL_HOURS}<span style={{ fontSize: 12, fontWeight: 400, marginLeft: 2 }}>h</span></div>
                </div>
              </div>
              {WORK_TYPES.map(wt => (
                <div key={wt.label} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{ width: 3, height: 18, borderRadius: 2, background: wt.color, flexShrink: 0 }} />
                  <span style={{ fontFamily: SANS, fontSize: 12, color: C.graphite, flex: 1 }}>{wt.label}</span>
                  <span style={{ fontFamily: MONO, fontWeight: 700, fontSize: 13, color: C.ink }}>{wt.pct}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Assignments */}
        <div style={{ background: C.paper, border: `1px solid ${C.mist}`, borderRadius: 12, overflow: "hidden" }}>
          <div style={{ padding: "16px 22px", borderBottom: `1px solid ${C.mist}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: 13, color: C.ink }}>Recent Assignments</div>
              <div style={{ fontFamily: SANS, fontSize: 11, color: C.graphite }}>Latest active placement details</div>
            </div>
            <button
              style={{ fontFamily: SANS, fontSize: 12, color: C.slate, background: "none", border: "none", cursor: "pointer", fontWeight: 500, transition: "color 0.15s" }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = C.ink; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = C.slate; }}
            >
              View all →
            </button>
          </div>
          {ASSIGNMENTS.map((a, i) => (
            <div
              key={i}
              style={{ padding: "14px 22px", borderBottom: i < ASSIGNMENTS.length - 1 ? "1px solid #F0F4F6" : "none", cursor: "pointer", transition: "background 0.12s" }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = C.bg; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "none"; }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 13 }}>
                <div style={{ width: 36, height: 36, borderRadius: 9, background: C.slate, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontFamily: MONO, fontSize: 11, fontWeight: 600, color: C.ivory }}>
                  {a.initials}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 2 }}>
                    <span style={{ fontFamily: SANS, fontWeight: 600, fontSize: 13, color: C.ink }}>{a.client}</span>
                    <span style={{ fontFamily: SANS, fontSize: 10, fontWeight: 600, color: C.green, background: "#EBF3EF", padding: "2px 7px", borderRadius: 20 }}>Active</span>
                  </div>
                  <div style={{ fontFamily: SANS, fontSize: 12, color: C.graphite, marginBottom: 4, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {a.role} · {a.partner}
                  </div>
                  <div style={{ display: "flex", gap: 16 }}>
                    <span style={{ fontFamily: MONO, fontSize: 11, color: C.graphite }}>${a.value.toLocaleString()}</span>
                    <span style={{ fontFamily: MONO, fontSize: 11, fontWeight: 700, color: C.ink }}>{a.hours}h</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom row — project health */}
      <div style={{ display: "grid", gridTemplateColumns: isTablet ? "1fr 1fr" : "1fr 1fr 1fr 1fr", gap: 12 }}>
        {[
          { label: "On Track",      count: 16, color: C.green, bg: "#EBF3EF" },
          { label: "At Risk",       count: 5,  color: C.amber, bg: "#FBF6F0" },
          { label: "Over Capacity", count: 3,  color: C.red,   bg: "#FBEAEA" },
        ].map(row => (
          <div
            key={row.label}
            style={{ background: C.paper, border: `1px solid ${C.mist}`, borderRadius: 10, padding: "14px 18px", display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer", transition: "box-shadow 0.15s" }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.boxShadow = "0 2px 10px rgba(22,48,63,0.07)"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.boxShadow = "none"; }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 32, height: 32, borderRadius: 8, background: row.bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: row.color }} />
              </div>
              <span style={{ fontFamily: SANS, fontSize: 12, color: C.ink, fontWeight: 500 }}>{row.label}</span>
            </div>
            <span style={{ fontFamily: MONO, fontWeight: 700, fontSize: 24, color: row.color }}>{row.count}</span>
          </div>
        ))}
        <div style={{ background: C.ink, borderRadius: 10, padding: "14px 18px", display: "flex", flexDirection: "column", gap: 8 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontFamily: SANS, fontSize: 9, fontWeight: 600, color: "rgba(217,226,232,0.5)", letterSpacing: "0.09em", textTransform: "uppercase" }}>Firm Capacity</span>
            <span style={{ fontFamily: MONO, fontWeight: 700, fontSize: 18, color: C.ivory }}>78%</span>
          </div>
          <div style={{ height: 4, background: "rgba(255,255,255,0.1)", borderRadius: 2 }}>
            <div style={{ height: "100%", width: "78%", background: C.green, borderRadius: 2 }} />
          </div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span style={{ fontFamily: MONO, fontSize: 10, color: "rgba(217,226,232,0.38)" }}>499 used</span>
            <span style={{ fontFamily: MONO, fontSize: 10, color: "rgba(217,226,232,0.38)" }}>141 free</span>
          </div>
        </div>
      </div>

    </div>
  );
}
