const API_URL = 'http://localhost:3000/api';

export async function generateQRForCoins(userId, coinsAmount, priceUsd) {
  const response = await fetch(`${API_URL}/generate-qr-coins`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ userId, coinsAmount, priceUsd }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Error al generar QR');
  }

  return data;
}

export async function generateQRForMembership(userId, membershipId) {
  const response = await fetch(`${API_URL}/generate-qr-membership`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ userId, membershipId }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Error al generar QR de membresía');
  }

  return data;
}

export async function confirmPayment(transactionId) {
  const response = await fetch(`${API_URL}/confirm-payment`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ transactionId }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Error al confirmar pago');
  }

  return data;
}

export async function getMemberships() {
  const response = await fetch(`${API_URL}/memberships`);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Error al obtener membresías');
  }

  return data;
}

export async function getTransactionHistory(userId) {
  const response = await fetch(`${API_URL}/transactions/${userId}`);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Error al obtener historial');
  }

  return data;
}
