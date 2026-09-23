import { useState } from "react";
import { T } from "./primitives";
import ProjectsRegistry from "./ProjectsRegistry";
import PartnersRegistry from "./PartnersRegistry";
import TeamMembersRegistry from "./TeamMembersRegistry";
import RolesAccess from "./RolesAccess";
import ResourcingTemplate from "./ResourcingTemplate";

type Section = "projects" | "partners" | "team" | "roles" | "resourcing";

const NAV: { id: Section; label: string; sub: string; icon: React.ReactNode }[] = [
  {
    id: "projects",
    label: "Projects Registry",
    sub: "Engagements & BD",
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
      </svg>
    ),
  },
  {
    id: "partners",
    label: "Partners Registry",
    sub: "Partner profiles",
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
  },
  {
    id: "team",
    label: "Team Members",
    sub: "Capacity & roles",
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <line x1="19" y1="8" x2="19" y2="14" />
        <line x1="22" y1="11" x2="16" y2="11" />
      </svg>
    ),
  },
  {
    id: "roles",
    label: "Roles & Access",
    sub: "Permissions",
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
      </svg>
    ),
  },
  {
    id: "resourcing",
    label: "Resourcing Template",
    sub: "Tier × dept hours",
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <line x1="3" y1="9" x2="21" y2="9" />
        <line x1="3" y1="15" x2="21" y2="15" />
        <line x1="9" y1="3" x2="9" y2="21" />
        <line x1="15" y1="3" x2="15" y2="21" />
      </svg>
    ),
  },
];

const SECTION_TITLES: Record<Section, string> = {
  projects: "Projects Registry",
  partners: "Partners Registry",
  team: "Team Members Registry",
  roles: "Roles & Access",
  resourcing: "Resourcing Template",
};

export default function Setup() {
  const [active, setActive] = useState<Section>("projects");

  return (
    <div style={{ display: "flex", height: "100%", overflow: "hidden" }}>
      {/* Secondary left rail */}
      <nav
        style={{
          width: 208,
          minWidth: 208,
          background: T.paper,
          borderRight: `1px solid ${T.hairline}`,
          padding: "16px 0",
          overflowY: "auto",
          flexShrink: 0,
        }}
      >
        <div
          style={{
            padding: "0 14px 10px",
            fontFamily: T.sans,
            fontSize: 9,
            fontWeight: 700,
            color: T.graphite,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
          }}
        >
          Configuration
        </div>
        {NAV.map((item) => {
          const isActive = active === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActive(item.id)}
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "9px 14px",
                background: isActive ? T.mist : "none",
                border: "none",
                borderLeft: `2px solid ${isActive ? T.ink : "transparent"}`,
                cursor: "pointer",
                textAlign: "left",
                transition: "background 0.12s, border-color 0.12s",
                position: "relative",
              }}
              onMouseEnter={(e) => {
                if (!isActive) (e.currentTarget as HTMLElement).style.background = "#F0F4F6";
              }}
              onMouseLeave={(e) => {
                if (!isActive) (e.currentTarget as HTMLElement).style.background = "none";
              }}
            >
              <span style={{ color: isActive ? T.ink : T.graphite, flexShrink: 0 }}>{item.icon}</span>
              <div>
                <div
                  style={{
                    fontFamily: T.sans,
                    fontSize: 12,
                    fontWeight: isActive ? 600 : 400,
                    color: isActive ? T.ink : T.graphite,
                    lineHeight: 1.2,
                  }}
                >
                  {item.label}
                </div>
                <div style={{ fontFamily: T.sans, fontSize: 10, color: "#8EA0AD", marginTop: 1 }}>
                  {item.sub}
                </div>
              </div>
            </button>
          );
        })}

        {/* Divider + hint */}
        <div style={{ margin: "16px 14px 12px", borderTop: `1px solid ${T.hairline}` }} />
        <div style={{ padding: "0 14px" }}>
          <div style={{ fontFamily: T.sans, fontSize: 11, color: T.graphite, lineHeight: 1.6 }}>
            Changes made here propagate across all modules immediately.
          </div>
        </div>
      </nav>

      {/* Content area */}
      <div style={{ flex: 1, overflowY: "auto", padding: "28px 28px 48px", minWidth: 0 }}>
        {/* Section header */}
        <div style={{ marginBottom: 22, paddingBottom: 16, borderBottom: `1px solid ${T.hairline}` }}>
          <h2
            style={{
              fontFamily: T.sans,
              fontWeight: 600,
              fontSize: 16,
              color: T.ink,
              margin: "0 0 4px",
              letterSpacing: "-0.01em",
            }}
          >
            {SECTION_TITLES[active]}
          </h2>
          <p style={{ fontFamily: T.sans, fontSize: 12, color: T.graphite, margin: 0 }}>
            {active === "projects" && "The master list of all engagements. New projects added here appear across utilisation and prediction views."}
            {active === "partners" && "Partner profiles and project ownership. Partners are assignable to any project across the firm."}
            {active === "team" && "All team members and their standard capacity. Capacity values feed utilisation calculations directly."}
            {active === "roles" && "Access control for Amplify Vantage. Manage who can view and edit firm data."}
            {active === "resourcing" && "Planned hours per engagement by tier and department. This is the reference table the platform uses to forecast demand."}
          </p>
        </div>

        {active === "projects" && <ProjectsRegistry />}
        {active === "partners" && <PartnersRegistry />}
        {active === "team" && <TeamMembersRegistry />}
        {active === "roles" && <RolesAccess />}
        {active === "resourcing" && <ResourcingTemplate />}
      </div>
    </div>
  );
}
