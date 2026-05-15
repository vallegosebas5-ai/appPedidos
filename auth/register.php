<?php
require_once __DIR__ . '/../helpers.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') err('Método no permitido', 405);

$b = body();
$email    = trim($b['email'] ?? '');
$password = $b['password'] ?? '';
$name     = trim($b['name'] ?? '');
$role     = $b['role'] ?? 'comprador';
$photo    = $b['photo'] ?? '';

if (!$email || !$password || !$name) err('Faltan campos requeridos');
if (!in_array($role, ['comprador', 'vendedor'])) err('Rol inválido');

$pdo = db();
$stmt = $pdo->prepare('SELECT id FROM users WHERE email = ?');
$stmt->execute([$email]);
if ($stmt->fetch()) err('El correo ya está registrado');

$photoUrl = '';
if ($photo) $photoUrl = save_image($photo);

$id   = uuid();
$hash = password_hash($password, PASSWORD_BCRYPT);
$pdo->prepare('INSERT INTO users (id, email, password_hash, name, role, photo, coins) VALUES (?,?,?,?,?,?,0)')
    ->execute([$id, $email, $hash, $name, $role, $photoUrl]);

$token = jwt_create(['uid' => $id, 'role' => $role, 'exp' => time() + 60 * 60 * 24 * 30]);
ok(['token' => $token, 'user' => ['uid' => $id, 'email' => $email, 'name' => $name, 'role' => $role, 'photo' => $photoUrl, 'coins' => 0]]);
