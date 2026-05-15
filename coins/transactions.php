<?php
require_once __DIR__ . '/../helpers.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') err('Método no permitido', 405);

$payload = auth();
$pdo     = db();

if ($payload['role'] === 'admin') {
    $stmt = $pdo->query('SELECT * FROM coin_transactions ORDER BY created_at DESC');
} else {
    $stmt = $pdo->prepare('SELECT * FROM coin_transactions WHERE user_id = ? ORDER BY created_at DESC');
    $stmt->execute([$payload['uid']]);
}
ok($stmt->fetchAll());
