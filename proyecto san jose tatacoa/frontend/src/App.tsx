import { Navigate, Route, Routes } from 'react-router-dom';
import { useAuth } from './auth/AuthContext';
import { Layout } from './components/Layout';
import { Login } from './pages/Login';
import { Home } from './pages/Home';
import { Reservas } from './pages/Reservas';
import { NuevaReserva } from './pages/NuevaReserva';
import { Alojamientos } from './pages/Alojamientos';
import { Actividades } from './pages/Actividades';
import { Galeria } from './pages/Galeria';
import Asistente  from './pages/Asistente';
import { JSX } from 'react/jsx-runtime';

function RequireAuth({ children }: { children: JSX.Element }) {
  const { user, bootstrapped } = useAuth();
  if (!bootstrapped) return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', fontFamily: 'Inter,sans-serif', color: '#64748b' }}>Cargando…</div>;
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route element={<RequireAuth><Layout /></RequireAuth>}>
        <Route path="/" element={<Home />} />
        <Route path="/reservas" element={<Reservas />} />
        <Route path="/reservas/nueva" element={<NuevaReserva />} />
        <Route path="/alojamientos" element={<Alojamientos />} />
        <Route path="/actividades" element={<Actividades />} />
        <Route path="/galeria" element={<Galeria />} />
        <Route path="/asistente" element={<Asistente />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}