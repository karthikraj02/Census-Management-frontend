import { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { submitVote } from '../api';
import { format, subYears } from 'date-fns';

const styles = {
  overlay: {
    position: 'fixed', inset: 0,
    background: 'rgba(0, 0, 0, 0.75)',
    backdropFilter: 'blur(6px)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    zIndex: 1000, padding: '20px',
    animation: 'fadeIn 0.2s ease',
  },
  modal: {
    background: 'var(--surface)',
    border: '1px solid var(--border)',
    borderRadius: '16px',
    width: '100%', maxWidth: '480px',
    padding: '36px',
    boxShadow: '0 20px 60px rgba(0,0,0,0.6), 0 0 40px rgba(0,212,255,0.08)',
    animation: 'slideUp 0.25s ease',
    position: 'relative',
  },
  header: {
    marginBottom: '28px',
  },
  headerLabel: {
    fontSize: '11px', fontWeight: 700, letterSpacing: '2px',
    textTransform: 'uppercase', color: 'var(--accent)',
    marginBottom: '6px', display: 'block',
    fontFamily: 'var(--font-display)',
  },
  title: {
    fontSize: '24px', fontWeight: 800,
    fontFamily: 'var(--font-display)',
    color: 'var(--text-primary)',
    lineHeight: 1.2,
  },
  closeBtn: {
    position: 'absolute', top: '20px', right: '20px',
    background: 'none', border: 'none',
    color: 'var(--text-muted)', cursor: 'pointer',
    fontSize: '22px', lineHeight: 1,
    padding: '4px 8px',
    borderRadius: '6px',
    transition: 'color 0.2s, background 0.2s',
  },
  fieldGroup: { marginBottom: '20px' },
  label: {
    display: 'block', fontSize: '12px', fontWeight: 600,
    letterSpacing: '0.5px', textTransform: 'uppercase',
    color: 'var(--text-secondary)', marginBottom: '8px',
    fontFamily: 'var(--font-display)',
  },
  input: {
    width: '100%', padding: '12px 16px',
    background: 'var(--surface-2)',
    border: '1.5px solid var(--border)',
    borderRadius: '8px',
    color: 'var(--text-primary)',
    fontFamily: 'var(--font-body)',
    fontSize: '14px', outline: 'none',
    transition: 'border-color 0.2s, box-shadow 0.2s',
  },
  radioGroup: { display: 'flex', gap: '10px', flexWrap: 'wrap' },
  radioLabel: {
    display: 'flex', alignItems: 'center', gap: '8px',
    padding: '10px 16px',
    background: 'var(--surface-2)',
    border: '1.5px solid var(--border)',
    borderRadius: '8px', cursor: 'pointer',
    transition: 'border-color 0.2s, background 0.2s',
    fontSize: '14px', color: 'var(--text-secondary)',
    userSelect: 'none',
    flex: 1, minWidth: '80px', justifyContent: 'center',
  },
  actions: { display: 'flex', gap: '12px', marginTop: '28px' },
  btnPrimary: {
    flex: 1, padding: '13px 24px',
    background: 'var(--accent)', border: 'none',
    borderRadius: '8px', color: 'var(--bg)',
    fontFamily: 'var(--font-display)',
    fontWeight: 700, fontSize: '14px',
    letterSpacing: '0.5px', cursor: 'pointer',
    transition: 'opacity 0.2s, transform 0.1s',
  },
  btnSecondary: {
    padding: '13px 20px',
    background: 'transparent',
    border: '1.5px solid var(--border)',
    borderRadius: '8px', color: 'var(--text-secondary)',
    fontFamily: 'var(--font-body)',
    fontSize: '14px', cursor: 'pointer',
    transition: 'border-color 0.2s, color 0.2s',
  },
  toast: {
    marginTop: '16px', padding: '12px 16px',
    borderRadius: '8px', fontSize: '13px', fontWeight: 500,
  },
};

const genderOptions = [
  { value: 'male', label: '♂ Male' },
  { value: 'female', label: '♀ Female' },
  { value: 'other', label: '⚥ Other' },
];

export default function CensusModal({ onClose, onSuccess }) {
  const [form, setForm] = useState({
    name: '',
    gender: '',
    birthdate: null,
    is_vaccinated: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const today = new Date();
  const minDate = subYears(today, 100);

  const handleSubmit = async () => {
    setError('');
    if (!form.name.trim()) return setError('Name is required.');
    if (!form.gender) return setError('Please select a gender.');
    if (!form.birthdate) return setError('Please select a birth date.');
    if (form.is_vaccinated === '') return setError('Please select vaccination status.');

    setLoading(true);
    try {
      const payload = {
        name: form.name.trim(),
        gender: form.gender,
        birthdate: format(form.birthdate, 'dd-MM-yyyy'),
        is_vaccinated: form.is_vaccinated === 'true',
      };
      await submitVote(payload);
      setSuccess(true);
      setTimeout(() => {
        onSuccess();
        onClose();
      }, 1200);
    } catch (err) {
      setError(err.response?.data?.error || 'Submission failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.overlay} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <style>{`
        @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(20px) } to { opacity: 1; transform: translateY(0) } }
        .close-btn:hover { color: var(--text-primary) !important; background: var(--border) !important; }
        .radio-label-active { border-color: var(--accent) !important; background: rgba(0,212,255,0.08) !important; color: var(--text-primary) !important; }
        .radio-vacc-active { border-color: var(--success) !important; background: rgba(52,211,153,0.08) !important; color: var(--text-primary) !important; }
        .radio-unvacc-active { border-color: var(--accent-2) !important; background: rgba(255,107,107,0.08) !important; color: var(--text-primary) !important; }
        .input-focus:focus { border-color: var(--accent) !important; box-shadow: 0 0 0 3px rgba(0,212,255,0.12) !important; }
        .btn-primary:hover { opacity: 0.85; }
        .btn-primary:active { transform: scale(0.98); }
        .btn-secondary:hover { border-color: var(--text-secondary) !important; color: var(--text-primary) !important; }
      `}</style>

      <div style={styles.modal}>
        <button className="close-btn" style={styles.closeBtn} onClick={onClose}>✕</button>

        <div style={styles.header}>
          <span style={styles.headerLabel}>New Entry</span>
          <h2 style={styles.title}>Add Census Record</h2>
        </div>

        {/* Name */}
        <div style={styles.fieldGroup}>
          <label style={styles.label}>Full Name</label>
          <input
            className="input-focus"
            style={styles.input}
            type="text"
            placeholder="e.g. Larry Page"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
        </div>

        {/* Gender */}
        <div style={styles.fieldGroup}>
          <label style={styles.label}>Gender</label>
          <div style={styles.radioGroup}>
            {genderOptions.map((opt) => (
              <label
                key={opt.value}
                className={form.gender === opt.value ? 'radio-label-active' : ''}
                style={styles.radioLabel}
              >
                <input
                  type="radio" name="gender" value={opt.value}
                  checked={form.gender === opt.value}
                  onChange={(e) => setForm({ ...form, gender: e.target.value })}
                  style={{ display: 'none' }}
                />
                {opt.label}
              </label>
            ))}
          </div>
        </div>

        {/* Birth Date */}
        <div style={styles.fieldGroup}>
          <label style={styles.label}>Birth Date</label>
          <DatePicker
            selected={form.birthdate}
            onChange={(date) => setForm({ ...form, birthdate: date })}
            dateFormat="dd/MM/yyyy"
            placeholderText="Select birth date"
            maxDate={today}
            minDate={minDate}
            showYearDropdown
            showMonthDropdown
            dropdownMode="select"
            yearDropdownItemNumber={100}
            scrollableYearDropdown
          />
        </div>

        {/* Vaccinated */}
        <div style={styles.fieldGroup}>
          <label style={styles.label}>Vaccination Status</label>
          <div style={styles.radioGroup}>
            <label
              className={form.is_vaccinated === 'true' ? 'radio-vacc-active' : ''}
              style={{ ...styles.radioLabel }}
            >
              <input
                type="radio" name="vaccinated" value="true"
                checked={form.is_vaccinated === 'true'}
                onChange={(e) => setForm({ ...form, is_vaccinated: e.target.value })}
                style={{ display: 'none' }}
              />
              ✓ Vaccinated
            </label>
            <label
              className={form.is_vaccinated === 'false' ? 'radio-unvacc-active' : ''}
              style={{ ...styles.radioLabel }}
            >
              <input
                type="radio" name="vaccinated" value="false"
                checked={form.is_vaccinated === 'false'}
                onChange={(e) => setForm({ ...form, is_vaccinated: e.target.value })}
                style={{ display: 'none' }}
              />
              ✗ Not Vaccinated
            </label>
          </div>
        </div>

        {/* Error / Success */}
        {error && (
          <div style={{ ...styles.toast, background: 'rgba(248,113,113,0.12)', color: 'var(--error)', border: '1px solid rgba(248,113,113,0.3)' }}>
            ⚠ {error}
          </div>
        )}
        {success && (
          <div style={{ ...styles.toast, background: 'rgba(52,211,153,0.12)', color: 'var(--success)', border: '1px solid rgba(52,211,153,0.3)' }}>
            ✓ Record saved successfully!
          </div>
        )}

        <div style={styles.actions}>
          <button
            className="btn-primary"
            style={{ ...styles.btnPrimary, opacity: loading ? 0.6 : 1 }}
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? 'Saving...' : 'Submit Record'}
          </button>
          <button className="btn-secondary" style={styles.btnSecondary} onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
