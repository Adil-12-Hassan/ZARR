export default function StatCard({ label, value, trend, trendDirection = "up", icon }) {
  return (
    <div className="stat-card">
      <div className="stat-card__top">
        <span className="stat-card__label">{label}</span>
        {icon && <span className="stat-card__icon">{icon}</span>}
      </div>
      <div className="stat-card__value">{value}</div>
      {trend && (
        <div className={`stat-card__trend stat-card__trend--${trendDirection}`}>
          {trendDirection === "up" ? "▲" : "▼"} {trend}
        </div>
      )}
    </div>
  );
}
