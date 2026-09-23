import { useMemo, useState } from "react";
import {
  C,
  MANDATE,
  RESOURCES,
  DOWNTIME_FACTOR,
  SCENARIOS,
  STEPS,
  buildModel,
  type ScenarioKey,
  type EngineModel,
} from "./engine/data";
import EngineVisualizer from "./engine/EngineVisualizer";

// ─── Formatting ───────────────────────────────────────────────────────────────
const h = (n: number, dp = 1) =>
  n.toLocaleString("en-US", { minimumFractionDigits: dp, maximumFractionDigits: dp });
const money = (n: number) =>
  (n < 0 ? "−$" : "$") +
  Math.abs(n).toLocaleString("en-US", { maximumFractionDigits: 0 });

// ─── Shared primitives (mirrored from Prediction) ─────────────────────────────
function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ fontFamily: C.sans, fontSize: 10, fontWeight: 700, letterSpacing: "0.10em", textTransform: "uppercase" as const, color: C.graphite, marginBottom: 14 }}>
      {children}
    </div>
  );
}

function Card({ title, aside, children }: { title?: string; aside?: React.ReactNode; children: React.ReactNode }) {
  return (
    <div style={{ background: C.paper, border: `1px solid ${C.hairline}`, borderRadius: 8, overflow: "hidden" }}>
      {title && (
        <div style={{ padding: "14px 20px", borderBottom: `1px solid ${C.hairline}`, display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontFamily: C.sans, fontWeight: 600, fontSize: 13, color: C.ink }}>{title}</span>
          <div style={{ flex: 1 }} />
          {aside}
        </div>
      )}
      <div style={{ padding: "18px 20px" }}>{children}</div>
    </div>
  );
}

function AssumptionPill({ children = "Assumption" }: { children?: React.ReactNode }) {
  return (
    <span style={{ fontFamily: C.sans, fontSize: 10, fontWeight: 500, letterSpacing: "0.04em", color: C.graphite, background: C.mist, border: `1px solid ${C.hairline}`, borderRadius: 3, padding: "2px 7px" }}>
      {children}
    </span>
  );
}

function Formula({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ fontFamily: C.mono, fontSize: 11.5, color: C.slate, background: C.bg, border: `1px solid ${C.hairline}`, borderRadius: 5, padding: "9px 12px", margin: "10px 0 14px", lineHeight: 1.6 }}>
      {children}
    </div>
  );
}

function Note({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ fontFamily: C.sans, fontSize: 11, color: C.graphite, lineHeight: 1.6, marginTop: 12 }}>
      {children}
    </div>
  );
}

