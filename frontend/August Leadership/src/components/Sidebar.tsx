import React from "react";
import type { Module } from "../App";

interface NavItem { id: Module; label: string; icon: React.ReactNode }

const WORKSPACE_ITEMS: NavItem[] = [
  {
    id: "control",
    label: "Control Center",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" />
      </svg>
    ),
  },
  {
    id: "projects",
    label: "Projects",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
      </svg>
    ),
  },
  {
    id: "utilization",
    label: "Utilization",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
      </svg>
    ),
  },
  {
    id: "prediction",
    label: "Prediction",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
      </svg>
    ),
  },
];

const SYSTEM_ITEMS: NavItem[] = [
  {
    id: "setup",
    label: "Setup",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3" />
        <path d="M19.07 4.93a10 10 0 0 1 0 14.14M4.93 4.93a10 10 0 0 0 0 14.14M16.24 7.76a6 6 0 0 1 0 8.49M7.76 7.76a6 6 0 0 0 0 8.49" />
      </svg>
    ),
  },
  {
    id: "styleguide",
    label: "Style Guide",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="13.5" cy="6.5" r="2.5" /><circle cx="17.5" cy="10.5" r="2.5" /><circle cx="8.5" cy="7.5" r="2.5" /><circle cx="6.5" cy="12.5" r="2.5" />
        <path d="M12 20h9" /><path d="M4.22 4.22l-.01.01" /><path d="M12 20l-7-7 1-1" />
      </svg>
    ),
  },
];

interface SidebarProps {
  active: Module;
  onNavigate: (m: Module) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
}

