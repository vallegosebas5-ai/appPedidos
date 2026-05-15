<?php
require_once __DIR__ . '/../helpers.php';

$method  = $_SERVER['REQUEST_METHOD'];
$orderId = $_GET['orderId'] ?? '';
if (!$orderId) err('orderId requerido');

$payload = auth();
$pdo     = db();

if ($method === 'GET') {
    $stmt = $pdo->prepare('SELECT * FROM order_messages WHERE order_id = ? ORDER BY created_at ASC');
    $stmt->execute([$orderId]);
    ok(camels($stmt->fetchAll()));
}

if ($method === 'POST') {
    $b = body();
    $text       = trim($b['text'] ?? '');
    $senderName = $b['senderName'] ?? '';
    $senderRole = $b['senderRole'] ?? '';
    if (!$text) err('Mensaje vacío');

    $pdo->prepare('INSERT INTO order_messages (order_id, sender_id, sender_name, sender_role, text) VALUES (?,?,?,?,?)')
        ->execute([$orderId, $payload['uid'], $senderName, $senderRole, $text]);

    ok(['id' => $pdo->lastInsertId(), 'orderId' => $orderId, 'senderId' => $payload['uid'], 'senderName' => $senderName, 'senderRole' => $senderRole, 'text' => $text, 'createdAt' => date('Y-m-d H:i:s')], 201);
}

err('Método no permitido', 405);
