import { apiFetch } from './api'

export async function getCoinPackages() {
  return apiFetch('/coins/packages.php')
}

export async function createCoinPackage(data) {
  return apiFetch('/coins/packages.php', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

export async function deleteCoinPackage(id) {
  return apiFetch(`/coins/packages.php?id=${id}`, { method: 'DELETE' })
}

export async function purchaseCoins(userId, packageId, coins, amount) {
  return apiFetch('/coins/buy.php', {
    method: 'POST',
    body: JSON.stringify({ packageId, coins, amount }),
  })
}

export async function deductCoins(userId, coins, reason) {
  return apiFetch('/coins/deduct.php', {
    method: 'POST',
    body: JSON.stringify({ coins, reason }),
  })
}

export async function getCoinTransactions() {
  return apiFetch('/coins/transactions.php')
}
