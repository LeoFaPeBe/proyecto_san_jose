import { useState } from 'react'

type Foto = { src: string; alt: string; categoria: string }

const FOTOS: Foto[] = [
  {
    src: 'https://sanjosetatacoa.com/wp-content/uploads/2024/11/l9.jpg',
    alt: 'Paisaje del Desierto de la Tatacoa',
    categoria: 'Paisaje',
  },
  {
    src: 'https://sanjosetatacoa.com/wp-content/uploads/2024/11/261432684_1155631491907683_5817851673661085323_n.jpg',
    alt: 'Vista de la finca hotel',
    categoria: 'Finca',
  },
  {
    src: 'https://sanjosetatacoa.com/wp-content/uploads/2024/11/449464715_982999090502649_3227799628425082865_n.jpg',
    alt: 'Alojamientos en la finca',
    categoria: 'Alojamientos',
  },
  {
    src: 'https://sanjosetatacoa.com/wp-content/uploads/2024/11/81768401_663137047823799_7554867118844411904_n.jpg',
    alt: 'Actividades al aire libre',
    categoria: 'Actividades',
  },
  {
    src: 'https://sanjosetatacoa.com/wp-content/uploads/2024/11/449460953_982998740502684_2321151171137522089_n.jpg',
    alt: 'Eventos especiales en la finca',
    categoria: 'Eventos',
  },
  {
    src: 'https://sanjosetatacoa.com/wp-content/uploads/2024/11/actividades1-1024x768.jpg',
    alt: 'Naturaleza y aventura',
    categoria: 'Actividades',
  },
  {
    src: 'https://sanjosetatacoa.com/wp-content/uploads/2024/11/alojamiento1-1024x766.jpg',
    alt: 'Cabaña en la finca',
    categoria: 'Alojamientos',
  },
  {
    src: 'https://sanjosetatacoa.com/wp-content/uploads/2024/11/eventos1-1024x768.jpg',
    alt: 'Celebraciones y eventos',
    categoria: 'Eventos',
  },
]

const CATEGORIAS = ['Todos', ...Array.from(new Set(FOTOS.map(f => f.categoria)))]

const INFO = [
  { icon: '📍', label: 'Ubicación', value: 'Vereda La Victoria, Villavieja, Huila' },
  { icon: '📞', label: 'Teléfono', value: '+57 320 849 1270' },
  { icon: '✉️', label: 'Correo', value: 'contacto@sanjosetatacoa.com' },
  { icon: '📱', label: 'Instagram', value: '@sanjose_tatacoa' },
  { icon: '🌐', label: 'Facebook', value: 'sanjosetatacoa' },
  { icon: '🕒', label: 'Atención', value: 'Lunes a domingo · 7 am – 9 pm' },
]

