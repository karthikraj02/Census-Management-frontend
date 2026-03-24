import { useState, useEffect, useCallback } from 'react';
import CensusModal from './components/CensusModal';
import CensusTable from './components/CensusTable';
import VaccinationLineChart from './components/VaccinationLineChart';
import GenderBarChart from './components/GenderBarChart';
import { fetchData, fetchCounts, fetchResults } from './api';

const styles = {
  app: { minHeight: '100vh', background: 'var(--bg)' },
  nav: {
    borderBottom: '1px solid var(--border)',
    padding: '0 32px',
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    height: '64px',
    background: 'rgba(10,14,26,0.9)',
    backdropFilter: 'blur(12px)',
    position: 'sticky', top: 0, zIndex: 100,
  },
  logo: {
    fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '18px',
    display: 'flex', alignItems: 'center', gap: '10px',
    color: 'var(--text-primary)',
  },
  logoDot: {
    width: '8px', height: '8px', borderRadius: '50%',
    background: 'var(--accent)',
    boxShadow: '0 0 8px var(--accent)',
    display: 'inline-block',
  },
  tabBar: { display: 'flex', gap: '4px' },
  tab: {
    padding: '8px 18px', borderRadius: '8px',
    border: 'none', cursor: 'pointer',
    fontFamily: 'var(--font-display)', fontWeight: 600,
    fontSize: '13px', letterSpacing: '0.3px',
    transition: 'all 0.2s',
  },
  addBtn: {
    display: 'flex', alignItems: 'center', gap: '8px',
    padding: '9px 18px',
    background: 'var(--accent)', border: 'none', borderRadius: '8px',
    color: 'var(--bg)', fontFamily: 'var(--font-display)',
    fontWeight: 700, fontSize: '13px',
    cursor: 'pointer', transition: 'opacity 0.2s, transform 0.1s',
    letterSpacing: '0.3px',
  },
  main: { maxWidth: '1200px', margin: '0 auto', padding: '32px' },
  heroSection: {
    marginBottom: '36px',
    display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between',
    gap: '24px', flexWrap: 'wrap',
  },
  heroTitle: {
    fontFamily: 'var(--font-display)', fontWeight: 800,
    fontSize: '32px', lineHeight: 1.15,
    letterSpacing: '-0.5px',
  },
  heroSub: {
    color: 'var(--text-secondary)', fontSize: '14px',
    marginTop: '6px', maxWidth: '420px',
  },
  statsRow: {
    display: 'flex', gap: '12px', flexWrap: 'wrap',
    marginBottom: '28px',
  },
  statCard: {
    flex: '1', minWidth: '140px',
    background: 'var(--surface)',
    border: '1px solid var(--border)',
    borderRadius: '12px', padding: '18px 20px',
  },
  statLabel: {
    fontSize: '11px', fontWeight: 700, letterSpacing: '1px',
    textTransform: 'uppercase', color: 'var(--text-muted)',
    fontFamily: 'var(--font-display)', marginBottom: '6px',
  },
  statValue: {
    fontFamily: 'var(--font-display)', fontWeight: 800,
    fontSize: '28px',
  },
  grid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginTop: '28px' },
};

function StatCard({ label, value, color }) {
  return (
    <div style={styles.statCard}>
      <div style={styles.statLabel}>{label}</div>
      <div style={{ ...styles.statValue, color: color || 'var(--text-primary)' }}>{value}</div>
    </div>
  );
}

