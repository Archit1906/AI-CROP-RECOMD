import { useState, useRef, useEffect } from 'react'
import api from '../api/axios'

const QUICK_SUGGESTIONS = [
  { text: "Which crop should I grow?",    icon: "🌾" },
  { text: "My tomato leaves have spots",  icon: "🍅" },
  { text: "Today's weather advice",       icon: "🌤️" },
  { text: "PM-KISAN scheme details",      icon: "💰" },
  { text: "Best fertilizer for rice",     icon: "🌱" },
  { text: "How to control pests?",        icon: "🐛" },
]

const LANGUAGES = [
  { code: "en", label: "EN",      full: "English" },
  { code: "ta", label: "தமிழ்",   full: "Tamil"   },
  { code: "hi", label: "हिंदी",   full: "Hindi"   },
]

const WELCOME_MESSAGES = {
  en: "Namaste! 🙏 I am AMRITKRISHI AI, your personal farming assistant. Ask me anything about crops, diseases, weather, market prices, or government schemes. I'm here to help!",
  ta: "நமஸ்தே! 🙏 நான் AMRITKRISHI AI, உங்கள் தனிப்பட்ட விவசாய உதவியாளர். பயிர்கள், நோய்கள், வானிலை, சந்தை விலைகள் அல்லது அரசு திட்டங்கள் பற்றி என்னிடம் கேளுங்கள்!",
  hi: "नमस्ते! 🙏 मैं AMRITKRISHI AI हूं, आपका व्यक्तिगत कृषि सहायक। फसल, बीमारी, मौसम, बाजार भाव या सरकारी योजनाओं के बारे में कुछ भी पूछें!",
}

function TypingIndicator() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '12px 16px',
                  background: '#1A2E1A', borderRadius: '18px 18px 18px 4px',
                  width: 'fit-content', maxWidth: 80 }}>
      {[0,1,2].map(i => (
        <div key={i} style={{
          width: 8, height: 8, borderRadius: '50%', background: '#22C55E',
          animation: 'bounce 1.2s ease infinite',
          animationDelay: `${i * 0.2}s`
        }} />
      ))}
    </div>
  )
}

function Message({ msg }) {
  const isUser = msg.role === 'user'
  return (
    <div style={{
      display: 'flex',
      justifyContent: isUser ? 'flex-end' : 'flex-start',
      marginBottom: 12,
      alignItems: 'flex-end',
      gap: 8
    }}>
      {/* AI Avatar */}
      {!isUser && (
        <div style={{
          width: 32, height: 32, borderRadius: '50%',
          background: 'linear-gradient(135deg, #166534, #22C55E)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 16, flexShrink: 0
        }}>🌾</div>
      )}

      <div style={{ maxWidth: '72%' }}>
        {/* Bubble */}
        <div style={{
          padding: '12px 16px',
          borderRadius: isUser
            ? '18px 18px 4px 18px'
            : '18px 18px 18px 4px',
          background: isUser
            ? 'linear-gradient(135deg, #15803D, #22C55E)'
            : '#1A2E1A',
          border: isUser ? 'none' : '1px solid #2D4A2D',
          color: '#fff',
          fontSize: 14,
          lineHeight: 1.6,
          whiteSpace: 'pre-wrap',
          wordBreak: 'break-word'
        }}>
          {msg.content}
        </div>

        {/* Timestamp */}
        <p style={{
          color: '#4B5563', fontSize: 11, margin: '4px 6px 0',
          textAlign: isUser ? 'right' : 'left'
        }}>
          {msg.time}
        </p>
      </div>

      {/* User Avatar */}
      {isUser && (
        <div style={{
          width: 32, height: 32, borderRadius: '50%',
          background: '#374151',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 16, flexShrink: 0
        }}>👨‍🌾</div>
      )}
    </div>
  )
}

