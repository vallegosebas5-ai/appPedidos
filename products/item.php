<?php
require_once __DIR__ . '/../helpers.php';

$method = $_SERVER['REQUEST_METHOD'];
$id     = $_GET['id'] ?? '';
if (!$id) err('ID requerido');

$payload = auth();
$pdo     = db();

$stmt = $pdo->prepare('SELECT * FROM products WHERE id = ?');
$stmt->execute([$id]);
$product = $stmt->fetch();
if (!$product) err('Producto no encontrado', 404);

if ($method === 'PUT') {
    $b      = body();
    $fields = [];
    $params = [];

    foreach (['name','description','category'] as $f) {
        if (isset($b[$f])) { $fields[] = "$f = ?"; $params[] = $b[$f]; }
    }
    if (isset($b['price']))     { $fields[] = 'price = ?';     $params[] = (float)$b['price']; }
    if (isset($b['available'])) { $fields[] = 'available = ?'; $params[] = (int)$b['available']; }
    if (isset($b['image']) && $b['image']) {
        $url      = save_image($b['image']);
        $fields[] = 'image_url = ?';
        $params[] = $url;
    }
    if ($fields) {
        $params[] = $id;
        $pdo->prepare('UPDATE products SET ' . implode(', ', $fields) . ' WHERE id = ?')->execute($params);
    }
    $stmt->execute([$id]);
    $stmt = $pdo->prepare('SELECT * FROM products WHERE id = ?');
    $stmt->execute([$id]);
    ok(camel($stmt->fetch()));
}

if ($method === 'DELETE') {
    $pdo->prepare('DELETE FROM products WHERE id = ?')->execute([$id]);
    ok(['deleted' => true]);
}

err('Método no permitido', 405);
