<?php
/**
 * API Favoris - Gère les favoris des utilisateurs
 * Méthodes: GET (lire), POST (ajouter), DELETE (supprimer)
 * URL: /api/favorites.php
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

// Gestion de l'utilisateur (simple session ou token)
$user_id = $_SESSION['user_id'] ?? $_COOKIE['device_id'] ?? null;
if (!$user_id) {
    // Générer un ID de périphérique unique pour les utilisateurs non connectés
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
    
    // Créer la table des favoris si elle n'existe pas
    $pdo->exec("
        CREATE TABLE IF NOT EXISTS user_favorites (
            id INT AUTO_INCREMENT PRIMARY KEY,
            user_id VARCHAR(100) NOT NULL,
            emission_id INT NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            UNIQUE KEY unique_favorite (user_id, emission_id),
            INDEX idx_user_id (user_id),
            INDEX idx_emission_id (emission_id)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
    ");
    
    $method = $_SERVER['REQUEST_METHOD'];
    
    // GET - Récupérer les favoris
    if ($method === 'GET') {
        $stmt = $pdo->prepare("
            SELECT f.emission_id, ma.*, ac.name as category_name
            FROM user_favorites f
            JOIN media_archives ma ON f.emission_id = ma.id
            LEFT JOIN archive_categories ac ON ma.category_id = ac.id
            WHERE f.user_id = ? AND ma.is_active = 1
            ORDER BY f.created_at DESC
        ");
        $stmt->execute([$user_id]);
        $favorites = $stmt->fetchAll();
        
        $data = array_map(function($fav) {
            return [
                'id' => (string)$fav['emission_id'],
                'title' => $fav['title'],
                'category' => $fav['category_name'] ?? 'Non catégorisé',
                'duration' => $fav['duration'] ?? '00:00',
                'date' => date('d/m/Y', strtotime($fav['broadcast_date'])),
                'added_at' => $fav['created_at']
            ];
        }, $favorites);
        
        echo json_encode([
            'success' => true,
            'data' => $data
        ]);
    }
    
    // POST - Ajouter un favori
    elseif ($method === 'POST') {
        $input = json_decode(file_get_contents('php://input'), true);
        $emission_id = $input['id'] ?? null;
        
        if (!$emission_id) {
            http_response_code(400);
            echo json_encode(['success' => false, 'error' => 'ID manquant']);
            exit();
        }
        
        try {
            $stmt = $pdo->prepare("
                INSERT INTO user_favorites (user_id, emission_id)
                VALUES (?, ?)
            ");
            $stmt->execute([$user_id, $emission_id]);
            
            echo json_encode([
                'success' => true,
                'message' => 'Ajouté aux favoris'
            ]);
        } catch (PDOException $e) {
            if ($e->getCode() == 23000) {
                echo json_encode([
                    'success' => false,
                    'error' => 'Déjà dans les favoris'
                ]);
            } else {
                throw $e;
            }
        }
    }
    
    // DELETE - Supprimer un favori
    elseif ($method === 'DELETE') {
        $emission_id = $_GET['id'] ?? null;
        
        if (!$emission_id) {
            http_response_code(400);
            echo json_encode(['success' => false, 'error' => 'ID manquant']);
            exit();
        }
        
        $stmt = $pdo->prepare("
            DELETE FROM user_favorites
            WHERE user_id = ? AND emission_id = ?
        ");
        $stmt->execute([$user_id, $emission_id]);
        
        echo json_encode([
            'success' => true,
            'message' => 'Retiré des favoris'
        ]);
    }
    
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => 'Erreur base de données: ' . $e->getMessage()
    ]);
}