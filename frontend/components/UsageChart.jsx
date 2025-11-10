import { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend);

export default function UsageChart() {
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/usage`)
      .then((res) => res.json())
      .then((data) => {
        const sorted = [...data].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        const labels = sorted.map((log) => new Date(log.createdAt).toLocaleDateString());
        const values = sorted.map((log) => log.litersUsed);

        setChartData({
          labels,
          datasets: [
            {
              label: 'Liters Used',
              data: values,
              borderColor: '#3b82f6',
              backgroundColor: 'rgba(59, 130, 246, 0.2)',
              tension: 0.3,
              fill: true,
            },
          ],
        });
      });
  }, []);

  if (!chartData) return <p className="text-center mt-10">Loading chart...</p>;

  return (
    <div className="max-w-4xl mx-auto mt-10 p-4 bg-white shadow rounded">
      <h2 className="text-xl font-bold mb-4">Usage Trend</h2>
      <Line data={chartData} />
    </div>
  );
}