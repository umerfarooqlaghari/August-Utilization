import { useState } from "react";
import ArcGauge from "../ArcGauge";
import { C, TEAM_MEMBERS, TeamMemberRow, utilColor, DEPARTMENTS, LEVELS } from "./data";

// ── Sparkline (6-week) ────────────────────────────────────────────────────────
function Sparkline({ values, color = C.slate, w = 72, h = 24 }: { values: number[]; color?: string; w?: number; h?: number }) {
  const [hov, setHov] = useState<number | null>(null);
  const min = Math.max(0, Math.min(...values) - 5);
  const max = Math.min(130, Math.max(...values) + 5);
  const scaleY = (v: number) => h - ((v - min) / (max - min || 1)) * h;
  const pts = values.map((v, i) => `${(i / (values.length - 1)) * w},${scaleY(v)}`).join(" ");
  const last = values[values.length - 1];
  const dotColor = utilColor(last).bg;
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{ overflow: "visible", cursor: "default" }}>
      <polyline points={pts} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      {values.map((v, i) => {
        const cx = (i / (values.length - 1)) * w;
        const cy = scaleY(v);
        const isH = hov === i;
        const tipX = Math.min(Math.max(cx, 12), w - 12);
        return (
          <g key={i}>
            <circle cx={cx} cy={cy} r={6} fill="transparent"
              onMouseEnter={() => setHov(i)} onMouseLeave={() => setHov(null)} />
            <circle cx={cx} cy={cy} r={isH ? 3.5 : (i === values.length - 1 ? 2.5 : 0)} fill={isH ? color : dotColor} />
            {isH && (
              <g pointerEvents="none">
                <rect x={tipX - 13} y={cy - 26} width={26} height={14} rx={3} fill={C.ink} />
                <text x={tipX} y={cy - 15} textAnchor="middle" fontFamily={C.mono} fontSize="7.5" fontWeight="700" fill="#fff">{v}%</text>
              </g>
            )}
          </g>
        );
      })}
    </svg>
  );
}

// ── 12-week trend line (drawer) ────────────────────────────────────────────────
function TrendLine({ values }: { values: number[] }) {
  const W = 240, H = 60;
  const min = Math.max(0, Math.min(...values) - 8);
  const max = Math.min(135, Math.max(...values) + 8);
  const scaleX = (i: number) => (i / (values.length - 1)) * W;
  const scaleY = (v: number) => H - ((v - min) / (max - min || 1)) * H;
  const pts = values.map((v, i) => `${scaleX(i)},${scaleY(v)}`).join(" ");
  // gradient area
  const areaD = `M${scaleX(0)},${H} ` + values.map((v, i) => `${scaleX(i)},${scaleY(v)}`).join(" L") + ` L${W},${H} Z`;
  return (
    <svg width={W} height={H + 24} viewBox={`0 0 ${W} ${H + 4}`} style={{ overflow: "visible" }}>
      <defs>
        <linearGradient id="trendGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={C.slate} stopOpacity="0.18" />
          <stop offset="100%" stopColor={C.slate} stopOpacity="0" />
        </linearGradient>
      </defs>
      {/* 100% reference line */}
      <line x1={0} y1={scaleY(100)} x2={W} y2={scaleY(100)} stroke={C.red} strokeWidth="1" strokeDasharray="4 3" opacity="0.4" />
      <path d={areaD} fill="url(#trendGrad)" />
      <polyline points={pts} fill="none" stroke={C.slate} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      {/* axis labels */}
      {[0, 6, 11].map((i) => (
        <text key={i} x={scaleX(i)} y={H + 14} fontFamily={C.mono} fontSize="8" fill={C.graphite} textAnchor="middle">
          {`W-${11 - i}`}
        </text>
      ))}
      {[70, 100].map((v) => (
        <text key={v} x={-4} y={scaleY(v) + 3} fontFamily={C.mono} fontSize="8" fill={C.graphite} textAnchor="end">{v}%</text>
      ))}
    </svg>
  );
}

