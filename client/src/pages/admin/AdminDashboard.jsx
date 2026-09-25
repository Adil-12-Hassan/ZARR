import { useMemo, useState } from "react";
import StatCard from "../../components/admin/StatCard";
import LineChart from "../../components/admin/LineChart";
import DonutChart from "../../components/admin/DonutChart";
import { downloadCsv } from "../../utils/csv";
import { useOrders } from "../../context/OrdersContext";
import "../../styles/components/admin-ui.css";
import "../../styles/pages/adminDashboard.css";

// TODO: replace with data fetched from your API (e.g. GET /api/revenue/monthly)
const SEED_MONTHLY_REVENUE = [
  {
    month: "Mar",
    label: "March 2026",
    value: 612000,
    orders: 18,
    archived: false,
  },
  {
    month: "Apr",
    label: "April 2026",
    value: 745000,
    orders: 22,
    archived: false,
  },
  {
    month: "May",
    label: "May 2026",
    value: 689000,
    orders: 20,
    archived: false,
  },
  {
    month: "Jun",
    label: "June 2026",
    value: 831000,
    orders: 25,
    archived: false,
  },
  {
    month: "Jul",
    label: "July 2026",
    value: 902000,
    orders: 27,
    archived: false,
  },
  {
    month: "Aug",
    label: "August 2026",
    value: 958500,
    orders: 29,
    archived: false,
  },
];

// TODO: replace with data fetched from your API (e.g. GET /api/revenue/by-category)
const REVENUE_BY_CATEGORY = [
  { label: "Automatic", value: 412000 },
  { label: "Chronograph", value: 318000 },
  { label: "Moonphase", value: 165000 },
  { label: "Limited Edition", value: 98000 },
];

const money = (n) => `PKR ${n.toLocaleString()}`;

export default function AdminDashboard() {
  const { orders } = useOrders();
  const [monthlyRevenue, setMonthlyRevenue] = useState(SEED_MONTHLY_REVENUE);

  const visibleMonths = monthlyRevenue.filter((m) => !m.archived);

  const totalRevenue = useMemo(
    () => visibleMonths.reduce((sum, m) => sum + m.value, 0),
    [visibleMonths],
  );
  const pendingOrders = orders.filter(
    (o) => o.status === "Processing" || o.status === "Received",
  ).length;
  const avgOrderValue = orders.length
    ? Math.round(orders.reduce((s, o) => s + o.total, 0) / orders.length)
    : 0;

  const chartData = visibleMonths.map((m) => ({
    label: m.month,
    value: m.value,
  }));

  // Save this month's revenue row as a CSV file, then remove it from the
  // dashboard/database — matches "save the file and details" from the brief.
  const handleSaveAndRemove = (month) => {
    downloadCsv(
      `zarr-revenue-${month.month.toLowerCase()}-${month.label.split(" ")[1]}`,
      [{ Month: month.label, Revenue: month.value, Orders: month.orders }],
    ); // TODO: call your API to persist the archive, e.g.
    // api.delete(`/api/revenue/monthly/${month.month}`);
    setMonthlyRevenue((prev) =>
      prev.map((m) => (m.month === month.month ? { ...m, archived: true } : m)),
    );
  };

  const handleExportAll = () => {
    downloadCsv(
      "zarr-revenue-all-months",
      visibleMonths.map((m) => ({
        Month: m.label,
        Revenue: m.value,
        Orders: m.orders,
      })),
    );
  };

  return (
    <div>
      <div className="admin-grid admin-grid--stats">
        <StatCard
          label="Total revenue"
          value={money(totalRevenue)}
          trend="8.2% vs last month"
          trendDirection="up"
        />
        <StatCard
          label="Orders this month"
          value={monthlyRevenue.at(-1)?.orders ?? 0}
          trend="3 more than July"
          trendDirection="up"
        />
        <StatCard
          label="Average order value"
          value={money(avgOrderValue)}
          trend="1.4% vs last month"
          trendDirection="down"
        />
        <StatCard
          label="Pending orders"
          value={pendingOrders}
          trend="Needs attention"
          trendDirection="down"
        />
      </div>   <div className="admin-grid admin-grid--2">
        <div className="admin-panel">
          <div className="admin-panel__head">
            <div>
              <h2>Revenue trend</h2>
              <p>Monthly revenue over the last {visibleMonths.length} months</p>
            </div>
          </div>
          <LineChart data={chartData} formatValue={money} />
        </div>     <div className="admin-panel">
          <div className="admin-panel__head">
            <div>
              <h2>Revenue by category</h2>
              <p>Share of total revenue this quarter</p>
            </div>
          </div>
          <DonutChart data={REVENUE_BY_CATEGORY} />
        </div>
      </div>   <div className="admin-panel" style={{ marginTop: 20 }}>
        <div className="admin-panel__head">
          <div>
            <h2>Monthly revenue log</h2>
            <p>Save a month as a CSV file, then clear it from the dashboard</p>
          </div>
          <button className="btn btn-outline btn-sm" onClick={handleExportAll}>
            Export all
          </button>
        </div>     <div className="table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Month</th>
                <th>Orders</th>
                <th>Revenue</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {visibleMonths.length === 0 && (
                <tr>
                  <td colSpan={4} className="table-empty">
                    No months logged yet.
                  </td>
                </tr>
              )}
              {visibleMonths.map((m) => (
                <tr key={m.month}>
                  <td className="admin-table__primary">{m.label}</td>
                  <td>{m.orders}</td>
                  <td>{money(m.value)}</td>
                  <td>
                    <div className="admin-table__actions">
                      <button
                        className="btn btn-ghost btn-sm"
                        onClick={() => handleSaveAndRemove(m)}
                      >
                        Save as CSV &amp; remove
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
