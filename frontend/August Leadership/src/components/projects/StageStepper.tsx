import { ALL_STAGES } from "./data";

interface Props {
  currentStage: string;
  stages?: string[];
  variant: "compact" | "full";
  stageDates?: Record<string, string>; // stage name → entry date shown on hover (full only)
}

const INK      = "#16303F";
const GREEN    = "#3F7A5D";
const HAIRLINE = "#DAD7CF";
const GRAPHITE = "#5B6472";
const SANS     = "'IBM Plex Sans', sans-serif";
const MONO     = "'IBM Plex Mono', monospace";

export default function StageStepper({ currentStage, stages = ALL_STAGES, variant, stageDates }: Props) {
  const cur = stages.indexOf(currentStage);

  if (variant === "compact") {
    return (
      <div style={{ display: "flex", alignItems: "center" }}>
        {stages.map((s, i) => {
          const past    = i < cur;
          const active  = i === cur;
          return (
            <div key={s} style={{ display: "flex", alignItems: "center" }}>
              {/* dot */}
              <div title={s} style={{ width: 8, height: 8, borderRadius: "50%", flexShrink: 0,
                background: past ? GREEN : active ? INK : "transparent",
                border: past ? `1px solid ${GREEN}` : active ? `1px solid ${INK}` : `1px solid ${HAIRLINE}`,
                position: "relative",
              }}>
                {past && (
                  <svg viewBox="0 0 8 8" width="8" height="8" style={{ position: "absolute", inset: 0 }}>
                    <polyline points="1.5,4 3.2,5.8 6.5,2" fill="none" stroke="white" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </div>
              {/* connector */}
              {i < stages.length - 1 && (
                <div style={{ width: 14, height: 1, background: i < cur ? GREEN : HAIRLINE, flexShrink: 0 }} />
              )}
            </div>
          );
        })}
      </div>
    );
  }

  // full variant — spans full header width
  return (
    <div style={{ display: "flex", alignItems: "flex-start", width: "100%" }}>
      {stages.map((s, i) => {
        const past   = i < cur;
        const active = i === cur;
        const date   = stageDates?.[s];
        return (
          <div key={s} style={{ display: "flex", alignItems: "flex-start", flex: i < stages.length - 1 ? 1 : 0 }}>
            {/* dot + label column */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
              {/* dot */}
              <div style={{
                width: 16, height: 16, borderRadius: "50%", flexShrink: 0,
                background: past ? GREEN : active ? INK : "transparent",
                border: past ? `2px solid ${GREEN}` : active ? `2px solid ${INK}` : `2px solid ${HAIRLINE}`,
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                {past && (
                  <svg viewBox="0 0 16 16" width="10" height="10">
                    <polyline points="3,8 6.5,11.5 13,5" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
                {active && <div style={{ width: 5, height: 5, borderRadius: "50%", background: "white" }} />}
              </div>
              {/* label */}
              <div style={{ textAlign: "center" }}>
                <div style={{
                  fontFamily: SANS, fontSize: 11,
                  fontWeight: active ? 600 : 400,
                  color: active ? INK : past ? GREEN : GRAPHITE,
                  whiteSpace: "nowrap",
                }}>
                  {s}
                </div>
                {date && (
                  <div style={{ fontFamily: MONO, fontSize: 9, color: GRAPHITE, marginTop: 1 }}>{date}</div>
                )}
              </div>
            </div>
            {/* connector line between dots — vertically centred with the 16px dot */}
            {i < stages.length - 1 && (
              <div style={{
                flex: 1, height: 2,
                background: i < cur ? GREEN : HAIRLINE,
                marginTop: 7, // align with dot centre
              }} />
            )}
          </div>
        );
      })}
    </div>
  );
}
