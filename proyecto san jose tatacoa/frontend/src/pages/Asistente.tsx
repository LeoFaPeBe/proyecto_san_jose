import { useEffect, useRef, useState } from 'react'
import { GoogleGenAI } from '@google/genai'
import {Send,Bot,User,Loader2,Sparkles,MessageSquare} from 'lucide-react'
import { motion, AnimatePresence } from 'motion/react'

/* ─────────────────────────────────────────────
   CONFIG GEMINI
───────────────────────────────────────────── */

const ai = new GoogleGenAI({
  apiKey: import.meta.env.VITE_GEMINI_API_KEY
})

/* ─────────────────────────────────────────────
   PROMPT DEL SISTEMA
───────────────────────────────────────────── */

const SYSTEM_PROMPT = `
Eres el asistente virtual de San José Tatacoa, una finca hotel turística
ubicada en la Vereda La Victoria, Villavieja, Huila, Colombia,
a orillas del Desierto de la Tatacoa.

CONTACTO:
- Teléfono / WhatsApp: +57 320 849 1270
- Email: contacto@sanjosetatacoa.com
- Instagram: @sanjose_tatacoa
- Facebook: sanjosetatacoa

ALOJAMIENTOS:
• Cabaña El Cactus — 2-4 personas — $180.000/noche
• Glamping Estrella del Desierto — 2 personas — $220.000/noche
• Habitación Familiar — 4-6 personas — $250.000/noche
• Habitación Doble — 2 personas — $120.000/noche
• Camping Bajo las Estrellas — $45.000/noche
• Cúpula Astronómica — $280.000/noche

ACTIVIDADES:
• Observación de estrellas — $35.000/persona
• Cabalgata por el desierto — $40.000/persona
• Caminata guiada — $30.000/persona
• Ordeño de vacas — $20.000/persona
• Tour Desierto Rojo — $55.000/persona
• Tour Desierto Gris — $55.000/persona
• Piscina y relax — $15.000/persona
• Restaurante típico huilense — desde $25.000

CÓMO LLEGAR:
Desde Neiva: 40 km por la vía Neiva-Villavieja.

POLÍTICAS:
- Check-in: 2 pm
- Check-out: 12 m
- Reserva previa para glamping y cúpula
- Mascotas: consultar disponibilidad
- Niños bienvenidos

INSTRUCCIONES:
- Responde SIEMPRE en español
- Sé amable, cálido y turístico
- Habla del desierto y las estrellas cuando sea natural
- Responde corto y claro
- Si preguntan disponibilidad exacta, dirige al WhatsApp
`

/* ─────────────────────────────────────────────
   TYPES
───────────────────────────────────────────── */

type Message = {
  role: 'user' | 'assistant'
  content: string
}

/* ─────────────────────────────────────────────
   SUGERENCIAS
───────────────────────────────────────────── */

const SUGERENCIAS = [
  '¿Cuánto cuesta el glamping?',
  '¿Cómo llego desde Neiva?',
  '¿Qué actividades hay?',
  '¿Tienen piscina?',
  '¿Puedo llevar mascotas?',
  '¿Qué incluye la cúpula astronómica?',
]

/* ─────────────────────────────────────────────
   MARKDOWN SIMPLE
───────────────────────────────────────────── */

function renderMd(text: string): string {
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/\n/g, '<br/>')
}

/* ─────────────────────────────────────────────
   COMPONENTE
───────────────────────────────────────────── */

export default function Asistente() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content:
        '¡Hola! 🌵✨ Soy el asistente virtual de **San José Tatacoa**.\n\nPuedo ayudarte con alojamientos, tours, actividades, rutas y experiencias en el desierto. ¿Qué deseas saber?',
    },
  ])

  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  /* Auto Scroll */

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: 'smooth',
    })
  }, [messages, loading])

  /* ─────────────────────────────────────────────
     ENVIAR MENSAJE
  ───────────────────────────────────────────── */

  async function sendMessage(text: string) {
    const trimmed = text.trim()

    if (!trimmed || loading) return

    setInput('')
    setError(null)

    const userMessage: Message = {
      role: 'user',
      content: trimmed,
    }

    const updatedMessages = [...messages, userMessage]

    setMessages(updatedMessages)
    setLoading(true)

    try {
      const history = updatedMessages
        .map(
          m =>
            `${m.role === 'user' ? 'Usuario' : 'Asistente'}: ${
              m.content
            }`,
        )
        .join('\n')

      const response = await ai.models.generateContent({
  model: 'gemini-1.5-flash',

  contents: [
    {
      role: 'user',
      parts: [
        {
          text: `
${SYSTEM_PROMPT}

CONVERSACIÓN:
${history}

Usuario: ${trimmed}
`,
        },
      ],
    },
  ],

  config: {
    temperature: 0.7,
  },
})

      const reply =
        response.text ||
        'Lo siento, no pude responder en este momento.'

      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          content: reply,
        },
      ])
    } catch (e) {
      console.error(e)

      setError('Error conectando con Gemini')

      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          content:
            '⚠️ Hubo un problema de conexión.\n\nPor favor intenta nuevamente o comunícate al WhatsApp +57 320 849 1270.',
        },
      ])
    } finally {
      setLoading(false)
      inputRef.current?.focus()
    }
  }

  /* ENTER */

  function handleKey(
    e: React.KeyboardEvent<HTMLInputElement>,
  ) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      void sendMessage(input)
    }
  }

  /* LIMPIAR CHAT */

  function clearChat() {
    setMessages([
      {
        role: 'assistant',
        content:
          '¡Hola! 🌵✨ Soy el asistente virtual de **San José Tatacoa**.\n\n¿En qué puedo ayudarte hoy?',
      },
    ])

    inputRef.current?.focus()
  }

  /* ─────────────────────────────────────────────
     UI
  ───────────────────────────────────────────── */

