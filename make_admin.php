<?php
require_once __DIR__ . '/config.php';

$email    = 'admin@wexi.com';   // cambia si quieres otro correo
$password = '123456';            // cambia por tu contraseña
$name     = 'Administrador';

$pdo  = db();
$hash = password_hash($password, PASSWORD_BCRYPT);
$id   = uuid();

function uuid() {
    return sprintf('%04x%04x-%04x-%04x-%04x-%04x%04x%04x',
        mt_rand(0,0xffff),mt_rand(0,0xffff),mt_rand(0,0xffff),
        mt_rand(0,0x0fff)|0x4000,mt_rand(0,0x3fff)|0x8000,
        mt_rand(0,0xffff),mt_rand(0,0xffff),mt_rand(0,0xffff));
}

// Si ya existe, solo actualiza el rol y contraseña
$stmt = $pdo->prepare('SELECT id FROM users WHERE email = ?');
$stmt->execute([$email]);
$existing = $stmt->fetch();

if ($existing) {
    $pdo->prepare('UPDATE users SET role = ?, password_hash = ? WHERE email = ?')
        ->execute(['admin', $hash, $email]);
    echo "✅ Usuario actualizado a admin: $email (contraseña: $password)";
} else {
    $pdo->prepare('INSERT INTO users (id, email, password_hash, name, role, photo, coins) VALUES (?,?,?,?,?,?,?)')
        ->execute([$id, $email, $hash, $name, 'admin', '', 0]);
    echo "✅ Admin creado: $email (contraseña: $password)";
}
?>
