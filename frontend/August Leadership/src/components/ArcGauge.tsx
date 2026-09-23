interface ArcGaugeProps {
  value: number; // 0–100
  size?: number;
  color?: string;
  label?: string;
  caption?: string;
}

export default function ArcGauge({ value, size = 88, color = "#16303F", label, caption }: ArcGaugeProps) {
  const r = (size - 10) / 2;
  const cx = size / 2;
  const cy = size / 2;
  const startAngle = -225;
  const sweep = 270;
  const angle = startAngle + (sweep * Math.min(Math.max(value, 0), 100)) / 100;

  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const arcPath = (a1: number, a2: number) => {
    const x1 = cx + r * Math.cos(toRad(a1));
    const y1 = cy + r * Math.sin(toRad(a1));
    const x2 = cx + r * Math.cos(toRad(a2));
    const y2 = cy + r * Math.sin(toRad(a2));
    const large = a2 - a1 > 180 ? 1 : 0;
    return `M ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2}`;
  };

  const trackPath = arcPath(startAngle, startAngle + sweep);
  const valuePath = value > 0 ? arcPath(startAngle, angle) : "";

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
      <div style={{ position: "relative", width: size, height: size }}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          <path d={trackPath} fill="none" stroke="#E4E9EC" strokeWidth={5} strokeLinecap="round" />
          {value > 0 && (
            <path d={valuePath} fill="none" stroke={color} strokeWidth={5} strokeLinecap="round" />
          )}
        </svg>
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 2,
          }}
        >
          <span
            style={{
              fontFamily: "'IBM Plex Mono', monospace",
              fontWeight: 600,
              fontSize: size > 72 ? 18 : 14,
              color: "#16303F",
              lineHeight: 1,
            }}
          >
            {label ?? `${value}%`}
          </span>
        </div>
      </div>
      {caption && (
        <span
          style={{
            fontFamily: "'IBM Plex Sans', sans-serif",
            fontSize: 10,
            fontWeight: 500,
            color: "#5B6472",
            textTransform: "uppercase",
            letterSpacing: "0.06em",
            textAlign: "center",
          }}
        >
          {caption}
        </span>
      )}
    </div>
  );
}
