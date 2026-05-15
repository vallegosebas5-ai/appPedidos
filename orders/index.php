<?php
require_once __DIR__ . '/../helpers.php';

$method  = $_SERVER['REQUEST_METHOD'];
$payload = auth();
$pdo     = db();

if ($method === 'GET') {
    $sql    = 'SELECT * FROM orders WHERE 1=1';
    $params = [];

    if (!empty($_GET['buyerId'])) {
        $sql .= ' AND buyer_id = ?';
        $params[] = $_GET['buyerId'];
    } elseif (!empty($_GET['sellerId'])) {
        $sql .= ' AND seller_id = ?';
        $params[] = $_GET['sellerId'];
    } elseif ($payload['role'] !== 'admin') {
        err('No autorizado', 403);
    }
    $sql .= ' ORDER BY created_at DESC';

    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);
    $orders = $stmt->fetchAll();

    $orders = camels($orders);
    foreach ($orders as &$order) {
        $s = $pdo->prepare('SELECT * FROM order_items WHERE order_id = ?');
        $s->execute([$order['id']]);
        $order['items'] = camels($s->fetchAll());
    }
    ok($orders);
}

if ($method === 'POST') {
    if ($payload['role'] !== 'comprador') err('Solo compradores pueden crear pedidos', 403);

    $b     = body();
    $items = $b['items'] ?? [];
    $paymentMethod = $b['paymentMethod'] ?? '';
    if (empty($items) || !$paymentMethod) err('Faltan datos del pedido');

    $stmt = $pdo->prepare('SELECT name FROM users WHERE id = ?');
    $stmt->execute([$payload['uid']]);
    $urow = $stmt->fetch();
    $buyerName = $urow ? $urow['name'] : '';

    // Group by seller
    $bySeller = [];
    foreach ($items as $item) {
        $sid = $item['sellerId'] ?? 'unknown';
        if (!isset($bySeller[$sid])) {
            $bySeller[$sid] = ['sellerName' => $item['sellerName'] ?? '', 'items' => []];
        }
        $bySeller[$sid]['items'][] = $item;
    }

    $orderIds = [];
    foreach ($bySeller as $sellerId => $data) {
        $sellerTotal = array_reduce($data['items'], fn($s, $i) => $s + (float)$i['price'] * (int)$i['qty'], 0);
        $orderId     = uuid();

        $pdo->prepare('INSERT INTO orders (id, buyer_id, buyer_name, seller_id, seller_name, total, payment_method, status) VALUES (?,?,?,?,?,?,?,?)')
            ->execute([$orderId, $payload['uid'], $buyerName, $sellerId, $data['sellerName'], $sellerTotal, $paymentMethod, 'pending']);

        foreach ($data['items'] as $item) {
            $pdo->prepare('INSERT INTO order_items (order_id, product_id, name, price, qty, image_url, seller_id, seller_name) VALUES (?,?,?,?,?,?,?,?)')
                ->execute([$orderId, $item['id'] ?? '', $item['name'] ?? '', (float)$item['price'], (int)$item['qty'], $item['imageUrl'] ?? '', $sellerId, $data['sellerName']]);
        }
        $orderIds[] = $orderId;
    }
    ok(['ids' => $orderIds], 201);
}

err('Método no permitido', 405);
