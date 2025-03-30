<?php
session_start();
require_once 'bd_connect.php';

// Vérifier si toutes les données sont envoyées
if (!isset($_POST['prenom'], $_POST['nom'], $_POST['email'], $_POST['password'], $_POST['phone'], $_POST['birth_date'], $_POST['licence_number'])) {
    echo json_encode(["success" => false, "message" => "Veuillez remplir tous les champs."]);
    exit;
}

// Récupération et nettoyage des données
$prenom = htmlspecialchars(trim($_POST['prenom']));
$nom = htmlspecialchars(trim($_POST['nom']));
$email = htmlspecialchars(trim($_POST['email']));
$password = trim($_POST['password']);
$phone = htmlspecialchars(trim($_POST['phone']));
$birth_date = htmlspecialchars(trim($_POST['birth_date']));
$licence_number = htmlspecialchars(trim($_POST['licence_number']));

// Vérifier la longueur du mot de passe
if (strlen($password) < 6) {
    echo json_encode(["success" => false, "message" => "Le mot de passe doit contenir au moins 6 caractères."]);
    exit;
}

// Vérifier si l'email existe déjà
$stmt = $pdo->prepare("SELECT id FROM users WHERE email = ?");
$stmt->execute([$email]);
if ($stmt->rowCount() > 0) {
    echo json_encode(["success" => false, "message" => "L'email est déjà utilisé."]);
    exit;
}

// Insérer l'utilisateur dans la base de données
$stmt = $pdo->prepare("INSERT INTO users (firstname, name, email, password, phone, birth_date, licence_number) VALUES (?, ?, ?, ?, ?, ?, ?)");
if ($stmt->execute([$prenom, $nom, $email, $password, $phone, $birth_date, $licence_number])) {
    echo json_encode(["success" => true, "message" => "Inscription réussie ! Redirection en cours..."]);
} else {
    echo json_encode(["success" => false, "message" => "Erreur lors de l'inscription."]);
}
?>