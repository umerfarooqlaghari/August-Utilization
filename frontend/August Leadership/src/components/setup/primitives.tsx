import React, { useEffect, useRef } from "react";

// ─── Design tokens (inline for portability) ───────────────────────────────────
export const T = {
  ink: "#16303F",
  slate: "#3E5568",
  paper: "#FFFFFF",
  mist: "#E4E9EC",
  graphite: "#5B6472",
  hairline: "#DAD7CF",
  ivory: "#D9E2E8",
  green: "#3F7A5D",
  amber: "#B8875A",
  red: "#B14A3D",
  bg: "#F8FAFB",
  sans: "'IBM Plex Sans', sans-serif",
  mono: "'IBM Plex Mono', monospace",
};

// ─── Label overline ────────────────────────────────────────────────────────────
export function Overline({ children }: { children: React.ReactNode }) {
  return (
    <span
      style={{
        fontFamily: T.sans,
        fontSize: 10,
        fontWeight: 600,
        color: T.graphite,
        letterSpacing: "0.08em",
        textTransform: "uppercase" as const,
      }}
    >
      {children}
    </span>
  );
}

// ─── Badge ─────────────────────────────────────────────────────────────────────
const BADGE_VARIANTS: Record<string, { bg: string; color: string }> = {
  "Client Project": { bg: "#E4EEF5", color: "#1C4A6B" },
  "BD Opportunity": { bg: "#F0EBF7", color: "#5B3080" },
  "Internal Work": { bg: "#E9F0E9", color: "#2D5C2D" },
  "Tier 1": { bg: T.ink, color: T.ivory },
  "Tier 2": { bg: T.slate, color: T.ivory },
  "Tier 3": { bg: "#7A95A8", color: "#FFFFFF" },
  "Active": { bg: "#EBF4EF", color: T.green },
  "On Hold": { bg: "#FBF6F0", color: T.amber },
  "Closed": { bg: "#F2F2F2", color: T.graphite },
  "Full-time": { bg: "#E4EEF5", color: "#1C4A6B" },
  "Part-time": { bg: "#FBF6F0", color: T.amber },
  "Contractor": { bg: "#F0EBF7", color: "#5B3080" },
  "On Leave": { bg: "#FBF6F0", color: T.amber },
  "Inactive": { bg: "#F2F2F2", color: T.graphite },
};

export function Badge({ label }: { label: string }) {
  const v = BADGE_VARIANTS[label] ?? { bg: T.mist, color: T.graphite };
  return (
    <span
      style={{
        fontFamily: T.sans,
        fontSize: 11,
        fontWeight: 500,
        padding: "2px 7px",
        borderRadius: 3,
        background: v.bg,
        color: v.color,
        whiteSpace: "nowrap" as const,
      }}
    >
      {label}
    </span>
  );
}

// ─── Icon buttons ───────────────────────────────────────────────────────────────
export function IconBtn({
  onClick,
  title,
  children,
  danger,
}: {
  onClick: () => void;
  title: string;
  children: React.ReactNode;
  danger?: boolean;
}) {
  return (
    <button
      onClick={(e) => { e.stopPropagation(); onClick(); }}
      title={title}
      style={{
        width: 28,
        height: 28,
        borderRadius: 5,
        border: `1px solid ${danger ? "#F5C0BB" : T.hairline}`,
        background: danger ? "#FBF0EF" : T.paper,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        color: danger ? T.red : T.graphite,
        transition: "background 0.12s, color 0.12s",
        flexShrink: 0,
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget as HTMLButtonElement;
        el.style.background = danger ? "#F8E0DE" : T.mist;
        el.style.color = danger ? T.red : T.ink;
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget as HTMLButtonElement;
        el.style.background = danger ? "#FBF0EF" : T.paper;
        el.style.color = danger ? T.red : T.graphite;
      }}
    >
      {children}
    </button>
  );
}

