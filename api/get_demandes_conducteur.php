<?php
session_start();
header('Content-Type: application/json');
require_once 'bd_connect.php';

$user_id = $_SESSION['user_id'] ?? null;

if (!$user_id) {
    echo json_encode(['success' => false, 'message' => 'Utilisateur non connecté.']);
    exit;
}

try {
    $stmt = $pdo->prepare("
        SELECT 
            r.id AS ride_id,
            r.start_location AS depart,
            r.dest_location AS destination,
            r.start_date,
            u.firstname, u.name,
            req.id AS request_id,
            req.status,
            req.passenger_id,
            CONCAT(p.firstname, ' ', p.name) AS passenger_name
        FROM requests req
        JOIN rides r ON req.ride_id = r.id
        JOIN vehicules v ON r.vehicule_id = v.id
        JOIN users u ON v.user_id = u.id
        JOIN users p ON req.passenger_id = p.id
        WHERE v.user_id = ?
        ORDER BY r.start_date DESC
    ");
    $stmt->execute([$user_id]);
    $demandes = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode(['success' => true, 'demandes' => $demandes]);
} catch (PDOException $e) {
    echo json_encode(['success' => false, 'message' => 'Erreur : ' . $e->getMessage()]);
}
