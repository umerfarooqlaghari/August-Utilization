import { useEffect, useRef, useState } from "react";
import { C, type EngineModel, type ScenarioKey, SCENARIOS, MANDATE, RESOURCES, DOWNTIME_FACTOR } from "./data";

// ─── Helpers ──────────────────────────────────────────────────────────────────
const h = (n: number, dp = 1) =>
  n.toLocaleString("en-US", { minimumFractionDigits: dp, maximumFractionDigits: dp });
const money = (n: number) =>
  (n < 0 ? "−$" : "$") + Math.abs(n).toLocaleString("en-US", { maximumFractionDigits: 0 });

// ─── Node layout (x, y as % of SVG viewBox 0 0 900 360) ──────────────────────
const NODES = [
  { id: 0, x: 90,  y: 180, label: "01", name: "Inputs",        icon: "📋" },
  { id: 1, x: 260, y: 80,  label: "02", name: "Capacity",       icon: "⚡" },
  { id: 2, x: 260, y: 280, label: "03", name: "Stage Plan",     icon: "📊" },
  { id: 3, x: 460, y: 180, label: "04", name: "Remaining Work", icon: "🔢" },
  { id: 4, x: 650, y: 180, label: "05", name: "Re-spread",      icon: "📅" },
  { id: 5, x: 820, y: 180, label: "06", name: "Roll-up",        icon: "✅" },
];

// Edges: [from, to]
const EDGES: [number, number][] = [
  [0, 1],
  [0, 2],
  [1, 3],
  [2, 3],
  [3, 4],
  [4, 5],
];

// Node radius
const R = 42;

// ─── Animated particle along a bezier path ────────────────────────────────────
function AnimatedParticle({
  x1, y1, x2, y2, active, delay, color,
}: {
  x1: number; y1: number; x2: number; y2: number;
  active: boolean; delay: number; color: string;
}) {
  const [pos, setPos] = useState({ x: x1, y: y1, opacity: 0 });

  useEffect(() => {
    if (!active) { setPos({ x: x1, y: y1, opacity: 0 }); return; }

    let start: number | null = null;
    let frame: number;
    const duration = 1600;
    const offset = delay * (duration / 3);
    let running = true;

    const animate = (ts: number) => {
      if (!running) return;
      if (!start) start = ts;
      const elapsed = ((ts - start + offset) % duration);
      const t = elapsed / duration;
      const mx = (x1 + x2) / 2;
      const my = (y1 + y2) / 2 - 40;
      const bx = (1 - t) * (1 - t) * x1 + 2 * (1 - t) * t * mx + t * t * x2;
      const by = (1 - t) * (1 - t) * y1 + 2 * (1 - t) * t * my + t * t * y2;
      const fade = t < 0.1 ? t / 0.1 : t > 0.85 ? (1 - t) / 0.15 : 1;
      setPos({ x: bx, y: by, opacity: fade * 0.95 });
      frame = requestAnimationFrame(animate);
    };

    frame = requestAnimationFrame(animate);
    return () => { running = false; cancelAnimationFrame(frame); };
  }, [active, x1, y1, x2, y2, delay]);

  return (
    <circle
      cx={pos.x}
      cy={pos.y}
      r={3.5}
      fill={color}
      opacity={pos.opacity}
      style={{ filter: `drop-shadow(0 0 5px ${color})` }}
    />
  );
}

// ─── Main visualizer ──────────────────────────────────────────────────────────
interface Props {
  model: EngineModel;
  activeStep: number;
  scenarioKey: ScenarioKey;
  onStepClick: (i: number) => void;
}

