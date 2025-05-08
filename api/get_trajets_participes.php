<?php
session_start();
header('Content-Type: application/json');
require_once '../api/bd_connect.php';

if (!isset($_SESSION['user_id'])) {
    echo json_encode(['success' => false, 'message' => 'Non connecté']);
    exit;
}

$user_id = $_SESSION['user_id'];

$sql = "
  SELECT 
    r.id AS ride_id,
    r.start_location,
    r.dest_location,
    r.start_date,
    v.user_id AS conducteur_id,
    u.firstname AS conducteur_prenom,
    u.name AS conducteur_nom
  FROM requests req
  JOIN rides r ON req.ride_id = r.id
  JOIN vehicules v ON r.vehicule_id = v.id
  JOIN users u ON v.user_id = u.id
  WHERE req.passenger_id = ? AND req.status = 'accepted'
";

$stmt = $pdo->prepare($sql);
$stmt->execute([$user_id]);

$trajets = $stmt->fetchAll(PDO::FETCH_ASSOC);
echo json_encode(['success' => true, 'trajets' => $trajets]);
