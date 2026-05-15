<?php
require_once __DIR__ . '/../helpers.php';

$method = $_SERVER['REQUEST_METHOD'];
$pdo    = db();

if ($method === 'GET') {
    $stmt = $pdo->prepare("SELECT `value` FROM settings WHERE `key` = 'qrImageUrl'");
    $stmt->execute();
    $row = $stmt->fetch();
    ok(['qrImageUrl' => $row ? $row['value'] : '']);
}

if ($method === 'POST') {
    $payload = auth();
    if ($payload['role'] !== 'admin') err('Solo admin puede modificar', 403);

    $b       = body();
    $imageB64 = $b['image'] ?? '';
    $url     = $imageB64 ? save_image($imageB64) : ($b['qrImageUrl'] ?? '');

    $pdo->prepare("INSERT INTO settings (`key`, `value`) VALUES ('qrImageUrl', ?) ON DUPLICATE KEY UPDATE `value` = ?")
        ->execute([$url, $url]);
    ok(['qrImageUrl' => $url]);
}

err('Método no permitido', 405);
