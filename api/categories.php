<?php
/**
 * API Catégories - Récupère toutes les catégories
 * Méthode: GET
 * URL: /api/categories.php
 */

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, OPTIONS');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once dirname(__DIR__) . '/includes/config.php';

try {
    $pdo = new PDO(
        "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=utf8mb4",
        DB_USER,
        DB_PASS,
        [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]
    );

    $stmt = $pdo->query("
        SELECT 
            ac.*,
            COUNT(ma.id) as emissions_count
        FROM archive_categories ac
        LEFT JOIN media_archives ma ON ac.id = ma.category_id AND ma.is_active = 1
        WHERE ac.is_active = 1
        GROUP BY ac.id
        ORDER BY ac.sort_order ASC
    ");
    
    $categories = $stmt->fetchAll();

    $data = array_map(function($cat) {
        return [
            'id' => (string)$cat['id'],
            'name' => $cat['name'],
            'color' => $cat['color'] ?? '#dc2626',
            'icon' => $cat['icon'] ?? 'folder',
            'emissions_count' => (int)$cat['emissions_count'],
            'sort_order' => (int)$cat['sort_order']
        ];
    }, $categories);

    echo json_encode([
        'success' => true,
        'data' => $data
    ]);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => 'Erreur base de données: ' . $e->getMessage()
    ]);
}