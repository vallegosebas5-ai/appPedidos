const API_URL = 'http://localhost:3000/api';

export async function getProducts() {
  const response = await fetch(`${API_URL}/products`);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Error al obtener productos');
  }

  return data.products;
}

export async function searchProducts(query) {
  const response = await fetch(
    `${API_URL}/products/search?q=${encodeURIComponent(query)}`
  );
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Error al buscar productos');
  }

  return data.products;
}

export async function getProductById(id) {
  const response = await fetch(`${API_URL}/products/${id}`);
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'Error al obtener producto');
  return data.product;
}

export async function getProductsByProducer(producerId) {
  const response = await fetch(`${API_URL}/products/producer/${producerId}`);
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'Error');
  return data.products;
}

export async function createProduct(productData) {
  const response = await fetch(`${API_URL}/products`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(productData),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'Error');
  return data;
}

export async function updateProduct(id, productData) {
  const response = await fetch(`${API_URL}/products/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(productData),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'Error');
  return data;
}
