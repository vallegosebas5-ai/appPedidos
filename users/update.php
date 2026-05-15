<?php
require_once __DIR__ . '/../helpers.php';

if ($_SERVER['REQUEST_METHOD'] !== 'PUT') err('Método no permitido', 405);

$payload = auth();
$b       = body();

$fields = [];
$params = [];

if (isset($b['name'])) { $fields[] = 'name = ?';  $params[] = $b['name']; }
if (isset($b['photo'])) {
    $url      = save_image($b['photo']);
    $fields[] = 'photo = ?';
    $params[] = $url;
}
if (empty($fields)) err('Nada que actualizar');

$params[] = $payload['uid'];
db()->prepare('UPDATE users SET ' . implode(', ', $fields) . ' WHERE id = ?')->execute($params);

$stmt = db()->prepare('SELECT id, email, name, role, photo, coins FROM users WHERE id = ?');
$stmt->execute([$payload['uid']]);
$user = $stmt->fetch();
$user['uid'] = $user['id'];
unset($user['id']);
ok($user);
