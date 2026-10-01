import { useMemo } from "react";
import StatCard from "../../components/admin/StatCard";
import LineChart from "../../components/admin/LineChart";
import DonutChart from "../../components/admin/DonutChart";
import { downloadCsv } from "../../utils/csv";
import { useOrders } from "../../context/OrdersContext";
import "../../styles/components/admin-ui.css";
import "../../styles/pages/adminDashboard.css";

const money = (n) => `PKR ${Number(n || 0).toLocaleString()}`;

function buildMonthlyRevenue(orders) {
  const monthMap = new Map();
  const now = new Date();

  for (let i = 5; i >= 0; i -= 1) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
    const label = date.toLocaleDateString("en-US", { month: "short", year: "numeric" });
    monthMap.set(key, { month: key, label, value: 0, orders: 0, archived: false });
  }

  orders.forEach((order) => {
    const date = new Date(order.createdAt || order.date || Date.now());
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
    if (!monthMap.has(key)) return;

    const current = monthMap.get(key);
    current.value += Number(order.total || 0);
    current.orders += 1;
  });

  return [...monthMap.values()];
}

function buildProductRevenue(orders) {
  const map = new Map();

  orders.forEach((order) => {
    (order.items || []).forEach((item) => {
      const name = item.name || "Product";
      const value = Number(item.price || 0) * Number(item.quantity || 1);
      map.set(name, (map.get(name) || 0) + value);
    });
  });

  return [...map.entries()].map(([label, value]) => ({ label, value })).slice(0, 4);
}

export default function AdminDashboard() {
  const { orders } = useOrders();
  const monthlyRevenue = useMemo(() => buildMonthlyRevenue(orders), [orders]);
  const productRevenue = useMemo(() => buildProductRevenue(orders), [orders]);

  const totalRevenue = useMemo(
    () => orders.reduce((sum, order) => sum + Number(order.total || 0), 0),
    [orders],
  );

  const pendingOrders = orders.filter((o) => ["Pending", "Confirmed", "Processing", "Shipped"].includes(o.status)).length;
  const avgOrderValue = orders.length
    ? Math.round(orders.reduce((s, o) => s + Number(o.total || 0), 0) / orders.length)
    : 0;

  const currentMonth = monthlyRevenue[monthlyRevenue.length - 1];
  const chartData = monthlyRevenue.map((m) => ({ label: m.month, value: m.value }));

  const handleExportAll = () => {
    downloadCsv(
      "zarr-revenue-all-months",
      monthlyRevenue.map((m) => ({
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
          trend="Live totals"
          trendDirection="up"
        />
        <StatCard
          label="Orders this month"
          value={currentMonth?.orders ?? 0}
          trend="Current month"
          trendDirection="up"
        />
        <StatCard
          label="Average order value"
          value={money(avgOrderValue)}
          trend="Live average"
          trendDirection="down"
        />
        <StatCard
          label="Pending orders"
          value={pendingOrders}
          trend="Needs attention"
          trendDirection="down"
        />
      </div>

      <div className="admin-grid admin-grid--2">
        <div className="admin-panel">
          <div className="admin-panel__head">
            <div>
              <h2>Revenue trend</h2>
              <p>Live monthly revenue from real orders</p>
            </div>
          </div>
          <LineChart data={chartData} formatValue={money} />
        </div>

        <div className="admin-panel">
          <div className="admin-panel__head">
            <div>
              <h2>Revenue by product</h2>
              <p>Share of current live order value</p>
            </div>
          </div>
          {productRevenue.length ? <DonutChart data={productRevenue} /> : <div className="chart-empty">No product revenue yet.</div>}
        </div>
      </div>

      <div className="admin-panel" style={{ marginTop: 20 }}>
        <div className="admin-panel__head">
          <div>
            <h2>Monthly revenue log</h2>
            <p>Export the current order totals from the live dashboard</p>
          </div>
          <button className="btn btn-outline btn-sm" onClick={handleExportAll}>
            Export all
          </button>
        </div>

        <div className="table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Month</th>
                <th>Orders</th>
                <th>Revenue</th>
              </tr>
            </thead>
            <tbody>
              {monthlyRevenue.length === 0 && (
                <tr>
                  <td colSpan={3} className="table-empty">No order data yet.</td>
                </tr>
              )}
              {monthlyRevenue.map((m) => (
                <tr key={m.month}>
                  <td className="admin-table__primary">{m.label}</td>
                  <td>{m.orders}</td>
                  <td>{money(m.value)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