export default function EngineVisualizer({ model, activeStep, scenarioKey, onStepClick }: Props) {
  const sc = SCENARIOS[scenarioKey];
  const over = model.variance > 0;

  // Live data labels per edge
  const edgeData: Record<string, string> = {
    "0-1": `${RESOURCES.length} resources`,
    "0-2": `${MANDATE.plannedHours}h plan`,
    "1-3": `${h(model.supply.reduce((a, s) => a + s.netCapacity, 0), 0)}h cap`,
    "2-3": `${model.stagePlan.length} stages`,
    "3-4": `${h(model.remaining, 0)}h`,
    "4-5": `${model.weeks.length}w`,
  };

  // Which edges are active (data has flowed through them)
  const activeEdges = new Set<string>();
  if (activeStep >= 1) activeEdges.add("0-1");
  if (activeStep >= 2) activeEdges.add("0-2");
  if (activeStep >= 3) { activeEdges.add("1-3"); activeEdges.add("2-3"); }
  if (activeStep >= 4) activeEdges.add("3-4");
  if (activeStep >= 5) activeEdges.add("4-5");

  const metrics = [
    { label: "Planned hrs", value: `${MANDATE.plannedHours}h`, color: "rgba(255,255,255,0.85)" },
    { label: "Remaining",   value: `${h(model.remaining, 0)}h`, color: "rgba(255,255,255,0.85)" },
    { label: "FAC",         value: `${h(model.forecastAtCompletion, 0)}h`, color: over ? "#e06b5f" : "#6ecfaa" },
    { label: "Variance",    value: `${over ? "+" : ""}${h(model.variance, 0)}h`, color: over ? "#e06b5f" : "#6ecfaa" },
    { label: "Cost impact", value: money(model.costImpact), color: over ? "#e06b5f" : "#6ecfaa" },
  ];

  return (
    <div
      style={{
        background: "linear-gradient(135deg, #0c1a23 0%, #14293a 60%, #192e3e 100%)",
        borderRadius: 12,
        border: "1px solid rgba(255,255,255,0.1)",
        overflow: "hidden",
      }}
    >
      {/* ── Header ── */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "13px 20px 11px",
          borderBottom: "1px solid rgba(255,255,255,0.07)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
          <div
            style={{
              width: 7, height: 7, borderRadius: "50%",
              background: "#3F7A5D", boxShadow: "0 0 8px #3F7A5D",
              animation: "pulseVisDot 2s ease-in-out infinite",
            }}
          />
          <span style={{ fontFamily: C.sans, fontSize: 11.5, fontWeight: 600, color: "rgba(255,255,255,0.8)", letterSpacing: "0.04em" }}>
            Engine Model · Live Data Flow
          </span>
          <span style={{ fontFamily: C.sans, fontSize: 10, color: "rgba(255,255,255,0.3)" }}>
            · click any node to navigate
          </span>
        </div>
        <div style={{ display: "flex", gap: 7 }}>
          <span style={{ fontFamily: C.sans, fontSize: 10, color: "rgba(255,255,255,0.4)", background: "rgba(255,255,255,0.06)", borderRadius: 4, padding: "3px 9px" }}>
            {sc.label}
          </span>
          <span style={{
            fontFamily: C.sans, fontSize: 10, fontWeight: 600, borderRadius: 4, padding: "3px 9px",
            color: over ? "#e06b5f" : "#6ecfaa",
            background: over ? "rgba(177,74,61,0.18)" : "rgba(63,122,93,0.18)",
          }}>
            {over ? `▲ ${h(model.variance, 0)}h over plan` : `▼ ${h(Math.abs(model.variance), 0)}h under plan`}
          </span>
        </div>
      </div>

      {/* ── SVG graph ── */}
      <svg viewBox="0 0 920 330" style={{ width: "100%", height: "auto", display: "block" }}>
        <defs>
          <style>{`
            @keyframes pulseVisDot {
              0%,100% { opacity:1; r:3.5px; }
              50% { opacity:0.4; r:5px; }
            }
            @keyframes glowPulse {
              0%,100% { opacity:0.6; }
              50% { opacity:1; }
            }
            @keyframes dashAnim {
              from { stroke-dashoffset: 20; }
              to   { stroke-dashoffset: 0; }
            }
          `}</style>
          <marker id="vis-arrow-dim" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
            <path d="M0,0 L6,3 L0,6 Z" fill="rgba(255,255,255,0.12)" />
          </marker>
          <marker id="vis-arrow-on" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
            <path d="M0,0 L6,3 L0,6 Z" fill="rgba(110,207,170,0.75)" />
          </marker>
          <filter id="vis-glow-node">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <filter id="vis-glow-soft">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <radialGradient id="vis-grad-active" cx="50%" cy="30%" r="70%">
            <stop offset="0%" stopColor="#264f62" />
            <stop offset="100%" stopColor="#16303F" />
          </radialGradient>
          <radialGradient id="vis-grad-done" cx="50%" cy="30%" r="70%">
            <stop offset="0%" stopColor="#1b3d2e" />
            <stop offset="100%" stopColor="#0f2318" />
          </radialGradient>
        </defs>

        {/* ── Subtle grid ── */}
        <defs>
          <pattern id="vis-grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.025)" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="920" height="330" fill="url(#vis-grid)" />

        {/* ── Edges ── */}
        {EDGES.map(([from, to]) => {
          const a = NODES[from];
          const b = NODES[to];
          const key = `${from}-${to}`;
          const isOn = activeEdges.has(key);
          const mx = (a.x + b.x) / 2;
          const my = (a.y + b.y) / 2 - 45;
          const d = `M ${a.x} ${a.y} Q ${mx} ${my} ${b.x} ${b.y}`;
          const lx = (a.x + b.x) / 2;
          const ly = (a.y + b.y) / 2 - 25;

          return (
            <g key={key}>
              {/* background path */}
              <path
                d={d} fill="none"
                stroke={isOn ? "rgba(110,207,170,0.25)" : "rgba(255,255,255,0.07)"}
                strokeWidth={isOn ? 2 : 1.5}
                markerEnd={isOn ? "url(#vis-arrow-on)" : "url(#vis-arrow-dim)"}
              />
              {/* Animated dash overlay */}
              {isOn && (
                <path
                  d={d} fill="none"
                  stroke="rgba(110,207,170,0.6)"
                  strokeWidth={1.5}
                  strokeDasharray="5 5"
                  style={{ animation: "dashAnim 0.6s linear infinite" }}
                />
              )}
              {/* Edge label */}
              {isOn && (
                <>
                  <rect x={lx - 26} y={ly - 11} width={52} height={15} rx={3}
                    fill="rgba(110,207,170,0.1)" stroke="rgba(110,207,170,0.2)" strokeWidth={0.75} />
                  <text x={lx} y={ly} textAnchor="middle"
                    fontFamily="'IBM Plex Mono',monospace" fontSize="8" fill="rgba(110,207,170,0.7)">
                    {edgeData[key]}
                  </text>
                </>
              )}
              {/* Particles */}
              {isOn && [0, 1, 2].map((i) => (
                <AnimatedParticle
                  key={i}
                  x1={a.x} y1={a.y} x2={b.x} y2={b.y}
                  active={isOn} delay={i}
                  color={i === 1 ? "#6ecfaa" : "#9de0c2"}
                />
              ))}
            </g>
          );
        })}

        {/* ── Nodes ── */}
        {NODES.map((node) => {
          const isActive = node.id === activeStep;
          const isDone   = node.id < activeStep;
          const isFuture = node.id > activeStep;

          return (
            <g key={node.id} style={{ cursor: "pointer" }} onClick={() => onStepClick(node.id)}>
              {/* Active pulse ring */}
              {isActive && (
                <>
                  <circle cx={node.x} cy={node.y} r={R + 12} fill="none"
                    stroke="rgba(110,207,170,0.15)" strokeWidth={10}
                    style={{ animation: "glowPulse 2s ease-in-out infinite" }} />
                  <circle cx={node.x} cy={node.y} r={R + 5} fill="none"
                    stroke="rgba(110,207,170,0.35)" strokeWidth={1.5} />
                </>
              )}

              {/* Main circle */}
              <circle
                cx={node.x} cy={node.y} r={R}
                fill={isActive ? "url(#vis-grad-active)" : isDone ? "url(#vis-grad-done)" : "rgba(255,255,255,0.03)"}
                stroke={isActive ? "#6ecfaa" : isDone ? "rgba(110,207,170,0.4)" : "rgba(255,255,255,0.1)"}
                strokeWidth={isActive ? 2 : 1}
                filter={isActive ? "url(#vis-glow-node)" : undefined}
              />

              {/* Step badge */}
              <text x={node.x} y={node.y - 16} textAnchor="middle"
                fontFamily="'IBM Plex Mono',monospace" fontSize="9" fontWeight="700"
                fill={isActive ? "#6ecfaa" : isDone ? "rgba(110,207,170,0.55)" : "rgba(255,255,255,0.2)"}>
                {node.label}
              </text>

              {/* Emoji icon */}
              <text x={node.x} y={node.y + 5} textAnchor="middle" fontSize="16"
                opacity={isFuture ? 0.2 : 1}>
                {node.icon}
              </text>

              {/* Name */}
              <text x={node.x} y={node.y + 22} textAnchor="middle"
                fontFamily="'IBM Plex Sans',sans-serif" fontSize="8" fontWeight={isActive ? "600" : "400"}
                fill={isActive ? "rgba(255,255,255,0.9)" : isDone ? "rgba(255,255,255,0.55)" : "rgba(255,255,255,0.18)"}>
                {node.name}
              </text>

              {/* Done check */}
              {isDone && (
                <text x={node.x + R - 4} y={node.y - R + 10} textAnchor="middle"
                  fontSize="11" fill="#6ecfaa" filter="url(#vis-glow-soft)">✓</text>
              )}
            </g>
          );
        })}

        {/* ── Floating data badges ── */}

        {/* Capacity / downtime beside node 1 */}
        {activeStep >= 1 && (() => {
          const nc = model.supply.reduce((a, s) => a + s.netCapacity, 0);
          return (
            <g>
              <rect x={300} y={34} width={94} height={44} rx={5}
                fill="rgba(63,122,93,0.2)" stroke="rgba(63,122,93,0.4)" strokeWidth={0.75} />
              <text x={347} y={50} textAnchor="middle"
                fontFamily="'IBM Plex Mono',monospace" fontSize="7.5" fill="rgba(255,255,255,0.4)" letterSpacing="0.08em">
                NET CAPACITY
              </text>
              <text x={347} y={65} textAnchor="middle"
                fontFamily="'IBM Plex Mono',monospace" fontSize="13" fontWeight="700" fill="#6ecfaa">
                {h(nc, 0)}h
              </text>
            </g>
          );
        })()}

        {/* Stage plan detail beside node 2 */}
        {activeStep >= 2 && (() => {
          const cur = model.currentStage;
          return (
            <g>
              <rect x={302} y={250} width={106} height={44} rx={5}
                fill="rgba(100,120,200,0.15)" stroke="rgba(100,120,200,0.35)" strokeWidth={0.75} />
              <text x={355} y={266} textAnchor="middle"
                fontFamily="'IBM Plex Mono',monospace" fontSize="7.5" fill="rgba(255,255,255,0.4)" letterSpacing="0.08em">
                CURRENT STAGE
              </text>
              <text x={355} y={282} textAnchor="middle"
                fontFamily="'IBM Plex Sans',sans-serif" fontSize="11" fontWeight="700" fill="#8fa8e8">
                {cur.name} · {h(cur.hours, 0)}h
              </text>
            </g>
          );
        })()}

        {/* Remaining above node 3 */}
        {activeStep >= 3 && (
          <g>
            <rect x={396} y={38} width={130} height={56} rx={5}
              fill={over ? "rgba(177,74,61,0.2)" : "rgba(63,122,93,0.2)"}
              stroke={over ? "rgba(177,74,61,0.4)" : "rgba(63,122,93,0.4)"} strokeWidth={0.75} />
            <text x={461} y={56} textAnchor="middle"
              fontFamily="'IBM Plex Mono',monospace" fontSize="7.5" fill="rgba(255,255,255,0.4)" letterSpacing="0.08em">
              FORECAST AT COMPLETION
            </text>
            <text x={461} y={74} textAnchor="middle"
              fontFamily="'IBM Plex Mono',monospace" fontSize="16" fontWeight="700"
              fill={over ? "#e06b5f" : "#6ecfaa"}>
              {h(model.forecastAtCompletion, 0)}h
            </text>
            <text x={461} y={87} textAnchor="middle"
              fontFamily="'IBM Plex Mono',monospace" fontSize="9"
              fill={over ? "#e06b5f" : "#6ecfaa"}>
              {over ? "+" : ""}{h(model.variance, 0)}h vs plan
            </text>
          </g>
        )}

        {/* Weeks spread beside node 4 */}
        {activeStep >= 4 && (
          <g>
            <rect x={660} y={215} width={100} height={44} rx={5}
              fill="rgba(184,135,90,0.15)" stroke="rgba(184,135,90,0.35)" strokeWidth={0.75} />
            <text x={710} y={231} textAnchor="middle"
              fontFamily="'IBM Plex Mono',monospace" fontSize="7.5" fill="rgba(255,255,255,0.4)" letterSpacing="0.08em">
              WEEKS SPREAD
            </text>
            <text x={710} y={249} textAnchor="middle"
              fontFamily="'IBM Plex Mono',monospace" fontSize="13" fontWeight="700" fill="#c8975a">
              {model.weeks.length}w · {h(model.spreadTotal, 0)}h
            </text>
          </g>
        )}
      </svg>

      {/* ── Metrics strip ── */}
      <div
        style={{
          display: "flex",
          borderTop: "1px solid rgba(255,255,255,0.07)",
          padding: "10px 20px 12px",
          gap: 0,
        }}
      >
        {metrics.map((m, i) => (
          <div
            key={m.label}
            style={{
              flex: 1,
              padding: "0 14px",
              borderRight: i < metrics.length - 1 ? "1px solid rgba(255,255,255,0.06)" : "none",
            }}
          >
            <div style={{ fontFamily: C.sans, fontSize: 8.5, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase" as const, color: "rgba(255,255,255,0.3)", marginBottom: 4 }}>
              {m.label}
            </div>
            <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 15, fontWeight: 700, color: m.color }}>
              {m.value}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