// ── Leave mini calendar (month view) ─────────────────────────────────────────
function LeaveCalendar({ start, end }: { start: string; end: string }) {
  const startD = new Date(start);
  const endD   = new Date(end);
  const year   = startD.getFullYear();
  const month  = startD.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const monthName = startD.toLocaleString("default", { month: "long" });

  const isLeave = (day: number) => {
    const d = new Date(year, month, day);
    return d >= startD && d <= endD;
  };

  const cells: (number | null)[] = Array(firstDay === 0 ? 6 : firstDay - 1).fill(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  while (cells.length % 7 !== 0) cells.push(null);

  return (
    <div>
      <div style={{ fontFamily: C.sans, fontSize: 11, fontWeight: 600, color: C.ink, marginBottom: 6, textAlign: "center" }}>
        {monthName} {year}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 2 }}>
        {["M","T","W","T","F","S","S"].map((d, i) => (
          <div key={i} style={{ fontFamily: C.sans, fontSize: 9, color: C.graphite, textAlign: "center", paddingBottom: 2 }}>{d}</div>
        ))}
        {cells.map((day, i) => (
          <div key={i} style={{
            height: 22, display: "flex", alignItems: "center", justifyContent: "center",
            borderRadius: 3,
            background: day && isLeave(day) ? C.amber : "transparent",
            fontFamily: C.mono, fontSize: 9,
            color: day && isLeave(day) ? "#FFFFFF" : day ? C.graphite : "transparent",
          }}>
            {day ?? ""}
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Member drawer ─────────────────────────────────────────────────────────────
function MemberDrawer({ member, onClose }: { member: TeamMemberRow; onClose: () => void }) {
  const col = utilColor(member.utilPct);

  return (
    <>
      <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(22,48,63,0.2)", zIndex: 100 }} />
      <div style={{
        position: "fixed", top: 0, right: 0, bottom: 0, width: 360,
        background: C.paper, borderLeft: `1px solid ${C.hairline}`,
        boxShadow: "-8px 0 32px rgba(22,48,63,0.14)",
        zIndex: 101, display: "flex", flexDirection: "column", overflow: "hidden",
      }}>
        {/* header */}
        <div style={{ padding: "18px 22px", borderBottom: `1px solid ${C.hairline}`, flexShrink: 0 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
              <div style={{ width: 40, height: 40, borderRadius: "50%", background: C.mist, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: C.sans, fontSize: 13, fontWeight: 600, color: C.slate, flexShrink: 0 }}>
                {member.name.split(" ").map((n) => n[0]).join("")}
              </div>
              <div>
                <div style={{ fontFamily: C.sans, fontWeight: 600, fontSize: 14, color: C.ink }}>{member.name}</div>
                <div style={{ fontFamily: C.sans, fontSize: 11, color: C.graphite, marginTop: 1 }}>{member.level} · {member.department}</div>
              </div>
            </div>
            <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: C.graphite, fontSize: 20 }}>×</button>
          </div>
        </div>

        <div style={{ flex: 1, overflowY: "auto", padding: "20px 22px" }}>
          {/* large gauge */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: 20 }}>
            <ArcGauge value={member.utilPct} size={110} color={col.bg.startsWith("#F") || col.bg === C.mist ? C.slate : col.bg} />
            <div style={{ fontFamily: C.mono, fontSize: 12, color: C.graphite, marginTop: 4 }}>
              {member.hoursLogged} / {member.capacity}h capacity
            </div>
            {member.leaveStart && (
              <div style={{ marginTop: 6, fontFamily: C.sans, fontSize: 11, color: C.amber, display: "flex", alignItems: "center", gap: 5 }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
                </svg>
                Leave: {member.leaveStart} – {member.leaveEnd}
              </div>
            )}
          </div>

          {/* assignments */}
          {member.assignments.length > 0 && (
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontFamily: C.sans, fontSize: 10, fontWeight: 600, color: C.graphite, letterSpacing: "0.08em", textTransform: "uppercase" as const, marginBottom: 10 }}>
                Current Assignments
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {member.assignments.map((a, i) => {
                  const pct = Math.round((a.hours / a.planned) * 100);
                  const isOver = a.hours > a.planned;
                  return (
                    <div key={i} style={{ padding: "10px 12px", background: C.bg, border: `1px solid ${C.hairline}`, borderRadius: 6 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                        <span style={{ fontFamily: C.sans, fontSize: 12, fontWeight: 500, color: C.ink }}>{a.project}</span>
                        <span style={{ fontFamily: C.mono, fontSize: 11, color: isOver ? C.red : C.graphite }}>{a.hours}h / {a.planned}h</span>
                      </div>
                      <div style={{ height: 3, background: C.mist, borderRadius: 2 }}>
                        <div style={{ height: "100%", width: `${Math.min(pct, 100)}%`, background: isOver ? C.red : C.green, borderRadius: 2 }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
          {member.assignments.length === 0 && (
            <div style={{ marginBottom: 20, padding: "16px 12px", background: C.bg, borderRadius: 6, textAlign: "center", fontFamily: C.sans, fontSize: 12, color: C.graphite }}>
              No active assignments this period.
            </div>
          )}

          {/* leave calendar */}
          {member.leaveStart && (
            <div style={{ marginBottom: 20, padding: "14px 14px", background: C.bg, border: `1px solid ${C.hairline}`, borderRadius: 6 }}>
              <div style={{ fontFamily: C.sans, fontSize: 10, fontWeight: 600, color: C.graphite, letterSpacing: "0.08em", textTransform: "uppercase" as const, marginBottom: 10 }}>
                Leave Schedule
              </div>
              <LeaveCalendar start={member.leaveStart} end={member.leaveEnd!} />
            </div>
          )}

          {/* 12-week trend */}
          <div>
            <div style={{ fontFamily: C.sans, fontSize: 10, fontWeight: 600, color: C.graphite, letterSpacing: "0.08em", textTransform: "uppercase" as const, marginBottom: 10 }}>
              12-Week Utilization Trend
            </div>
            <div style={{ overflowX: "auto" }}>
              <TrendLine values={member.twelveWeekUtil} />
            </div>
            <div style={{ fontFamily: C.sans, fontSize: 10, color: C.graphite, marginTop: 4 }}>
              <span style={{ color: C.red }}>— </span>100% capacity line
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

// ── Loading skeleton ──────────────────────────────────────────────────────────
function Skeleton() {
  return (
    <>
      <style>{`@keyframes shimmer{0%{background-position:200% 0}100%{background-position:-200% 0}}`}</style>
      {Array.from({ length: 5 }).map((_, i) => (
        <tr key={i} style={{ borderBottom: `1px solid ${C.mist}` }}>
          {[48, 24, 24, 16, 20, 24, 16, 14].map((w, j) => (
            <td key={j} style={{ padding: "12px 14px" }}>
              <div style={{ height: 11, borderRadius: 4, width: `${w * 3}px`, background: "linear-gradient(90deg,#E4E9EC 25%,#EFF2F4 50%,#E4E9EC 75%)", backgroundSize: "200% 100%", animation: "shimmer 1.4s infinite" }} />
            </td>
          ))}
        </tr>
      ))}
    </>
  );
}

// ── Main tab ──────────────────────────────────────────────────────────────────
export default function ByTeamMember() {
  const [search, setSearch]     = useState("");
  const [fDept, setFDept]       = useState("");
  const [fLevel, setFLevel]     = useState("");
  const [sortKey, setSortKey]   = useState<"name" | "util" | "hours">("name");
  const [sortDir, setSortDir]   = useState<1 | -1>(1);
  const [loading]               = useState(false);
  const [openMember, setOpenMember] = useState<TeamMemberRow | null>(null);

  const sort = (key: typeof sortKey) => {
    if (sortKey === key) setSortDir((d) => (d === 1 ? -1 : 1));
    else { setSortKey(key); setSortDir(key === "util" ? -1 : 1); }
  };

  const visible = TEAM_MEMBERS
    .filter((m) => {
      const q = search.toLowerCase();
      if (q && !m.name.toLowerCase().includes(q)) return false;
      if (fDept  && m.department !== fDept)  return false;
      if (fLevel && m.level !== fLevel)       return false;
      return true;
    })
    .sort((a, b) => {
      const v =
        sortKey === "name"  ? a.name.localeCompare(b.name) :
        sortKey === "util"  ? a.utilPct - b.utilPct :
        a.hoursLogged - b.hoursLogged;
      return v * sortDir;
    });

  const COLS = [
    { key: "name",  label: "Name" },
    { key: null,    label: "Department" },
    { key: null,    label: "Level" },
    { key: "util",  label: "Utilization" },
    { key: "hours", label: "Hrs / Capacity" },
    { key: null,    label: "Current Projects" },
    { key: null,    label: "Upcoming Leave" },
    { key: null,    label: "6-Week Trend" },
  ];

  function SortTh({ col }: { col: typeof COLS[number] }) {
    const active = col.key === sortKey;
    return (
      <th
        onClick={() => col.key && sort(col.key as any)}
        style={{
          padding: "10px 14px", textAlign: "left",
          fontFamily: C.sans, fontSize: 11, fontWeight: 600, color: active ? C.ink : C.graphite,
          letterSpacing: "0.06em", textTransform: "uppercase" as const, whiteSpace: "nowrap" as const,
          cursor: col.key ? "pointer" : "default", userSelect: "none" as const,
        }}
      >
        {col.label}
        {col.key && (
          <span style={{ marginLeft: 4, opacity: active ? 1 : 0.3 }}>
            {active && sortDir === -1 ? "↓" : "↑"}
          </span>
        )}
      </th>
    );
  }

  return (
    <div style={{ padding: "22px 28px 48px", maxWidth: 1200 }}>
      {/* filter bar */}
      <div style={{ display: "flex", gap: 8, marginBottom: 14, alignItems: "center" }}>
        <div style={{ position: "relative", flex: "0 0 200px" }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={C.graphite} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
            style={{ position: "absolute", left: 9, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}>
            <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Search team members…"
            style={{ fontFamily: C.sans, fontSize: 13, color: C.ink, background: C.paper, border: `1px solid ${C.hairline}`, borderRadius: 6, padding: "6px 10px 6px 28px", outline: "none", width: "100%" }}
            onFocus={(e) => { e.currentTarget.style.borderColor = C.slate; }}
            onBlur={(e)  => { e.currentTarget.style.borderColor = C.hairline; }}
          />
        </div>
        {[
          { label: "Department", value: fDept,  onChange: setFDept,  options: [...DEPARTMENTS] },
          { label: "Level",      value: fLevel, onChange: setFLevel, options: [...LEVELS] },
        ].map((f) => (
          <div key={f.label} style={{ position: "relative" }}>
            <select value={f.value} onChange={(e) => f.onChange(e.target.value)} style={{
              fontFamily: C.sans, fontSize: 12, cursor: "pointer", appearance: "none" as const,
              color: f.value ? C.ink : C.graphite, fontWeight: f.value ? 500 : 400,
              background: f.value ? C.mist : C.paper, border: `1px solid ${f.value ? C.slate : C.hairline}`,
              borderRadius: 5, padding: "5px 24px 5px 10px", outline: "none",
            }}>
              <option value="">{f.label}</option>
              {f.options.map((o) => <option key={o}>{o}</option>)}
            </select>
            <svg width="9" height="9" viewBox="0 0 9 9" fill="none" style={{ position: "absolute", right: 7, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}>
              <path d="M1.5 3l3 3 3-3" stroke={C.graphite} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        ))}
        {(search || fDept || fLevel) && (
          <button onClick={() => { setSearch(""); setFDept(""); setFLevel(""); }}
            style={{ fontFamily: C.sans, fontSize: 12, color: C.graphite, background: "none", border: "none", cursor: "pointer", textDecoration: "underline" }}>
            Clear
          </button>
        )}
        <div style={{ flex: 1 }} />
        <span style={{ fontFamily: C.sans, fontSize: 12, color: C.graphite }}>
          <span style={{ fontFamily: C.mono, fontWeight: 600, color: C.ink }}>{visible.length}</span> members
        </span>
      </div>

      <div style={{ background: C.paper, border: `1px solid ${C.hairline}`, borderRadius: 8, overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: C.bg, borderBottom: `1px solid ${C.hairline}` }}>
              {COLS.map((col, i) => <SortTh key={i} col={col} />)}
            </tr>
          </thead>
          <tbody>
            {loading ? <Skeleton /> : visible.length === 0 ? (
              <tr><td colSpan={8}>
                <div style={{ padding: "56px 24px", textAlign: "center" }}>
                  <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke={C.hairline} strokeWidth="1.5" style={{ marginBottom: 10 }}>
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" />
                  </svg>
                  <div style={{ fontFamily: C.sans, fontWeight: 600, fontSize: 13, color: C.ink, marginBottom: 4 }}>No team members match your filters</div>
                  <div style={{ fontFamily: C.sans, fontSize: 12, color: C.graphite }}>Try adjusting your search or clearing the filter bar.</div>
                </div>
              </td></tr>
            ) : visible.map((m, i) => {
              const col = utilColor(m.utilPct);
              const sparkColor = m.utilPct > 100 ? C.red : m.utilPct > 89 ? C.ink : C.slate;
              return (
                <tr key={m.id}
                  onClick={() => setOpenMember(m)}
                  style={{
                    borderBottom: i < visible.length - 1 ? `1px solid ${C.mist}` : "none",
                    background: i % 2 === 0 ? C.paper : C.bg,
                    cursor: "pointer", transition: "background 0.1s",
                  }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "#EDF2F5"; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = i % 2 === 0 ? C.paper : C.bg; }}
                >
                  {/* avatar + name */}
                  <td style={{ padding: "11px 14px", verticalAlign: "middle" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div style={{ width: 30, height: 30, borderRadius: "50%", background: C.mist, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: C.sans, fontSize: 10, fontWeight: 600, color: C.slate, flexShrink: 0 }}>
                        {m.name.split(" ").map((n) => n[0]).join("")}
                      </div>
                      <span style={{ fontFamily: C.sans, fontWeight: 500, fontSize: 13, color: C.ink }}>{m.name}</span>
                    </div>
                  </td>
                  <td style={{ padding: "11px 14px", verticalAlign: "middle", fontFamily: C.sans, fontSize: 12, color: C.graphite }}>{m.department}</td>
                  <td style={{ padding: "11px 14px", verticalAlign: "middle", fontFamily: C.sans, fontSize: 12, color: C.graphite }}>{m.level}</td>
                  {/* util % + bar */}
                  <td style={{ padding: "11px 14px", verticalAlign: "middle" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <div style={{ width: 56, height: 4, background: C.mist, borderRadius: 2 }}>
                        <div style={{ height: "100%", width: `${Math.min(m.utilPct, 100)}%`, background: col.bg.startsWith("#F") || col.bg === C.mist ? C.slate : col.bg, borderRadius: 2 }} />
                      </div>
                      <span style={{ fontFamily: C.mono, fontSize: 12, fontWeight: 600, color: col.bg.startsWith("#F") || col.bg === C.mist ? C.graphite : col.bg }}>
                        {m.utilPct}%
                      </span>
                    </div>
                  </td>
                  {/* hours / capacity */}
                  <td style={{ padding: "11px 14px", verticalAlign: "middle" }}>
                    <span style={{ fontFamily: C.mono, fontSize: 12, color: C.ink }}>{m.hoursLogged}</span>
                    <span style={{ fontFamily: C.mono, fontSize: 11, color: C.graphite }}> / {m.capacity}h</span>
                  </td>
                  {/* projects */}
                  <td style={{ padding: "11px 14px", verticalAlign: "middle" }}>
                    {m.projects.length === 0 ? (
                      <span style={{ fontFamily: C.sans, fontSize: 11, color: C.graphite }}>—</span>
                    ) : (
                      <span style={{ fontFamily: C.sans, fontSize: 12, color: C.ink }}>
                        {m.projects.slice(0, 2).join(", ")}
                        {m.projects.length > 2 && <span style={{ color: C.graphite }}> +{m.projects.length - 2}</span>}
                      </span>
                    )}
                  </td>
                  {/* leave */}
                  <td style={{ padding: "11px 14px", verticalAlign: "middle" }}>
                    {m.leaveStart ? (
                      <div style={{ display: "flex", alignItems: "center", gap: 5, color: C.amber }}>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                          <rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
                        </svg>
                        <span style={{ fontFamily: C.mono, fontSize: 10 }}>{m.leaveStart}</span>
                      </div>
                    ) : (
                      <span style={{ fontFamily: C.sans, fontSize: 11, color: C.graphite }}>—</span>
                    )}
                  </td>
                  {/* sparkline */}
                  <td style={{ padding: "11px 14px", verticalAlign: "middle" }}>
                    <Sparkline values={m.weeklyUtil} color={sparkColor} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {openMember && <MemberDrawer member={openMember} onClose={() => setOpenMember(null)} />}
    </div>
  );
}
