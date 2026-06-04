import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../lib/api';
import { Input, Button, Card, Alert } from '../components/ui';

export default function AdminLoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const nav = useNavigate();

  async function submit(e) {
    e.preventDefault();
    setLoading(true); setError(null);
    try {
      await api.login(username, password);
      nav('/admin/dashboard');
    } catch {
      api.logout();
      setError('Invalid username or password.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: '#F9FAFB', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
      <div style={{ width: '100%', maxWidth: 380 }}>
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{ width: 40, height: 40, background: '#16A34A', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
            <span style={{ color: '#fff', fontWeight: 700, fontSize: 18 }}>A</span>
          </div>
          <h1 style={{ fontSize: 20, fontWeight: 600, marginBottom: 4 }}>Admin login</h1>
          <p style={{ fontSize: 13, color: '#6B7280' }}>Sign in to the appointment dashboard</p>
        </div>

        {error && <Alert type="error">{error}</Alert>}

        <Card>
          <div style={{ padding: '20px 22px' }}>
            <form onSubmit={submit}>
              <Input label="Username" value={username} onChange={e => setUsername(e.target.value)} autoComplete="username" />
              <Input label="Password" value={password} onChange={e => setPassword(e.target.value)} type="password" autoComplete="current-password" />
              <Button type="submit" style={{ width: '100%', padding: 10 }} disabled={loading}>
                {loading ? 'Signing in…' : 'Sign in'}
              </Button>
            </form>
          </div>
        </Card>
      </div>
    </div>
  );
}
