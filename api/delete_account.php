<?php
session_start();
header('Content-Type: application/json');
require_once 'bd_connect.php';

if (!isset($_SESSION['user_id'])) {
  echo json_encode(['success' => false, 'message' => 'Utilisateur non connecté.']);
  exit;
}

$user_id = $_SESSION['user_id'];

try {
  // 1. Supprimer les avis où il est evaluateur ou évalué
  $pdo->prepare("DELETE FROM opinions WHERE evaluator_id = :id OR evaluated_id = :id")->execute([':id' => $user_id]);

  // 2. Supprimer les demandes (passager ou liées aux trajets qu'il gère)
  $rideIdsStmt = $pdo->prepare("SELECT rides.id FROM rides 
    JOIN vehicules ON rides.vehicule_id = vehicules.id
    WHERE vehicules.user_id = ?");
  $rideIdsStmt->execute([$user_id]);
  $rideIds = $rideIdsStmt->fetchAll(PDO::FETCH_COLUMN);

  if (!empty($rideIds)) {
    $in = str_repeat('?,', count($rideIds) - 1) . '?';
    $pdo->prepare("DELETE FROM requests WHERE ride_id IN ($in)")->execute($rideIds);
  }
  $pdo->prepare("DELETE FROM requests WHERE passenger_id = ?")->execute([$user_id]);

  // 3. Supprimer les trajets
  if (!empty($rideIds)) {
    $in = str_repeat('?,', count($rideIds) - 1) . '?';
    $pdo->prepare("DELETE FROM rides WHERE id IN ($in)")->execute($rideIds);
  }

  // 4. Supprimer les véhicules
  $pdo->prepare("DELETE FROM vehicules WHERE user_id = ?")->execute([$user_id]);

  // 5. Supprimer le compte utilisateur
  $pdo->prepare("DELETE FROM users WHERE id = ?")->execute([$user_id]);

  // 6. Détruire la session
  session_destroy();

  echo json_encode(['success' => true]);
} catch (PDOException $e) {
  echo json_encode(['success' => false, 'message' => 'Erreur serveur : ' . $e->getMessage()]);
}
