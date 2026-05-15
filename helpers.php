<?php
require_once __DIR__ . '/config.php';

// CORS
header('Access-Control-Allow-Origin: http://localhost:5173');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

// JSON helpers
function ok($data = [], int $code = 200): void {
    http_response_code($code);
    echo json_encode($data);
    exit;
}

function err(string $msg, int $code = 400): void {
    http_response_code($code);
    echo json_encode(['error' => $msg]);
    exit;
}

function body(): array {
    return json_decode(file_get_contents('php://input'), true) ?? [];
}

// UUID v4
function uuid(): string {
    return sprintf('%04x%04x-%04x-%04x-%04x-%04x%04x%04x',
        mt_rand(0, 0xffff), mt_rand(0, 0xffff),
        mt_rand(0, 0xffff),
        mt_rand(0, 0x0fff) | 0x4000,
        mt_rand(0, 0x3fff) | 0x8000,
        mt_rand(0, 0xffff), mt_rand(0, 0xffff), mt_rand(0, 0xffff)
    );
}

// JWT
function b64url(string $data): string {
    return rtrim(strtr(base64_encode($data), '+/', '-_'), '=');
}
function b64url_decode(string $data): string {
    return base64_decode(strtr($data, '-_', '+/') . str_repeat('=', (4 - strlen($data) % 4) % 4));
}
function jwt_create(array $payload): string {
    $h = b64url(json_encode(['alg' => 'HS256', 'typ' => 'JWT']));
    $p = b64url(json_encode($payload));
    $s = b64url(hash_hmac('sha256', "$h.$p", JWT_SECRET, true));
    return "$h.$p.$s";
}
function jwt_verify(string $token): ?array {
    $parts = explode('.', $token);
    if (count($parts) !== 3) return null;
    [$h, $p, $s] = $parts;
    $expected = b64url(hash_hmac('sha256', "$h.$p", JWT_SECRET, true));
    if (!hash_equals($expected, $s)) return null;
    $payload = json_decode(b64url_decode($p), true);
    if (isset($payload['exp']) && $payload['exp'] < time()) return null;
    return $payload;
}

// Auth middleware — returns user array or calls err()
function auth(): array {
    // Apache en Windows puede bloquear el header Authorization,
    // así que lo buscamos en múltiples lugares
    $header = $_SERVER['HTTP_AUTHORIZATION']
           ?? $_SERVER['REDIRECT_HTTP_AUTHORIZATION']
           ?? '';

    if (!$header && function_exists('apache_request_headers')) {
        $all = apache_request_headers();
        $header = $all['Authorization'] ?? $all['authorization'] ?? '';
    }

    if (!preg_match('/^Bearer\s+(.+)$/i', $header, $m)) err('No autorizado', 401);
    $payload = jwt_verify($m[1]);
    if (!$payload) err('Token inválido', 401);
    return $payload;
}

// snake_case → camelCase para respuestas JSON
function camel(array $row): array {
    $out = [];
    foreach ($row as $k => $v) {
        $out[lcfirst(str_replace('_', '', ucwords($k, '_')))] = $v;
    }
    return $out;
}
function camels(array $rows): array { return array_map('camel', $rows); }

// Save uploaded/base64 image to disk, return URL
function save_image(string $base64data): string {
    if (!is_dir(UPLOAD_DIR)) mkdir(UPLOAD_DIR, 0755, true);
    // Strip data URI prefix if present
    if (preg_match('/^data:image\/(\w+);base64,/', $base64data, $m)) {
        $ext = $m[1];
        $base64data = preg_replace('/^data:image\/\w+;base64,/', '', $base64data);
    } else {
        $ext = 'jpg';
    }
    $filename = uuid() . '.' . $ext;
    file_put_contents(UPLOAD_DIR . $filename, base64_decode($base64data));
    return UPLOAD_URL . $filename;
}