export function Galeria() {
  const [catActiva, setCatActiva] = useState('Todos')
  const [lightbox, setLightbox] = useState<Foto | null>(null)

  const visibles =
    catActiva === 'Todos' ? FOTOS : FOTOS.filter(f => f.categoria === catActiva)

  return (
    <div className="fm-page">
      {/* Header */}
      <div className="fm-head">
        <div className="fm-head-icon-wrap">
          <svg className="fm-head-icon" viewBox="0 0 24 24" fill="none">
            <rect x="3" y="3" width="18" height="18" rx="2"
              stroke="currentColor" strokeWidth="1.75" />
            <circle cx="8.5" cy="8.5" r="1.5"
              stroke="currentColor" strokeWidth="1.5" />
            <path d="M21 15l-5-5L5 21"
              stroke="currentColor" strokeWidth="1.75"
              strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <div>
          <h1 className="fm-title">Galería</h1>
          <p className="fm-subtitle">
            Imágenes que capturan la esencia del Desierto de la Tatacoa y nuestra finca hotel.
          </p>
        </div>
      </div>

      {/* Filtros de categoría */}
      <div
        style={{
          display: 'flex',
          gap: '0.5rem',
          flexWrap: 'wrap',
          marginBottom: '0.25rem',
        }}
      >
        {CATEGORIAS.map(cat => (
          <button
            key={cat}
            onClick={() => setCatActiva(cat)}
            style={{
              padding: '0.38rem 1rem',
              borderRadius: 'var(--ds-radius-pill)',
              border: '1px solid',
              borderColor: catActiva === cat
                ? 'var(--ds-color-primary)'
                : 'var(--ds-color-border)',
              background: catActiva === cat
                ? 'var(--ds-color-blue-50)'
                : '#fff',
              color: catActiva === cat
                ? 'var(--ds-color-primary)'
                : 'var(--ds-color-text-secondary)',
              fontWeight: catActiva === cat ? 700 : 400,
              fontSize: 'var(--ds-text-sm)',
              cursor: 'pointer',
              transition: 'all 0.12s',
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Galería mosaico */}
      <div className="fm-panel">
        <div className="gallery-grid">
          {visibles.slice(0, 5).map((f, i) => (
            <div
              key={i}
              className="g-item"
              onClick={() => setLightbox(f)}
              title={f.alt}
              style={{ cursor: 'zoom-in' }}
            >
              <img
                src={f.src}
                alt={f.alt}
                loading={i === 0 ? 'eager' : 'lazy'}
              />
            </div>
          ))}
        </div>

        {/* Fotos adicionales si hay más de 5 */}
        {visibles.length > 5 && (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
              gap: 10,
              marginTop: 10,
            }}
          >
            {visibles.slice(5).map((f, i) => (
              <div
                key={i}
                style={{
                  height: 160,
                  overflow: 'hidden',
                  borderRadius: 'var(--ds-radius-lg)',
                  cursor: 'zoom-in',
                }}
                onClick={() => setLightbox(f)}
              >
                <img
                  src={f.src}
                  alt={f.alt}
                  loading="lazy"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    transition: 'transform 0.4s',
                    display: 'block',
                  }}
                />
              </div>
            ))}
          </div>
        )}

        <p
          style={{
            marginTop: '0.85rem',
            fontSize: 'var(--ds-text-xs)',
            color: 'var(--ds-color-text-muted)',
            textAlign: 'center',
          }}
        >
          {visibles.length} foto{visibles.length !== 1 ? 's' : ''} ·{' '}
          San José Tatacoa, Villavieja, Huila
        </p>
      </div>

      {/* Info de contacto */}
      <div className="fm-panel">
        <h2 className="fm-panel-title">Información de la finca</h2>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
            gap: '0.85rem',
          }}
        >
          {INFO.map(item => (
            <div
              key={item.label}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '0.75rem',
                padding: '1rem',
                borderRadius: 'var(--ds-radius-lg)',
                border: '1px solid var(--ds-color-border)',
                background: 'var(--ds-color-bg-muted)',
              }}
            >
              <span style={{ fontSize: '1.25rem', flexShrink: 0 }}>{item.icon}</span>
              <div>
                <div
                  style={{
                    fontSize: 'var(--ds-text-xs)',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.06em',
                    color: 'var(--ds-color-text-muted)',
                    marginBottom: '0.2rem',
                  }}
                >
                  {item.label}
                </div>
                <div
                  style={{
                    fontSize: 'var(--ds-text-sm)',
                    fontWeight: 500,
                    color: 'var(--ds-color-text)',
                  }}
                >
                  {item.value}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      {lightbox && (
        <div
          className="modal-backdrop"
          onClick={() => setLightbox(null)}
          style={{ alignItems: 'center', justifyContent: 'center' }}
        >
          <div
            style={{
              position: 'relative',
              maxWidth: '90vw',
              maxHeight: '90vh',
              borderRadius: 'var(--ds-radius-2xl)',
              overflow: 'hidden',
              boxShadow: 'var(--ds-shadow-lg)',
            }}
            onClick={e => e.stopPropagation()}
          >
            <img
              src={lightbox.src}
              alt={lightbox.alt}
              style={{
                display: 'block',
                maxWidth: '90vw',
                maxHeight: '85vh',
                objectFit: 'contain',
              }}
            />
            <div
              style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                padding: '0.75rem 1rem',
                background: 'rgba(0,0,0,0.55)',
                color: '#fff',
                fontSize: 'var(--ds-text-sm)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <span>{lightbox.alt}</span>
              <span
                style={{
                  background: 'var(--ds-color-blue-600)',
                  color: '#fff',
                  fontSize: 'var(--ds-text-xs)',
                  fontWeight: 700,
                  padding: '0.2rem 0.6rem',
                  borderRadius: 'var(--ds-radius-pill)',
                }}
              >
                {lightbox.categoria}
              </span>
            </div>
            <button
              onClick={() => setLightbox(null)}
              style={{
                position: 'absolute',
                top: '0.75rem',
                right: '0.75rem',
                width: 32,
                height: 32,
                borderRadius: '50%',
                background: 'rgba(0,0,0,0.5)',
                border: 'none',
                color: '#fff',
                fontSize: '1rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              aria-label="Cerrar"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  )
}