import { useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../lib/api';
import { Badge, Button, Card, Alert, fmtDateTime } from '../components/ui';

export default function TrackPage() {
  const [phone, setPhone] = useState('');
  const [appts, setAppts] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [msg, setMsg] = useState(null);

  async function lookup() {
    if (!phone.trim()) return;
    setLoading(true); setError(null); setMsg(null);
    try {
      const data = await api.trackAppointments(phone.trim());
      setAppts(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function cancel(id) {
    if (!confirm('Cancel this appointment?')) return;
    try {
      await api.cancelMyAppointment(id, phone);
      setMsg('Appointment cancelled. A WhatsApp notification has been sent.');
      lookup();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: '#F9FAFB', padding: '40px 16px' }}>
      <div style={{ maxWidth: 600, margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
          <div style={{ width: 32, height: 32, background: '#16A34A', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ color: '#fff', fontWeight: 700, fontSize: 14 }}>A</span>
          </div>
          <span style={{ fontWeight: 600, fontSize: 16 }}>ApptDesk</span>
        </div>
        <h1 style={{ fontSize: 22, fontWeight: 600, marginBottom: 4 }}>My appointments</h1>
        <p style={{ fontSize: 14, color: '#6B7280', marginBottom: 24 }}>Enter your WhatsApp number to view your bookings.</p>

        {error && <Alert type="error">{error}</Alert>}
        {msg && <Alert type="success">{msg}</Alert>}

        <Card style={{ marginBottom: 20 }}>
          <div style={{ padding: '16px 20px', display: 'flex', gap: 10 }}>
            <input
              value={phone}
              onChange={e => setPhone(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && lookup()}
              placeholder="Your WhatsApp number"
              type="tel"
              style={{ flex: 1, padding: '8px 11px', border: '1px solid #D1D5DB', borderRadius: 8, fontSize: 13, fontFamily: 'inherit', outline: 'none' }}
            />
            <Button onClick={lookup} disabled={loading}>{loading ? 'Searching…' : 'Look up'}</Button>
          </div>
        </Card>

        {appts !== null && (
          appts.length === 0
            ? <Alert type="info">No appointments found for this number.</Alert>
            : appts.map(a => (
              <Card key={a.id} style={{ marginBottom: 12 }}>
                <div style={{ padding: '14px 18px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                    <div>
                      <div style={{ fontWeight: 500, fontSize: 15, marginBottom: 2 }}>{a.customer_name}</div>
                      <div style={{ fontSize: 13, color: '#6B7280' }}>{a.service}</div>
                    </div>
                    <Badge status={a.status} />
                  </div>
                  <div style={{ fontSize: 13, color: '#374151', marginBottom: 12 }}>
                    📅 {fmtDateTime(a.appointment_time)}
                  </div>
                  {a.status !== 'Cancelled' && (
                    <Button variant="outline" style={{ fontSize: 12, padding: '5px 12px', color: '#DC2626', borderColor: '#FCA5A5' }} onClick={() => cancel(a.id)}>
                      Cancel appointment
                    </Button>
                  )}
                </div>
              </Card>
            ))
        )}

        <p style={{ textAlign: 'center', marginTop: 20, fontSize: 13, color: '#6B7280' }}>
          <Link to="/" style={{ color: '#16A34A', fontWeight: 500 }}>Book a new appointment</Link>
        </p>
      </div>
    </div>
  );
}
