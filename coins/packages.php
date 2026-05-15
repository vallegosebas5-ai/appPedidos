<?php
require_once __DIR__ . '/../helpers.php';

$method = $_SERVER['REQUEST_METHOD'];
$pdo    = db();

if ($method === 'GET') {
    $stmt = $pdo->query('SELECT * FROM coin_packages ORDER BY coins ASC');
    ok($stmt->fetchAll());
}

if ($method === 'POST') {
    $payload = auth();
    if ($payload['role'] !== 'admin') err('Solo admin', 403);
    $b    = body();
    $id   = uuid();
    $pdo->prepare('INSERT INTO coin_packages (id, name, coins, price) VALUES (?,?,?,?)')
        ->execute([$id, $b['name'], (int)$b['coins'], (float)$b['price']]);
    ok(['id' => $id, ...$b], 201);
}

if ($method === 'DELETE') {
    $payload = auth();
    if ($payload['role'] !== 'admin') err('Solo admin', 403);
    $id = $_GET['id'] ?? '';
    if (!$id) err('ID requerido');
    $pdo->prepare('DELETE FROM coin_packages WHERE id = ?')->execute([$id]);
    ok(['deleted' => true]);
}

err('Método no permitido', 405);
