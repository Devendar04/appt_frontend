const BASE = import.meta.env.VITE_API_URL || '';

function authHeader() {
  const creds = sessionStorage.getItem('admin_creds');
  if (!creds) return {};
  return { Authorization: `Basic ${creds}` };
}

async function request(path, options = {}) {
  const res = await fetch(`${BASE}/api${path}`, {
    headers: { 'Content-Type': 'application/json', ...authHeader(), ...options.headers },
    ...options,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Request failed');
  return data;
}

export const api = {
  // Customer
  bookAppointment: (body) => request('/appointments', { method: 'POST', body: JSON.stringify(body) }),
  trackAppointments: (phone) => request(`/appointments/track?phone=${encodeURIComponent(phone)}`),
  cancelMyAppointment: (id, phone_number) =>
    request(`/appointments/${id}/cancel`, { method: 'PATCH', body: JSON.stringify({ phone_number }) }),

  // Admin
  login: (username, password) => {
    const creds = btoa(`${username}:${password}`);
    sessionStorage.setItem('admin_creds', creds);
    return request('/auth/login', { method: 'POST' });
  },
  logout: () => sessionStorage.removeItem('admin_creds'),
  isLoggedIn: () => !!sessionStorage.getItem('admin_creds'),

  getAllAppointments: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return request(`/appointments${qs ? '?' + qs : ''}`);
  },
  updateAppointment: (id, body) =>
    request(`/appointments/${id}`, { method: 'PATCH', body: JSON.stringify(body) }),
  sendReminder: (id) => request(`/appointments/${id}/reminder`, { method: 'POST' }),
  deleteAppointment: (id) => request(`/appointments/${id}`, { method: 'DELETE' }),
};
