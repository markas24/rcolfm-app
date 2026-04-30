<?php
/**
 * API Incrémenter les lectures
 * Méthode: POST
 * URL: /api/increment_play.php
 * Body: { "id": "1" }
 */

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once dirname(__DIR__) . '/includes/config.php';

try {
    // Lire le corps de la requête
    $input = json_decode(file_get_contents('php://input'), true);
    
    if (!$input || !isset($input['id'])) {
        http_response_code(400);
        echo json_encode([
            'success' => false,
            'error' => 'ID manquant'
        ]);
        exit();
    }
    
    $id = $input['id'];
    
    $pdo = new PDO(
        "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=utf8mb4",
        DB_USER,
        DB_PASS,
        [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]
    );
    
    // Incrémenter le compteur
    $stmt = $pdo->prepare("
        UPDATE media_archives 
        SET plays = COALESCE(plays, 0) + 1,
            last_played_at = NOW()
        WHERE id = ?
    ");
    $stmt->execute([$id]);
    
    // Récupérer le nouveau compteur
    $stmt = $pdo->prepare("SELECT plays FROM media_archives WHERE id = ?");
    $stmt->execute([$id]);
    $newCount = $stmt->fetchColumn();
    
    echo json_encode([
        'success' => true,
        'plays' => (int)$newCount
    ]);
    
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => 'Erreur base de données: ' . $e->getMessage()
    ]);
}