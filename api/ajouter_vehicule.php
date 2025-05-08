<?php
// /api/ajouter_vehicule.php
session_start();
header('Content-Type: application/json');
require_once '../api/bd_connect.php';

$required = ['brand', 'model', 'year', 'color', 'registration_number', 'user_id'];
foreach ($required as $field) {
    if (empty($_POST[$field])) {
        echo json_encode(['success' => false, 'message' => "Champ '$field' manquant."]);
        exit;
    }
}

try {
    $stmt = $pdo->prepare("
        INSERT INTO vehicules (user_id, brand, model, year, color, registration_number)
        VALUES (:user_id, :brand, :model, :year, :color, :registration_number)
    ");
    $stmt->execute([
        ':user_id' => (int) $_POST['user_id'],
        ':brand' => $_POST['brand'],
        ':model' => $_POST['model'],
        ':year' => (int) $_POST['year'],
        ':color' => $_POST['color'],
        ':registration_number' => $_POST['registration_number']
    ]);
    echo json_encode(['success' => true]);
} catch (PDOException $e) {
    echo json_encode(['success' => false, 'message' => 'Erreur BDD : ' . $e->getMessage()]);
}
