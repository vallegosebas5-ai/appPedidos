import { apiFetch } from './api'

export const ORDER_STATUS = {
  pending:    { label: 'Pendiente',  color: 'bg-yellow-100 text-yellow-700' },
  processing: { label: 'En proceso', color: 'bg-blue-100 text-blue-700' },
  delivered:  { label: 'Entregado',  color: 'bg-green-100 text-green-700' },
  cancelled:  { label: 'Cancelado',  color: 'bg-red-100 text-red-700' },
}

export async function createOrder(buyerId, buyerName, items, paymentMethod, total) {
  const sanitized = items.map((item) => ({
    id:         item.id,
    name:       item.name,
    price:      Number(item.price),
    qty:        item.qty,
    imageUrl:   item.imageUrl ?? '',
    sellerId:   item.sellerId ?? '',
    sellerName: item.sellerName ?? '',
  }))
  const res = await apiFetch('/orders/index.php', {
    method: 'POST',
    body: JSON.stringify({ items: sanitized, paymentMethod, total }),
  })
  return res.ids
}

export async function getBuyerOrders(buyerId) {
  return apiFetch(`/orders/index.php?buyerId=${buyerId}`)
}

export async function getSellerOrders(sellerId) {
  return apiFetch(`/orders/index.php?sellerId=${sellerId}`)
}

export async function getAllOrders() {
  return apiFetch('/orders/index.php?all=1')
}

export async function updateOrderStatus(orderId, status) {
  return apiFetch(`/orders/item.php?id=${orderId}`, {
    method: 'PUT',
    body: JSON.stringify({ status }),
  })
}

// Polling-based subscription (replaces Firebase onSnapshot)
export function subscribeSellerOrders(sellerId, callback) {
  let active = true
  const poll = async () => {
    if (!active) return
    try {
      const orders = await getSellerOrders(sellerId)
      callback(orders)
    } catch { /* ignore */ }
    if (active) setTimeout(poll, 4000)
  }
  poll()
  return () => { active = false }
}
