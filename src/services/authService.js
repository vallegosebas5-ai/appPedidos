const API_URL = 'http://localhost:3000/api';

export async function registerUser(formData) {
  const response = await fetch(`${API_URL}/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(formData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Error al registrarse');
  }

  return data;
}

export async function loginUser(formData) {
  const response = await fetch(`${API_URL}/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(formData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Error al iniciar sesión');
  }

  return data;
}

export async function getProfile(userId) {
  const response = await fetch(`${API_URL}/profile/${userId}`);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Error al obtener perfil');
  }

  return data;
}

export async function updateProfile(userId, formData) {
  const response = await fetch(`${API_URL}/profile/${userId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(formData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Error al actualizar perfil');
  }

  return data;
}

export async function buyCoins(userId, amount) {
  const response = await fetch(`${API_URL}/buy-coins`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ userId, amount }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Error al comprar monedas');
  }

  return data;
}

// Nuevos servicios de pago
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
