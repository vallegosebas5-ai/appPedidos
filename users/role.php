<?php
require_once __DIR__ . '/../helpers.php';

if ($_SERVER['REQUEST_METHOD'] !== 'PUT') err('Método no permitido', 405);

$payload = auth();
if ($payload['role'] !== 'admin') err('Solo admin', 403);

$b    = body();
$uid  = $b['uid'] ?? '';
$role = $b['role'] ?? '';
if (!$uid || !in_array($role, ['comprador','vendedor','admin'])) err('Datos inválidos');

db()->prepare('UPDATE users SET role = ? WHERE id = ?')->execute([$role, $uid]);
ok(['uid' => $uid, 'role' => $role]);
