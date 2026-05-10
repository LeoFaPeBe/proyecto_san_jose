import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';

const navClass = ({ isActive }: { isActive: boolean }) => `app-sidebar-link${isActive ? ' active' : ''}`;

export function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="app-shell">
      <aside className="app-sidebar">
        <Link to="/" className="app-sidebar-brand">
          <div className="app-sidebar-logo-mark">
            <svg viewBox="0 0 40 40" fill="none"><rect width="40" height="40" rx="10" fill="#2563eb"/><path d="M20 8C14 8 10 13 10 18c0 6 10 14 10 14s10-8 10-14c0-5-4-10-10-10z" stroke="#fff" strokeWidth="1.75" strokeLinejoin="round"/><circle cx="20" cy="18" r="3" fill="#fff"/></svg>
          </div>
          <div>
            <span className="app-sidebar-brand-text">San José Tatacoa</span>
            <span className="app-sidebar-brand-sub">Portal de Reservas</span>
          </div>
        </Link>
        <nav className="app-sidebar-nav">
          <NavLink to="/" className={navClass} end><IcoHome />Inicio</NavLink>
          <NavLink to="/reservas" className={navClass}><IcoCal />Reservas</NavLink>
          <NavLink to="/reservas/nueva" className={navClass}><IcoPlus />Nueva reserva</NavLink>
          <NavLink to="/alojamientos" className={navClass}><IcoHome />Alojamientos</NavLink>
          <NavLink to="/actividades" className={navClass}><IcoStar />Actividades</NavLink>
          <NavLink to="/galeria" className={navClass}><IcoImg />Galería</NavLink>
          <NavLink to="/asistente" className={navClass}><IcoChat />Asistente IA</NavLink>
        </nav>
        <div className="app-sidebar-footer">
          <button className="app-sidebar-link" onClick={() => { logout(); navigate('/login'); }}>
            <IcoOut />Cerrar sesión
          </button>
        </div>
      </aside>
      <div className="app-shell-body">
        <main className="app-main">
          <div className="app-main-toolbar">
            <div className="toolbar-user-chip">
              <div className="toolbar-avatar">{user?.nombre?.[0]?.toUpperCase()}</div>
              <span>{user?.nombre}</span>
            </div>
          </div>
          <Outlet />
        </main>
      </div>
    </div>
  );
}


function IcoHome() { return <svg className="app-sidebar-icon" viewBox="0 0 24 24" fill="none"><path d="M3 10.5L12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1v-9.5z" stroke="currentColor" strokeWidth="1.75" strokeLinejoin="round"/></svg>; }
function IcoCal() { return <svg className="app-sidebar-icon" viewBox="0 0 24 24" fill="none"><rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="1.75"/><path d="M3 9h18M8 2v4M16 2v4" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round"/></svg>; }
function IcoPlus() { return <svg className="app-sidebar-icon" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.75"/><path d="M12 8v8M8 12h8" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round"/></svg>; }
function IcoStar() { return <svg className="app-sidebar-icon" viewBox="0 0 24 24" fill="none"><path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z" stroke="currentColor" strokeWidth="1.75" strokeLinejoin="round"/></svg>; }
function IcoImg() { return <svg className="app-sidebar-icon" viewBox="0 0 24 24" fill="none"><rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="1.75"/><circle cx="8.5" cy="8.5" r="1.5" stroke="currentColor" strokeWidth="1.5"/><path d="M21 15l-5-5L5 21" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/></svg>; }
function IcoChat() { return <svg className="app-sidebar-icon" viewBox="0 0 24 24" fill="none"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" stroke="currentColor" strokeWidth="1.75" strokeLinejoin="round"/></svg>; }
function IcoOut() { return <svg className="app-sidebar-icon" viewBox="0 0 24 24" fill="none"><path d="M10 17H6a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h4" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round"/><path d="M14 15l4-3-4-3M18 12H9" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/></svg>; }