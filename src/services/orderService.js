const API_URL = 'http://localhost:3000/api';

export async function createOrder(orderData) {
  const response = await fetch(`${API_URL}/orders`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(orderData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Error al crear pedido');
  }

  return data;
}

export async function getUserOrders(userId) {
  const response = await fetch(`${API_URL}/orders/user/${userId}`);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Error al obtener pedidos');
  }

  return data.orders;
}

export async function getOrdersByProducer(producerId) {
  const response = await fetch(`${API_URL}/orders/producer/${producerId}`);
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Error al obtener ventas del productor');
  }
  return data.orders;
}
