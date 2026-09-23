import { useState } from "react";
import { C, PARTNERS, PartnerRow } from "./data";

// ── Hours-over-time bar chart ─────────────────────────────────────────────────
function HoursChart({ values }: { values: number[] }) {
  const [hov, setHov] = useState<number | null>(null);
  const max = Math.max(...values, 1);
  const labels = values.map((_, i) => `W-${values.length - 1 - i}`);
  return (
    <div>
      <div style={{ display: "flex", alignItems: "flex-end", gap: 5, height: 72 }}>
        {values.map((v, i) => (
          <div key={i}
            onMouseEnter={() => setHov(i)}
            onMouseLeave={() => setHov(null)}
            style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 3, cursor: "default", position: "relative" }}>
            {hov === i && (
              <div style={{
                position: "absolute", top: -22, left: "50%", transform: "translateX(-50%)",
                background: C.ink, color: "#fff", borderRadius: 3,
                padding: "2px 6px", fontFamily: C.mono, fontSize: 9, fontWeight: 600,
                whiteSpace: "nowrap", pointerEvents: "none", zIndex: 20,
              }}>{v}h</div>
            )}
            <span style={{ fontFamily: C.mono, fontSize: 8, color: hov === i ? C.ink : C.graphite, fontWeight: hov === i ? 700 : 400 }}>{v}h</span>
            <div style={{ width: "100%", background: C.mist, borderRadius: "3px 3px 0 0", position: "relative", height: 48 }}>
              <div style={{
                position: "absolute", bottom: 0, left: 0, right: 0,
                height: `${(v / max) * 100}%`,
                background: hov === i ? C.ink : C.slate, borderRadius: "3px 3px 0 0",
                transition: "background 0.15s",
              }} />
            </div>
          </div>
        ))}
      </div>
      <div style={{ display: "flex", gap: 5, marginTop: 4 }}>
        {labels.map((l, i) => (
          <div key={i} style={{ flex: 1, textAlign: "center", fontFamily: C.mono, fontSize: 8, color: C.graphite }}>{l}</div>
        ))}
      </div>
    </div>
  );
}

// ── Project list in drawer ────────────────────────────────────────────────────
function ProjectCard({ p }: { p: PartnerRow["projects"][number] }) {
  const pct = Math.round((p.hours / p.planned) * 100);
  const isOver = p.hours > p.planned;
  const statusColor: Record<string, string> = { Active: C.green, Closed: C.graphite, "On Hold": C.amber };
  return (
    <div style={{ padding: "10px 12px", background: C.bg, border: `1px solid ${C.hairline}`, borderRadius: 6 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
        <span style={{ fontFamily: C.sans, fontSize: 12, fontWeight: 500, color: C.ink }}>{p.name}</span>
        <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
          <span style={{ fontFamily: C.sans, fontSize: 10, fontWeight: 600, color: statusColor[p.status] || C.graphite, background: `${statusColor[p.status] || C.graphite}18`, padding: "1px 6px", borderRadius: 3 }}>
            {p.status}
          </span>
          <span style={{ fontFamily: C.sans, fontSize: 10, color: C.graphite, background: C.mist, padding: "1px 5px", borderRadius: 3 }}>{p.tier}</span>
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 5 }}>
        <div style={{ flex: 1, height: 3, background: C.mist, borderRadius: 2, position: "relative" }}>
          <div style={{ height: "100%", width: `${Math.min(pct, 100)}%`, background: isOver ? C.red : C.green, borderRadius: 2 }} />
          {/* planned marker */}
          <div style={{ position: "absolute", left: "100%", top: -2, width: 1.5, height: 7, background: C.ink, transform: "translateX(-50%)" }} />
        </div>
        <span style={{ fontFamily: C.mono, fontSize: 11, color: isOver ? C.red : C.graphite, whiteSpace: "nowrap" as const }}>
          {p.hours}h / {p.planned}h
        </span>
      </div>
      <div style={{ fontFamily: C.mono, fontSize: 10, color: isOver ? C.red : C.graphite }}>
        {isOver ? `${pct - 100}% over plan` : `${100 - pct}% under plan`}
      </div>
    </div>
  );
}