export default function App() {
  const [activeTab, setActiveTab] = useState('census');
  const [showModal, setShowModal] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [vaccinated, setVaccinated] = useState([]);
  const [unvaccinated, setUnvaccinated] = useState([]);
  const [genderResults, setGenderResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadAll = useCallback(async () => {
    setLoading(true);
    try {
      const [dataRes, vacRes, unvacRes, resultsRes] = await Promise.all([
        fetchData(),
        fetchCounts(true),
        fetchCounts(false),
        fetchResults(),
      ]);
      setTableData(dataRes.data?.data || []);
      setVaccinated(vacRes.data?.data || []);
      setUnvaccinated(unvacRes.data?.data || []);
      setGenderResults(resultsRes.data?.data || []);
    } catch (err) {
      console.error('Failed to load data:', err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadAll(); }, [loadAll]);

  const totalVaccinated = tableData.filter((r) => r.is_vaccinated).length;
  const totalUnvaccinated = tableData.filter((r) => !r.is_vaccinated).length;
  const vacRate = tableData.length > 0 ? Math.round((totalVaccinated / tableData.length) * 100) : 0;

  return (
    <div style={styles.app}>
      <style>{`
        .add-btn:hover { opacity: 0.85 !important; }
        .add-btn:active { transform: scale(0.97) !important; }
        .tab-active { background: rgba(0,212,255,0.12) !important; color: var(--accent) !important; border: 1px solid rgba(0,212,255,0.25) !important; }
        .tab-inactive { background: transparent !important; color: var(--text-muted) !important; border: 1px solid transparent !important; }
        .tab-inactive:hover { color: var(--text-secondary) !important; background: var(--surface) !important; }
        @media (max-width: 700px) {
          .charts-grid { grid-template-columns: 1fr !important; }
          .hero-section { flex-direction: column !important; align-items: flex-start !important; }
        }
      `}</style>

      {/* Nav */}
      <nav style={styles.nav}>
        <div style={styles.logo}>
          <span style={styles.logoDot}></span>
          VaxCensus
        </div>
        <div style={styles.tabBar}>
          <button
            className={activeTab === 'census' ? 'tab-active' : 'tab-inactive'}
            style={styles.tab}
            onClick={() => setActiveTab('census')}
          >
            Census
          </button>
          <button
            className={activeTab === 'trends' ? 'tab-active' : 'tab-inactive'}
            style={styles.tab}
            onClick={() => setActiveTab('trends')}
          >
            Trends
          </button>
        </div>
        <button
          className="add-btn"
          style={styles.addBtn}
          onClick={() => setShowModal(true)}
        >
          + Add Entry
        </button>
      </nav>

      {/* Main */}
      <main style={styles.main}>
        {/* Hero */}
        <div className="hero-section" style={styles.heroSection}>
          <div>
            <h1 style={styles.heroTitle}>
              {activeTab === 'census' ? 'Census Management' : 'Trend Analysis'}
            </h1>
            <p style={styles.heroSub}>
              {activeTab === 'census'
                ? 'Track and manage vaccination census records across the population.'
                : 'Visual insights on vaccination rates and demographic distribution.'}
            </p>
          </div>
          {activeTab === 'trends' && (
            <button
              className="add-btn"
              style={{ ...styles.addBtn, background: 'var(--surface)', color: 'var(--text-secondary)', border: '1px solid var(--border)' }}
              onClick={loadAll}
            >
              ↺ Refresh
            </button>
          )}
        </div>

        {/* Stats Row */}
        <div style={styles.statsRow}>
          <StatCard label="Total Records" value={tableData.length} color="var(--text-primary)" />
          <StatCard label="Vaccinated" value={totalVaccinated} color="var(--vaccinated)" />
          <StatCard label="Unvaccinated" value={totalUnvaccinated} color="var(--unvaccinated)" />
          <StatCard label="Vaccine Rate" value={`${vacRate}%`} color="var(--success)" />
        </div>

        {/* Screen 1: Census Management */}
        {activeTab === 'census' && (
          <CensusTable data={tableData} loading={loading} />
        )}

        {/* Screen 2: Trends */}
        {activeTab === 'trends' && (
          <div className="charts-grid" style={styles.grid}>
            <VaccinationLineChart
              vaccinated={vaccinated}
              unvaccinated={unvaccinated}
              loading={loading}
            />
            <GenderBarChart results={genderResults} loading={loading} />
          </div>
        )}
      </main>

      {/* Modal */}
      {showModal && (
        <CensusModal
          onClose={() => setShowModal(false)}
          onSuccess={loadAll}
        />
      )}
    </div>
  );
}
