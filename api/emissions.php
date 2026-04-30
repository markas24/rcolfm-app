<?php
/**
 * API Emissions - Récupère la liste des émissions
 * Méthode: GET
 * URL: /api/emissions.php?category_id=1&limit=20&offset=0&search=keyword
 */

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

// Gestion preflight CORS
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Configuration
require_once dirname(__DIR__) . '/includes/config.php';

try {
    $pdo = new PDO(
        "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=utf8mb4",
        DB_USER,
        DB_PASS,
        [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC
        ]
    );

    // Paramètres de filtrage
    $category_id = isset($_GET['category_id']) ? (int)$_GET['category_id'] : null;
    $limit = isset($_GET['limit']) ? (int)$_GET['limit'] : 50;
    $offset = isset($_GET['offset']) ? (int)$_GET['offset'] : 0;
    $search = isset($_GET['search']) ? trim($_GET['search']) : '';
    $sort = isset($_GET['sort']) ? $_GET['sort'] : 'latest'; // latest, popular, title

    // Construction de la requête
    $sql = "
        SELECT 
            ma.*,
            ac.name as category_name,
            ac.color as category_color,
            ac.icon as category_icon,
            COALESCE(ma.plays, 0) as plays_count
        FROM media_archives ma
        LEFT JOIN archive_categories ac ON ma.category_id = ac.id
        WHERE ma.is_active = 1
    ";

    $params = [];

    // Filtre par catégorie
    if ($category_id) {
        $sql .= " AND ma.category_id = ?";
        $params[] = $category_id;
    }

    // Filtre par recherche
    if (!empty($search)) {
        $sql .= " AND (ma.title LIKE ? OR ma.description LIKE ?)";
        $params[] = "%$search%";
        $params[] = "%$search%";
    }

    // Tri
    switch ($sort) {
        case 'popular':
            $sql .= " ORDER BY ma.plays DESC, ma.broadcast_date DESC";
            break;
        case 'title':
            $sql .= " ORDER BY ma.title ASC";
            break;
        default:
            $sql .= " ORDER BY ma.broadcast_date DESC, ma.created_at DESC";
    }

    $sql .= " LIMIT ? OFFSET ?";
    $params[] = $limit;
    $params[] = $offset;

    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);
    $emissions = $stmt->fetchAll();

    // Compter le total pour pagination
    $countSql = "
        SELECT COUNT(*) as total
        FROM media_archives ma
        WHERE ma.is_active = 1
    ";
    
    $countParams = [];
    
    if ($category_id) {
        $countSql .= " AND ma.category_id = ?";
        $countParams[] = $category_id;
    }
    
    if (!empty($search)) {
        $countSql .= " AND (ma.title LIKE ? OR ma.description LIKE ?)";
        $countParams[] = "%$search%";
        $countParams[] = "%$search%";
    }
    
    $countStmt = $pdo->prepare($countSql);
    $countStmt->execute($countParams);
    $total = $countStmt->fetch()['total'];

    // Formater les données pour React Native
    $data = array_map(function($emission) {
        return [
            'id' => (string)$emission['id'],
            'title' => $emission['title'],
            'category' => $emission['category_name'] ?? 'Non catégorisé',
            'category_id' => $emission['category_id'],
            'category_color' => $emission['category_color'] ?? '#dc2626',
            'duration' => $emission['duration'] ?? '00:00',
            'url' => getFullUrl($emission['media_url']),
            'date' => date('d/m/Y', strtotime($emission['broadcast_date'])),
            'image' => $emission['image_url'] ? getFullUrl($emission['image_url']) : null,
            'description' => $emission['description'] ?? '',
            'plays' => (int)($emission['plays_count'] ?? 0),
            'broadcast_date' => $emission['broadcast_date'],
            'is_active' => (bool)$emission['is_active']
        ];
    }, $emissions);

    // Réponse JSON
    echo json_encode([
        'success' => true,
        'data' => $data,
        'pagination' => [
            'total' => (int)$total,
            'limit' => $limit,
            'offset' => $offset,
            'has_more' => ($offset + $limit) < $total
        ]
    ]);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => 'Erreur base de données: ' . $e->getMessage()
    ]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => 'Erreur serveur: ' . $e->getMessage()
    ]);
}

/**
 * Construit l'URL complète d'un fichier média
 */
function getFullUrl($path) {
    if (empty($path)) return null;
    if (filter_var($path, FILTER_VALIDATE_URL)) return $path;
    
    $protocol = isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on' ? 'https' : 'http';
    $host = $_SERVER['HTTP_HOST'];
    $baseUrl = $protocol . '://' . $host;
    
    // Nettoyer le chemin
    $path = ltrim($path, './');
    $path = preg_replace('#^\.\./\.\./#', '', $path);
    
    return $baseUrl . '/' . $path;
}