import { apiFetch, fileToBase64 } from './api'

export async function getPaymentSettings() {
  return apiFetch('/settings/payment.php')
}

export async function updatePaymentSettings(imageFile) {
  const image = imageFile ? await fileToBase64(imageFile) : ''
  return apiFetch('/settings/payment.php', {
    method: 'POST',
    body: JSON.stringify({ image }),
  })
}
