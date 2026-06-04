import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import BookPage from './pages/BookPage';
import TrackPage from './pages/TrackPage';
import AdminLoginPage from './pages/AdminLoginPage';
import AdminDashboard from './pages/AdminDashboard';
import AppointmentDetailPage from './pages/AppointmentDetailPage';
import { api } from './lib/api';

function RequireAuth({ children }) {
  return api.isLoggedIn() ? children : <Navigate to="/admin" replace />;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<BookPage />} />
        <Route path="/track" element={<TrackPage />} />
        <Route path="/admin" element={<AdminLoginPage />} />
        <Route path="/admin/dashboard" element={<RequireAuth><AdminDashboard /></RequireAuth>} />
        <Route path="/admin/appointments/:id" element={<RequireAuth><AppointmentDetailPage /></RequireAuth>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
