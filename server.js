import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = 3000;
const DIST_DIR = path.join(__dirname, 'dist');
const API_SERVER = 'http://localhost:5000';

const MIME = {
  '.html': 'text/html',
  '.js':   'application/javascript',
  '.css':  'text/css',
  '.svg':  'image/svg+xml',
  '.json': 'application/json',
  '.png':  'image/png',
  '.jpg':  'image/jpeg',
  '.gif':  'image/gif',
  '.webp': 'image/webp',
};

const server = http.createServer((req, res) => {
  if (req.url.startsWith('/api')) {
    const apiUrl = new URL(API_SERVER + req.url);
    const proxyReq = http.request({
      hostname: apiUrl.hostname,
      port: apiUrl.port,
      path: apiUrl.pathname + apiUrl.search,
      method: req.method,
      headers: { ...req.headers, host: apiUrl.host }
    }, (proxyRes) => {
      res.writeHead(proxyRes.statusCode, proxyRes.headers);
      proxyRes.pipe(res);
    });
    req.pipe(proxyReq);
    proxyReq.on('error', () => {
      res.writeHead(502, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: false, message: 'No se pudo conectar con el servidor. Intentá de nuevo.' }));
    });
    return;
  }

  let filePath = path.join(DIST_DIR, req.url === '/' ? 'index.html' : req.url);
  if (!filePath.startsWith(DIST_DIR)) { res.writeHead(403); res.end('Forbidden'); return; }
  if (!path.extname(filePath) || !fs.existsSync(filePath)) filePath = path.join(DIST_DIR, 'index.html');

  fs.readFile(filePath, (err, data) => {
    if (err) { res.writeHead(404); res.end('Not Found'); return; }
    res.writeHead(200, { 'Content-Type': MIME[path.extname(filePath)] || 'application/octet-stream' });
    res.end(data);
  });
});

server.listen(PORT, () => {
  console.log(`\n✅ Frontend en http://localhost:${PORT}`);
  console.log(`✅ Backend en ${API_SERVER}`);
  console.log('Presioná Ctrl+C para detener\n');
});
