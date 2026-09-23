import { useState } from "react";
import FirmWide from "./utilization/FirmWide";
import ByTeamMember from "./utilization/ByTeamMember";
import ByPartner from "./utilization/ByPartner";
import { C } from "./utilization/data";

interface UtilizationIntelligenceProps {
  period: string;
}

type Tab = "firm" | "team" | "partner";

const TABS: { id: Tab; label: string }[] = [
  { id: "firm",    label: "Firm-wide" },
  { id: "team",    label: "By Team Member" },
  { id: "partner", label: "By Partner" },
];

const LAST_SYNCED = "Today at 9:14 AM";

export default function UtilizationIntelligence({ period }: UtilizationIntelligenceProps) {
  const [tab, setTab] = useState<Tab>("firm");

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", minHeight: 0 }}>
      {/* tab bar */}
      <div style={{
        borderBottom: `1px solid ${C.hairline}`,
        display: "flex", alignItems: "center",
        padding: "0 28px",
        background: C.paper,
        flexShrink: 0,
        gap: 0,
      }}>
        {TABS.map((t) => {
          const active = t.id === tab;
          return (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              style={{
                fontFamily: C.sans, fontSize: 13, fontWeight: active ? 600 : 400,
                color: active ? C.ink : C.graphite,
                background: "none", border: "none", cursor: "pointer",
                padding: "14px 18px 12px",
                borderBottom: active ? `2px solid ${C.ink}` : "2px solid transparent",
                marginBottom: -1,
                transition: "color 0.15s, border-color 0.15s",
              }}
              onMouseEnter={(e) => { if (!active) (e.currentTarget as HTMLElement).style.color = C.ink; }}
              onMouseLeave={(e) => { if (!active) (e.currentTarget as HTMLElement).style.color = C.graphite; }}
            >
              {t.label}
            </button>
          );
        })}

        {/* spacer + synced caption + period */}
        <div style={{ flex: 1 }} />
        <div style={{ display: "flex", alignItems: "center", gap: 16, paddingBottom: 0 }}>
          <span style={{ fontFamily: C.sans, fontSize: 11, color: C.graphite }}>
            Last synced&nbsp;
            <span style={{ fontFamily: C.mono, fontWeight: 500 }}>{LAST_SYNCED}</span>
          </span>
          <span style={{
            fontFamily: C.sans, fontSize: 11, fontWeight: 500,
            color: C.graphite, background: C.mist,
            padding: "3px 9px", borderRadius: 4,
          }}>
            {period}
          </span>
        </div>
      </div>

      {/* tab content */}
      <div style={{ flex: 1, overflowY: "auto" }}>
        {tab === "firm"    && <FirmWide />}
        {tab === "team"    && <ByTeamMember />}
        {tab === "partner" && <ByPartner />}
      </div>
    </div>
  );
}
