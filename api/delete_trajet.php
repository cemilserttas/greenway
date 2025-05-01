<?php
session_start();
require_once 'bd_connect.php';
header('Content-Type: application/json');

// Vérifie que l'utilisateur est connecté
if (!isset($_SESSION['user_id'])) {
    echo json_encode(['success' => false, 'message' => 'Non autorisé.']);
    exit;
}

// Vérifie que l’ID du trajet est fourni et est un entier
if (!isset($_GET['id']) || !is_numeric($_GET['id'])) {
    echo json_encode(['success' => false, 'message' => 'ID de trajet invalide.']);
    exit;
}

$trajet_id = intval($_GET['id']);
$user_id = $_SESSION['user_id'];

try {
    // Vérifie que ce trajet appartient bien à l'utilisateur connecté
    $stmt = $pdo->prepare("
        SELECT rides.id 
        FROM rides 
        JOIN vehicules ON rides.vehicule_id = vehicules.id 
        WHERE rides.id = ? AND vehicules.user_id = ?
    ");
    $stmt->execute([$trajet_id, $user_id]);

    if ($stmt->rowCount() === 0) {
        echo json_encode(['success' => false, 'message' => 'Ce trajet ne vous appartient pas.']);
        exit;
    }

    // Supprimer le trajet
    $stmt = $pdo->prepare("DELETE FROM rides WHERE id = ?");
    $stmt->execute([$trajet_id]);

    echo json_encode(['success' => true, 'message' => 'Trajet supprimé avec succès.']);
} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => 'Erreur : ' . $e->getMessage()]);
}
?>
