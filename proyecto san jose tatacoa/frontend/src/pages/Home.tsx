import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api/http';
import { useAuth } from '../auth/AuthContext';

type Stats = { total: number; confirmadas: number; pendientes: number; canceladas: number };

function IcoChevron() {
  return (
    <svg className="home-dash-tile-chevron" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

type TileProps = { to: string; title: string; sub: string; icon: React.ReactNode };
function DashTile({ to, title, sub, icon }: TileProps) {
  return (
    <Link to={to} className="home-dash-tile">
      <span className="home-dash-tile-icon-wrap" aria-hidden>{icon}</span>
      <span className="home-dash-tile-body">
        <span className="home-dash-tile-title">{title}</span>
        <span className="home-dash-tile-sub">{sub}</span>
      </span>
      <IcoChevron />
    </Link>
  );
}

type StatCardProps = { label: string; value: string | number; sub: string; iconClass: string; icon: React.ReactNode };
function StatCard({ label, value, sub, iconClass, icon }: StatCardProps) {
  return (
    <div className="stat-card">
      <div className={`stat-card-icon ${iconClass}`}>{icon}</div>
      <span className="stat-card-label">{label}</span>
      <span className="stat-card-value">{value}</span>
      <span className="stat-card-sub">{sub}</span>
    </div>
  );
}

export function Home() {
  const { user } = useAuth();
  const [stats, setStats] = useState<Stats | null>(null);

  const loadStats = useCallback(async () => {
    try {
      const s = await api<Stats>('/reservas/stats');
      setStats(s);
    } catch {}
  }, []);

  useEffect(() => { void loadStats(); }, [loadStats]);

  const nombre = user?.nombre?.split(' ')[0] ?? 'Administrador';

  return (
    <div className="home-dash">
      {/* Hero banner */}
      <div className="hero-banner">
        <img
          src="https://sanjosetatacoa.com/wp-content/uploads/2024/11/l9.jpg"
          alt="Desierto de la Tatacoa"
          loading="lazy"
        />
        <div className="hero-banner-body">
          <p className="hero-banner-tag">Naturaleza Pura · Descanso Ideal</p>
          <h1 className="hero-banner-title">
            Hola, {nombre} 👋<br />Bienvenido al portal
          </h1>
          <p className="hero-banner-sub">
            Gestiona reservas, alojamientos y actividades de la Finca Hotel Turística
            en el Desierto de la Tatacoa.
          </p>
          <div className="hero-banner-actions">
            <Link to="/reservas/nueva" className="ds-btn ds-btn--gradient">
              + Nueva reserva
            </Link>
            <Link to="/reservas" className="ds-btn ds-btn--ghost">
              Ver todas las reservas
            </Link>
          </div>
        </div>
      </div>

      {/* KPI stats */}
      {stats && (
        <div className="stat-grid">
          <StatCard
            label="Total reservas"
            value={stats.total}
            sub="Registradas en el sistema"
            iconClass="stat-card-icon--blue"
            icon={<svg viewBox="0 0 24 24" fill="none"><rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="1.75" /><path d="M3 9h18M8 2v4M16 2v4" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" /></svg>}
          />
          <StatCard
            label="Confirmadas"
            value={stats.confirmadas}
            sub="Estadías aseguradas"
            iconClass="stat-card-icon--green"
            icon={<svg viewBox="0 0 24 24" fill="none"><path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>}
          />
          <StatCard
            label="Pendientes"
            value={stats.pendientes}
            sub="Por confirmar"
            iconClass="stat-card-icon--amber"
            icon={<svg viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.75" /><path d="M12 8v4M12 16h.01" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" /></svg>}
          />
          <StatCard
            label="Canceladas"
            value={stats.canceladas}
            sub="En este período"
            iconClass="stat-card-icon--red"
            icon={<svg viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.75" /><path d="M15 9l-6 6M9 9l6 6" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" /></svg>}
          />
        </div>
      )}

      {/* Accesos rápidos */}
      <section aria-labelledby="accesos-title">
        <h2 id="accesos-title" className="home-dash-section-title">Accesos rápidos</h2>
        <div className="home-dash-tiles">
          <DashTile
            to="/reservas"
            title="Reservas"
            sub="Ver y gestionar todas las reservas"
            icon={<svg className="home-dash-tile-svg" viewBox="0 0 24 24" fill="none"><rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="1.75" /><path d="M3 9h18M8 2v4M16 2v4" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" /></svg>}
          />
          <DashTile
            to="/reservas/nueva"
            title="Nueva reserva"
            sub="Registrar nueva estadía de huésped"
            icon={<svg className="home-dash-tile-svg" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.75" /><path d="M12 8v8M8 12h8" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" /></svg>}
          />
          <DashTile
            to="/alojamientos"
            title="Alojamientos"
            sub="Cabañas, glamping, cúpulas y más"
            icon={<svg className="home-dash-tile-svg" viewBox="0 0 24 24" fill="none"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" stroke="currentColor" strokeWidth="1.75" strokeLinejoin="round" /><path d="M9 22V12h6v10" stroke="currentColor" strokeWidth="1.75" strokeLinejoin="round" /></svg>}
          />
          <DashTile
            to="/actividades"
            title="Actividades"
            sub="Estrellas, cabalgatas, caminatas…"
            icon={<svg className="home-dash-tile-svg" viewBox="0 0 24 24" fill="none"><path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z" stroke="currentColor" strokeWidth="1.75" strokeLinejoin="round" /></svg>}
          />
          <DashTile
            to="/galeria"
            title="Galería"
            sub="Imágenes del desierto y la finca"
            icon={<svg className="home-dash-tile-svg" viewBox="0 0 24 24" fill="none"><rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="1.75" /><circle cx="8.5" cy="8.5" r="1.5" stroke="currentColor" strokeWidth="1.5" /><path d="M21 15l-5-5L5 21" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" /></svg>}
          />
          <DashTile
            to="/asistente"
            title="Asistente IA"
            sub="Consulta sobre servicios con IA"
            icon={<svg className="home-dash-tile-svg" viewBox="0 0 24 24" fill="none"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" stroke="currentColor" strokeWidth="1.75" strokeLinejoin="round" /></svg>}
          />
        </div>
      </section>
    </div>
  );
}