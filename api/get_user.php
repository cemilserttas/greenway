<?php
session_start();
header('Content-Type: application/json');
require_once 'bd_connect.php';

if (!isset($_SESSION['user_id'])) {
    echo json_encode(['success' => false, 'message' => 'Non connecté']);
    exit;
}

$id = $_SESSION['user_id'];

$stmt = $pdo->prepare("SELECT id, name, firstname, email, birth_date, licence_number FROM users WHERE id = ?");
$stmt->execute([$id]);

if ($user = $stmt->fetch(PDO::FETCH_ASSOC)) {
    echo json_encode(['success' => true, 'user' => $user]);
} else {
    echo json_encode(['success' => false, 'message' => 'Utilisateur introuvable']);
}
