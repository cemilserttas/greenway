<?php
session_start();
header('Content-Type: application/json');
require_once 'bd_connect.php';

// Vérifie que l'utilisateur est connecté
if (!isset($_SESSION['user_id'])) {
    http_response_code(401);
    echo json_encode(['success' => false, 'message' => 'Utilisateur non connecté.']);
    exit;
}

$user_id = (int)$_SESSION['user_id'];

// Vérifie que la requête est en POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Méthode non autorisée.']);
    exit;
}

// Récupère et nettoie les données
$vehicule_id = isset($_POST['vehicule_id']) ? (int)$_POST['vehicule_id'] : null;
$start_location = isset($_POST['start_location']) ? trim($_POST['start_location']) : '';
$dest_location = isset($_POST['dest_location']) ? trim($_POST['dest_location']) : '';
$start_date = isset($_POST['start_date']) ? trim($_POST['start_date']) : '';
$available_places = isset($_POST['available_places']) ? (int)$_POST['available_places'] : 0;

// Vérifie que tout est rempli
if (!$vehicule_id || !$start_location || !$dest_location || !$start_date || $available_places <= 0) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Tous les champs sont obligatoires.']);
    exit;
}

try {
    // Vérifie que le véhicule appartient bien à l'utilisateur connecté
    $checkVehicle = $pdo->prepare("SELECT id FROM vehicules WHERE id = :vehicule_id AND user_id = :user_id");
    $checkVehicle->execute([
        ':vehicule_id' => $vehicule_id,
        ':user_id' => $user_id
    ]);

    if ($checkVehicle->rowCount() === 0) {
        http_response_code(403);
        echo json_encode(['success' => false, 'message' => 'Ce véhicule ne vous appartient pas.']);
        exit;
    }

    // Insertion dans la table rides
    $stmt = $pdo->prepare("
        INSERT INTO rides (vehicule_id, start_location, dest_location, start_date, available_places, creation_date)
        VALUES (:vehicule_id, :start_location, :dest_location, :start_date, :available_places, NOW())
    ");

    $stmt->execute([
        ':vehicule_id' => $vehicule_id,
        ':start_location' => $start_location,
        ':dest_location' => $dest_location,
        ':start_date' => $start_date,
        ':available_places' => $available_places
    ]);

    echo json_encode(['success' => true, 'message' => 'Trajet créé avec succès.']);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Erreur serveur : ' . $e->getMessage()]);
}
