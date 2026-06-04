import { useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../lib/api';
import { Input, Select, Button, Card, Alert } from '../components/ui';

export default function BookPage() {
  const [form, setForm] = useState({
    customer_name: '', phone_number: '', appointment_time: '', service: 'General consultation',
  });
  const [status, setStatus] = useState(null); // { type, msg }
  const [loading, setLoading] = useState(false);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  async function submit(e) {
    e.preventDefault();
    if (!form.customer_name || !form.phone_number || !form.appointment_time) {
      setStatus({ type: 'error', msg: 'Please fill in all required fields.' });
      return;
    }
    setLoading(true);
    try {
      await api.bookAppointment(form);
      setStatus({ type: 'success', msg: `Appointment booked! A SMS confirmation has been sent to ${form.phone_number}.` });
      setForm({ customer_name: '', phone_number: '', appointment_time: '', service: 'General consultation' });
    } catch (err) {
      setStatus({ type: 'error', msg: err.message });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: '#F9FAFB', padding: '40px 16px' }}>
      <div style={{ maxWidth: 480, margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
          <div style={{ width: 32, height: 32, background: '#16A34A', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ color: '#fff', fontWeight: 700, fontSize: 14 }}>A</span>
          </div>
          <span style={{ fontWeight: 600, fontSize: 16 }}>ApptDesk</span>
        </div>
        <h1 style={{ fontSize: 22, fontWeight: 600, marginBottom: 4 }}>Book an appointment</h1>
        <p style={{ fontSize: 14, color: '#6B7280', marginBottom: 24 }}>
          Fill in the form below — you'll receive a SMS confirmation instantly.
        </p>

        {status && <Alert type={status.type}>{status.msg}</Alert>}

        <Card>
          <div style={{ padding: '18px 20px' }}>
            <form onSubmit={submit}>
              <Input label="Full name *" value={form.customer_name} onChange={e => set('customer_name', e.target.value)} placeholder="e.g. Aisha Malik" />
              <Input label="phone number *" value={form.phone_number} onChange={e => set('phone_number', e.target.value)} placeholder="+91 98000 00000" type="tel" />
              <Select label="Service" value={form.service} onChange={e => set('service', e.target.value)}>
                <option>General consultation</option>
                <option>Follow-up visit</option>
                <option>Lab test</option>
                <option>Dental checkup</option>
                <option>Eye examination</option>
              </Select>
              <Input label="Appointment date & time *" value={form.appointment_time} onChange={e => set('appointment_time', e.target.value)} type="datetime-local" />
              <Button type="submit" style={{ width: '100%', padding: 10 }} disabled={loading}>
                {loading ? 'Booking…' : 'Confirm booking'}
              </Button>
            </form>
          </div>
        </Card>

        <p style={{ textAlign: 'center', marginTop: 20, fontSize: 13, color: '#6B7280' }}>
          Already booked?{' '}
          <Link to="/track" style={{ color: '#16A34A', fontWeight: 500 }}>View my appointments</Link>
        </p>
      </div>
    </div>
  );
}
