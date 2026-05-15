import { apiFetch, fileToBase64 } from './api'

export const COIN_COST_PER_PRODUCT = 1

export async function getProducts(filters = {}) {
  const params = new URLSearchParams()
  if (filters.sellerId)                        params.set('sellerId', filters.sellerId)
  if (filters.category && filters.category !== 'Todos') params.set('category', filters.category)
  if (filters.search)                          params.set('search', filters.search)
  const qs = params.toString()
  return apiFetch(`/products/index.php${qs ? '?' + qs : ''}`)
}

export async function createProduct(data, imageFile, userId, userName) {
  const image = imageFile ? await fileToBase64(imageFile) : ''
  return apiFetch('/products/index.php', {
    method: 'POST',
    body: JSON.stringify({ ...data, image }),
  })
}

export async function updateProduct(id, data, imageFile) {
  const image = imageFile ? await fileToBase64(imageFile) : ''
  return apiFetch(`/products/item.php?id=${id}`, {
    method: 'PUT',
    body: JSON.stringify({ ...data, ...(image ? { image } : {}) }),
  })
}

export async function deleteProduct(id) {
  return apiFetch(`/products/item.php?id=${id}`, { method: 'DELETE' })
}

export async function toggleProductAvailability(id, available) {
  return apiFetch(`/products/item.php?id=${id}`, {
    method: 'PUT',
    body: JSON.stringify({ available: available ? 1 : 0 }),
  })
}
