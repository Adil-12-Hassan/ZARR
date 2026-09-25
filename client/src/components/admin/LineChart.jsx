import { useId, useState } from "react";

/**
 * Minimal SVG line/area chart — no charting library required.
 * data: [{ label: "Jan", value: 12000 }, ...]
 */
export default function LineChart({ data, height = 220, formatValue = (v) => v }) {
  const gradientId = useId();
  const [hoverIndex, setHoverIndex] = useState(null);

  if (!data || data.length === 0) {
    return <div className="chart-empty">No revenue data yet.</div>;
  }

  const width = 640;
  const padding = { top: 16, right: 16, bottom: 28, left: 16 };
  const innerW = width - padding.left - padding.right;
  const innerH = height - padding.top - padding.bottom;

  const values = data.map((d) => d.value);
  const max = Math.max(...values, 1);
  const min = Math.min(0, ...values);
  const range = max - min || 1;

  const points = data.map((d, i) => {
    const x = padding.left + (i / (data.length - 1 || 1)) * innerW;
    const y = padding.top + innerH - ((d.value - min) / range) * innerH;
    return { x, y, ...d };
  });

  const linePath = points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");
  const areaPath = `${linePath} L ${points[points.length - 1].x} ${padding.top + innerH} L ${points[0].x} ${padding.top + innerH} Z`;

  return (
    <div className="line-chart">
      <svg viewBox={`0 0 ${width} ${height}`} className="line-chart__svg" preserveAspectRatio="none">
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--color-gold-primary)" stopOpacity="0.35" />
            <stop offset="100%" stopColor="var(--color-gold-primary)" stopOpacity="0" />
          </linearGradient>
        </defs>     {/* horizontal gridlines */}
        {[0.25, 0.5, 0.75, 1].map((f) => (
          <line
            key={f}
            x1={padding.left}
            x2={width - padding.right}
            y1={padding.top + innerH * (1 - f)}
            y2={padding.top + innerH * (1 - f)}
            stroke="var(--color-border-dark)"
            strokeWidth="1"
          />
        ))}     <path d={areaPath} fill={`url(#${gradientId})`} stroke="none" />
        <path d={linePath} fill="none" stroke="var(--color-gold-primary)" strokeWidth="2" />     {points.map((p, i) => (
          <g key={i} onMouseEnter={() => setHoverIndex(i)} onMouseLeave={() => setHoverIndex(null)}>
            <rect x={p.x - innerW / data.length / 2} y={0} width={innerW / data.length} height={height} fill="transparent" />
            <circle
              cx={p.x}
              cy={p.y}
              r={hoverIndex === i ? 5 : 3}
              fill={hoverIndex === i ? "var(--color-gold-highlight)" : "var(--color-gold-primary)"}
              stroke="var(--color-admin-background)"
              strokeWidth="1.5"
            />
          </g>
        ))}
      </svg>   <div className="line-chart__labels">
        {data.map((d, i) => (
          <span key={i} className={hoverIndex === i ? "is-active" : ""}>
            {d.label}
          </span>
        ))}
      </div>   {hoverIndex !== null && (
        <div
          className="line-chart__tooltip"
          style={{ left: `${(points[hoverIndex].x / width) * 100}%` }}
        >
          <strong>{data[hoverIndex].label}</strong>
          <span>{formatValue(data[hoverIndex].value)}</span>
        </div>
      )}
    </div>
  );
}
