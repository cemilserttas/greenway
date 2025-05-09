<?php
session_start();
header('Content-Type: application/json');
require_once 'bd_connect.php';

if ($_SERVER['REQUEST_METHOD'] !== 'DELETE') {
    echo json_encode(['success' => false, 'message' => 'Méthode non autorisée.']);
    exit;
}

$user_id = $_SESSION['user_id'] ?? null;
$ride_id = $_GET['id'] ?? null;

if (!$user_id || !$ride_id) {
    echo json_encode(['success' => false, 'message' => 'Données manquantes.']);
    exit;
}

try {
    // Vérifie que le trajet appartient bien à l'utilisateur connecté
    $stmt = $pdo->prepare("
        SELECT r.id
        FROM rides r
        JOIN vehicules v ON r.vehicule_id = v.id
        WHERE r.id = ? AND v.user_id = ?
    ");
    $stmt->execute([$ride_id, $user_id]);

    if (!$stmt->fetch()) {
        echo json_encode(['success' => false, 'message' => 'Trajet introuvable ou non autorisé.']);
        exit;
    }
    //Supprimer les avis liés à ce trajet
    $pdo->prepare("DELETE FROM opinions WHERE ride_id = ?")->execute([$ride_id]);
    // Supprimer d'abord les demandes liées à ce trajet
    $pdo->prepare("DELETE FROM requests WHERE ride_id = ?")->execute([$ride_id]);

    // Puis supprimer le trajet
    $pdo->prepare("DELETE FROM rides WHERE id = ?")->execute([$ride_id]);

    echo json_encode(['success' => true]);
} catch (PDOException $e) {
    echo json_encode([
        'success' => false,
        'message' => 'Erreur BDD : ' . $e->getMessage()
    ]);
}