// ─── Primary button ────────────────────────────────────────────────────────────
export function PrimaryBtn({
  onClick,
  children,
  small,
}: {
  onClick?: () => void;
  children: React.ReactNode;
  small?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: small ? "6px 14px" : "8px 18px",
        borderRadius: 6,
        border: "none",
        background: T.ink,
        cursor: "pointer",
        fontFamily: T.sans,
        fontSize: small ? 12 : 13,
        fontWeight: 500,
        color: T.ivory,
        display: "flex",
        alignItems: "center",
        gap: 6,
        whiteSpace: "nowrap" as const,
        transition: "background 0.15s",
        flexShrink: 0,
      }}
      onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = T.slate; }}
      onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = T.ink; }}
    >
      {children}
    </button>
  );
}

export function SecondaryBtn({
  onClick,
  children,
}: {
  onClick?: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: "7px 16px",
        borderRadius: 6,
        border: `1px solid ${T.hairline}`,
        background: T.paper,
        cursor: "pointer",
        fontFamily: T.sans,
        fontSize: 13,
        fontWeight: 400,
        color: T.graphite,
        whiteSpace: "nowrap" as const,
        transition: "background 0.15s",
      }}
      onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = T.mist; }}
      onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = T.paper; }}
    >
      {children}
    </button>
  );
}

// ─── Form field ────────────────────────────────────────────────────────────────
export function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
      <Overline>{label}</Overline>
      {children}
    </div>
  );
}

export function Input({
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      style={{
        fontFamily: T.sans,
        fontSize: 13,
        color: T.ink,
        background: T.paper,
        border: `1px solid ${T.hairline}`,
        borderRadius: 6,
        padding: "8px 10px",
        outline: "none",
        width: "100%",
      }}
      onFocus={(e) => { e.currentTarget.style.borderColor = T.slate; }}
      onBlur={(e) => { e.currentTarget.style.borderColor = T.hairline; }}
    />
  );
}

export function Select({
  value,
  onChange,
  options,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  options: string[];
  placeholder?: string;
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      style={{
        fontFamily: T.sans,
        fontSize: 13,
        color: value ? T.ink : T.graphite,
        background: T.paper,
        border: `1px solid ${T.hairline}`,
        borderRadius: 6,
        padding: "8px 10px",
        outline: "none",
        width: "100%",
        cursor: "pointer",
        appearance: "none" as const,
      }}
      onFocus={(e) => { e.currentTarget.style.borderColor = T.slate; }}
      onBlur={(e) => { e.currentTarget.style.borderColor = T.hairline; }}
    >
      {placeholder && <option value="">{placeholder}</option>}
      {options.map((o) => <option key={o} value={o}>{o}</option>)}
    </select>
  );
}

export function Textarea({
  value,
  onChange,
  placeholder,
  rows = 3,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  rows?: number;
}) {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      rows={rows}
      style={{
        fontFamily: T.sans,
        fontSize: 13,
        color: T.ink,
        background: T.paper,
        border: `1px solid ${T.hairline}`,
        borderRadius: 6,
        padding: "8px 10px",
        outline: "none",
        width: "100%",
        resize: "vertical" as const,
      }}
      onFocus={(e) => { e.currentTarget.style.borderColor = T.slate; }}
      onBlur={(e) => { e.currentTarget.style.borderColor = T.hairline; }}
    />
  );
}

// ─── Right-side Drawer ────────────────────────────────────────────────────────
export function Drawer({
  open,
  onClose,
  title,
  width = 420,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  width?: number;
  children: React.ReactNode;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(22,48,63,0.22)",
          opacity: open ? 1 : 0,
          pointerEvents: open ? "auto" : "none",
          transition: "opacity 0.22s",
          zIndex: 200,
        }}
      />
      {/* Panel */}
      <div
        style={{
          position: "fixed",
          top: 0,
          right: 0,
          bottom: 0,
          width,
          background: T.paper,
          borderLeft: `1px solid ${T.hairline}`,
          boxShadow: "-8px 0 32px rgba(22,48,63,0.14)",
          transform: open ? "translateX(0)" : `translateX(${width}px)`,
          transition: "transform 0.25s cubic-bezier(0.4,0,0.2,1)",
          zIndex: 201,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        {/* Drawer header */}
        <div
          style={{
            padding: "18px 24px",
            borderBottom: `1px solid ${T.hairline}`,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexShrink: 0,
          }}
        >
          <span style={{ fontFamily: T.sans, fontWeight: 600, fontSize: 15, color: T.ink }}>{title}</span>
          <button
            onClick={onClose}
            style={{ background: "none", border: "none", cursor: "pointer", color: T.graphite, fontSize: 20, lineHeight: 1, padding: "0 4px" }}
          >
            ×
          </button>
        </div>
        {/* Drawer body */}
        <div style={{ flex: 1, overflowY: "auto", padding: "24px 24px 32px" }}>
          {children}
        </div>
      </div>
    </>
  );
}