// ─── Step 01 · Inputs ─────────────────────────────────────────────────────────
function StepInputs({ m }: { m: EngineModel }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1.35fr", gap: 12 }}>
      <Card title="Mandate">
        <dl style={{ margin: 0 }}>
          {[
            ["Project", `${MANDATE.id} · ${MANDATE.client}`],
            ["Lead Partner", MANDATE.partner],
            ["Type", MANDATE.type],
            ["Tier", MANDATE.tier],
            ["Assignment value", money(MANDATE.assignmentValue)],
            ["Planned hours", `${MANDATE.plannedHours} h`],
          ].map(([k, v]) => (
            <div key={k} style={{ display: "flex", justifyContent: "space-between", gap: 12, padding: "7px 0", borderBottom: `1px solid ${C.mist}` }}>
              <dt style={{ fontFamily: C.sans, fontSize: 12, color: C.graphite }}>{k}</dt>
              <dd style={{ margin: 0, fontFamily: C.sans, fontSize: 12, fontWeight: 600, color: C.ink, textAlign: "right" }}>{v}</dd>
            </div>
          ))}
        </dl>
        <Note>
          The tier sets planned hours. That mapping is the resourcing template —
          running as a live calculation rather than a document someone opens.
        </Note>
      </Card>

      <Card title="Resourcing template → planned hours" aside={<AssumptionPill>Rates assumed</AssumptionPill>}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: `1px solid ${C.hairline}` }}>
              {["Team member", "Level", "Rate", "Hours", "Cost"].map((th, i) => (
                <th key={th} style={{ padding: "0 0 8px", fontFamily: C.sans, fontSize: 10, fontWeight: 600, letterSpacing: "0.07em", textTransform: "uppercase" as const, color: C.graphite, textAlign: i > 1 ? "right" : "left" }}>
                  {th}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {RESOURCES.map((r) => (
              <tr key={r.id} style={{ borderBottom: `1px solid ${C.mist}` }}>
                <td style={{ padding: "9px 0", fontFamily: C.sans, fontSize: 12, fontWeight: 500, color: C.ink }}>{r.name}</td>
                <td style={{ padding: "9px 0", fontFamily: C.sans, fontSize: 11, color: C.graphite }}>{r.level}</td>
                <td style={{ padding: "9px 0", fontFamily: C.mono, fontSize: 11, color: C.slate, textAlign: "right" }}>${r.costRate}</td>
                <td style={{ padding: "9px 0", fontFamily: C.mono, fontSize: 11, color: C.ink, textAlign: "right" }}>{r.plannedHours}</td>
                <td style={{ padding: "9px 0", fontFamily: C.mono, fontSize: 11, color: C.ink, textAlign: "right" }}>{money(r.plannedHours * r.costRate)}</td>
              </tr>
            ))}
            <tr>
              <td colSpan={3} style={{ padding: "10px 0 0", fontFamily: C.sans, fontSize: 12, fontWeight: 700, color: C.ink }}>Total</td>
              <td style={{ padding: "10px 0 0", fontFamily: C.mono, fontSize: 12, fontWeight: 700, color: C.ink, textAlign: "right" }}>{MANDATE.plannedHours}</td>
              <td style={{ padding: "10px 0 0", fontFamily: C.mono, fontSize: 12, fontWeight: 700, color: C.ink, textAlign: "right" }}>{money(m.plannedCost)}</td>
            </tr>
          </tbody>
        </table>
        <Note>
          Delivery cost is {h((m.plannedCost / MANDATE.assignmentValue) * 100, 1)}% of
          assignment value · blended rate {money(m.blendedRate)}/h.
        </Note>
      </Card>
    </div>
  );
}

// ─── Step 02 · Capacity supply ────────────────────────────────────────────────
function StepCapacity({ m }: { m: EngineModel }) {
  return (
    <Card title="Capacity supply" aside={<AssumptionPill>{Math.round(DOWNTIME_FACTOR * 100)}% downtime</AssumptionPill>}>
      <Formula>
        net capacity&nbsp;=&nbsp;(contracted − leave − internal&nbsp;/&nbsp;BD)&nbsp;×&nbsp;(1 − downtime)
      </Formula>

      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {m.supply.map((s) => {
          const r = s.resource;
          const seg = (v: number) => (v / r.contractedHours) * 100;
          const bars = [
            { w: seg(s.netCapacity), bg: C.ink,   label: `${h(s.netCapacity)}h net` },
            { w: seg(r.leaveHours),  bg: C.amber, label: r.leaveHours ? `${r.leaveHours}h leave` : "" },
            { w: seg(r.internalHours), bg: C.slate, label: `${r.internalHours}h internal` },
            { w: seg(r.contractedHours - s.netCapacity - r.leaveHours - r.internalHours), bg: C.mist, label: "downtime" },
          ];
          return (
            <div key={r.id}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                <span style={{ fontFamily: C.sans, fontSize: 12, fontWeight: 500, color: C.ink }}>
                  {r.name} <span style={{ color: C.graphite, fontWeight: 400 }}>· {r.department}</span>
                </span>
                <span style={{ fontFamily: C.mono, fontSize: 11, fontWeight: 600, color: C.ink }}>
                  {h(s.netCapacity)} of {r.contractedHours}h
                </span>
              </div>
              <div style={{ display: "flex", height: 24, borderRadius: 4, overflow: "hidden", background: C.mist }}>
                {bars.filter((b) => b.w > 0.5).map((b, i) => (
                  <div key={i} title={b.label} style={{ width: `${b.w}%`, background: b.bg, display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
                    {b.w > 14 && (
                      <span style={{ fontFamily: C.mono, fontSize: 9.5, fontWeight: 600, color: b.bg === C.mist ? C.graphite : "#fff", whiteSpace: "nowrap" }}>
                        {b.label}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <Note>
        A capacity figure that skips these deductions always reads optimistic —
        it doesn't know someone is out two of the next five days.
      </Note>
    </Card>
  );
}

// ─── Step 03 · Stage plan ─────────────────────────────────────────────────────
function StepStagePlan({ m, activeStage }: { m: EngineModel; activeStage: string }) {
  const max = Math.max(...m.stagePlan.map((s) => s.hours));
  const total = m.stagePlan.reduce((a, s) => a + s.hours, 0);

  return (
    <Card title="Planned hours by lifecycle stage">
      <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
        {m.stagePlan.map((s, i) => {
          const isCurrent = s.name === activeStage;
          return (
            <div key={s.name} style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <span style={{ width: 92, flexShrink: 0, fontFamily: C.sans, fontSize: 11.5, fontWeight: isCurrent ? 700 : 400, color: isCurrent ? C.ink : C.graphite }}>
                {i + 1}. {s.name}
              </span>
              <div style={{ flex: 1, height: 22, background: C.bg, borderRadius: 3 }}>
                <div style={{ width: `${(s.hours / max) * 100}%`, height: "100%", background: isCurrent ? C.ink : C.slate, borderRadius: 3, display: "flex", alignItems: "center", paddingLeft: 8, opacity: isCurrent ? 1 : 0.55 }}>
                  <span style={{ fontFamily: C.mono, fontSize: 10, fontWeight: 600, color: "#fff" }}>{h(s.hours, 0)}h</span>
                </div>
              </div>
              <span style={{ width: 34, flexShrink: 0, textAlign: "right", fontFamily: C.mono, fontSize: 10, color: C.graphite }}>
                {h(s.weight * 100, 0)}%
              </span>
            </div>
          );
        })}
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 14, padding: "10px 14px", background: C.greenBg, borderRadius: 5 }}>
        <span style={{ fontFamily: C.sans, fontSize: 11.5, color: C.slate }}>Sum of all stages</span>
        <span style={{ fontFamily: C.mono, fontSize: 12, fontWeight: 700, color: C.green }}>
          {h(total, 0)}h — reconciles to plan ✓
        </span>
      </div>

      <Note>
        Every stage must reconcile into the mandate total. A stage plan that
        doesn't tie is a forecast that can't be trusted downstream.
      </Note>
    </Card>
  );
}

// ─── Step 04 · Remaining work ─────────────────────────────────────────────────
function StepRemaining({ m, sc }: { m: EngineModel; sc: typeof SCENARIOS[ScenarioKey] }) {
  const over = m.variance > 0;
  const accent = over ? C.red : C.green;
  const accentBg = over ? C.redBg : C.greenBg;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <Card>
        <div style={{ fontFamily: C.sans, fontSize: 12, color: C.slate }}>
          Position: <strong style={{ color: C.ink }}>{m.currentStage.name}</strong>,{" "}
          {h(sc.stageCompletion * 100, 0)}% complete ·{" "}
          <strong style={{ color: C.ink }}>{h(sc.actualHours, 0)}h</strong> logged to date
        </div>
      </Card>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <div style={{ background: C.paper, border: `1px solid ${C.hairline}`, borderRadius: 8, padding: "18px 20px", opacity: 0.72 }}>
          <div style={{ fontFamily: C.sans, fontSize: 12, fontWeight: 600, color: C.graphite }}>Budget minus actual</div>
          <Formula>{MANDATE.plannedHours} − {h(sc.actualHours, 0)}</Formula>
          <div style={{ fontFamily: C.mono, fontSize: 30, fontWeight: 600, color: C.graphite }}>
            {h(m.naiveRemaining)}<span style={{ fontSize: 14, fontWeight: 400 }}>h</span>
          </div>
          <Note>
            Can never forecast above budget. Structurally incapable of warning you
            about an overrun — it reads calm right up until it doesn't.
          </Note>
        </div>

        <div style={{ background: C.paper, border: `2px solid ${C.ink}`, borderRadius: 8, padding: "18px 20px" }}>
          <div style={{ fontFamily: C.sans, fontSize: 12, fontWeight: 600, color: C.ink }}>Stage-driven</div>
          <Formula>
            {h(m.currentStage.hours, 1)} × (1 − {sc.stageCompletion.toFixed(2)}) + {h(m.futureStagesRemaining, 1)}
          </Formula>
          <div style={{ fontFamily: C.mono, fontSize: 30, fontWeight: 600, color: C.ink }}>
            {h(m.remaining)}<span style={{ fontSize: 14, fontWeight: 400 }}>h</span>
          </div>
          <Note>
            Current stage at its uncompleted portion, plus every stage ahead at full
            planned hours. Driven by operational progress, never elapsed time.
          </Note>
        </div>
      </div>

      <div style={{ background: accentBg, borderRadius: 8, padding: "16px 20px", border: `1px solid ${C.hairline}` }}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 28 }}>
          <div>
            <div style={{ fontFamily: C.sans, fontSize: 10, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase" as const, color: C.graphite }}>
              Forecast at completion
            </div>
            <div style={{ fontFamily: C.mono, fontSize: 22, fontWeight: 700, color: C.ink, marginTop: 3 }}>
              {h(m.forecastAtCompletion)}h
            </div>
          </div>
          <div>
            <div style={{ fontFamily: C.sans, fontSize: 10, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase" as const, color: C.graphite }}>
              Variance to plan
            </div>
            <div style={{ fontFamily: C.mono, fontSize: 22, fontWeight: 700, color: accent, marginTop: 3 }}>
              {over ? "+" : ""}{h(m.variance)}h
            </div>
          </div>
          <div>
            <div style={{ fontFamily: C.sans, fontSize: 10, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase" as const, color: C.graphite }}>
              Cost impact
            </div>
            <div style={{ fontFamily: C.mono, fontSize: 22, fontWeight: 700, color: accent, marginTop: 3 }}>
              {over ? "+" : ""}{money(m.costImpact)}
            </div>
          </div>
        </div>
        <div style={{ fontFamily: C.sans, fontSize: 12, color: C.slate, lineHeight: 1.6, marginTop: 12 }}>
          {sc.reading}
        </div>
      </div>
    </div>
  );
}

// ─── Step 05 · Re-spread ──────────────────────────────────────────────────────
function StepRespread({ m, sc }: { m: EngineModel; sc: typeof SCENARIOS[ScenarioKey] }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {sc.holdWeeks && (
        <Card title="Capacity released during the hold">
          <div style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
            <span style={{ fontFamily: C.mono, fontSize: 22, fontWeight: 700, color: C.green }}>
              {h(m.capacityReleased, 0)}h
            </span>
            <span style={{ fontFamily: C.sans, fontSize: 12, color: C.slate }}>
              returned to the pool across {sc.holdWeeks} weeks on hold
            </span>
          </div>
          <Note>
            Those hours become available for other mandates on a known date, rather
            than sitting invisibly reserved against work that isn't happening.
          </Note>
        </Card>
      )}

      <Card title={`Re-spread · ${sc.pace.toLowerCase()} pace`} aside={<AssumptionPill>Pace assumed</AssumptionPill>}>
        <Formula>week hours = remaining × (pace weight ÷ Σ pace weights)</Formula>

        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: `1px solid ${C.hairline}` }}>
              <th style={{ padding: "0 0 8px", textAlign: "left", fontFamily: C.sans, fontSize: 10, fontWeight: 600, letterSpacing: "0.07em", textTransform: "uppercase" as const, color: C.graphite }}>Week</th>
              {RESOURCES.map((r) => (
                <th key={r.id} style={{ padding: "0 0 8px", textAlign: "right", fontFamily: C.sans, fontSize: 10, fontWeight: 600, letterSpacing: "0.07em", textTransform: "uppercase" as const, color: C.graphite }}>
                  {r.name.split(" ")[0]}
                </th>
              ))}
              <th style={{ padding: "0 0 8px", textAlign: "right", fontFamily: C.sans, fontSize: 10, fontWeight: 600, letterSpacing: "0.07em", textTransform: "uppercase" as const, color: C.ink }}>Total</th>
            </tr>
          </thead>
          <tbody>
            {m.weeks.map((w) => (
              <tr key={w.index} style={{ borderBottom: `1px solid ${C.mist}` }}>
                <td style={{ padding: "9px 0", fontFamily: C.sans, fontSize: 12, color: C.slate }}>Week {w.index}</td>
                {w.byResource.map((b) => (
                  <td key={b.resource.id} style={{ padding: "9px 0", textAlign: "right", fontFamily: C.mono, fontSize: 11, color: C.slate }}>
                    {h(b.hours)}
                  </td>
                ))}
                <td style={{ padding: "9px 0", textAlign: "right", fontFamily: C.mono, fontSize: 11, fontWeight: 700, color: C.ink }}>
                  {h(w.hours)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div style={{
          display: "flex", justifyContent: "space-between", alignItems: "center",
          marginTop: 14, padding: "10px 14px", borderRadius: 5,
          background: m.reconciles ? C.greenBg : C.redBg,
        }}>
          <span style={{ fontFamily: C.sans, fontSize: 11.5, color: C.slate }}>
            Spread total <strong style={{ fontFamily: C.mono, color: C.ink }}>{h(m.spreadTotal)}h</strong>
            {"  vs  "}remaining <strong style={{ fontFamily: C.mono, color: C.ink }}>{h(m.remaining)}h</strong>
          </span>
          <span style={{ fontFamily: C.mono, fontSize: 12, fontWeight: 700, color: m.reconciles ? C.green : C.red }}>
            {m.reconciles ? "Reconciles ✓" : "Does not reconcile ✗"}
          </span>
        </div>

        <Note>
          The model refuses to publish a spread that doesn't tie back to the hours
          it calculated. If this badge ever goes red, the forecast is held rather
          than shipped.
        </Note>
      </Card>
    </div>
  );
}

// ─── Step 06 · Roll-up ────────────────────────────────────────────────────────
function StepRollup({ m, sc }: { m: EngineModel; sc: typeof SCENARIOS[ScenarioKey] }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <Card title="Week 1 · demand against net capacity">
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {m.rollup.map((row) => {
            const pct = row.utilisation * 100;
            const over = pct > 100;
            const tight = pct > 90 && pct <= 100;
            const color = over ? C.red : tight ? C.amber : C.green;
            return (
              <div key={row.resource.id}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                  <span style={{ fontFamily: C.sans, fontSize: 12, fontWeight: 500, color: C.ink }}>
                    {row.resource.name}
                  </span>
                  <span style={{ fontFamily: C.mono, fontSize: 11.5, fontWeight: 700, color }}>
                    {h(pct, 0)}%
                  </span>
                </div>
                <div style={{ position: "relative", height: 22, background: C.mist, borderRadius: 4, overflow: "hidden" }}>
                  <div style={{ width: `${Math.min(pct, 100)}%`, height: "100%", background: color, borderRadius: 4 }} />
                </div>
                <div style={{ fontFamily: C.sans, fontSize: 10.5, color: C.graphite, marginTop: 5 }}>
                  {h(row.mandateHours)}h on {MANDATE.id} + {row.resource.otherCommitments}h elsewhere
                  {" = "}{h(row.demand)}h against {h(row.netCapacity)}h net
                  {over && (
                    <strong style={{ color: C.red }}> · over by {h(row.demand - row.netCapacity)}h</strong>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div style={{ display: "flex", gap: 20, marginTop: 16, paddingTop: 12, borderTop: `1px solid ${C.mist}` }}>
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
      </Card>

      <Card title="What this tells leadership">
        <div style={{ fontFamily: C.sans, fontSize: 12.5, color: C.slate, lineHeight: 1.7 }}>
          {sc.reading}
        </div>
        <div style={{ fontFamily: C.sans, fontSize: 12.5, color: C.slate, lineHeight: 1.7, marginTop: 10 }}>
          Every figure on this page drills back to the stage, the person and the
          logged hour that produced it. Nothing has to be taken on faith.
        </div>
      </Card>

      <div style={{ border: `1px dashed ${C.hairline}`, borderRadius: 8, padding: "18px 20px", background: C.paper }}>
        <div style={{ fontFamily: C.sans, fontSize: 12, fontWeight: 700, color: C.ink, marginBottom: 10 }}>
          Where this goes next
        </div>
        <ul style={{ margin: 0, paddingLeft: 16, display: "flex", flexDirection: "column", gap: 5 }}>
          {[
            "Multiple concurrent mandates competing for the same people",
            "Partner-level roll-up across a whole book of work",
            "Forecast pipeline — unsigned work, probability-weighted",
            "Hiring lead time and ramp, so a gap surfaces while it is still actionable",
            "Leave collisions against peak demand weeks",
          ].map((t) => (
            <li key={t} style={{ fontFamily: C.sans, fontSize: 12, color: C.slate, lineHeight: 1.6 }}>{t}</li>
          ))}
        </ul>
        <div style={{ fontFamily: C.sans, fontSize: 12, color: C.slate, lineHeight: 1.7, marginTop: 12 }}>
          All of it extends this same engine. What we would need first is a working
          session on how delivery actually runs here — how a mandate gets staffed,
          who decides a stage has moved, and what happens today when two mandates
          need the same person in the same week.
        </div>
      </div>
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
interface ForecastEngineProps { period: string }

export default function ForecastEngine({ period: _period }: ForecastEngineProps) {
  const [step, setStep] = useState(0);
  const [scenarioKey, setScenarioKey] = useState<ScenarioKey>("overrun");
  const [showViz, setShowViz] = useState(true);

  const sc = SCENARIOS[scenarioKey];
  const model = useMemo(() => buildModel(sc), [sc]);

  return (
    <div style={{ padding: "24px 28px 56px", maxWidth: 1200, display: "flex", flexDirection: "column", gap: 20 }}>

      {/* Intro */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16 }}>
        <div>
          <div style={{ fontFamily: "Georgia, 'Times New Roman', serif", fontSize: 19, color: C.ink, marginBottom: 6 }}>
            How the forecast works
          </div>
          <div style={{ fontFamily: C.sans, fontSize: 12.5, color: C.graphite, lineHeight: 1.7, maxWidth: 560 }}>
            Six steps, from the resourcing template to a staffing decision. Every
            figure is calculated live — change a scenario and everything downstream
            moves with it.
          </div>
        </div>
        <button
          onClick={() => setShowViz((v) => !v)}
          style={{
            flexShrink: 0,
            fontFamily: C.sans, fontSize: 11.5, fontWeight: 500,
            color: showViz ? C.paper : C.slate,
            background: showViz ? C.ink : C.paper,
            border: `1px solid ${showViz ? C.ink : C.hairline}`,
            borderRadius: 6, padding: "6px 14px", cursor: "pointer",
            transition: "background 0.15s, color 0.15s",
            whiteSpace: "nowrap" as const,
            marginTop: 4,
          }}
        >
          {showViz ? "Hide" : "Show"} Model Visualization
        </button>
      </div>

      {/* Model Visualizer */}
      {showViz && (
        <EngineVisualizer
          model={model}
          activeStep={step}
          scenarioKey={scenarioKey}
          onStepClick={setStep}
        />
      )}

      {/* Scenario selector */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
        <span style={{ fontFamily: C.sans, fontSize: 10, fontWeight: 600, letterSpacing: "0.09em", textTransform: "uppercase" as const, color: C.graphite, marginRight: 2 }}>
          Scenario
        </span>
        {(Object.keys(SCENARIOS) as ScenarioKey[]).map((k) => {
          const active = k === scenarioKey;
          return (
            <button
              key={k}
              onClick={() => setScenarioKey(k)}
              style={{
                fontFamily: C.sans, fontSize: 11.5, fontWeight: active ? 600 : 400,
                color: active ? C.paper : C.slate,
                background: active ? C.ink : C.paper,
                border: `1px solid ${active ? C.ink : C.hairline}`,
                borderRadius: 5, padding: "5px 12px", cursor: "pointer",
                transition: "background 0.15s, color 0.15s, border-color 0.15s",
              }}
            >
              {SCENARIOS[k].label}
            </button>
          );
        })}
      </div>

      {/* Stepper */}
      <div style={{ display: "flex", gap: 4, flexWrap: "wrap", borderBottom: `1px solid ${C.hairline}`, paddingBottom: 12 }}>
        {STEPS.map((s, i) => {
          const active = i === step;
          const done = i < step;
          return (
            <button
              key={s.n}
              onClick={() => setStep(i)}
              style={{
                display: "flex", alignItems: "center", gap: 7,
                padding: "6px 11px", borderRadius: 6, border: "none", cursor: "pointer",
                background: active ? C.ink : "transparent",
                transition: "background 0.15s",
              }}
              onMouseEnter={(e) => { if (!active) (e.currentTarget as HTMLElement).style.background = C.mist; }}
              onMouseLeave={(e) => { if (!active) (e.currentTarget as HTMLElement).style.background = "transparent"; }}
            >
              <span style={{
                fontFamily: C.mono, fontSize: 9.5, fontWeight: 700,
                color: active ? C.paper : done ? C.slate : C.graphite,
                opacity: active ? 1 : done ? 1 : 0.55,
              }}>
                {s.n}
              </span>
              <span style={{
                fontFamily: C.sans, fontSize: 11.5, fontWeight: active ? 600 : 400,
                color: active ? C.paper : done ? C.ink : C.graphite,
                opacity: active || done ? 1 : 0.7, whiteSpace: "nowrap",
              }}>
                {s.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* Active step */}
      <section>
        <SectionLabel>{STEPS[step].n} · {STEPS[step].title}</SectionLabel>
        {step === 0 && <StepInputs m={model} />}
        {step === 1 && <StepCapacity m={model} />}
        {step === 2 && <StepStagePlan m={model} activeStage={model.currentStage.name} />}
        {step === 3 && <StepRemaining m={model} sc={sc} />}
        {step === 4 && <StepRespread m={model} sc={sc} />}
        {step === 5 && <StepRollup m={model} sc={sc} />}
      </section>

      {/* Controls */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: 4 }}>
        <button
          onClick={() => setStep((s) => Math.max(0, s - 1))}
          disabled={step === 0}
          style={{
            fontFamily: C.sans, fontSize: 12, color: step === 0 ? C.graphite : C.ink,
            background: C.paper, border: `1px solid ${C.hairline}`, borderRadius: 6,
            padding: "7px 16px", cursor: step === 0 ? "default" : "pointer", opacity: step === 0 ? 0.45 : 1,
          }}
        >
          ← Back
        </button>
        <span style={{ fontFamily: C.mono, fontSize: 10.5, color: C.graphite }}>
          Step {step + 1} of {STEPS.length}
        </span>
        <button
          onClick={() => setStep((s) => Math.min(STEPS.length - 1, s + 1))}
          disabled={step === STEPS.length - 1}
          style={{
            fontFamily: C.sans, fontSize: 12, fontWeight: 500, color: C.paper,
            background: C.ink, border: `1px solid ${C.ink}`, borderRadius: 6,
            padding: "7px 16px",
            cursor: step === STEPS.length - 1 ? "default" : "pointer",
            opacity: step === STEPS.length - 1 ? 0.35 : 1,
          }}
        >
          Next →
        </button>
      </div>

      {/* Footnote */}
      <div style={{ borderTop: `1px solid ${C.hairline}`, paddingTop: 14, fontFamily: C.sans, fontSize: 10.5, color: C.graphite, lineHeight: 1.7, maxWidth: 720 }}>
        Rates, downtime, stage weights and pace profiles shown here are starting
        assumptions drawn from comparable delivery work. Calibrating them against
        real mandate history — and back-testing the result against closed searches —
        is the first phase of the engagement.
      </div>
    </div>
  );
}