export default function Chatbot() {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [language, setLanguage] = useState('en')
  const [showLangMenu, setShowLangMenu] = useState(false)
  const bottomRef = useRef(null)
  const inputRef = useRef(null)

  // Set welcome message when language changes
  useEffect(() => {
    setMessages([{
      role: 'assistant',
      content: WELCOME_MESSAGES[language],
      time: new Date().toLocaleTimeString([], { hour:'2-digit', minute:'2-digit' })
    }])
  }, [language])

  // Auto scroll to bottom
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  const sendMessage = async (text) => {
    const trimmed = (text || input).trim()
    if (!trimmed || loading) return

    const userMsg = {
      role: 'user',
      content: trimmed,
      time: new Date().toLocaleTimeString([], { hour:'2-digit', minute:'2-digit' })
    }

    const updatedMessages = [...messages, userMsg]
    setMessages(updatedMessages)
    setInput('')
    setLoading(true)

    try {
      const history = updatedMessages
        .slice(1) // skip welcome message
        .map(m => ({ role: m.role, content: m.content }))

      const res = await api.post('/api/chatbot', {
        message: trimmed,
        language,
        history: history.slice(0, -1) // exclude current message
      })

      setMessages(prev => [...prev, {
        role: 'assistant',
        content: res.data.reply,
        time: new Date().toLocaleTimeString([], { hour:'2-digit', minute:'2-digit' })
      }])
    } catch {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: '⚠️ Could not connect to AI. Make sure backend is running: uvicorn main:app --reload',
        time: new Date().toLocaleTimeString([], { hour:'2-digit', minute:'2-digit' })
      }])
    } finally {
      setLoading(false)
      inputRef.current?.focus()
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const currentLang = LANGUAGES.find(l => l.code === language)

  return (
    <div style={{
      height: '100vh', display: 'flex', flexDirection: 'column',
      background: '#0A0F0A', position: 'relative'
    }}>

      {/* Subtle farm pattern background */}
      <div style={{
        position: 'absolute', inset: 0, opacity: 0.03, pointerEvents: 'none',
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%2322C55E' fill-opacity='1'%3E%3Cpath d='M30 10 L35 25 L30 20 L25 25 Z'/%3E%3Ccircle cx='30' cy='30' r='3'/%3E%3C/g%3E%3C/svg%3E")`,
        backgroundSize: '60px 60px'
      }} />

      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, #0F2A0F, #162116)',
        borderBottom: '1px solid #2D4A2D',
        padding: '14px 20px',
        display: 'flex', alignItems: 'center',
        justifyContent: 'space-between',
        flexShrink: 0, zIndex: 10
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            width: 44, height: 44, borderRadius: '50%',
            background: 'linear-gradient(135deg, #166534, #22C55E)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 22, border: '2px solid #22C55E'
          }}>🌾</div>
          <div>
            <p style={{ color: '#fff', fontWeight: 700, fontSize: 16, margin: 0 }}>
              AmritKrishi Assistant
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%',
                            background: '#22C55E',
                            boxShadow: '0 0 6px #22C55E',
                            animation: 'pulse 2s infinite' }} />
              <p style={{ color: '#22C55E', fontSize: 12, margin: 0 }}>Online • AI Powered</p>
            </div>
          </div>
        </div>

        {/* Language Selector */}
        <div style={{ position: 'relative' }}>
          <button onClick={() => setShowLangMenu(!showLangMenu)}
            style={{
              background: '#0F1A0F', border: '1px solid #2D4A2D',
              borderRadius: 8, color: '#fff', padding: '8px 14px',
              cursor: 'pointer', fontSize: 14, fontWeight: 600,
              display: 'flex', alignItems: 'center', gap: 6
            }}>
            {currentLang.label} ▾
          </button>

          {showLangMenu && (
            <div style={{
              position: 'absolute', top: '110%', right: 0,
              background: '#162116', border: '1px solid #2D4A2D',
              borderRadius: 10, overflow: 'hidden', zIndex: 100,
              minWidth: 140
            }}>
              {LANGUAGES.map(lang => (
                <button key={lang.code}
                  onClick={() => { setLanguage(lang.code); setShowLangMenu(false) }}
                  style={{
                    display: 'block', width: '100%', padding: '10px 16px',
                    background: language === lang.code ? '#1E3A1E' : 'transparent',
                    border: 'none', color: language === lang.code ? '#22C55E' : '#9CA3AF',
                    cursor: 'pointer', textAlign: 'left', fontSize: 14,
                    borderLeft: language === lang.code ? '3px solid #22C55E' : '3px solid transparent'
                  }}>
                  {lang.label} — {lang.full}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Messages Area */}
      <div style={{
        flex: 1, overflowY: 'auto', padding: '20px 24px', paddingBottom: '160px',
        display: 'flex', flexDirection: 'column'
      }}>
        {messages.map((msg, i) => (
          <Message key={i} msg={msg} />
        ))}

        {loading && (
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, marginBottom: 12 }}>
            <div style={{
              width: 32, height: 32, borderRadius: '50%',
              background: 'linear-gradient(135deg, #166534, #22C55E)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16
            }}>🌾</div>
            <TypingIndicator />
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input Bar Fixed Bottom */}
      <div style={{
        position: 'fixed', bottom: 0, left: 240, right: 0,
        padding: '16px 24px', background: '#0A0F0A',
        borderTop: '1px solid #2D4A2D', zIndex: 10
      }}>
        {/* Quick Suggestion Chips */}
        {messages.length <= 1 && (
          <div style={{ display: 'flex', gap: 8, marginBottom: 12, flexWrap: 'wrap' }}>
            {QUICK_SUGGESTIONS.map((s, i) => (
              <button key={i} onClick={() => sendMessage(s.text)}
                style={{
                  padding: '6px 14px', borderRadius: 20, border: '1px solid #2D4A2D',
                  background: 'transparent', color: '#9CA3AF', fontSize: 13, cursor: 'pointer',
                  transition: 'all 0.15s', display: 'flex', alignItems: 'center', gap: 6
                }}
                onMouseEnter={e => { e.target.style.borderColor = '#22C55E'; e.target.style.color = '#22C55E' }}
                onMouseLeave={e => { e.target.style.borderColor = '#2D4A2D'; e.target.style.color = '#9CA3AF' }}>
                {s.icon} {s.text}
              </button>
            ))}
          </div>
        )}

        {/* Input row */}
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={
              language === 'ta' ? 'உங்கள் கேள்வியை தட்டச்சு செய்யுங்கள்...' :
              language === 'hi' ? 'अपना सवाल टाइप करें...' :
              'Ask about crops, diseases, weather, schemes...'
            }
            disabled={loading}
            autoFocus
            style={{
              flex: 1, background: '#162116', border: '1px solid #2D4A2D',
              borderRadius: 12, color: '#ffffff', padding: '12px 16px',
              fontSize: 15, outline: 'none', pointerEvents: 'all', cursor: 'text',
              caretColor: '#22C55E'
            }}
          />
          <button
            onClick={() => sendMessage()}
            disabled={!input.trim() || loading}
            style={{
              width: 48, height: 48, borderRadius: 12, border: 'none',
              background: input.trim() && !loading ? '#22C55E' : '#2D4A2D',
              color: input.trim() && !loading ? '#000' : '#4B5563',
              fontSize: 20, cursor: input.trim() && !loading ? 'pointer' : 'not-allowed',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'all 0.15s', pointerEvents: 'all'
            }}>
            {loading ? '⏳' : '➤'}
          </button>
        </div>
        <p style={{ color: '#374151', fontSize: 11, textAlign: 'center', margin: '8px 0 0' }}>
          AI can make mistakes. Verify important farming decisions with local experts.
        </p>
      </div>

      <style>{`
        @keyframes bounce {
          0%, 60%, 100% { transform: translateY(0); }
          30% { transform: translateY(-8px); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #2D4A2D; border-radius: 4px; }
      `}</style>
    </div>
  )
}