function NavGroup({
  label,
  items,
  active,
  collapsed,
  onNavigate,
}: {
  label: string;
  items: NavItem[];
  active: Module;
  collapsed: boolean;
  onNavigate: (m: Module) => void;
}) {
  return (
    <div style={{ marginBottom: 4 }}>
      {!collapsed && (
        <div
          style={{
            fontFamily: "'IBM Plex Sans', sans-serif",
            fontSize: 10,
            fontWeight: 600,
            color: "rgba(122,149,168,0.6)",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            padding: "10px 20px 4px",
          }}
        >
          {label}
        </div>
      )}
      {collapsed && <div style={{ height: 8 }} />}
      {items.map((item) => {
        const isActive = active === item.id;
        return (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            title={collapsed ? item.label : undefined}
            style={{
              width: collapsed ? "100%" : "calc(100% - 16px)",
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: collapsed ? "8px 0" : "8px 12px",
              margin: collapsed ? "0 auto" : "1px 8px",
              background: isActive ? "rgba(217,226,232,0.14)" : "none",
              border: "none",
              borderRadius: 7,
              cursor: "pointer",
              color: isActive ? "#D9E2E8" : "#7A95A8",
              transition: "color 0.15s, background 0.15s",
              justifyContent: collapsed ? "center" : "flex-start",
            }}
            onMouseEnter={(e) => {
              if (!isActive) {
                (e.currentTarget as HTMLElement).style.background = "rgba(217,226,232,0.08)";
                (e.currentTarget as HTMLElement).style.color = "#B0C8D4";
              }
            }}
            onMouseLeave={(e) => {
              if (!isActive) {
                (e.currentTarget as HTMLElement).style.background = "none";
                (e.currentTarget as HTMLElement).style.color = "#7A95A8";
              }
            }}
          >
            <span
              style={{
                flexShrink: 0,
                width: collapsed ? 36 : "auto",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {item.icon}
            </span>
            {!collapsed && (
              <span
                style={{
                  fontFamily: "'IBM Plex Sans', sans-serif",
                  fontWeight: isActive ? 600 : 400,
                  fontSize: 13,
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {item.label}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

export default function Sidebar({ active, onNavigate, collapsed, onToggleCollapse }: SidebarProps) {
  return (
    <aside
      style={{
        width: collapsed ? 56 : 216,
        minWidth: collapsed ? 56 : 216,
        background: "#16303F",
        display: "flex",
        flexDirection: "column",
        transition: "width 0.22s cubic-bezier(0.4,0,0.2,1), min-width 0.22s cubic-bezier(0.4,0,0.2,1)",
        overflow: "hidden",
        borderRight: "1px solid rgba(217,226,232,0.08)",
        position: "relative",
        zIndex: 10,
      }}
    >
      {/* Brand header */}
      <div
        style={{
          height: 60,
          display: "flex",
          alignItems: "center",
          justifyContent: collapsed ? "center" : "flex-start",
          padding: collapsed ? "0" : "0 18px",
          borderBottom: "1px solid rgba(217,226,232,0.08)",
          flexShrink: 0,
          overflow: "hidden",
        }}
      >
        {collapsed ? (
          <div
            style={{
              width: 30,
              height: 30,
              background: "#D9E2E8",
              borderRadius: 6,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <span style={{ fontFamily: "Georgia, serif", fontWeight: 400, fontSize: 12, color: "#16303F", letterSpacing: "0.01em" }}>AL</span>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
            <div style={{
              fontFamily: "Georgia, 'Times New Roman', serif",
              fontSize: 15,
              fontWeight: 400,
              color: "#D9E2E8",
              letterSpacing: "0.01em",
              lineHeight: 1.1,
              whiteSpace: "nowrap",
            }}>
              August Leadership
            </div>
            <div style={{
              fontFamily: "'IBM Plex Sans', sans-serif",
              fontSize: 7.5,
              fontWeight: 500,
              color: "rgba(122,149,168,0.7)",
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              whiteSpace: "nowrap",
            }}>
              Search &amp; Leadership Advisory
            </div>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, overflowY: "auto", padding: "8px 0" }}>
        <NavGroup label="Workspace" items={WORKSPACE_ITEMS} active={active} collapsed={collapsed} onNavigate={onNavigate} />
        <div style={{ height: 1, background: "rgba(217,226,232,0.07)", margin: "4px 12px" }} />
        <NavGroup label="System" items={SYSTEM_ITEMS} active={active} collapsed={collapsed} onNavigate={onNavigate} />
      </nav>

      {/* User area */}
      <div style={{ borderTop: "1px solid rgba(217,226,232,0.08)", padding: collapsed ? "10px 0" : "10px 12px", flexShrink: 0 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 9,
            padding: collapsed ? "6px 0" : "6px 8px",
            borderRadius: 8,
            cursor: "default",
            justifyContent: collapsed ? "center" : "flex-start",
          }}
        >
          <div
            style={{
              width: 30,
              height: 30,
              borderRadius: "50%",
              background: "#3E5568",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              fontFamily: "'IBM Plex Sans', sans-serif",
              fontWeight: 600,
              fontSize: 11,
              color: "#D9E2E8",
            }}
          >
            MH
          </div>
          {!collapsed && (
            <div style={{ minWidth: 0 }}>
              <div style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontWeight: 500, fontSize: 12, color: "#D9E2E8", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                Morgan Hayes
              </div>
              <div style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 10, color: "rgba(122,149,168,0.8)", marginTop: 1 }}>
                Partner · Full access
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Collapse toggle */}
      <button
        onClick={onToggleCollapse}
        style={{
          position: "absolute",
          top: 60 + 14,
          right: -10,
          width: 20,
          height: 20,
          borderRadius: "50%",
          border: "1px solid #DAD7CF",
          background: "#FFFFFF",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          color: "#5B6472",
          zIndex: 20,
          transition: "background 0.15s, color 0.15s",
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLElement).style.background = "#E4E9EC";
          (e.currentTarget as HTMLElement).style.color = "#16303F";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLElement).style.background = "#FFFFFF";
          (e.currentTarget as HTMLElement).style.color = "#5B6472";
        }}
        aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
          <path
            d={collapsed ? "M3 2l4 3-4 3" : "M7 2L3 5l4 3"}
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    </aside>
  );
}
