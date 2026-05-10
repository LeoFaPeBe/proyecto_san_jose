import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api/http';

type Reserva = {
  id: string; codigo: string; huesped: string; email: string; telefono: string;
  alojamiento: string; llegada: string; salida: string; personas: number;
  actividades: string[]; notas: string; estado: string; total: string; creadoEn: string;
};

function fmtDate(iso: string) {
  if (!iso) return '—';
  try {
    return new Date(iso).toLocaleDateString('es-CO', { day: 'numeric', month: 'short', year: 'numeric' });
  } catch { return iso; }
}

function badgeCls(estado: string) {
  return { Confirmada: 'ds-badge--success', Pendiente: 'ds-badge--warning', Cancelada: 'ds-badge--danger' }[estado] ?? 'ds-badge--neutral';
}

type ModalState = { open: boolean; title: string; body: string; onConfirm: () => void; danger?: boolean };
const MODAL_CLOSED: ModalState = { open: false, title: '', body: '', onConfirm: () => {} };

export function Reservas() {
  const [reservas, setReservas] = useState<Reserva[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [q, setQ] = useState('');
  const [estado, setEstado] = useState('');
  const [modal, setModal] = useState<ModalState>(MODAL_CLOSED);

  const load = useCallback(async () => {
    setLoading(true); setError(null);
    try {
      const params = new URLSearchParams();
      if (q.trim()) params.set('q', q.trim());
      if (estado) params.set('estado', estado);
      const data = await api<Reserva[]>(`/reservas?${params}`);
      setReservas(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error cargando reservas');
    } finally { setLoading(false); }
  }, [q, estado]);

  useEffect(() => { void load(); }, [load]);

  function confirmChangeEstado(reserva: Reserva, nuevoEstado: string) {
    setModal({
      open: true,
      title: `Cambiar estado a "${nuevoEstado}"`,
      body: `¿Cambiar la reserva ${reserva.codigo} de "${reserva.estado}" a "${nuevoEstado}"?`,
      danger: nuevoEstado === 'Cancelada',
      onConfirm: async () => {
        try {
          await api(`/reservas/${reserva.id}/estado`, { method: 'PATCH', body: JSON.stringify({ estado: nuevoEstado }) });
          void load();
        } catch (e) { alert(e instanceof Error ? e.message : 'Error'); }
      },
    });
  }

  function confirmDelete(reserva: Reserva) {
    setModal({
      open: true,
      title: 'Eliminar reserva',
      body: `¿Eliminar la reserva ${reserva.codigo} de ${reserva.huesped}? Esta acción no se puede deshacer.`,
      danger: true,
      onConfirm: async () => {
        try {
          await api(`/reservas/${reserva.id}`, { method: 'DELETE' });
          void load();
        } catch (e) { alert(e instanceof Error ? e.message : 'Error'); }
      },
    });
  }

  return (
    <div className="fm-page">
      {/* Header */}
      <div className="fm-head fm-head--between">
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
          <div className="fm-head-icon-wrap">
            <svg className="fm-head-icon" viewBox="0 0 24 24" fill="none">
              <rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="1.75" />
              <path d="M3 9h18M8 2v4M16 2v4" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
            </svg>
          </div>
          <div>
            <h1 className="fm-title">Reservas</h1>
            <p className="fm-subtitle">Listado completo de reservas registradas en el sistema.</p>
          </div>
        </div>
        <Link to="/reservas/nueva" className="ds-btn ds-btn--gradient">
          + Nueva reserva
        </Link>
      </div>

      {/* Panel principal */}
      <div className="fm-panel">
        {/* Filtros */}
        <div className="reservas-filters">
          <input
            className="ds-input reservas-search"
            type="search"
            placeholder="Buscar por huésped, correo o alojamiento…"
            value={q}
            onChange={e => setQ(e.target.value)}
          />
          <select
            className="ds-select"
            value={estado}
            onChange={e => setEstado(e.target.value)}
            style={{ maxWidth: 170 }}
          >
            <option value="">Todos los estados</option>
            <option value="Confirmada">Confirmada</option>
            <option value="Pendiente">Pendiente</option>
            <option value="Cancelada">Cancelada</option>
          </select>
          <button className="ds-btn ds-btn--secondary ds-btn--sm" onClick={() => load()}>
            Actualizar
          </button>
        </div>

        {/* Tabla */}
        {loading && <p style={{ color: 'var(--ds-color-text-secondary)', padding: '1.5rem 0' }}>Cargando reservas…</p>}
        {error && <p style={{ color: 'var(--ds-color-danger-fg)', padding: '1rem 0' }}>{error}</p>}

        {!loading && !error && (
          <div className="ds-table-wrap">
            <table className="ds-table">
              <thead>
                <tr>
                  <th>Código</th>
                  <th>Huésped</th>
                  <th>Alojamiento</th>
                  <th>Llegada</th>
                  <th>Salida</th>
                  <th>Personas</th>
                  <th>Estado</th>
                  <th>Total</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {reservas.length === 0 && (
                  <tr>
                    <td colSpan={9} style={{ textAlign: 'center', padding: '2rem', color: 'var(--ds-color-text-muted)' }}>
                      No se encontraron reservas.
                    </td>
                  </tr>
                )}
                {reservas.map(r => (
                  <tr key={r.id} className={`status-${r.estado.toLowerCase()}`}>
                    <td>
                      <span style={{ fontWeight: 700, fontSize: 'var(--ds-text-sm)', fontFamily: 'var(--ds-font-mono)' }}>
                        {r.codigo}
                      </span>
                    </td>
                    <td>
                      <div style={{ fontWeight: 600 }}>{r.huesped}</div>
                      <div style={{ fontSize: 'var(--ds-text-xs)', color: 'var(--ds-color-text-muted)' }}>{r.email}</div>
                    </td>
                    <td style={{ maxWidth: 160, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {r.alojamiento}
                    </td>
                    <td style={{ whiteSpace: 'nowrap' }}>{fmtDate(r.llegada)}</td>
                    <td style={{ whiteSpace: 'nowrap' }}>{fmtDate(r.salida)}</td>
                    <td style={{ textAlign: 'center' }}>{r.personas}</td>
                    <td>
                      <span className={`ds-badge ${badgeCls(r.estado)}`}>{r.estado}</span>
                    </td>
                    <td style={{ fontWeight: 700, whiteSpace: 'nowrap' }}>{r.total}</td>
                    <td>
                      <div className="reservas-actions-cell">
                        {r.estado !== 'Confirmada' && (
                          <button
                            className="ds-btn ds-btn--sm ds-btn--primary"
                            title="Confirmar"
                            onClick={() => confirmChangeEstado(r, 'Confirmada')}
                          >
                            ✓
                          </button>
                        )}
                        {r.estado !== 'Cancelada' && (
                          <button
                            className="ds-btn ds-btn--sm ds-btn--danger"
                            title="Cancelar"
                            onClick={() => confirmChangeEstado(r, 'Cancelada')}
                          >
                            ✗
                          </button>
                        )}
                        <button
                          className="ds-btn ds-btn--sm ds-btn--secondary"
                          title="Eliminar"
                          onClick={() => confirmDelete(r)}
                        >
                          🗑
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {!loading && !error && (
          <p style={{ marginTop: '0.75rem', fontSize: 'var(--ds-text-xs)', color: 'var(--ds-color-text-muted)' }}>
            {reservas.length} reserva{reservas.length !== 1 ? 's' : ''} encontrada{reservas.length !== 1 ? 's' : ''}
          </p>
        )}
      </div>

      {/* Modal confirmación */}
      {modal.open && (
        <div className="modal-backdrop" onClick={() => setModal(MODAL_CLOSED)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h3 className="modal-title">{modal.title}</h3>
            <p className="modal-body">{modal.body}</p>
            <div className="modal-actions">
              <button className="ds-btn ds-btn--secondary" onClick={() => setModal(MODAL_CLOSED)}>
                Cancelar
              </button>
              <button
                className={`ds-btn ${modal.danger ? 'ds-btn--danger' : 'ds-btn--primary'}`}
                onClick={() => { modal.onConfirm(); setModal(MODAL_CLOSED); }}
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}