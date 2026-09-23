import { useState } from "react";

const PERIOD_OPTIONS = ["This Week", "This Month", "This Quarter"];

interface TopBarProps {
  title: string;
  period: string;
  onPeriodChange: (p: string) => void;
}

export default function TopBar({ period, onPeriodChange }: TopBarProps) {
  const [periodOpen, setPeriodOpen] = useState(false);
  const [hasNotification] = useState(true);

  return (
    <header
      style={{
        height: 60,
        display: "flex",
        alignItems: "center",
        gap: 12,
        padding: "0 24px",
        background: "#FFFFFF",
        borderBottom: "1px solid #E4E9EC",
        flexShrink: 0,
        position: "relative",
        zIndex: 5,
      }}
    >
      {/* Search input */}
      <div style={{ flex: 1, maxWidth: 380, position: "relative" }}>
        <div
          style={{
            position: "absolute",
            left: 12,
            top: "50%",
            transform: "translateY(-50%)",
            color: "#5B6472",
            pointerEvents: "none",
          }}
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        </div>
        <input
          type="text"
          placeholder="Search projects, members, tasks…"
          style={{
            width: "100%",
            height: 36,
            paddingLeft: 36,
            paddingRight: 52,
            border: "1px solid #E4E9EC",
            borderRadius: 8,
            background: "#F8FAFB",
            fontFamily: "'IBM Plex Sans', sans-serif",
            fontSize: 13,
            color: "#16303F",
            outline: "none",
            boxSizing: "border-box",
            transition: "border-color 0.15s, background 0.15s",
          }}
          onFocus={(e) => {
            (e.target as HTMLInputElement).style.borderColor = "#3E5568";
            (e.target as HTMLInputElement).style.background = "#FFFFFF";
          }}
          onBlur={(e) => {
            (e.target as HTMLInputElement).style.borderColor = "#E4E9EC";
            (e.target as HTMLInputElement).style.background = "#F8FAFB";
          }}
        />
        <div
          style={{
            position: "absolute",
            right: 10,
            top: "50%",
            transform: "translateY(-50%)",
            display: "flex",
            alignItems: "center",
            gap: 2,
            pointerEvents: "none",
          }}
        >
          <kbd
            style={{
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: 10,
              color: "#5B6472",
              background: "#E4E9EC",
              border: "1px solid #DAD7CF",
              borderRadius: 4,
              padding: "1px 5px",
              lineHeight: 1.6,
            }}
          >
            ⌘K
          </kbd>
        </div>
      </div>

      <div style={{ flex: 1 }} />

      {/* Period selector */}
      <div style={{ position: "relative" }}>
        <button
          onClick={() => setPeriodOpen((v) => !v)}
          style={{
            height: 36,
            padding: "0 12px",
            borderRadius: 8,
            border: "1px solid #E4E9EC",
            background: "#F8FAFB",
            display: "flex",
            alignItems: "center",
            gap: 6,
            cursor: "pointer",
            fontFamily: "'IBM Plex Sans', sans-serif",
            fontWeight: 500,
            fontSize: 13,
            color: "#16303F",
            transition: "background 0.15s, border-color 0.15s",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.background = "#E4E9EC";
            (e.currentTarget as HTMLElement).style.borderColor = "#DAD7CF";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.background = "#F8FAFB";
            (e.currentTarget as HTMLElement).style.borderColor = "#E4E9EC";
          }}
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
          </svg>
          {period}
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
            <path d="M2 4l3 3 3-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        {periodOpen && (
          <div
            style={{
              position: "absolute",
              top: "calc(100% + 4px)",
              right: 0,
              background: "#FFFFFF",
              border: "1px solid #DAD7CF",
              borderRadius: 8,
              boxShadow: "0 4px 16px rgba(22,48,63,0.12)",
              minWidth: 148,
              zIndex: 50,
              overflow: "hidden",
            }}
          >
            {PERIOD_OPTIONS.map((opt) => (
              <button
                key={opt}
                onClick={() => { onPeriodChange(opt); setPeriodOpen(false); }}
                style={{
                  width: "100%",
                  padding: "9px 14px",
                  textAlign: "left",
                  background: opt === period ? "#E4E9EC" : "none",
                  border: "none",
                  cursor: "pointer",
                  fontFamily: "'IBM Plex Sans', sans-serif",
                  fontSize: 13,
                  color: opt === period ? "#16303F" : "#5B6472",
                  fontWeight: opt === period ? 500 : 400,
                  transition: "background 0.1s",
                }}
                onMouseEnter={(e) => { if (opt !== period) (e.currentTarget as HTMLElement).style.background = "#F0F4F6"; }}
                onMouseLeave={(e) => { if (opt !== period) (e.currentTarget as HTMLElement).style.background = "none"; }}
              >
                {opt}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Notification bell */}
      <button
        style={{
          width: 36,
          height: 36,
          borderRadius: 8,
          border: "1px solid #E4E9EC",
          background: "#F8FAFB",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          color: "#5B6472",
          position: "relative",
          transition: "background 0.15s",
          flexShrink: 0,
        }}
        onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "#E4E9EC"; }}
        onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "#F8FAFB"; }}
        aria-label="Notifications"
      >
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
          <path d="M13.73 21a2 2 0 0 1-3.46 0" />
        </svg>
        {hasNotification && (
          <span
            style={{
              position: "absolute",
              top: 8,
              right: 8,
              width: 6,
              height: 6,
              borderRadius: "50%",
              background: "#B14A3D",
              border: "1.5px solid #FFFFFF",
            }}
          />
        )}
      </button>

      {/* User chip */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          padding: "5px 10px 5px 6px",
          border: "1px solid #E4E9EC",
          borderRadius: 10,
          background: "#F8FAFB",
          cursor: "default",
          flexShrink: 0,
          transition: "background 0.15s",
        }}
        onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "#E4E9EC"; }}
        onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "#F8FAFB"; }}
      >
        <div
          style={{
            width: 28,
            height: 28,
            borderRadius: "50%",
            background: "#3E5568",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: "'IBM Plex Sans', sans-serif",
            fontWeight: 600,
            fontSize: 11,
            color: "#D9E2E8",
            flexShrink: 0,
          }}
        >
          MH
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 1 }}>
          <span style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontWeight: 600, fontSize: 12, color: "#16303F", whiteSpace: "nowrap" }}>
            Morgan Hayes
          </span>
          <span style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 10, color: "#5B6472", whiteSpace: "nowrap" }}>
            Partner · Full access
          </span>
        </div>
      </div>
    </header>
  );
}
