<?php
session_start();
require_once 'bd_connect.php';
header('Content-Type: application/json');

try {
    $sql = "
        SELECT 
            rides.id,
            rides.start_location AS depart,
            rides.dest_location AS destination,
            rides.start_date,
            rides.available_places AS places,
            users.firstname,
            users.name,
            users.id AS user_id
        FROM rides
        JOIN vehicules ON rides.vehicule_id = vehicules.id
        JOIN users ON vehicules.user_id = users.id
        ORDER BY rides.start_date ASC
    ";

    $stmt = $pdo->prepare($sql);
    $stmt->execute();
    $trajets = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode(['success' => true, 'trajets' => $trajets]);
} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'message' => 'Erreur : ' . $e->getMessage()
    ]);
}
