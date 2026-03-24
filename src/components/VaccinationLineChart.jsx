import {
  Chart as ChartJS,
  CategoryScale, LinearScale, PointElement,
  LineElement, Title, Tooltip, Legend, Filler,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale, LinearScale, PointElement,
  LineElement, Title, Tooltip, Legend, Filler,
);

export default function VaccinationLineChart({ vaccinated, unvaccinated, loading }) {
  // Merge all ages from both datasets
  const allAgesSet = new Set([
    ...vaccinated.map((d) => d.age),
    ...unvaccinated.map((d) => d.age),
  ]);
  const allAges = Array.from(allAgesSet).sort((a, b) => a - b);

  const vacMap = Object.fromEntries(vaccinated.map((d) => [d.age, d.count]));
  const unvacMap = Object.fromEntries(unvaccinated.map((d) => [d.age, d.count]));

  const vacData = allAges.map((age) => vacMap[age] ?? null);
  const unvacData = allAges.map((age) => unvacMap[age] ?? null);

  const chartData = {
    labels: allAges,
    datasets: [
      {
        label: 'Vaccinated',
        data: vacData,
        borderColor: '#00d4ff',
        backgroundColor: 'rgba(0, 212, 255, 0.08)',
        pointBackgroundColor: '#00d4ff',
        pointBorderColor: '#0a0e1a',
        pointBorderWidth: 2,
        pointRadius: 5,
        pointHoverRadius: 7,
        borderWidth: 2.5,
        tension: 0.4,
        fill: true,
        spanGaps: true,
      },
      {
        label: 'Not Vaccinated',
        data: unvacData,
        borderColor: '#ff6b6b',
        backgroundColor: 'rgba(255, 107, 107, 0.08)',
        pointBackgroundColor: '#ff6b6b',
        pointBorderColor: '#0a0e1a',
        pointBorderWidth: 2,
        pointRadius: 5,
        pointHoverRadius: 7,
        borderWidth: 2.5,
        tension: 0.4,
        fill: true,
        spanGaps: true,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: { intersect: false, mode: 'index' },
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: '#8899bb',
          font: { family: 'DM Sans', size: 13, weight: '500' },
          usePointStyle: true, pointStyleWidth: 10,
          padding: 20,
        },
      },
      tooltip: {
        backgroundColor: '#111827',
        borderColor: '#1e2d45',
        borderWidth: 1,
        titleColor: '#f0f4ff',
        bodyColor: '#8899bb',
        padding: 12,
        callbacks: {
          title: (items) => `Age: ${items[0].label}`,
          label: (item) => ` ${item.dataset.label}: ${item.raw ?? 0} people`,
        },
      },
    },
    scales: {
      x: {
        title: {
          display: true, text: 'Age',
          color: '#4a5c7a',
          font: { family: 'Syne', size: 12, weight: '600' },
          padding: { top: 10 },
        },
        ticks: { color: '#4a5c7a', font: { size: 11 } },
        grid: { color: 'rgba(30,45,69,0.5)' },
        border: { color: '#1e2d45' },
      },
      y: {
        beginAtZero: true,
        title: {
          display: true, text: 'Number of People',
          color: '#4a5c7a',
          font: { family: 'Syne', size: 12, weight: '600' },
          padding: { bottom: 10 },
        },
        ticks: {
          color: '#4a5c7a', font: { size: 11 },
          stepSize: 1,
          callback: (v) => Number.isInteger(v) ? v : '',
        },
        grid: { color: 'rgba(30,45,69,0.5)' },
        border: { color: '#1e2d45' },
      },
    },
  };

  return (
    <div style={{
      background: 'var(--surface)',
      border: '1px solid var(--border)',
      borderRadius: '16px', overflow: 'hidden',
    }}>
      <div style={{
        padding: '20px 24px', borderBottom: '1px solid var(--border)',
        display: 'flex', alignItems: 'flex-start', gap: '12px',
      }}>
        <div>
          <div style={{
            fontSize: '11px', fontWeight: 700, letterSpacing: '1.5px',
            textTransform: 'uppercase', color: 'var(--accent)',
            fontFamily: 'var(--font-display)', marginBottom: '4px',
          }}>Line Chart</div>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '16px' }}>
            Vaccinated vs Unvaccinated by Age
          </div>
        </div>
      </div>
      <div style={{ padding: '24px', height: '320px' }}>
        {loading ? (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--text-muted)' }}>
            Loading chart data...
          </div>
        ) : allAges.length === 0 ? (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--text-muted)', fontSize: '14px' }}>
            No data available yet. Add census records to see trends.
          </div>
        ) : (
          <Line data={chartData} options={options} />
        )}
      </div>
    </div>
  );
}
