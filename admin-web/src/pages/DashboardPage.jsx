import { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell } from 'recharts';
import { fetchDeliveredTodayCount, fetchOrderCount } from '../api/admin';
import LoadingSpinner from '../components/common/LoadingSpinner';

// Live pipeline statuses shown as stat cards (DELIVERED excluded — shown separately as "Today" via dedicated endpoint)
const PIPELINE_STATUSES = ['PENDING', 'IN_PROGRESS', 'READY', 'CANCELLED'];

const STATUS_LABELS = {
  PENDING: 'Pending',
  IN_PROGRESS: 'In Progress',
  READY: 'Ready',
  CANCELLED: 'Cancelled',
};

const BAR_COLORS = {
  PENDING: '#f59e0b',
  IN_PROGRESS: '#3b82f6',
  READY: '#10b981',
  CANCELLED: '#ef4444',
  'Delivered Today': '#7c3aed',
};

export default function DashboardPage() {
  const [stats, setStats] = useState({});
  const [deliveredToday, setDeliveredToday] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const countEntries = await Promise.all(
          PIPELINE_STATUSES.map(async (status) => {
            const value = await fetchOrderCount(status);
            return [status, value];
          })
        );
        setStats(Object.fromEntries(countEntries));

        // Uses GET /admin/orders/delivered/count — dedicated endpoint from AdminController
        const today = await fetchDeliveredTodayCount();
        setDeliveredToday(today);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const chartData = [
    ...PIPELINE_STATUSES.map((status) => ({
      label: STATUS_LABELS[status],
      count: stats[status] || 0,
    })),
    { label: 'Delivered Today', count: deliveredToday },
  ];

  if (loading) {
    return (
      <div className="grid gap-16 page-enter">
        <div className="stats-grid">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="stat-card skeleton-block" />
          ))}
        </div>
        <div className="card chart-skeleton">
          <LoadingSpinner label="Loading dashboard insights..." />
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-16 page-enter">
      <div className="stats-grid">
        {PIPELINE_STATUSES.map((status) => (
          <div key={status} className="stat-card">
            <h4>{STATUS_LABELS[status]}</h4>
            <strong>{stats[status] || 0}</strong>
          </div>
        ))}
        {/* Delivered Today: sourced exclusively from GET /admin/orders/delivered/count */}
        <div className="stat-card highlight">
          <h4>Delivered Today</h4>
          <strong>{deliveredToday}</strong>
        </div>
      </div>

      <div className="card chart-card">
        <h3>Order Pipeline Overview</h3>
        <ResponsiveContainer width="100%" height={320}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="label" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Bar dataKey="count" radius={[8, 8, 0, 0]}>
              {chartData.map((entry) => (
                <Cell key={entry.label} fill={BAR_COLORS[entry.label] || '#5b7cfa'} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
