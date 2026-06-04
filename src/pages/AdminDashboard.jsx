import { useState, useEffect, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { api } from '../lib/api';
import { Badge, Button, Card, Alert, Spinner, fmtDateTime } from '../components/ui';

function StatCard({ label, value, color }) {
  return (
    <div style={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: 10, padding: '14px 16px' }}>
      <div style={{ fontSize: 24, fontWeight: 600, color: color || '#111', lineHeight: 1.1 }}>{value}</div>
      <div style={{ fontSize: 12, color: '#6B7280', marginTop: 4 }}>{label}</div>
    </div>
  );
}

export default function AdminDashboard() {
  const [appts, setAppts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('');
  const [msg, setMsg] = useState(null);
  const nav = useNavigate();

  const load = useCallback(async () => {
    if (!api.isLoggedIn()) { nav('/admin'); return; }
    try {
      const data = await api.getAllAppointments({ search, status: filter });
      setAppts(data);
    } catch (err) {
      if (err.message.includes('401') || err.message.includes('Unauthorized')) {
        api.logout(); nav('/admin');
      }
    } finally {
      setLoading(false);
    }
  }, [search, filter, nav]);

  useEffect(() => { load(); }, [load]);

  function logout() { api.logout(); nav('/admin'); }

  async function confirm(id, prevStatus) {
    await api.updateAppointment(id, { status: 'Confirmed', _prevStatus: prevStatus });
    setMsg('Appointment confirmed. SMS notification sent.'); load();
  }

  async function cancel(id, prevStatus) {
    if (!window.confirm('Cancel this appointment?')) return;
    await api.updateAppointment(id, { status: 'Cancelled', _prevStatus: prevStatus });
    setMsg('Appointment cancelled. SMS notification sent.'); load();
  }

  async function remind(id) {
    await api.sendReminder(id);
    setMsg('Reminder sent via SMS.'); load();
  }

  async function del(id) {
    if (!window.confirm('Delete this appointment permanently?')) return;
    await api.deleteAppointment(id);
    load();
  }

  const total = appts.length;
  const pending = appts.filter(a => a.status === 'Pending').length;
  const confirmed = appts.filter(a => a.status === 'Confirmed').length;
  const cancelled = appts.filter(a => a.status === 'Cancelled').length;

  return (
    <div style={{ minHeight: '100vh', background: '#F9FAFB' }}>
      <div style={{ background: '#fff', borderBottom: '1px solid #E5E7EB', padding: '0 24px', height: 52, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 28, height: 28, background: '#16A34A', borderRadius: 7, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ color: '#fff', fontWeight: 700, fontSize: 13 }}>A</span>
          </div>
          <span style={{ fontWeight: 600, fontSize: 15 }}>ApptDesk Admin</span>
        </div>
        <Button variant="outline" style={{ fontSize: 12, padding: '5px 12px' }} onClick={logout}>Sign out</Button>
      </div>

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '24px 20px' }}>
        <h1 style={{ fontSize: 19, fontWeight: 600, marginBottom: 4 }}>Dashboard</h1>
        <p style={{ fontSize: 13, color: '#6B7280', marginBottom: 20 }}>Manage all appointments and send SMS notifications.</p>

        {msg && <Alert type="success">{msg}</Alert>}

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 20 }}>
          <StatCard label="Total" value={total} />
          <StatCard label="Pending" value={pending} color="#854D0E" />
          <StatCard label="Confirmed" value={confirmed} color="#166534" />
          <StatCard label="Cancelled" value={cancelled} color="#991B1B" />
        </div>

        <div style={{ display: 'flex', gap: 10, marginBottom: 14 }}>
          <input
            value={search} onChange={e => { setSearch(e.target.value); }}
            placeholder="Search by name or phone…"
            style={{ flex: 1, padding: '8px 12px', border: '1px solid #D1D5DB', borderRadius: 8, fontSize: 13, fontFamily: 'inherit', outline: 'none' }}
          />
          <select
            value={filter} onChange={e => setFilter(e.target.value)}
            style={{ padding: '8px 12px', border: '1px solid #D1D5DB', borderRadius: 8, fontSize: 13, fontFamily: 'inherit', outline: 'none', background: '#fff' }}
          >
            <option value="">All statuses</option>
            <option value="Pending">Pending</option>
            <option value="Confirmed">Confirmed</option>
            <option value="Cancelled">Cancelled</option>
          </select>
          <Button onClick={load} variant="outline" style={{ fontSize: 12 }}>Refresh</Button>
        </div>

        <Card>
          {loading ? <Spinner /> : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', tableLayout: 'auto' }}>
                <thead>
                  <tr style={{ background: '#F9FAFB' }}>
                    {['Name', 'Phone', 'Service', 'Date & time', 'Status', 'Reminder', 'Actions'].map(h => (
                      <th key={h} style={{ padding: '9px 14px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: '#6B7280', borderBottom: '1px solid #E5E7EB', whiteSpace: 'nowrap' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {appts.length === 0 && (
                    <tr><td colSpan={7} style={{ padding: 32, textAlign: 'center', color: '#6B7280', fontSize: 13 }}>No appointments found.</td></tr>
                  )}
                  {appts.map(a => (
                    <tr key={a.id} style={{ borderBottom: '1px solid #F3F4F6' }}>
                      <td style={{ padding: '10px 14px', fontWeight: 500, fontSize: 13 }}>{a.customer_name}</td>
                      <td style={{ padding: '10px 14px', fontSize: 12, color: '#6B7280' }}>{a.phone_number}</td>
                      <td style={{ padding: '10px 14px', fontSize: 12 }}>{a.service}</td>
                      <td style={{ padding: '10px 14px', fontSize: 12, color: '#374151', whiteSpace: 'nowrap' }}>{fmtDateTime(a.appointment_time)}</td>
                      <td style={{ padding: '10px 14px' }}><Badge status={a.status} /></td>
                      <td style={{ padding: '10px 14px', fontSize: 12, color: a.reminder_sent ? '#166534' : '#6B7280' }}>
                        {a.reminder_sent ? 'Sent' : 'Not sent'}
                      </td>
                      <td style={{ padding: '10px 14px' }}>
                        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                          <Link to={`/admin/appointments/${a.id}`}>
                            <button style={{ padding: '4px 9px', fontSize: 12, border: '1px solid #D1D5DB', borderRadius: 6, cursor: 'pointer', background: 'transparent', fontFamily: 'inherit' }}>Edit</button>
                          </Link>
                          {a.status === 'Pending' && (
                            <button onClick={() => confirm(a.id, a.status)} style={{ padding: '4px 9px', fontSize: 12, background: '#16A34A', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer', fontFamily: 'inherit' }}>Confirm</button>
                          )}
                          {a.status !== 'Cancelled' && (
                            <button onClick={() => cancel(a.id, a.status)} style={{ padding: '4px 9px', fontSize: 12, background: '#DC2626', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer', fontFamily: 'inherit' }}>Cancel</button>
                          )}
                          <button onClick={() => remind(a.id)} title="Send SMS reminder" style={{ padding: '4px 9px', fontSize: 12, border: '1px solid #D1D5DB', borderRadius: 6, cursor: 'pointer', background: 'transparent', fontFamily: 'inherit', color: '#16A34A' }}>
                            Remind
                          </button>
                          <button onClick={() => del(a.id)} style={{ padding: '4px 9px', fontSize: 12, border: '1px solid #FCA5A5', borderRadius: 6, cursor: 'pointer', background: 'transparent', fontFamily: 'inherit', color: '#DC2626' }}>
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