// ─── Confirm Modal ─────────────────────────────────────────────────────────────
export function ConfirmModal({
  open,
  onClose,
  onConfirm,
  title,
  body,
  confirmLabel = "Confirm",
  danger = true,
}: {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  body: React.ReactNode;
  confirmLabel?: string;
  danger?: boolean;
}) {
  if (!open) return null;
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(22,48,63,0.3)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 300,
      }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: T.paper,
          borderRadius: 10,
          width: 420,
          padding: "28px 28px 24px",
          boxShadow: "0 8px 40px rgba(22,48,63,0.2)",
        }}
      >
        <div style={{ fontFamily: T.sans, fontWeight: 600, fontSize: 15, color: T.ink, marginBottom: 12 }}>{title}</div>
        <div style={{ fontFamily: T.sans, fontSize: 13, color: T.graphite, lineHeight: 1.6, marginBottom: 24 }}>{body}</div>
        <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
          <SecondaryBtn onClick={onClose}>Cancel</SecondaryBtn>
          <button
            onClick={() => { onConfirm(); onClose(); }}
            style={{
              padding: "8px 16px",
              borderRadius: 6,
              border: "none",
              background: danger ? T.red : T.ink,
              cursor: "pointer",
              fontFamily: T.sans,
              fontSize: 13,
              fontWeight: 500,
              color: "#FFFFFF",
            }}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Skeleton row ──────────────────────────────────────────────────────────────
function SkeletonCell({ w = "80%" }: { w?: string }) {
  return (
    <div
      style={{
        height: 12,
        borderRadius: 4,
        background: "linear-gradient(90deg, #E4E9EC 25%, #EFF2F4 50%, #E4E9EC 75%)",
        backgroundSize: "200% 100%",
        animation: "shimmer 1.4s infinite",
        width: w,
      }}
    />
  );
}

export function TableSkeleton({ cols, rows = 5 }: { cols: number; rows?: number }) {
  return (
    <>
      <style>{`@keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }`}</style>
      {Array.from({ length: rows }).map((_, i) => (
        <tr key={i} style={{ borderBottom: `1px solid ${T.mist}` }}>
          {Array.from({ length: cols }).map((_, j) => (
            <td key={j} style={{ padding: "13px 16px" }}>
              <SkeletonCell w={j === 0 ? "70%" : j === cols - 1 ? "50%" : "80%"} />
            </td>
          ))}
        </tr>
      ))}
    </>
  );
}

// ─── Empty State ──────────────────────────────────────────────────────────────
export function EmptyState({
  icon,
  title,
  body,
  action,
}: {
  icon: React.ReactNode;
  title: string;
  body: string;
  action?: React.ReactNode;
}) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "60px 24px",
        gap: 12,
        textAlign: "center",
      }}
    >
      <div style={{ color: T.hairline, marginBottom: 4 }}>{icon}</div>
      <div style={{ fontFamily: T.sans, fontWeight: 600, fontSize: 14, color: T.ink }}>{title}</div>
      <div style={{ fontFamily: T.sans, fontSize: 13, color: T.graphite, maxWidth: 320, lineHeight: 1.6 }}>{body}</div>
      {action}
    </div>
  );
}

