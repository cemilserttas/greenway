<?php
session_start();
header('Content-Type: application/json');
require_once '../api/bd_connect.php';

if (!isset($_SESSION['user_id'])) {
    echo json_encode(['success' => false, 'message' => 'Utilisateur non connecté.']);
    exit;
}

$user_id = $_SESSION['user_id'];

try {
    $stmt = $pdo->prepare("SELECT id, brand, model, year, color, registration_number FROM vehicules WHERE user_id = ?");
    $stmt->execute([$user_id]);
    $vehicules = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode(['success' => true, 'vehicules' => $vehicules]);
} catch (PDOException $e) {
    echo json_encode(['success' => false, 'message' => 'Erreur BDD : ' . $e->getMessage()]);
}
