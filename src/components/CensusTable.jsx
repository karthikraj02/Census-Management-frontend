const styles = {
  wrapper: {
    background: 'var(--surface)',
    border: '1px solid var(--border)',
    borderRadius: '16px',
    overflow: 'hidden',
  },
  tableHeader: {
    padding: '20px 24px',
    borderBottom: '1px solid var(--border)',
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
  },
  tableTitle: {
    fontFamily: 'var(--font-display)',
    fontWeight: 700, fontSize: '16px',
    color: 'var(--text-primary)',
  },
  badge: {
    background: 'rgba(0,212,255,0.12)',
    color: 'var(--accent)',
    border: '1px solid rgba(0,212,255,0.25)',
    borderRadius: '20px', padding: '3px 10px',
    fontSize: '12px', fontWeight: 600,
  },
  tableScroll: { overflowX: 'auto' },
  table: { width: '100%', borderCollapse: 'collapse' },
  th: {
    padding: '12px 20px', textAlign: 'left',
    fontSize: '11px', fontWeight: 700,
    letterSpacing: '1.5px', textTransform: 'uppercase',
    color: 'var(--text-muted)',
    fontFamily: 'var(--font-display)',
    borderBottom: '1px solid var(--border)',
    whiteSpace: 'nowrap',
    background: 'var(--surface)',
  },
  td: {
    padding: '14px 20px', fontSize: '14px',
    color: 'var(--text-secondary)',
    borderBottom: '1px solid rgba(30,45,69,0.6)',
    verticalAlign: 'middle',
  },
  nameCell: {
    color: 'var(--text-primary)', fontWeight: 500,
  },
  emptyState: {
    padding: '60px 24px', textAlign: 'center',
    color: 'var(--text-muted)', fontSize: '14px',
  },
};

const genderColors = {
  male: { bg: 'rgba(96,165,250,0.12)', color: '#60a5fa', border: 'rgba(96,165,250,0.3)' },
  female: { bg: 'rgba(244,114,182,0.12)', color: '#f472b6', border: 'rgba(244,114,182,0.3)' },
  other: { bg: 'rgba(167,139,250,0.12)', color: '#a78bfa', border: 'rgba(167,139,250,0.3)' },
};

function Pill({ label, bg, color, border }) {
  return (
    <span style={{
      display: 'inline-block', padding: '3px 10px',
      background: bg, color, border: `1px solid ${border}`,
      borderRadius: '20px', fontSize: '12px', fontWeight: 600,
      textTransform: 'capitalize',
    }}>
      {label}
    </span>
  );
}

export default function CensusTable({ data, loading }) {
  if (loading) {
    return (
      <div style={styles.wrapper}>
        <div style={styles.tableHeader}><span style={styles.tableTitle}>Census Records</span></div>
        <div style={styles.emptyState}>Loading records...</div>
      </div>
    );
  }

  return (
    <div style={styles.wrapper}>
      <div style={styles.tableHeader}>
        <span style={styles.tableTitle}>Census Records</span>
        <span style={styles.badge}>{data.length} entries</span>
      </div>

      {data.length === 0 ? (
        <div style={styles.emptyState}>
          No records yet. Add the first census entry!
        </div>
      ) : (
        <div style={styles.tableScroll}>
          <table style={styles.table}>
            <thead>
              <tr>
                {['#', 'Name', 'Gender', 'Birth Date', 'Vaccinated'].map((h) => (
                  <th key={h} style={styles.th}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.map((row, idx) => {
                const gc = genderColors[row.gender] || genderColors.other;
                return (
                  <tr key={row.id} style={{ transition: 'background 0.15s' }}
                    onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                  >
                    <td style={{ ...styles.td, color: 'var(--text-muted)', fontSize: '12px' }}>
                      {idx + 1}
                    </td>
                    <td style={{ ...styles.td, ...styles.nameCell }}>{row.name}</td>
                    <td style={styles.td}>
                      <Pill label={row.gender} bg={gc.bg} color={gc.color} border={gc.border} />
                    </td>
                    <td style={styles.td}>{row.birthdate}</td>
                    <td style={styles.td}>
                      {row.is_vaccinated ? (
                        <Pill label="✓ Yes" bg="rgba(52,211,153,0.12)" color="var(--success)" border="rgba(52,211,153,0.3)" />
                      ) : (
                        <Pill label="✗ No" bg="rgba(248,113,113,0.12)" color="var(--error)" border="rgba(248,113,113,0.3)" />
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
