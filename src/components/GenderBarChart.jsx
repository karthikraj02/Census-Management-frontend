import {
  Chart as ChartJS,
  CategoryScale, LinearScale,
  BarElement, Title, Tooltip, Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function GenderBarChart({ results, loading }) {
  // Group data by age
  const ageMap = {};
  results.forEach(({ age, gender, count }) => {
    if (!ageMap[age]) ageMap[age] = { male: 0, female: 0, other: 0 };
    ageMap[age][gender] = count;
  });

  const ages = Object.keys(ageMap).map(Number).sort((a, b) => a - b);
  const maleData = ages.map((a) => ageMap[a].male || 0);
  const femaleData = ages.map((a) => ageMap[a].female || 0);
  const otherData = ages.map((a) => ageMap[a].other || 0);

  const chartData = {
    labels: ages,
    datasets: [
      {
        label: 'Male',
        data: maleData,
        backgroundColor: 'rgba(96, 165, 250, 0.75)',
        borderColor: '#60a5fa',
        borderWidth: 1.5,
        borderRadius: 4,
        borderSkipped: false,
      },
      {
        label: 'Female',
        data: femaleData,
        backgroundColor: 'rgba(244, 114, 182, 0.75)',
        borderColor: '#f472b6',
        borderWidth: 1.5,
        borderRadius: 4,
        borderSkipped: false,
      },
      {
        label: 'Other',
        data: otherData,
        backgroundColor: 'rgba(167, 139, 250, 0.75)',
        borderColor: '#a78bfa',
        borderWidth: 1.5,
        borderRadius: 4,
        borderSkipped: false,
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
          label: (item) => ` ${item.dataset.label}: ${item.raw} people`,
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
      }}>
        <div style={{
          fontSize: '11px', fontWeight: 700, letterSpacing: '1.5px',
          textTransform: 'uppercase', color: 'var(--accent-3)',
          fontFamily: 'var(--font-display)', marginBottom: '4px',
        }}>Bar Chart</div>
        <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '16px' }}>
          Gender Distribution by Age
        </div>
      </div>
      <div style={{ padding: '24px', height: '320px' }}>
        {loading ? (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--text-muted)' }}>
            Loading chart data...
          </div>
        ) : ages.length === 0 ? (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--text-muted)', fontSize: '14px' }}>
            No data available yet. Add census records to see distribution.
          </div>
        ) : (
          <Bar data={chartData} options={options} />
        )}
      </div>
    </div>
  );
}
