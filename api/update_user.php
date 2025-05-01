<?php
session_start();
header('Content-Type: application/json');
require_once 'bd_connect.php';

if (!isset($_SESSION['user_id'])) {
    echo json_encode(['success' => false, 'message' => 'Utilisateur non connecté.']);
    exit;
}

$id = $_SESSION['user_id'];
$name = trim($_POST['name'] ?? '');
$firstname = trim($_POST['firstname'] ?? '');
$email = trim($_POST['email'] ?? '');
$birth_date = trim($_POST['birth_date'] ?? '');
$licence_number = trim($_POST['licence_number'] ?? '');
$password = $_POST['password'] ?? null;

if (!$name || !$firstname || !$email || !$birth_date || !$licence_number) {
    echo json_encode(['success' => false, 'message' => 'Champs requis manquants.']);
    exit;
}

try {
    if ($password) {
        $stmt = $pdo->prepare("UPDATE users SET name = ?, firstname = ?, email = ?, birth_date = ?, licence_number = ?, password = ? WHERE id = ?");
        $stmt->execute([$name, $firstname, $email, $birth_date, $licence_number, $password, $id]);
    } else {
        $stmt = $pdo->prepare("UPDATE users SET name = ?, firstname = ?, email = ?, birth_date = ?, licence_number = ? WHERE id = ?");
        $stmt->execute([$name, $firstname, $email, $birth_date, $licence_number, $id]);
    }

    echo json_encode(['success' => true]);
} catch (PDOException $e) {
    echo json_encode(['success' => false, 'message' => 'Erreur SQL : ' . $e->getMessage()]);
}
