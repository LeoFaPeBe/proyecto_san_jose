import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api/http';
 
type Alojamiento = {
  id: string; nombre: string; icon: string; capacidad: string;
  precio: number; descripcion: string; disponible: boolean;
};
 
function fmtCOP(n: number) {
  return `$${n.toLocaleString('es-CO')}`;
}
 
export function Alojamientos() {
  const [items, setItems] = useState<Alojamiento[]>([]);
  const [loading, setLoading] = useState(true);
 
  useEffect(() => {
    api<Alojamiento[]>('/alojamientos')
      .then(setItems)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);
 
  return (
    <div className="fm-page">
      <div className="fm-head fm-head--between">
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
          <div className="fm-head-icon-wrap">
            <svg className="fm-head-icon" viewBox="0 0 24 24" fill="none">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" stroke="currentColor" strokeWidth="1.75" strokeLinejoin="round" />
              <path d="M9 22V12h6v10" stroke="currentColor" strokeWidth="1.75" strokeLinejoin="round" />
            </svg>
          </div>
          <div>
            <h1 className="fm-title">Alojamientos</h1>
            <p className="fm-subtitle">Catálogo de opciones de hospedaje disponibles en la finca hotel.</p>
          </div>
        </div>
        <Link to="/reservas/nueva" className="ds-btn ds-btn--gradient">
          + Reservar
        </Link>
      </div>
 
      {loading && <p style={{ color: 'var(--ds-color-text-secondary)' }}>Cargando alojamientos…</p>}
 
      {!loading && (
        <div className="catalog-grid">
          {items.map(a => (
            <div key={a.id} className="catalog-card">
              <div className="catalog-card-icon">{a.icon || '🏡'}</div>
              <h3>{a.nombre}</h3>
              <p>{a.descripcion}</p>
              <div className="catalog-card-meta">
                <span className={`ds-badge ds-badge--${a.disponible ? 'success' : 'neutral'}`}>
                  {a.disponible ? 'Disponible' : 'No disponible'}
                </span>
                <span className="ds-badge ds-badge--info">{a.capacidad}</span>
                <span className="catalog-card-price">{fmtCOP(a.precio)}/noche</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}