import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { api } from '../lib/api';
import { Input, Select, Button, Card, Alert, Badge, fmtDateTime } from '../components/ui';

export default function AppointmentDetailPage() {
  const { id } = useParams();
  const nav = useNavigate();
  const [appt, setAppt] = useState(null);
  const [form, setForm] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!api.isLoggedIn()) { nav('/admin'); return; }
    api.getAllAppointments().then(data => {
      const found = data.find(a => String(a.id) === String(id));
      if (!found) { nav('/admin/dashboard'); return; }
      setAppt(found);
      const dt = new Date(found.appointment_time);
      const local = new Date(dt.getTime() - dt.getTimezoneOffset() * 60000)
        .toISOString().slice(0, 16);
      setForm({
        customer_name: found.customer_name,
        phone_number: found.phone_number,
        service: found.service,
        appointment_time: local,
        status: found.status,
      });
    }).catch(() => nav('/admin/dashboard'))
      .finally(() => setLoading(false));
  }, [id, nav]);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  async function save(e) {
    e.preventDefault();
    setSaving(true); setMsg(null); setError(null);
    try {
      const updated = await api.updateAppointment(id, {
        ...form,
        appointment_time: new Date(form.appointment_time).toISOString(),
        _prevStatus: appt.status,
      });
      setAppt(updated);
      setMsg('Appointment updated.' + (updated.status !== appt.status ? ' WhatsApp notification sent to customer.' : ''));
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function sendReminder() {
    try {
      await api.sendReminder(id);
      setMsg('Reminder sent via WhatsApp.');
    } catch (err) {
      setError(err.message);
    }
  }

  if (loading) return <div style={{ padding: 40, textAlign: 'center', color: '#6B7280' }}>Loading…</div>;

  return (
    <div style={{ minHeight: '100vh', background: '#F9FAFB' }}>
      <div style={{ background: '#fff', borderBottom: '1px solid #E5E7EB', padding: '0 24px', height: 52, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 28, height: 28, background: '#16A34A', borderRadius: 7, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ color: '#fff', fontWeight: 700, fontSize: 13 }}>A</span>
          </div>
          <span style={{ fontWeight: 600, fontSize: 15 }}>ApptDesk Admin</span>
        </div>
        <Link to="/admin/dashboard">
          <Button variant="outline" style={{ fontSize: 12, padding: '5px 12px' }}>← Back to dashboard</Button>
        </Link>
      </div>

      <div style={{ maxWidth: 560, margin: '0 auto', padding: '28px 20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
          <div>
            <h1 style={{ fontSize: 19, fontWeight: 600 }}>{appt?.customer_name}</h1>
            <div style={{ fontSize: 13, color: '#6B7280', marginTop: 2 }}>
              {appt?.phone_number} · Booked {fmtDateTime(appt?.created_at)}
            </div>
          </div>
          <div style={{ marginLeft: 'auto' }}><Badge status={appt?.status} /></div>
        </div>

        {msg && <Alert type="success">{msg}</Alert>}
        {error && <Alert type="error">{error}</Alert>}

        <Card style={{ marginBottom: 16 }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid #F3F4F6', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontWeight: 500, fontSize: 13 }}>Edit appointment</span>
            <Button variant="outline" style={{ fontSize: 12, padding: '4px 12px', color: '#16A34A', borderColor: '#A7F3D0' }} onClick={sendReminder}>
              Send WhatsApp reminder
            </Button>
          </div>
          <div style={{ padding: '18px 20px' }}>
            <form onSubmit={save}>
              <Input label="Customer name" value={form.customer_name || ''} onChange={e => set('customer_name', e.target.value)} />
              <Input label="Phone number" value={form.phone_number || ''} onChange={e => set('phone_number', e.target.value)} type="tel" />
              <Select label="Service" value={form.service || ''} onChange={e => set('service', e.target.value)}>
                <option>General consultation</option>
                <option>Follow-up visit</option>
                <option>Lab test</option>
                <option>Dental checkup</option>
                <option>Eye examination</option>
              </Select>
              <Input label="Appointment date & time" value={form.appointment_time || ''} onChange={e => set('appointment_time', e.target.value)} type="datetime-local" />
              <Select label="Status" value={form.status || 'Pending'} onChange={e => set('status', e.target.value)}>
                <option>Pending</option>
                <option>Confirmed</option>
                <option>Cancelled</option>
              </Select>
              <div style={{ display: 'flex', gap: 10 }}>
                <Button type="submit" style={{ flex: 1, padding: 10 }} disabled={saving}>
                  {saving ? 'Saving…' : 'Save changes'}
                </Button>
                <Link to="/admin/dashboard" style={{ flex: 1 }}>
                  <Button variant="outline" style={{ width: '100%', padding: 10 }} type="button">Discard</Button>
                </Link>
              </div>
            </form>
          </div>
        </Card>

        <Card>
          <div style={{ padding: '14px 20px', borderBottom: '1px solid #F3F4F6', fontWeight: 500, fontSize: 13 }}>Appointment details</div>
          <div style={{ padding: '14px 20px' }}>
            {[
              ['Service', appt?.service],
              ['Scheduled', fmtDateTime(appt?.appointment_time)],
              ['Created', fmtDateTime(appt?.created_at)],
              ['Reminder sent', appt?.reminder_sent ? 'Yes' : 'No'],
            ].map(([k, v]) => (
              <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid #F9FAFB', fontSize: 13 }}>
                <span style={{ color: '#6B7280' }}>{k}</span>
                <span style={{ fontWeight: 500 }}>{v}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
