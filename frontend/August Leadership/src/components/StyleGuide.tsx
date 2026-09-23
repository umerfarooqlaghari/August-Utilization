import ArcGauge from "./ArcGauge";

const C = {
  ink:      "#16303F",
  slate:    "#3E5568",
  paper:    "#FFFFFF",
  mist:     "#E4E9EC",
  graphite: "#5B6472",
  hairline: "#DAD7CF",
  ivory:    "#D9E2E8",
  bg:       "#F8FAFB",
  green:    "#3F7A5D",
  amber:    "#B8875A",
  red:      "#B14A3D",
  sans:     "'IBM Plex Sans', sans-serif",
  mono:     "'IBM Plex Mono', monospace",
};

// ── Section wrapper ───────────────────────────────────────────────────────────
function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section style={{ marginBottom: 48 }}>
      <div style={{
        fontFamily: C.sans, fontSize: 10, fontWeight: 700, letterSpacing: "0.12em",
        textTransform: "uppercase" as const, color: C.graphite, marginBottom: 16,
        paddingBottom: 10, borderBottom: `1px solid ${C.hairline}`,
      }}>
        {title}
      </div>
      {children}
    </section>
  );
}

// ── Color palette ─────────────────────────────────────────────────────────────
const COLORS = [
  { name: "Ink",          token: "--color-ink",      hex: "#16303F", bg: "#16303F", text: "#D9E2E8", role: "Primary canvas, headings, dark UI" },
  { name: "Slate",        token: "--color-slate",     hex: "#3E5568", bg: "#3E5568", text: "#D9E2E8", role: "Secondary, mid-tone interactive" },
  { name: "Graphite",     token: "--color-graphite",  hex: "#5B6472", bg: "#5B6472", text: "#FFFFFF", role: "Muted labels, secondary text" },
  { name: "Hairline",     token: "--color-hairline",  hex: "#DAD7CF", bg: "#DAD7CF", text: "#16303F", role: "Borders and rules (1px only)" },
  { name: "Mist",         token: "--color-mist",      hex: "#E4E9EC", bg: "#E4E9EC", text: "#16303F", role: "Subtle fills, filter chips" },
  { name: "Ivory",        token: "--color-ivory",     hex: "#D9E2E8", bg: "#D9E2E8", text: "#16303F", role: "Light accent, reversed text" },
  { name: "Background",   token: "--color-bg",        hex: "#F8FAFB", bg: "#F8FAFB", text: "#16303F", role: "Page and alternating row bg", border: true },
  { name: "Paper",        token: "--color-paper",     hex: "#FFFFFF", bg: "#FFFFFF", text: "#16303F", role: "Card and surface background", border: true },
  { name: "Signal Green", token: "--color-green",     hex: "#3F7A5D", bg: "#3F7A5D", text: "#FFFFFF", role: "On-track · healthy · completed" },
  { name: "Signal Amber", token: "--color-amber",     hex: "#B8875A", bg: "#B8875A", text: "#FFFFFF", role: "At risk · caution · over-expected" },
  { name: "Signal Red",   token: "--color-red",       hex: "#B14A3D", bg: "#B14A3D", text: "#FFFFFF", role: "Behind · over-capacity · critical" },
];

// ── Progress indicator examples ───────────────────────────────────────────────
function FlatBarDemo({ label, pct, color }: { label: string; pct: number; color: string }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
        <span style={{ fontFamily: C.sans, fontSize: 11, color: C.graphite }}>{label}</span>
        <span style={{ fontFamily: C.mono, fontSize: 11, fontWeight: 600, color }}>{pct}%</span>
      </div>
      <div style={{ height: 4, background: C.mist, borderRadius: 2 }}>
        <div style={{ height: "100%", width: `${Math.min(pct, 100)}%`, background: color, borderRadius: 2 }} />
      </div>
    </div>
  );
}

// ── Badge component ───────────────────────────────────────────────────────────
function Badge({ label, color, bg, border }: { label: string; color: string; bg: string; border?: string }) {
  return (
    <span style={{
      fontFamily: C.sans, fontSize: 11, fontWeight: 600,
      color, background: bg,
      border: border ? `1px solid ${border}` : undefined,
      padding: "3px 9px", borderRadius: 3,
      display: "inline-block", whiteSpace: "nowrap" as const,
    }}>
      {label}
    </span>
  );
}

// ── Rule / divider label ──────────────────────────────────────────────────────
function SubLabel({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ fontFamily: C.sans, fontSize: 10, fontWeight: 600, color: C.graphite, letterSpacing: "0.08em", textTransform: "uppercase" as const, marginBottom: 10, marginTop: 20 }}>
      {children}
    </div>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────
