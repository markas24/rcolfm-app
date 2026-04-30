<?php
/**
 * API Historique - Gère l'historique d'écoute
 * Méthodes: GET (lire), POST (ajouter), DELETE (effacer)
 * URL: /api/history.php
 */

session_start();

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once dirname(__DIR__) . '/includes/config.php';

$user_id = $_SESSION['user_id'] ?? $_COOKIE['device_id'] ?? null;
if (!$user_id) {
    $user_id = uniqid('device_');
    setcookie('device_id', $user_id, time() + 365 * 24 * 3600, '/');
    $_SESSION['user_id'] = $user_id;
}

try {
    $pdo = new PDO(
        "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=utf8mb4",
        DB_USER,
        DB_PASS,
        [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]
    );
    
    // Créer la table d'historique si elle n'existe pas
    $pdo->exec("
        CREATE TABLE IF NOT EXISTS user_history (
            id INT AUTO_INCREMENT PRIMARY KEY,
            user_id VARCHAR(100) NOT NULL,
            emission_id INT NOT NULL,
            played_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            progress INT DEFAULT 0,
            INDEX idx_user_id (user_id),
            INDEX idx_played_at (played_at)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
    ");
    
    $method = $_SERVER['REQUEST_METHOD'];
    
    // GET - Récupérer l'historique
    if ($method === 'GET') {
        $limit = isset($_GET['limit']) ? (int)$_GET['limit'] : 50;
        
        $stmt = $pdo->prepare("
            SELECT h.*, ma.title, ma.duration, ma.category_id, ac.name as category_name
            FROM user_history h
            JOIN media_archives ma ON h.emission_id = ma.id
            LEFT JOIN archive_categories ac ON ma.category_id = ac.id
            WHERE h.user_id = ?
            ORDER BY h.played_at DESC
            LIMIT ?
        ");
        $stmt->execute([$user_id, $limit]);
        $history = $stmt->fetchAll();
        
        $data = array_map(function($item) {
            return [
                'id' => (string)$item['emission_id'],
                'title' => $item['title'],
                'category' => $item['category_name'] ?? 'Non catégorisé',
                'duration' => $item['duration'] ?? '00:00',
                'played_at' => $item['played_at'],
                'progress' => (int)$item['progress']
            ];
        }, $history);
        
        echo json_encode([
            'success' => true,
            'data' => $data
        ]);
    }
    
    // POST - Ajouter à l'historique
    elseif ($method === 'POST') {
        $input = json_decode(file_get_contents('php://input'), true);
        $emission_id = $input['id'] ?? null;
        $progress = $input['progress'] ?? 0;
        
        if (!$emission_id) {
            http_response_code(400);
            echo json_encode(['success' => false, 'error' => 'ID manquant']);
            exit();
        }
        
        // Supprimer l'ancienne entrée pour cet ID
        $stmt = $pdo->prepare("
            DELETE FROM user_history
            WHERE user_id = ? AND emission_id = ?
        ");
        $stmt->execute([$user_id, $emission_id]);
        
        // Ajouter la nouvelle
        $stmt = $pdo->prepare("
            INSERT INTO user_history (user_id, emission_id, progress, played_at)
            VALUES (?, ?, ?, NOW())
        ");
        $stmt->execute([$user_id, $emission_id, $progress]);
        
        echo json_encode([
            'success' => true,
            'message' => 'Ajouté à l\'historique'
        ]);
    }
    
    // DELETE - Effacer tout l'historique
    elseif ($method === 'DELETE') {
        $stmt = $pdo->prepare("DELETE FROM user_history WHERE user_id = ?");
        $stmt->execute([$user_id]);
        
        echo json_encode([
            'success' => true,
            'message' => 'Historique effacé'
        ]);
    }
    
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => 'Erreur base de données: ' . $e->getMessage()
    ]);
}