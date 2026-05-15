<?php
require_once __DIR__ . '/../helpers.php';

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    $pdo  = db();
    $sql  = 'SELECT * FROM products WHERE 1=1';
    $params = [];

    if (!empty($_GET['sellerId'])) {
        $sql .= ' AND seller_id = ?';
        $params[] = $_GET['sellerId'];
    }
    if (!empty($_GET['category']) && $_GET['category'] !== 'Todos') {
        $sql .= ' AND category = ?';
        $params[] = $_GET['category'];
    }
    if (!empty($_GET['search'])) {
        $sql .= ' AND name LIKE ?';
        $params[] = '%' . $_GET['search'] . '%';
    }
    $sql .= ' ORDER BY created_at DESC';

    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);
    ok(camels($stmt->fetchAll()));
}

if ($method === 'POST') {
    $payload = auth();
    if ($payload['role'] !== 'vendedor') err('Solo vendedores pueden crear productos', 403);

    $b = body();
    $name     = trim($b['name'] ?? '');
    $price    = $b['price'] ?? null;
    $category = $b['category'] ?? '';
    $desc     = $b['description'] ?? '';
    $imageB64 = $b['image'] ?? '';

    if (!$name || $price === null) err('Faltan campos requeridos');

    $pdo = db();
    $stmt = $pdo->prepare('SELECT name FROM users WHERE id = ?');
    $stmt->execute([$payload['uid']]);
    $urow = $stmt->fetch();
    if (!$urow) err('Usuario no encontrado', 404);

    $imageUrl = $imageB64 ? save_image($imageB64) : '';
    $id = uuid();
    $pdo->prepare('INSERT INTO products (id, seller_id, seller_name, name, description, price, category, image_url, available) VALUES (?,?,?,?,?,?,?,?,1)')
        ->execute([$id, $payload['uid'], $urow['name'], $name, $desc, (float)$price, $category, $imageUrl]);

    $stmt = $pdo->prepare('SELECT * FROM products WHERE id = ?');
    $stmt->execute([$id]);
    ok(camel($stmt->fetch()), 201);
}

err('Método no permitido', 405);
