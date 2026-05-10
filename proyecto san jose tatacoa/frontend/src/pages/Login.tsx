import { type FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';

function LogoMark() {
  return (
    <div className="login-logo-mark" aria-hidden>
      <svg viewBox="0 0 40 40" fill="none">
        <rect width="40" height="40" rx="10" fill="#2563eb" />
        <path d="M20 8C14 8 10 13 10 18c0 6 10 14 10 14s10-8 10-14c0-5-4-10-10-10z" stroke="#fff" strokeWidth="1.75" strokeLinejoin="round" />
        <circle cx="20" cy="18" r="3" fill="#fff" />
      </svg>
    </div>
  );
}

function IconMail() {
  return (
    <svg className="login-field-icon" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M4 7h16v10H4V7zm0 0l8 5 8-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IconLock() {
  return (
    <svg className="login-field-icon" viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect x="5" y="11" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <path d="M8 11V8a4 4 0 0 1 8 0v3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function IconArrow() {
  return (
    <svg className="login-btn-arrow" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M5 12h14m-4-5l5 5-5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IconInfo() {
  return (
    <svg className="login-notice-icon" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" />
      <path d="M12 10v5M12 8h.01" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
    </svg>
  );
}

export function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('admin@sanjosetatacoa.com');
  const [password, setPassword] = useState('admin123');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      await login(email.trim(), password);
      navigate('/', { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al iniciar sesión');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="login-page">
      {/* Lado izquierdo — marca */}
      <aside className="login-brand" aria-label="San José Tatacoa">
        <div className="login-brand-inner">
          <div className="login-brand-header">
            <LogoMark />
            <span className="login-brand-name">San José Tatacoa</span>
          </div>

          <div className="login-brand-hero">
            <div className="login-brand-img">
              <img
                src="https://sanjosetatacoa.com/wp-content/uploads/2024/11/l9.jpg"
                alt="Desierto de la Tatacoa"
                loading="lazy"
              />
            </div>
            <h1 className="login-brand-title">
              Portal de{' '}
              <span className="login-brand-title-accent">Reservas</span>
            </h1>
            <p className="login-brand-tagline">
              Gestiona alojamientos, reservas de huéspedes y actividades de la
              Finca Hotel Turística en el Desierto de la Tatacoa.
            </p>
          </div>

          <p className="login-brand-footer">
            🛡️ Acceso seguro · © {new Date().getFullYear()} San José Tatacoa
          </p>
        </div>
      </aside>

      {/* Lado derecho — formulario */}
      <main className="login-main">
        <div className="login-main-inner">
          <h2 className="login-welcome">Bienvenido</h2>
          <p className="login-welcome-sub">Ingresa tus credenciales para continuar.</p>

          <form className="login-form" onSubmit={onSubmit} noValidate>
            <div className="login-field">
              <label className="login-label" htmlFor="login-email">
                Correo corporativo
              </label>
              <div className="login-input-wrap">
                <IconMail />
                <input
                  id="login-email"
                  type="email"
                  autoComplete="username"
                  placeholder="admin@sanjosetatacoa.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="login-field">
              <div className="login-label-row">
                <label className="login-label" htmlFor="login-pw">
                  Contraseña
                </label>
              </div>
              <div className="login-input-wrap">
                <IconLock />
                <input
                  id="login-pw"
                  type="password"
                  autoComplete="current-password"
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="login-notice" role="note">
              <IconInfo />
              <p>
                <strong>Demo:</strong> correo <code>admin@sanjosetatacoa.com</code> ·
                contraseña <code>admin123</code>. Ejecuta primero{' '}
                <code>npm run db:seed</code> en el backend.
              </p>
            </div>

            {error && <p className="login-error" role="alert">{error}</p>}

            <button className="login-submit" type="submit" disabled={busy}>
              {busy ? 'Entrando…' : 'Iniciar sesión'}
              {!busy && <IconArrow />}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}