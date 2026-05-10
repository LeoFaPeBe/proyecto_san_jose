import { type FormEvent, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api/http';

type Alojamiento = {
    icon: string; id: string; nombre: string; precio: number; capacidad: string; disponible: boolean 
};
type Actividad   = { id: string; nombre: string; precio: number; duracion: string };

function calcNights(llegada: string, salida: string): number {
  if (!llegada || !salida) return 0;
  const ms = new Date(salida).getTime() - new Date(llegada).getTime();
  return Math.max(0, Math.ceil(ms / 86400000));
}

function fmtCOP(n: number) {
  return `$${n.toLocaleString('es-CO')}`;
}

export function NuevaReserva() {
  const navigate = useNavigate();
  const [alojamientos, setAlojamientos] = useState<Alojamiento[]>([]);
  const [actividades, setActividades]   = useState<Actividad[]>([]);

  const [huesped, setHuesped]       = useState('');
  const [email, setEmail]           = useState('');
  const [telefono, setTelefono]     = useState('');
  const [alojId, setAlojId]         = useState('');
  const [llegada, setLlegada]       = useState('');
  const [salida, setSalida]         = useState('');
  const [personas, setPersonas]     = useState(2);
  const [actSel, setActSel]         = useState<string[]>([]);
  const [notas, setNotas]           = useState('');

  const [busy, setBusy]     = useState(false);
  const [error, setError]   = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    api<Alojamiento[]>('/alojamientos').then(setAlojamientos).catch(() => {});
    api<Actividad[]>('/actividades').then(setActividades).catch(() => {});
    // Fecha mínima hoy
    const today = new Date().toISOString().slice(0, 10);
    setLlegada(today);
    const tmrw = new Date(Date.now() + 86400000).toISOString().slice(0, 10);
    setSalida(tmrw);
  }, []);

  const selectedAloj = alojamientos.find(a => a.id === alojId || a.nombre === alojId);
  const nights = calcNights(llegada, salida);
  const total  = selectedAloj ? selectedAloj.precio * nights : 0;

  function toggleAct(nombre: string) {
    setActSel(prev => prev.includes(nombre) ? prev.filter(a => a !== nombre) : [...prev, nombre]);
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null); setSuccess(null);

    if (!huesped.trim()) return setError('El nombre del huésped es requerido.');
    if (!email.trim())   return setError('El correo es requerido.');
    if (!alojId)         return setError('Selecciona un alojamiento.');
    if (!llegada || !salida) return setError('Las fechas son requeridas.');
    if (salida <= llegada)   return setError('La fecha de salida debe ser posterior a la de llegada.');

    setBusy(true);
    try {
      const res = await api<{ codigo: string; total: string }>('/reservas', {
        method: 'POST',
        body: JSON.stringify({
          huesped: huesped.trim(),
          email: email.trim(),
          telefono: telefono.trim(),
          alojamiento: selectedAloj?.nombre ?? alojId,
          llegada, salida, personas,
          actividades: actSel,
          notas: notas.trim(),
          precioPorNoche: selectedAloj?.precio ?? 0,
        }),
      });
      setSuccess(`✓ Reserva ${res.codigo} creada exitosamente. Total estimado: ${res.total} (${nights} noche${nights !== 1 ? 's' : ''}).`);
      // reset
      setHuesped(''); setEmail(''); setTelefono(''); setAlojId('');
      setPersonas(2); setActSel([]); setNotas('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al guardar');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="fm-page">
      <div className="fm-head">
        <div className="fm-head-icon-wrap">
          <svg className="fm-head-icon" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.75" />
            <path d="M12 8v8M8 12h8" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
          </svg>
        </div>
        <div>
          <h1 className="fm-title">Nueva reserva</h1>
          <p className="fm-subtitle">Registra una nueva estadía para un huésped en San José Tatacoa.</p>
        </div>
      </div>

      <div className="fm-panel">
        <form onSubmit={onSubmit} noValidate>
          <div className="form-grid">
            {/* Datos del huésped */}
            <div className="form-field">
              <label htmlFor="nr-huesped">Nombre completo del huésped <span aria-hidden style={{ color: 'var(--ds-color-danger-fg)' }}>*</span></label>
              <input id="nr-huesped" className="ds-input" type="text" placeholder="Ej: María Gómez" value={huesped} onChange={e => setHuesped(e.target.value)} required />
            </div>

            <div className="form-field">
              <label htmlFor="nr-email">Correo electrónico <span aria-hidden style={{ color: 'var(--ds-color-danger-fg)' }}>*</span></label>
              <input id="nr-email" className="ds-input" type="email" placeholder="maria@email.com" value={email} onChange={e => setEmail(e.target.value)} required />
            </div>

            <div className="form-field">
              <label htmlFor="nr-tel">Teléfono</label>
              <input id="nr-tel" className="ds-input" type="tel" placeholder="+57 300 000 0000" value={telefono} onChange={e => setTelefono(e.target.value)} />
            </div>

            <div className="form-field">
              <label htmlFor="nr-personas">Número de personas</label>
              <input id="nr-personas" className="ds-input" type="number" min={1} max={20} value={personas} onChange={e => setPersonas(+e.target.value)} />
            </div>

            {/* Alojamiento */}
            <div className="form-field form-field--full">
              <label htmlFor="nr-aloj">Alojamiento <span aria-hidden style={{ color: 'var(--ds-color-danger-fg)' }}>*</span></label>
              <select id="nr-aloj" className="ds-select" value={alojId} onChange={e => setAlojId(e.target.value)} required>
                <option value="">Selecciona un alojamiento…</option>
                {alojamientos.map(a => (
                  <option key={a.id} value={a.id} disabled={!a.disponible}>
                    {a.icon ?? ''} {a.nombre} — {fmtCOP(a.precio)}/noche — {a.capacidad}
                    {!a.disponible ? ' (no disponible)' : ''}
                  </option>
                ))}
              </select>
            </div>

            {/* Fechas */}
            <div className="form-field">
              <label htmlFor="nr-llegada">Fecha de llegada <span aria-hidden style={{ color: 'var(--ds-color-danger-fg)' }}>*</span></label>
              <input id="nr-llegada" className="ds-input" type="date" value={llegada} onChange={e => setLlegada(e.target.value)} required />
            </div>

            <div className="form-field">
              <label htmlFor="nr-salida">Fecha de salida <span aria-hidden style={{ color: 'var(--ds-color-danger-fg)' }}>*</span></label>
              <input id="nr-salida" className="ds-input" type="date" value={salida} min={llegada} onChange={e => setSalida(e.target.value)} required />
            </div>

            {/* Resumen precio */}
            {selectedAloj && nights > 0 && (
              <div className="form-field form-field--full">
                <div style={{ background: 'var(--ds-color-info-bg)', border: '1px solid #bfdbfe', borderRadius: 'var(--ds-radius-lg)', padding: '0.85rem 1rem', fontSize: 'var(--ds-text-sm)', color: 'var(--ds-color-info-fg)', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
                  <span>{selectedAloj.nombre} · {nights} noche{nights !== 1 ? 's' : ''} × {fmtCOP(selectedAloj.precio)}</span>
                  <span style={{ fontWeight: 800, fontSize: 'var(--ds-text-md)' }}>Total estimado: {fmtCOP(total)}</span>
                </div>
              </div>
            )}

            {/* Actividades */}
            <div className="form-field form-field--full">
              <label>Actividades incluidas</label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '0.5rem', marginTop: '0.25rem' }}>
                {actividades.map(a => (
                  <label
                    key={a.id}
                    style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '0.6rem 0.75rem', borderRadius: 'var(--ds-radius-lg)', border: `1px solid ${actSel.includes(a.nombre) ? 'var(--ds-color-primary)' : 'var(--ds-color-border)'}`, background: actSel.includes(a.nombre) ? 'var(--ds-color-blue-50)' : '#fff', cursor: 'pointer', fontSize: 'var(--ds-text-sm)', fontWeight: actSel.includes(a.nombre) ? 600 : 400, transition: 'border-color 0.12s, background 0.12s' }}
                  >
                    <input type="checkbox" checked={actSel.includes(a.nombre)} onChange={() => toggleAct(a.nombre)} style={{ accentColor: 'var(--ds-color-primary)', width: 15, height: 15 }} />
                    <span>{a.nombre}</span>
                    <span style={{ marginLeft: 'auto', color: 'var(--ds-color-text-muted)', fontWeight: 400 }}>{fmtCOP(a.precio)}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Notas */}
            <div className="form-field form-field--full">
              <label htmlFor="nr-notas">Notas adicionales</label>
              <textarea id="nr-notas" className="ds-textarea" placeholder="Alergias, celebraciones especiales, requerimientos especiales…" value={notas} onChange={e => setNotas(e.target.value)} />
            </div>
          </div>

          {/* Resultado */}
          {success && <p className="form-result form-result--ok" role="status">{success}</p>}
          {error   && <p className="form-result form-result--err" role="alert">{error}</p>}

          {/* Acciones */}
          <div className="form-actions">
            <button type="button" className="ds-btn ds-btn--secondary" onClick={() => navigate('/reservas')}>
              Cancelar
            </button>
            <button type="submit" className="ds-btn ds-btn--gradient" disabled={busy}>
              {busy ? 'Guardando…' : 'Guardar reserva'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}