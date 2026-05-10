import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api/http';

type Actividad = {
  id: string; nombre: string; icon: string; duracion: string;
  precio: number; descripcion: string;
};
 
export function Actividades() {
  const [items, setItems] = useState<Actividad[]>([]);
  const [loading, setLoading] = useState(true);
 
  useEffect(() => {
    api<Actividad[]>('/actividades')
      .then(setItems)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);
 
    function fmtCOP(precio: number): import("react").ReactNode {
        throw new Error('Function not implemented.');
    }

  return (
    <div className="fm-page">
      <div className="fm-head">
        <div className="fm-head-icon-wrap">
          <svg className="fm-head-icon" viewBox="0 0 24 24" fill="none">
            <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z" stroke="currentColor" strokeWidth="1.75" strokeLinejoin="round" />
          </svg>
        </div>
        <div>
          <h1 className="fm-title">Actividades</h1>
          <p className="fm-subtitle">Experiencias y aventuras disponibles en San José Tatacoa.</p>
        </div>
      </div>
 
      {loading && <p style={{ color: 'var(--ds-color-text-secondary)' }}>Cargando actividades…</p>}
 
      {!loading && (
        <div className="catalog-grid">
          {items.map(a => (
            <div key={a.id} className="catalog-card">
              <div className="catalog-card-icon">{a.icon || '⭐'}</div>
              <h3>{a.nombre}</h3>
              <p>{a.descripcion}</p>
              <div className="catalog-card-meta">
                <span className="ds-badge ds-badge--info">⏱ {a.duracion}</span>
                <span className="catalog-card-price">{fmtCOP(a.precio)}/persona</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}