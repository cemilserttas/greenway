<?php
session_start();
header('Content-Type: application/json');
require_once 'bd_connect.php';

$userId = $_SESSION['user_id'] ?? null;

try {
    $stmt = $pdo->prepare("
        SELECT 
            r.id,
            v.user_id AS conducteur_id,
            r.start_location AS depart,
            r.dest_location AS destination,
            r.start_date,
            r.available_places,
            u.firstname,
            u.name,
            req.status AS request_status,
            (
                SELECT COUNT(*) 
                FROM requests r2 
                WHERE r2.ride_id = r.id AND r2.status = 'accepted'
            ) AS accepted_count
        FROM rides r
        JOIN vehicules v ON r.vehicule_id = v.id
        JOIN users u ON v.user_id = u.id
        LEFT JOIN requests req 
            ON req.ride_id = r.id AND req.passenger_id = :user_id
        ORDER BY r.start_date DESC
    ");

    $stmt->execute(['user_id' => $userId]);
    $trajets = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode(['success' => true, 'trajets' => $trajets]);

} catch (PDOException $e) {
    echo json_encode([
        'success' => false,
        'message' => 'Erreur : ' . $e->getMessage()
    ]);
}
