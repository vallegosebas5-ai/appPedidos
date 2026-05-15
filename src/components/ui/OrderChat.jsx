import { useEffect, useRef, useState } from 'react'
import { sendMessage, subscribeToMessages } from '../../services/chat'
import { Send, MessageCircle } from 'lucide-react'

function formatTime(ts) {
  if (!ts) return ''
  const d = ts.toDate ? ts.toDate() : new Date(ts)
  return d.toLocaleTimeString('es-BO', { hour: '2-digit', minute: '2-digit' })
}

export default function OrderChat({ orderId, senderId, senderName, senderRole }) {
  const [messages, setMessages] = useState([])
  const [text, setText] = useState('')
  const [sending, setSending] = useState(false)
  const bottomRef = useRef(null)

  useEffect(() => {
    const unsub = subscribeToMessages(orderId, setMessages)
    return unsub
  }, [orderId])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  async function handleSend(e) {
    e.preventDefault()
    if (!text.trim()) return
    setSending(true)
    try {
      await sendMessage(orderId, { text: text.trim(), senderId, senderName, senderRole })
      setText('')
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="mt-4 pt-4 border-t border-gray-100">
      <p className="text-xs font-semibold text-gray-400 mb-3 flex items-center gap-1.5">
        <MessageCircle size={13} />
        Chat del pedido
      </p>

      {/* Mensajes */}
      <div className="h-48 overflow-y-auto space-y-2 mb-3 pr-1">
        {messages.length === 0 ? (
          <p className="text-center text-xs text-gray-300 pt-10">
            Aún no hay mensajes. ¡Escribe el primero!
          </p>
        ) : (
          messages.map((msg) => {
            const isMe = msg.senderId === senderId
            return (
              <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[75%] px-3 py-2 rounded-2xl text-sm ${
                  isMe
                    ? 'bg-orange-500 text-white rounded-br-sm'
                    : 'bg-gray-100 text-gray-700 rounded-bl-sm'
                }`}>
                  {!isMe && (
                    <p className="text-xs font-semibold mb-0.5 text-orange-500">{msg.senderName}</p>
                  )}
                  <p className="leading-snug">{msg.text}</p>
                  <p className={`text-xs mt-1 text-right ${isMe ? 'text-orange-200' : 'text-gray-400'}`}>
                    {formatTime(msg.createdAt)}
                  </p>
                </div>
              </div>
            )
          })
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSend} className="flex gap-2">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Escribe un mensaje..."
          className="flex-1 px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition"
        />
        <button
          type="submit"
          disabled={sending || !text.trim()}
          className="p-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl transition disabled:opacity-40"
        >
          <Send size={16} />
        </button>
      </form>
    </div>
  )
}