// ─── Search input ─────────────────────────────────────────────────────────────
export function SearchInput({
  value,
  onChange,
  placeholder = "Search…",
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <div style={{ position: "relative", minWidth: 200 }}>
      <svg
        width="13"
        height="13"
        viewBox="0 0 24 24"
        fill="none"
        stroke={T.graphite}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ position: "absolute", left: 9, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}
      >
        <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
      </svg>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        style={{
          fontFamily: T.sans,
          fontSize: 13,
          color: T.ink,
          background: T.paper,
          border: `1px solid ${T.hairline}`,
          borderRadius: 6,
          padding: "7px 10px 7px 30px",
          outline: "none",
          width: "100%",
        }}
        onFocus={(e) => { e.currentTarget.style.borderColor = T.slate; }}
        onBlur={(e) => { e.currentTarget.style.borderColor = T.hairline; }}
      />
    </div>
  );
}

// ─── FilterChip ────────────────────────────────────────────────────────────────
export function FilterSelect({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
}) {
  return (
    <div style={{ position: "relative" }}>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{
          fontFamily: T.sans,
          fontSize: 12,
          color: value ? T.ink : T.graphite,
          background: value ? T.mist : T.paper,
          border: `1px solid ${value ? T.slate : T.hairline}`,
          borderRadius: 5,
          padding: "6px 28px 6px 10px",
          outline: "none",
          cursor: "pointer",
          appearance: "none" as const,
          fontWeight: value ? 500 : 400,
        }}
      >
        <option value="">{label}</option>
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
      <svg width="10" height="10" viewBox="0 0 10 10" fill="none"
        style={{ position: "absolute", right: 8, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}>
        <path d="M2 4l3 3 3-3" stroke={T.graphite} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );
}

// ─── Table shell ───────────────────────────────────────────────────────────────
export function TableShell({
  headers,
  children,
  colWidths,
}: {
  headers: string[];
  children: React.ReactNode;
  colWidths?: string[];
}) {
  return (
    <div style={{ background: T.paper, border: `1px solid ${T.hairline}`, borderRadius: 8, overflow: "hidden" }}>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        {colWidths && (
          <colgroup>
            {colWidths.map((w, i) => <col key={i} style={{ width: w }} />)}
          </colgroup>
        )}
        <thead>
          <tr style={{ background: T.bg, borderBottom: `1px solid ${T.hairline}` }}>
            {headers.map((h) => (
              <th
                key={h}
                style={{
                  padding: "10px 16px",
                  textAlign: "left",
                  fontFamily: T.sans,
                  fontSize: 11,
                  fontWeight: 600,
                  color: T.graphite,
                  letterSpacing: "0.06em",
                  textTransform: "uppercase" as const,
                  whiteSpace: "nowrap" as const,
                }}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
    </div>
  );
}

export function TR({
  children,
  index,
  onClick,
  hover = true,
  selected,
}: {
  children: React.ReactNode;
  index: number;
  onClick?: () => void;
  hover?: boolean;
  selected?: boolean;
}) {
  const baseBg = selected ? "#EDF1F5" : index % 2 === 0 ? T.paper : T.bg;
  const ref = useRef<HTMLTableRowElement>(null);

  return (
    <tr
      ref={ref}
      onClick={onClick}
      style={{
        borderBottom: `1px solid ${T.mist}`,
        background: baseBg,
        cursor: onClick ? "pointer" : "default",
        transition: "background 0.1s",
      }}
      onMouseEnter={() => {
        if (hover && ref.current) ref.current.style.background = "#F0F4F7";
      }}
      onMouseLeave={() => {
        if (hover && ref.current) ref.current.style.background = baseBg;
      }}
    >
      {children}
    </tr>
  );
}

export function TD({
  children,
  mono,
  muted,
}: {
  children: React.ReactNode;
  mono?: boolean;
  muted?: boolean;
}) {
  return (
    <td
      style={{
        padding: "11px 16px",
        fontFamily: mono ? T.mono : T.sans,
        fontSize: 13,
        color: muted ? T.graphite : T.ink,
        verticalAlign: "middle",
      }}
    >
      {children}
    </td>
  );
}

// ─── Section header ────────────────────────────────────────────────────────────
export function SectionBar({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 16,
        gap: 12,
        flexWrap: "wrap" as const,
      }}
    >
      {children}
    </div>
  );
}
