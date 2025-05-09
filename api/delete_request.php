<?php
session_start();
header('Content-Type: application/json');
require_once 'bd_connect.php';

if ($_SERVER['REQUEST_METHOD'] !== 'DELETE') {
    echo json_encode(['success' => false, 'message' => 'Méthode non autorisée.']);
    exit;
}

$user_id = $_SESSION['user_id'] ?? null;
$request_id = $_GET['id'] ?? null;

if (!$user_id || !$request_id) {
    echo json_encode(['success' => false, 'message' => 'Paramètres manquants.']);
    exit;
}

try {
    // Vérification : la requête existe et appartient bien à un trajet du conducteur connecté
    $check = $pdo->prepare("
        SELECT req.id
        FROM requests req
        JOIN rides r ON req.ride_id = r.id
        JOIN vehicules v ON r.vehicule_id = v.id
        WHERE req.id = ? AND v.user_id = ?
    ");
    $check->execute([$request_id, $user_id]);

    if (!$check->fetch()) {
        echo json_encode(['success' => false, 'message' => 'Requête non autorisée.']);
        exit;
    }

    // Suppression
    $delete = $pdo->prepare("DELETE FROM requests WHERE id = ?");
    $delete->execute([$request_id]);

    echo json_encode(['success' => true]);
} catch (PDOException $e) {
    echo json_encode(['success' => false, 'message' => 'Erreur : ' . $e->getMessage()]);
}