return (
    <div className="fm-page">
      {/* Header */}
      <div className="fm-head fm-head--between">
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
          <div className="fm-head-icon-wrap">
            <svg className="fm-head-icon" viewBox="0 0 24 24" fill="none">
              <path
                d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"
                stroke="currentColor" strokeWidth="1.75" strokeLinejoin="round"
              />
            </svg>
          </div>
          <div>
            <h1 className="fm-title">Asistente IA</h1>
            <p className="fm-subtitle">
              Consulta sobre alojamientos, actividades, cómo llegar y más.
              Impulsado por Claude de Anthropic.
            </p>
          </div>
        </div>
        <button
          className="ds-btn ds-btn--secondary ds-btn--sm"
          onClick={clearChat}
          title="Limpiar conversación"
        >
          🗑 Limpiar chat
        </button>
      </div>
 
      {/* Sugerencias rápidas */}
      <div className="chat-suggestions" aria-label="Preguntas frecuentes">
        {SUGERENCIAS.map(s => (
          <button
            key={s}
            className="chat-suggestion-btn"
            onClick={() => sendMessage(s)}
            disabled={loading}
          >
            {s}
          </button>
        ))}
      </div>
 
      {/* Panel de chat */}
      <div className="fm-panel">
        {error && (
          <div
            style={{
              marginBottom: '0.75rem',
              padding: '0.65rem 1rem',
              background: 'var(--ds-color-danger-bg)',
              color: 'var(--ds-color-danger-fg)',
              borderRadius: 'var(--ds-radius-lg)',
              fontSize: 'var(--ds-text-sm)',
              border: '1px solid #fca5a5',
            }}
          >
            ⚠️ {error}
          </div>
        )}
 
        <div className="chat-wrap">
          {/* Mensajes */}
          <div
            id="chat-messages"
            className="chat-messages"
            role="log"
            aria-live="polite"
            aria-label="Conversación con el asistente"
          >
            {messages.map((m, i) => (
              <div
                key={i}
                className={`chat-bubble chat-bubble--${m.role === 'user' ? 'user' : 'bot'}`}
              >
                {m.role === 'assistant' ? (
                  <span dangerouslySetInnerHTML={{ __html: renderMd(m.content) }} />
                ) : (
                  m.content
                )}
              </div>
            ))}
 
            {/* Indicador de escritura */}
            {loading && (
              <div className="chat-bubble chat-bubble--bot chat-bubble--loading">
                <span style={{ display: 'inline-flex', gap: '4px', alignItems: 'center' }}>
                  <span style={dotStyle(0)}>●</span>
                  <span style={dotStyle(0.2)}>●</span>
                  <span style={dotStyle(0.4)}>●</span>
                </span>
              </div>
            )}
 
            <div ref={messagesEndRef} />
          </div>
 
          {/* Input */}
          <div className="chat-input-row">
            <input
              ref={inputRef}
              className="ds-input"
              type="text"
              placeholder="Escribe tu pregunta sobre San José Tatacoa…"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKey}
              disabled={loading}
              aria-label="Mensaje al asistente"
              autoComplete="off"
            />
            <button
              className="ds-btn ds-btn--primary"
              onClick={() => sendMessage(input)}
              disabled={loading || !input.trim()}
              aria-label="Enviar mensaje"
            >
              {loading ? (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                  style={{ animation: 'spin 1s linear infinite' }}>
                  <circle cx="12" cy="12" r="9" stroke="currentColor"
                    strokeWidth="2" strokeDasharray="28" strokeDashoffset="10" />
                </svg>
              ) : (
                <>
                  Enviar
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"
                      stroke="currentColor" strokeWidth="2"
                      strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </>
              )}
            </button>
          </div>
        </div>
 
        {/* Footer del chat */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            marginTop: '0.75rem',
            padding: '0.65rem 0.85rem',
            background: 'var(--ds-color-bg-muted)',
            borderRadius: 'var(--ds-radius-lg)',
            fontSize: 'var(--ds-text-xs)',
            color: 'var(--ds-color-text-muted)',
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" />
            <path d="M12 10v5M12 8h.01" stroke="currentColor" strokeWidth="1.75"
              strokeLinecap="round" />
          </svg>
          Impulsado por Gemini · Para reservas llama al{' '}
          <a
            href="tel:+573208491270"
            style={{ color: 'var(--ds-color-primary)', fontWeight: 600 }}
          >
            +57 320 849 1270
          </a>{' '}
          o escríbenos por{' '}
          <a
            href="https://wa.me/573208491270"
            target="_blank"
            rel="noreferrer"
            style={{ color: '#16a34a', fontWeight: 600 }}
          >
            WhatsApp
          </a>
        </div>
      </div>
 
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes dotPulse {
          0%, 60%, 100% { opacity: 0.3; transform: scale(0.8); }
          30% { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  )
}
 
function dotStyle(delay: number): React.CSSProperties {
  return {
    fontSize: '0.5rem',
    animation: `dotPulse 1.2s ${delay}s ease-in-out infinite`,
    display: 'inline-block',
  }
}