// ── Partner drawer ────────────────────────────────────────────────────────────
function PartnerDrawer({ partner, onClose }: { partner: PartnerRow; onClose: () => void }) {
  const initials = partner.name.split(" ").map((n) => n[0]).join("");
  const active = partner.projects.filter((p) => p.status === "Active");
  const closed = partner.projects.filter((p) => p.status !== "Active");

  return (
    <>
      <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(22,48,63,0.2)", zIndex: 100 }} />
      <div style={{
        position: "fixed", top: 0, right: 0, bottom: 0, width: 380,
        background: C.paper, borderLeft: `1px solid ${C.hairline}`,
        boxShadow: "-8px 0 32px rgba(22,48,63,0.14)",
        zIndex: 101, display: "flex", flexDirection: "column", overflow: "hidden",
      }}>
        {/* header */}
        <div style={{ padding: "18px 22px 16px", borderBottom: `1px solid ${C.hairline}`, flexShrink: 0 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
              <div style={{ width: 40, height: 40, borderRadius: "50%", background: C.ink, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: C.sans, fontSize: 13, fontWeight: 600, color: C.paper, flexShrink: 0 }}>
                {initials}
              </div>
              <div>
                <div style={{ fontFamily: C.sans, fontWeight: 600, fontSize: 15, color: C.ink }}>{partner.name}</div>
                <div style={{ fontFamily: C.sans, fontSize: 11, color: C.graphite, marginTop: 2 }}>
                  Partner · {partner.avgTier}
                </div>
              </div>
            </div>
            <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: C.graphite, fontSize: 20, lineHeight: 1 }}>×</button>
          </div>
          {/* quick stats */}
          <div style={{ display: "flex", gap: 16, marginTop: 14 }}>
            {[
              { label: "Active Projects",  value: partner.activeProjects },
              { label: "Total Projects",   value: partner.totalProjects },
              { label: "Total Hours",      value: `${partner.totalHours}h` },
              { label: "BD Conversion",    value: `${partner.conversionRate}%` },
            ].map((s) => (
              <div key={s.label}>
                <div style={{ fontFamily: C.mono, fontSize: 15, fontWeight: 600, color: C.ink }}>{s.value}</div>
                <div style={{ fontFamily: C.sans, fontSize: 10, color: C.graphite, marginTop: 1 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ flex: 1, overflowY: "auto", padding: "20px 22px" }}>
          {/* hours chart */}
          <div style={{ marginBottom: 20 }}>
            <div style={{ fontFamily: C.sans, fontSize: 10, fontWeight: 600, color: C.graphite, letterSpacing: "0.08em", textTransform: "uppercase" as const, marginBottom: 10 }}>
              Hours Over Time (8 Weeks)
            </div>
            <HoursChart values={partner.weeklyHours} />
          </div>

          {/* active projects */}
          {active.length > 0 && (
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontFamily: C.sans, fontSize: 10, fontWeight: 600, color: C.graphite, letterSpacing: "0.08em", textTransform: "uppercase" as const, marginBottom: 8 }}>
                Active Projects
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {active.map((p, i) => <ProjectCard key={i} p={p} />)}
              </div>
            </div>
          )}

          {/* past projects */}
          {closed.length > 0 && (
            <div>
              <div style={{ fontFamily: C.sans, fontSize: 10, fontWeight: 600, color: C.graphite, letterSpacing: "0.08em", textTransform: "uppercase" as const, marginBottom: 8 }}>
                Past Projects
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {closed.map((p, i) => <ProjectCard key={i} p={p} />)}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

// ── Inline sparkline bar strip ────────────────────────────────────────────────
function SparkBars({ values, h = 18 }: { values: number[]; h?: number }) {
  const [hov, setHov] = useState<number | null>(null);
  const maxW = Math.max(...values, 1);
  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: 2, height: h, position: "relative" }}>
      {values.map((v, wi) => (
        <div
          key={wi}
          onMouseEnter={() => setHov(wi)}
          onMouseLeave={() => setHov(null)}
          style={{ flex: 1, display: "flex", alignItems: "flex-end", height: "100%", position: "relative" }}
        >
          <div style={{
            width: "100%",
            background: hov === wi ? C.ink : C.slate,
            borderRadius: "2px 2px 0 0",
            height: `${(v / maxW) * h}px`,
            transition: "background 0.12s",
          }} />
          {hov === wi && (
            <div style={{
              position: "absolute",
              bottom: "calc(100% + 4px)",
              left: "50%",
              transform: "translateX(-50%)",
              background: C.ink,
              color: "#fff",
              borderRadius: 3,
              padding: "2px 5px",
              fontFamily: C.mono,
              fontSize: 9,
              fontWeight: 600,
              whiteSpace: "nowrap",
              pointerEvents: "none",
              zIndex: 30,
            }}>{v}h</div>
          )}
        </div>
      ))}
    </div>
  );
}

// ── Skeleton ──────────────────────────────────────────────────────────────────
function Skeleton() {
  return (
    <>
      <style>{`@keyframes shimmer{0%{background-position:200% 0}100%{background-position:-200% 0}}`}</style>
      {Array.from({ length: 4 }).map((_, i) => (
        <tr key={i} style={{ borderBottom: `1px solid ${C.mist}` }}>
          {[80, 32, 32, 40, 40, 40, 40].map((w, j) => (
            <td key={j} style={{ padding: "14px 14px" }}>
              <div style={{ height: 11, borderRadius: 4, width: `${w * 2}px`, background: "linear-gradient(90deg,#E4E9EC 25%,#EFF2F4 50%,#E4E9EC 75%)", backgroundSize: "200% 100%", animation: "shimmer 1.4s infinite" }} />
            </td>
          ))}
        </tr>
      ))}
    </>
  );
}

// ── Main tab ──────────────────────────────────────────────────────────────────
export default function ByPartner() {
  const [sortKey, setSortKey]     = useState<"name" | "totalHours" | "conversion" | "active">("name");
  const [sortDir, setSortDir]     = useState<1 | -1>(1);
  const [loading]                 = useState(false);
  const [openPartner, setOpenPartner] = useState<PartnerRow | null>(null);

  const sort = (key: typeof sortKey) => {
    if (sortKey === key) setSortDir((d) => (d === 1 ? -1 : 1));
    else { setSortKey(key); setSortDir(key === "totalHours" || key === "conversion" ? -1 : 1); }
  };

  const visible = [...PARTNERS].sort((a, b) => {
    const v =
      sortKey === "name"       ? a.name.localeCompare(b.name) :
      sortKey === "totalHours" ? a.totalHours - b.totalHours :
      sortKey === "conversion" ? a.conversionRate - b.conversionRate :
      a.activeProjects - b.activeProjects;
    return v * sortDir;
  });

  const COLS = [
    { key: "name",       label: "Partner" },
    { key: "active",     label: "Active Projects" },
    { key: null,         label: "Total Projects" },
    { key: "totalHours", label: "Total Hours" },
    { key: null,         label: "Avg Tier" },
    { key: "conversion", label: "BD Conversion" },
    { key: null,         label: "8-Week Hours" },
  ];

  const tierColor: Record<string, string> = { "Tier 1": C.green, "Tier 2": C.amber, "Tier 3": C.graphite };

  function SortTh({ col }: { col: typeof COLS[number] }) {
    const active = col.key === sortKey;
    return (
      <th onClick={() => col.key && sort(col.key as any)} style={{
        padding: "10px 14px", textAlign: "left",
        fontFamily: C.sans, fontSize: 11, fontWeight: 600,
        color: active ? C.ink : C.graphite,
        letterSpacing: "0.06em", textTransform: "uppercase" as const,
        whiteSpace: "nowrap" as const,
        cursor: col.key ? "pointer" : "default", userSelect: "none" as const,
      }}>
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
    <div style={{ padding: "22px 28px 48px", maxWidth: 1100 }}>
      <div style={{ background: C.paper, border: `1px solid ${C.hairline}`, borderRadius: 8, overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: C.bg, borderBottom: `1px solid ${C.hairline}` }}>
              {COLS.map((col, i) => <SortTh key={i} col={col} />)}
            </tr>
          </thead>
          <tbody>
            {loading ? <Skeleton /> : visible.length === 0 ? (
              <tr><td colSpan={7}>
                <div style={{ padding: "64px 24px", textAlign: "center" }}>
                  <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke={C.hairline} strokeWidth="1.5" style={{ marginBottom: 10 }}>
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
                  </svg>
                  <div style={{ fontFamily: C.sans, fontWeight: 600, fontSize: 13, color: C.ink, marginBottom: 4 }}>No partners found</div>
                  <div style={{ fontFamily: C.sans, fontSize: 12, color: C.graphite }}>Partner data will appear here once available.</div>
                </div>
              </td></tr>
            ) : visible.map((p, i) => {
              const sparkH = 18;
              const initials = p.name.split(" ").map((n) => n[0]).join("");
              return (
                <tr key={p.id}
                  onClick={() => setOpenPartner(p)}
                  style={{
                    borderBottom: i < visible.length - 1 ? `1px solid ${C.mist}` : "none",
                    background: i % 2 === 0 ? C.paper : C.bg,
                    cursor: "pointer", transition: "background 0.1s",
                  }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "#EDF2F5"; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = i % 2 === 0 ? C.paper : C.bg; }}
                >
                  {/* name + avatar */}
                  <td style={{ padding: "13px 14px", verticalAlign: "middle" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div style={{ width: 32, height: 32, borderRadius: "50%", background: C.ink, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: C.sans, fontSize: 11, fontWeight: 600, color: C.paper, flexShrink: 0 }}>
                        {initials}
                      </div>
                      <div>
                        <div style={{ fontFamily: C.sans, fontWeight: 600, fontSize: 13, color: C.ink }}>{p.name}</div>
                        <div style={{ fontFamily: C.sans, fontSize: 10, color: C.graphite, marginTop: 1 }}>Partner</div>
                      </div>
                    </div>
                  </td>
                  {/* active projects */}
                  <td style={{ padding: "13px 14px", verticalAlign: "middle" }}>
                    <span style={{ fontFamily: C.mono, fontSize: 13, fontWeight: 600, color: p.activeProjects > 0 ? C.ink : C.graphite }}>{p.activeProjects}</span>
                  </td>
                  {/* total projects */}
                  <td style={{ padding: "13px 14px", verticalAlign: "middle" }}>
                    <span style={{ fontFamily: C.mono, fontSize: 13, color: C.graphite }}>{p.totalProjects}</span>
                  </td>
                  {/* total hours */}
                  <td style={{ padding: "13px 14px", verticalAlign: "middle" }}>
                    <span style={{ fontFamily: C.mono, fontSize: 13, fontWeight: 600, color: C.ink }}>{p.totalHours.toLocaleString()}h</span>
                  </td>
                  {/* avg tier */}
                  <td style={{ padding: "13px 14px", verticalAlign: "middle" }}>
                    <span style={{
                      fontFamily: C.sans, fontSize: 11, fontWeight: 600,
                      color: tierColor[p.avgTier] || C.graphite,
                      background: `${tierColor[p.avgTier] || C.graphite}18`,
                      padding: "2px 7px", borderRadius: 3,
                    }}>
                      {p.avgTier}
                    </span>
                  </td>
                  {/* bd conversion */}
                  <td style={{ padding: "13px 14px", verticalAlign: "middle" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                      <div style={{ width: 52, height: 3, background: C.mist, borderRadius: 2 }}>
                        <div style={{ height: "100%", width: `${p.conversionRate}%`, background: p.conversionRate >= 65 ? C.green : p.conversionRate >= 50 ? C.amber : C.red, borderRadius: 2 }} />
                      </div>
                      <span style={{ fontFamily: C.mono, fontSize: 12, color: C.graphite }}>{p.conversionRate}%</span>
                    </div>
                  </td>
                  {/* mini bar sparkline */}
                  <td style={{ padding: "13px 14px", verticalAlign: "middle" }} onClick={(e) => e.stopPropagation()}>
                    <SparkBars values={p.weeklyHours} h={sparkH} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {openPartner && <PartnerDrawer partner={openPartner} onClose={() => setOpenPartner(null)} />}
    </div>
  );
}
