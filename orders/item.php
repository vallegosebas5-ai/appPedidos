<?php
require_once __DIR__ . '/../helpers.php';

$method  = $_SERVER['REQUEST_METHOD'];
$id      = $_GET['id'] ?? '';
if (!$id) err('ID requerido');

$payload = auth();
$pdo     = db();

$stmt = $pdo->prepare('SELECT * FROM orders WHERE id = ?');
$stmt->execute([$id]);
$order = $stmt->fetch();
if (!$order) err('Pedido no encontrado', 404);

if ($method === 'GET') {
    $s = $pdo->prepare('SELECT * FROM order_items WHERE order_id = ?');
    $s->execute([$id]);
    $order = camel($order);
    $order['items'] = camels($s->fetchAll());
    ok($order);
}

if ($method === 'PUT') {
    $b      = body();
    $status = $b['status'] ?? '';
    $allowed = ['pending','processing','delivered','cancelled'];
    if (!in_array($status, $allowed)) err('Estado inválido');

    $pdo->prepare('UPDATE orders SET status = ? WHERE id = ?')->execute([$status, $id]);
    ok(['id' => $id, 'status' => $status]);
}

err('Método no permitido', 405);
