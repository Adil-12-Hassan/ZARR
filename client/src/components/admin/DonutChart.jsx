const PALETTE = [
  "var(--color-gold-primary)",
  "var(--color-gold-light)",
  "var(--color-success)",
  "var(--color-info)",
  "var(--color-gold-dark)",
  "var(--color-text-muted)",
];

/**
 * Minimal SVG donut chart — no charting library required.
 * data: [{ label: "Automatic", value: 42000 }, ...]
 */
export default function DonutChart({ data, size = 200, thickness = 26 }) {
  if (!data || data.length === 0) {
    return <div className="chart-empty">No category data yet.</div>;
  }

  const total = data.reduce((sum, d) => sum + d.value, 0) || 1;
  const radius = (size - thickness) / 2;
  const circumference = 2 * Math.PI * radius;

  let offset = 0;
  const segments = data.map((d, i) => {
    const fraction = d.value / total;
    const dash = fraction * circumference;
    const segment = {
      ...d,
      color: PALETTE[i % PALETTE.length],
      dasharray: `${dash} ${circumference - dash}`,
      dashoffset: -offset,
      percent: Math.round(fraction * 100),
    };
    offset += dash;
    return segment;
  });

  return (
    <div className="donut-chart">
      <svg viewBox={`0 0 ${size} ${size}`} width={size} height={size}>
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="var(--color-border-dark)" strokeWidth={thickness} />
        {segments.map((s, i) => (
          <circle
            key={i}
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={s.color}
            strokeWidth={thickness}
            strokeDasharray={s.dasharray}
            strokeDashoffset={s.dashoffset}
            transform={`rotate(-90 ${size / 2} ${size / 2})`}
            strokeLinecap="butt"
          />
        ))}
        <text x="50%" y="47%" textAnchor="middle" className="donut-chart__total-value">
          {total.toLocaleString()}
        </text>
        <text x="50%" y="60%" textAnchor="middle" className="donut-chart__total-label">
          total
        </text>
      </svg>   <ul className="donut-chart__legend">
        {segments.map((s, i) => (
          <li key={i}>
            <span className="donut-chart__swatch" style={{ background: s.color }} />
            <span className="donut-chart__legend-label">{s.label}</span>
            <span className="donut-chart__legend-value">{s.percent}%</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
