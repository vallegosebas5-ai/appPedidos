<?php
require_once __DIR__ . '/../helpers.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') err('Método no permitido', 405);

$b        = body();
$email    = trim($b['email'] ?? '');
$password = $b['password'] ?? '';

if (!$email || !$password) err('Faltan campos');

$pdo  = db();
$stmt = $pdo->prepare('SELECT * FROM users WHERE email = ?');
$stmt->execute([$email]);
$user = $stmt->fetch();

if (!$user || !password_verify($password, $user['password_hash'])) err('Credenciales incorrectas', 401);

$token = jwt_create(['uid' => $user['id'], 'role' => $user['role'], 'exp' => time() + 60 * 60 * 24 * 30]);
unset($user['password_hash']);
$user['uid'] = $user['id'];
unset($user['id']);
ok(['token' => $token, 'user' => $user]);
