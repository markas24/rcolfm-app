<?php
/**
 * API Recherche - Recherche avancée dans les émissions
 * Méthode: GET
 * URL: /api/search.php?q=keyword&category=1&limit=20
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

    $query = isset($_GET['q']) ? trim($_GET['q']) : '';
    $category_id = isset($_GET['category']) ? (int)$_GET['category'] : null;
    $limit = isset($_GET['limit']) ? (int)$_GET['limit'] : 30;
    
    if (empty($query)) {
        echo json_encode([
            'success' => true,
            'data' => [],
            'message' => 'Aucun terme de recherche'
        ]);
        exit();
    }
    
    $sql = "
        SELECT 
            ma.*,
            ac.name as category_name,
            ac.color as category_color,
            MATCH(ma.title, ma.description) AGAINST(? IN BOOLEAN MODE) as relevance
        FROM media_archives ma
        LEFT JOIN archive_categories ac ON ma.category_id = ac.id
        WHERE ma.is_active = 1
        AND (
            ma.title LIKE ? 
            OR ma.description LIKE ?
            OR MATCH(ma.title, ma.description) AGAINST(? IN BOOLEAN MODE)
        )
    ";
    
    $params = [$query, "%$query%", "%$query%", $query];
    
    if ($category_id) {
        $sql .= " AND ma.category_id = ?";
        $params[] = $category_id;
    }
    
    $sql .= " ORDER BY relevance DESC, ma.broadcast_date DESC LIMIT ?";
    $params[] = $limit;
    
    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);
    $results = $stmt->fetchAll();
    
    $data = array_map(function($item) {
        return [
            'id' => (string)$item['id'],
            'title' => $item['title'],
            'category' => $item['category_name'] ?? 'Non catégorisé',
            'duration' => $item['duration'] ?? '00:00',
            'date' => date('d/m/Y', strtotime($item['broadcast_date'])),
            'description' => $item['description'] ?? '',
            'url' => getFullUrl($item['media_url']),
            'relevance' => (float)$item['relevance']
        ];
    }, $results);
    
    echo json_encode([
        'success' => true,
        'data' => $data,
        'total' => count($data),
        'query' => $query
    ]);
    
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => 'Erreur base de données: ' . $e->getMessage()
    ]);
}

function getFullUrl($path) {
    if (empty($path)) return null;
    if (filter_var($path, FILTER_VALIDATE_URL)) return $path;
    
    $protocol = isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on' ? 'https' : 'http';
    $host = $_SERVER['HTTP_HOST'];
    $baseUrl = $protocol . '://' . $host;
    $path = ltrim($path, './');
    $path = preg_replace('#^\.\./\.\./#', '', $path);
    
    return $baseUrl . '/' . $path;
}