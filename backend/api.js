import http from 'http';
import { parse } from 'url';

const PORT = 5000;

function getBody(req) {
  return new Promise((resolve) => {
    let body = '';
    req.on('data', chunk => body += chunk.toString());
    req.on('end', () => {
      try { resolve(JSON.parse(body)); }
      catch { resolve({}); }
    });
  });
}

function sendJSON(res, status, data) {
  res.writeHead(status, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization'
  });
  res.end(JSON.stringify(data));
}

const server = http.createServer(async (req, res) => {
  const parsedUrl = parse(req.url, true);
  const pathname = parsedUrl.pathname;
  const method = req.method;

  console.log(`\n📨 ${method} ${pathname}`);

  if (method === 'OPTIONS') {
    res.writeHead(200, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization'
    });
    res.end();
    return;
  }

  const body = method !== 'GET' ? await getBody(req) : {};
  if (Object.keys(body).length > 0) console.log('Body:', JSON.stringify(body, null, 2));

  // ── Auth ──
  if (pathname === '/api/register' && method === 'POST') {
    if (!body.name || !body.email || !body.password)
      return sendJSON(res, 400, { success: false, message: 'Nombre, correo y contraseña son obligatorios.' });
    return sendJSON(res, 201, {
      success: true, message: 'Usuario registrado exitosamente',
      user: { id: 'user_' + Date.now(), email: body.email, name: body.name, role: body.role || 'cliente', coins: 0 }
    });
  }

  if (pathname === '/api/login' && method === 'POST') {
    if (!body.email || !body.password)
      return sendJSON(res, 400, { success: false, message: 'Correo y contraseña son obligatorios.' });
    return sendJSON(res, 200, {
      success: true, message: 'Login exitoso',
      token: 'token_' + Date.now(),
      user: { id: 'user_123', email: body.email, name: 'Usuario Test', role: body.role || 'cliente', coins: 50 }
    });
  }

  if (pathname === '/api/logout' && method === 'POST')
    return sendJSON(res, 200, { success: true, message: 'Logout exitoso' });

  if (pathname === '/api/verify' && method === 'GET')
    return sendJSON(res, 200, { success: true, authenticated: true });

  if (pathname === '/api/me' && method === 'GET')
    return sendJSON(res, 200, { success: true, user: { id: 'user_123', email: 'test@test.com', name: 'Usuario Test', role: 'productor', coins: 50 } });

  // ── Perfil ──
  if (pathname.startsWith('/api/profile/') && method === 'GET')
    return sendJSON(res, 200, { success: true, user: { id: pathname.split('/api/profile/')[1], name: 'Usuario Test', email: 'test@test.com', role: 'productor', coins: 50 } });

  if (pathname.startsWith('/api/profile/') && method === 'PUT')
    return sendJSON(res, 200, { success: true, message: 'Perfil actualizado correctamente' });

  // ── Productos ──
  if (pathname === '/api/products' && method === 'GET')
    return sendJSON(res, 200, { success: true, products: [
      { id: 1, name: 'Tomates frescos', price: 50, category: 'Verduras', stock: 100, producer: 'Productor Test', image: '' },
      { id: 2, name: 'Queso artesanal', price: 200, category: 'Lácteos', stock: 30, producer: 'Productor Test', image: '' }
    ]});

  if (pathname === '/api/products' && method === 'POST')
    return sendJSON(res, 201, { success: true, message: 'Producto creado', product: { id: Date.now(), ...body } });

  if (pathname.startsWith('/api/products/producer/') && method === 'GET')
    return sendJSON(res, 200, { success: true, products: [
      { id: 1, name: 'Tomates frescos', price: 50, category: 'Verduras', stock: 100 }
    ]});

  if (pathname.startsWith('/api/products/') && method === 'PUT')
    return sendJSON(res, 200, { success: true, message: 'Producto actualizado' });

  if (pathname.startsWith('/api/products/') && method === 'GET')
    return sendJSON(res, 200, { success: true, product: { id: pathname.split('/api/products/')[1], name: 'Producto', price: 100, stock: 10 } });

  // ── Órdenes ──
  if (pathname === '/api/orders' && method === 'POST')
    return sendJSON(res, 200, { success: true, orderId: 'order_' + Date.now(), message: 'Orden creada exitosamente' });

  if (pathname.startsWith('/api/orders/user/') && method === 'GET')
    return sendJSON(res, 200, { success: true, orders: [
      { id: 1, total: 150.00, status: 'pendiente',   type: 'delivery', payment_method: 'efectivo',      created_at: new Date().toISOString(), items: [] },
      { id: 2, total: 80.00,  status: 'completado',  type: 'pickup',   payment_method: 'transferencia', created_at: new Date().toISOString(), items: [] }
    ]});

  if (pathname.startsWith('/api/orders/producer/') && method === 'GET')
    return sendJSON(res, 200, { success: true, orders: [
      { id: 10, buyer_name: 'Cliente Test', total: 200.00, status: 'pendiente', delivery_type: 'delivery', created_at: new Date().toISOString() }
    ]});

  // ── Pagos y monedas ──
  if (pathname === '/api/generate-qr-coins' && method === 'POST')
    return sendJSON(res, 200, { success: true, transactionId: 'txn_' + Date.now(), qrImage: null, message: 'QR generado' });

  if (pathname === '/api/generate-qr-membership' && method === 'POST')
    return sendJSON(res, 200, { success: true, transactionId: 'txn_mbr_' + Date.now(), qrImage: null, message: 'QR membresía generado' });

  if (pathname === '/api/confirm-payment' && method === 'POST')
    return sendJSON(res, 200, { success: true, message: 'Pago confirmado correctamente' });

  // ── Membresías ──
  if (pathname === '/api/memberships' && method === 'GET')
    return sendJSON(res, 200, { success: true, memberships: [
      { id: 1, name: 'Básico',      price: 4.99,  max_products: 10,   features: ['10 productos', 'Sin destacados'] },
      { id: 2, name: 'Profesional', price: 9.99,  max_products: 50,   features: ['50 productos', 'Destacados incluidos'] },
      { id: 3, name: 'Premium',     price: 19.99, max_products: null,  features: ['Ilimitados', 'Soporte premium'] }
    ]});

  // ── Not found ──
  console.log('❌ Ruta no encontrada:', pathname);
  return sendJSON(res, 404, { success: false, message: `Ruta no encontrada: ${method} ${pathname}` });
});

server.listen(PORT, () => {
  console.log(`\n✅ Backend API iniciado en http://localhost:${PORT}`);
  console.log('Esperando peticiones...\n');
});
