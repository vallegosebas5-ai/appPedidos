<?php
require_once __DIR__ . '/../helpers.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') err('Método no permitido', 405);

$payload = auth();
if ($payload['role'] !== 'admin') err('Solo admin', 403);

$b      = body();
$uid    = $b['uid'] ?? '';
$amount = (int)($b['amount'] ?? 0);
if (!$uid || !$amount) err('Datos inválidos');

db()->prepare('UPDATE users SET coins = coins + ? WHERE id = ?')->execute([$amount, $uid]);
$stmt = db()->prepare('SELECT coins FROM users WHERE id = ?');
$stmt->execute([$uid]);
ok(['uid' => $uid, 'coins' => (int)$stmt->fetchColumn()]);
