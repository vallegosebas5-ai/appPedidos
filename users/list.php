<?php
require_once __DIR__ . '/../helpers.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') err('Método no permitido', 405);

$payload = auth();
if ($payload['role'] !== 'admin') err('Solo admin', 403);

$stmt = db()->query('SELECT id, email, name, role, photo, coins, created_at FROM users ORDER BY created_at DESC');
$users = $stmt->fetchAll();
foreach ($users as &$u) { $u['uid'] = $u['id']; unset($u['id']); }
ok($users);
