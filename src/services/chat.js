import { apiFetch } from './api'

export async function sendMessage(orderId, { text, senderId, senderName, senderRole }) {
  return apiFetch(`/orders/messages.php?orderId=${orderId}`, {
    method: 'POST',
    body: JSON.stringify({ text, senderName, senderRole }),
  })
}

// Polling-based subscription (replaces Firebase onSnapshot)
export function subscribeToMessages(orderId, callback) {
  let active = true
  const poll = async () => {
    if (!active) return
    try {
      const msgs = await apiFetch(`/orders/messages.php?orderId=${orderId}`)
      callback(msgs)
    } catch { /* ignore */ }
    if (active) setTimeout(poll, 3000)
  }
  poll()
  return () => { active = false }
}
