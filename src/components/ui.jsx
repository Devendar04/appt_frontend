export function Badge({ status }) {
  const map = {
    Confirmed: { bg: '#DCFCE7', color: '#166534' },
    Pending:   { bg: '#FEF9C3', color: '#854D0E' },
    Cancelled: { bg: '#FEE2E2', color: '#991B1B' },
  };
  const s = map[status] || map.Pending;
  return (
    <span style={{
      background: s.bg, color: s.color,
      padding: '2px 9px', borderRadius: 20,
      fontSize: 12, fontWeight: 500, display: 'inline-block',
    }}>
      {status}
    </span>
  );
}

export function Input({ label, ...props }) {
  return (
    <div style={{ marginBottom: 14 }}>
      {label && (
        <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: '#6B7280', marginBottom: 5 }}>
          {label}
        </label>
      )}
      <input
        style={{
          width: '100%', padding: '8px 11px', border: '1px solid #D1D5DB',
          borderRadius: 8, fontSize: 13, fontFamily: 'inherit', outline: 'none',
          background: '#fff', color: '#111',
        }}
        {...props}
      />
    </div>
  );
}

export function Select({ label, children, ...props }) {
  return (
    <div style={{ marginBottom: 14 }}>
      {label && (
        <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: '#6B7280', marginBottom: 5 }}>
          {label}
        </label>
      )}
      <select
        style={{
          width: '100%', padding: '8px 11px', border: '1px solid #D1D5DB',
          borderRadius: 8, fontSize: 13, fontFamily: 'inherit', outline: 'none',
          background: '#fff', color: '#111',
        }}
        {...props}
      >
        {children}
      </select>
    </div>
  );
}

export function Button({ variant = 'primary', children, style, ...props }) {
  const styles = {
    primary: { background: '#16A34A', color: '#fff', border: 'none' },
    outline:  { background: 'transparent', color: '#374151', border: '1px solid #D1D5DB' },
    danger:   { background: '#DC2626', color: '#fff', border: 'none' },
    ghost:    { background: 'transparent', color: '#374151', border: '1px solid #E5E7EB' },
  };
  return (
    <button
      style={{
        padding: '8px 16px', borderRadius: 8, fontSize: 13, fontFamily: 'inherit',
        cursor: 'pointer', fontWeight: 500, ...styles[variant], ...style,
      }}
      {...props}
    >
      {children}
    </button>
  );
}

export function Card({ children, style }) {
  return (
    <div style={{
      background: '#fff', border: '1px solid #E5E7EB',
      borderRadius: 12, overflow: 'hidden', ...style,
    }}>
      {children}
    </div>
  );
}

export function Alert({ type = 'info', children }) {
  const map = {
    success: { bg: '#DCFCE7', color: '#166534' },
    error:   { bg: '#FEE2E2', color: '#991B1B' },
    info:    { bg: '#DBEAFE', color: '#1E40AF' },
  };
  const s = map[type];
  return (
    <div style={{
      background: s.bg, color: s.color, padding: '10px 14px',
      borderRadius: 8, fontSize: 13, marginBottom: 16,
    }}>
      {children}
    </div>
  );
}

export function Spinner() {
  return (
    <div style={{ textAlign: 'center', padding: 32, color: '#6B7280', fontSize: 13 }}>
      Loading…
    </div>
  );
}

export function fmtDateTime(iso) {
  if (!iso) return '—';
  return new Date(iso).toLocaleString('en-IN', {
    day: 'numeric', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit', hour12: true,
    timeZone: 'Asia/Kolkata',
  });
}
