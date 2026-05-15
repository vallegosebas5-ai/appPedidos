<?php
require_once __DIR__ . '/../helpers.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') err('Método no permitido', 405);

$payload = auth();
$pdo     = db();
$stmt    = $pdo->prepare('SELECT id, email, name, role, photo, coins, created_at FROM users WHERE id = ?');
$stmt->execute([$payload['uid']]);
$user = $stmt->fetch();
if (!$user) err('Usuario no encontrado', 404);

$user['uid'] = $user['id'];
unset($user['id']);
ok($user);