export default function StyleGuide() {
  return (
    <div style={{ padding: "28px 28px 80px", maxWidth: 900 }}>

      {/* Header */}
      <div style={{ marginBottom: 36 }}>
        <h1 style={{ fontFamily: C.sans, fontWeight: 700, fontSize: 24, color: C.ink, margin: "0 0 6px", letterSpacing: "-0.02em" }}>
          Amplify Vantage
        </h1>
        <div style={{ fontFamily: C.sans, fontSize: 13, color: C.graphite, letterSpacing: "0.03em" }}>
          Design System Reference · Internal
        </div>
        <div style={{ fontFamily: C.mono, fontSize: 11, color: C.graphite, marginTop: 4 }}>
          Last updated: 2026-08-24 · This document describes the approved tokens, type styles, and component patterns in use across all four Amplify Vantage modules.
        </div>
      </div>

      {/* ── 1. Color Tokens ── */}
      <Section title="01 · Color Tokens">
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
          {COLORS.map((col) => (
            <div key={col.hex} style={{
              background: C.paper, border: `1px solid ${C.hairline}`, borderRadius: 8, overflow: "hidden",
            }}>
              <div style={{
                height: 56, background: col.bg,
                border: col.border ? `1px solid ${C.hairline}` : undefined,
                borderBottom: `1px solid ${C.hairline}`,
              }} />
              <div style={{ padding: "10px 12px" }}>
                <div style={{ fontFamily: C.sans, fontWeight: 600, fontSize: 12, color: C.ink, marginBottom: 2 }}>{col.name}</div>
                <div style={{ fontFamily: C.mono, fontSize: 11, color: C.graphite, marginBottom: 4 }}>{col.hex}</div>
                <div style={{ fontFamily: C.sans, fontSize: 10, color: C.graphite, lineHeight: 1.5 }}>{col.role}</div>
              </div>
            </div>
          ))}
        </div>

        <div style={{ marginTop: 16, padding: "12px 16px", background: C.bg, border: `1px solid ${C.hairline}`, borderRadius: 6 }}>
          <span style={{ fontFamily: C.sans, fontSize: 11, fontWeight: 600, color: C.ink }}>Signal colors (green / amber / red) are reserved exclusively for status meaning.</span>
          <span style={{ fontFamily: C.sans, fontSize: 11, color: C.graphite }}> They must never be used decoratively. Any percentage or count colored green/amber/red must carry a direct on-track / at-risk / over-capacity interpretation.</span>
        </div>
      </Section>

      {/* ── 2. Typefaces ── */}
      <Section title="02 · Typefaces">
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>

          {/* IBM Plex Sans */}
          <div style={{ background: C.paper, border: `1px solid ${C.hairline}`, borderRadius: 8, padding: "20px 22px" }}>
            <div style={{ fontFamily: C.mono, fontSize: 10, color: C.graphite, letterSpacing: "0.06em", textTransform: "uppercase" as const, marginBottom: 14 }}>IBM Plex Sans</div>
            <div style={{ fontFamily: C.sans, fontSize: 10, fontWeight: 600, color: C.graphite, letterSpacing: "0.08em", textTransform: "uppercase" as const, marginBottom: 10 }}>Role: all UI text — labels, headings, descriptions, navigation</div>

            <div style={{ fontFamily: C.sans, fontWeight: 700, fontSize: 22, color: C.ink, marginBottom: 6, letterSpacing: "-0.01em" }}>Heading — Bold 700</div>
            <div style={{ fontFamily: C.sans, fontWeight: 600, fontSize: 16, color: C.ink, marginBottom: 6 }}>Card title — SemiBold 600</div>
            <div style={{ fontFamily: C.sans, fontWeight: 500, fontSize: 13, color: C.ink, marginBottom: 6 }}>Body emphasis — Medium 500</div>
            <div style={{ fontFamily: C.sans, fontWeight: 400, fontSize: 13, color: C.slate, marginBottom: 6, lineHeight: 1.6 }}>Body copy — Regular 400. Used for descriptions, activity items, and contextual notes throughout the dashboard.</div>
            <div style={{ fontFamily: C.sans, fontWeight: 600, fontSize: 10, color: C.graphite, letterSpacing: "0.09em", textTransform: "uppercase" as const }}>OVERLINE — ALL CAPS 600 · 0.09em spacing</div>
          </div>

          {/* IBM Plex Mono */}
          <div style={{ background: C.paper, border: `1px solid ${C.hairline}`, borderRadius: 8, padding: "20px 22px" }}>
            <div style={{ fontFamily: C.mono, fontSize: 10, color: C.graphite, letterSpacing: "0.06em", textTransform: "uppercase" as const, marginBottom: 14 }}>IBM Plex Mono</div>
            <div style={{ fontFamily: C.sans, fontSize: 10, fontWeight: 600, color: C.graphite, letterSpacing: "0.08em", textTransform: "uppercase" as const, marginBottom: 10 }}>Role: all numeric values — percentages, hours, counts, timestamps, IDs</div>

            <div style={{ fontFamily: C.mono, fontWeight: 600, fontSize: 40, color: C.ink, lineHeight: 1, marginBottom: 10 }}>78%</div>
            <div style={{ fontFamily: C.mono, fontWeight: 600, fontSize: 22, color: C.ink, marginBottom: 8 }}>499h logged</div>
            <div style={{ fontFamily: C.mono, fontWeight: 400, fontSize: 13, color: C.slate, marginBottom: 8 }}>128 / 140h · 91%</div>
            <div style={{ fontFamily: C.mono, fontSize: 11, color: C.graphite, marginBottom: 6 }}>2024-08-24 · Aug 26</div>
            <div style={{ fontFamily: C.mono, fontSize: 10, color: C.graphite }}>PJ-001 · TM-004 · PA-02</div>

            <div style={{ marginTop: 14, padding: "8px 10px", background: C.bg, borderRadius: 5, border: `1px solid ${C.hairline}` }}>
              <div style={{ fontFamily: C.sans, fontSize: 10, color: C.graphite, lineHeight: 1.55 }}>
                <strong style={{ color: C.ink }}>Rule:</strong> if a value is a number, percentage, date, duration, or identifier — it must be set in IBM Plex Mono. Labels that contain a number must split the string: label in Sans, the numeric part in Mono.
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* ── 3. Progress Indicators ── */}
      <Section title="03 · Progress Indicators">
        <div style={{ fontFamily: C.sans, fontSize: 12, color: C.slate, marginBottom: 20, lineHeight: 1.6 }}>
          Exactly two progress indicator types are permitted. Never introduce a third variant (ring gauge, step counter as bar, etc.).
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>

          {/* Type A: Arc Gauge */}
          <div style={{ background: C.paper, border: `1px solid ${C.hairline}`, borderRadius: 8, padding: "20px 22px" }}>
            <div style={{ fontFamily: C.sans, fontWeight: 600, fontSize: 12, color: C.ink, marginBottom: 4 }}>Type A · Arc Gauge (270°)</div>
            <div style={{ fontFamily: C.sans, fontSize: 11, color: C.graphite, marginBottom: 16, lineHeight: 1.6 }}>
              Use for standalone KPI emphasis — large single-metric cards, the utilization KPI row, the Project Detail completion circle. The arc sweeps 270° starting bottom-left.
            </div>
            <div style={{ display: "flex", justifyContent: "space-around", alignItems: "flex-end" }}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
                <ArcGauge value={74} size={72} color={C.green} />
                <span style={{ fontFamily: C.sans, fontSize: 10, color: C.graphite }}>88px default</span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
                <ArcGauge value={74} size={48} color={C.slate} />
                <span style={{ fontFamily: C.sans, fontSize: 10, color: C.graphite }}>48px compact</span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
                <ArcGauge value={74} size={120} color={C.green} />
                <span style={{ fontFamily: C.sans, fontSize: 10, color: C.graphite }}>120px large</span>
              </div>
            </div>
          </div>

          {/* Type B: Flat bar */}
          <div style={{ background: C.paper, border: `1px solid ${C.hairline}`, borderRadius: 8, padding: "20px 22px" }}>
            <div style={{ fontFamily: C.sans, fontWeight: 600, fontSize: 12, color: C.ink, marginBottom: 4 }}>Type B · Flat Bar</div>
            <div style={{ fontFamily: C.sans, fontSize: 11, color: C.graphite, marginBottom: 16, lineHeight: 1.6 }}>
              Use for inline compact contexts — table cells, drawer rows, cards where the metric is secondary to surrounding content. Always 3–6px tall with a Mist track.
            </div>
            <FlatBarDemo label="Delivery progress" pct={74} color={C.green} />
            <FlatBarDemo label="Hours burn (over plan)" pct={112} color={C.red} />
            <FlatBarDemo label="BD conversion rate" pct={58} color={C.amber} />
          </div>
        </div>
      </Section>

      {/* ── 4. Arc Gauge States ── */}
      <Section title="04 · Arc Gauge — Three States">
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
          {[
            {
              state: "Healthy", value: 74, color: C.green, bg: "#EBF4EF",
              description: "Utilization or completion is on track. No immediate action needed.",
              range: "< 90%",
            },
            {
              state: "Caution", value: 94, color: C.amber, bg: "#FBF6F0",
              description: "Approaching a threshold — over 90% utilization or behind pace.",
              range: "90–100%",
            },
            {
              state: "Risk", value: 113, color: C.red, bg: "#FBF0EF",
              description: "Over capacity or behind plan. Requires review or intervention.",
              range: "> 100%",
            },
          ].map((s) => (
            <div key={s.state} style={{
              background: s.bg, border: `1px solid ${s.color}22`, borderRadius: 8,
              padding: "24px 20px", display: "flex", flexDirection: "column", alignItems: "center", gap: 12,
              borderTop: `3px solid ${s.color}`,
            }}>
              <ArcGauge value={s.value} size={96} color={s.color} />
              <div style={{ textAlign: "center" }}>
                <div style={{ fontFamily: C.sans, fontWeight: 700, fontSize: 13, color: s.color, marginBottom: 4 }}>{s.state}</div>
                <div style={{ fontFamily: C.mono, fontSize: 10, color: C.graphite, marginBottom: 6 }}>Range: {s.range}</div>
                <div style={{ fontFamily: C.sans, fontSize: 11, color: C.slate, lineHeight: 1.55 }}>{s.description}</div>
              </div>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 12, padding: "10px 14px", background: C.bg, border: `1px solid ${C.hairline}`, borderRadius: 6, fontFamily: C.sans, fontSize: 11, color: C.graphite, lineHeight: 1.6 }}>
          When a value exceeds 100%, the arc fills completely and the label still shows the raw value (e.g., "113%"). The over-capacity meaning is carried by color alone — no additional icons or text are required at the gauge level.
        </div>
      </Section>

      {/* ── 5. Badge Inventory ── */}
      <Section title="05 · Badge Inventory">

        <SubLabel>Status — project delivery health</SubLabel>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" as const, marginBottom: 4 }}>
          <Badge label="On Track"  color={C.green} bg="#EBF4EF" />
          <Badge label="At Risk"   color={C.amber} bg="#FBF6F0" />
          <Badge label="Behind"    color={C.red}   bg="#FBF0EF" />
        </div>
        <div style={{ fontFamily: C.sans, fontSize: 10, color: C.graphite, marginBottom: 4 }}>Driven by the signal color system. Used in project list, board cards, and project detail header.</div>

        <SubLabel>Project Stage — pipeline position</SubLabel>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" as const, marginBottom: 4 }}>
          {["Intake", "Sourcing", "Shortlist", "Interviews", "Offer", "Closed"].map((s) => (
            <Badge key={s} label={s} color={C.graphite} bg={C.mist} />
          ))}
        </div>
        <div style={{ fontFamily: C.sans, fontSize: 10, color: C.graphite, marginBottom: 4 }}>Neutral Graphite-on-Mist. Stage is positional context, not a health signal — never use signal colors here.</div>

        <SubLabel>Tier — commercial classification</SubLabel>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" as const, marginBottom: 4 }}>
          <Badge label="Tier 1" color="#D9E2E8" bg="#16303F" />
          <Badge label="Tier 2" color="#D9E2E8" bg="#3E5568" />
          <Badge label="Tier 3" color="#D9E2E8" bg="#5B6472" />
        </div>
        <div style={{ fontFamily: C.sans, fontSize: 10, color: C.graphite, marginBottom: 4 }}>Uses the neutral brand scale (Ink → Slate → Graphite). No signal colors — tier is a classification, not a health status.</div>

        <SubLabel>Employment type — team member contract</SubLabel>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" as const, marginBottom: 4 }}>
          <Badge label="Full-time"  color={C.ink}   bg={C.mist} />
          <Badge label="Part-time"  color={C.slate}  bg={C.mist} />
          <Badge label="Contractor" color={C.graphite} bg={C.mist} border={C.hairline} />
        </div>
        <div style={{ fontFamily: C.sans, fontSize: 10, color: C.graphite, marginBottom: 4 }}>Mist background with ink-scale text. Contractor uses a hairline border to distinguish from full-time/part-time.</div>

        <SubLabel>Prediction health — risk assessment</SubLabel>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" as const, marginBottom: 4 }}>
          <Badge label="Low Risk"    color={C.green} bg="#EBF4EF" />
          <Badge label="Medium Risk" color={C.amber} bg="#FBF6F0" />
          <Badge label="High Risk"   color={C.red}   bg="#FBF0EF" />
        </div>
        <div style={{ fontFamily: C.sans, fontSize: 10, color: C.graphite, marginBottom: 4 }}>Plain-language risk labels backed by the signal color system. Never show a numeric score — the word and color together are the signal.</div>

        <SubLabel>Miscellaneous — role, access, system state</SubLabel>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" as const, marginBottom: 4 }}>
          <Badge label="Partner"     color="#16303F" bg="#D9E2E8" />
          <Badge label="Full access" color={C.graphite} bg="transparent" />
          <Badge label="Active"      color={C.ink}   bg={C.mist} />
          <Badge label="On Hold"     color={C.amber} bg="#FBF6F0" />
          <Badge label="Closed"      color={C.graphite} bg={C.mist} />
          <Badge label="Estimated"   color={C.graphite} bg={C.mist} border={C.hairline} />
        </div>

      </Section>

      {/* ── 6. Interaction Patterns ── */}
      <Section title="06 · Interaction Patterns">
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>

          <div style={{ background: C.paper, border: `1px solid ${C.hairline}`, borderRadius: 8, padding: "16px 18px" }}>
            <div style={{ fontFamily: C.sans, fontWeight: 600, fontSize: 12, color: C.ink, marginBottom: 10 }}>Table rows</div>
            <div style={{ fontFamily: C.sans, fontSize: 11, color: C.slate, lineHeight: 1.65 }}>
              Default: alternating Paper / Background (#F8FAFB).<br />
              Hover: <span style={{ fontFamily: C.mono, fontSize: 10 }}>#EDF2F5</span> — consistent across all tables, no box-shadow.<br />
              Click: navigates to detail view or opens drawer. Cursor: pointer.
            </div>
          </div>

          <div style={{ background: C.paper, border: `1px solid ${C.hairline}`, borderRadius: 8, padding: "16px 18px" }}>
            <div style={{ fontFamily: C.sans, fontWeight: 600, fontSize: 12, color: C.ink, marginBottom: 10 }}>Cards</div>
            <div style={{ fontFamily: C.sans, fontSize: 11, color: C.slate, lineHeight: 1.65 }}>
              Default: Paper bg, 1px Hairline border, 8px radius, no shadow.<br />
              Hover (clickable cards only): subtle <span style={{ fontFamily: C.mono, fontSize: 10 }}>box-shadow: 0 4px 16px rgba(22,48,63,0.08)</span>.<br />
              Never use shadows on non-interactive cards.
            </div>
          </div>

          <div style={{ background: C.paper, border: `1px solid ${C.hairline}`, borderRadius: 8, padding: "16px 18px" }}>
            <div style={{ fontFamily: C.sans, fontWeight: 600, fontSize: 12, color: C.ink, marginBottom: 10 }}>Buttons</div>
            <div style={{ fontFamily: C.sans, fontSize: 11, color: C.slate, lineHeight: 1.65 }}>
              Primary: Ink bg → Slate bg on hover.<br />
              Secondary: Paper bg, Hairline border → Mist bg on hover.<br />
              Ghost/text: transparent → color darkens to Ink on hover.<br />
              Icon buttons: transparent → Mist (#E4E9EC) bg on hover.
            </div>
          </div>

          <div style={{ background: C.paper, border: `1px solid ${C.hairline}`, borderRadius: 8, padding: "16px 18px" }}>
            <div style={{ fontFamily: C.sans, fontWeight: 600, fontSize: 12, color: C.ink, marginBottom: 10 }}>Drawers &amp; Modals</div>
            <div style={{ fontFamily: C.sans, fontSize: 11, color: C.slate, lineHeight: 1.65 }}>
              Drawers: 300–380px, right-anchored, with <span style={{ fontFamily: C.mono, fontSize: 10 }}>rgba(22,48,63,0.2)</span> backdrop.<br />
              Modals: centered, 400px wide, with <span style={{ fontFamily: C.mono, fontSize: 10 }}>rgba(22,48,63,0.3)</span> backdrop.<br />
              Both use <span style={{ fontFamily: C.mono, fontSize: 10 }}>box-shadow</span> since they float above the surface.
            </div>
          </div>
        </div>
      </Section>

    </div>
  );
}
