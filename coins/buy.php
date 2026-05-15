<?php
require_once __DIR__ . '/../helpers.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') err('Método no permitido', 405);

$payload = auth();
$b       = body();
$packageId = $b['packageId'] ?? '';
$coins     = (int)($b['coins'] ?? 0);
$amount    = (float)($b['amount'] ?? 0);

if (!$coins) err('Datos inválidos');

$pdo = db();
$pdo->prepare('UPDATE users SET coins = coins + ? WHERE id = ?')->execute([$coins, $payload['uid']]);
$pdo->prepare('INSERT INTO coin_transactions (id, user_id, package_id, coins, amount, type) VALUES (?,?,?,?,?,?)')
    ->execute([uuid(), $payload['uid'], $packageId, $coins, $amount, 'purchase']);

$stmt = $pdo->prepare('SELECT coins FROM users WHERE id = ?');
$stmt->execute([$payload['uid']]);
ok(['coins' => (int)$stmt->fetchColumn()]);
