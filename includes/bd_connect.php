<?php
session_start();
header('Content-Type: application/json'); // Réponse en JSON

// Paramètres de connexion à la base de données
define('USER', 'ag32eg0enyr');
define('PASSWD', 'w1:w0a#4wr');
define('SERVER', 'localhost');
define('BASE', 'ebus2_projet06_yenw61');

// Construction du DSN pour la connexion à la base de données
$dsn = "mysql:host=" . SERVER . ";dbname=" . BASE . ";charset=utf8";

try {
    // Connexion à la base de données avec PDO
    $pdo = new PDO($dsn, USER, PASSWD);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION); // Mode d'erreur : exceptions
} catch (PDOException $e) {
    echo json_encode(["success" => false, "message" => "Erreur de connexion à la base de données."]);
    exit();
}

// Vérifier si les données sont bien envoyées
if (!isset($_POST['username'], $_POST['password'])) {
    echo json_encode(["success" => false, "message" => "Données manquantes."]);
    exit();
}

// Récupération des données du formulaire
$username = trim($_POST['username']);
$password = trim($_POST['password']);

// Vérifier si les champs sont remplis
if (empty($username) || empty($password)) {
    echo json_encode(["success" => false, "message" => "Veuillez remplir tous les champs."]);
    exit();
}

// Rechercher l'utilisateur dans la base de données
$sql = "SELECT id, email, password FROM users WHERE email = :username";
$stmt = $pdo->prepare($sql);
$stmt->bindParam(':username', $username);
$stmt->execute();
$user = $stmt->fetch(PDO::FETCH_ASSOC);

if ($user) {
    // Vérifier si le mot de passe est correct
    if (password_verify($password, $user['password'])) {
        // Stocker l'utilisateur en session
        $_SESSION['user_id'] = $user['id'];
        $_SESSION['username'] = $user['email']; // Assurez-vous d'utiliser le bon champ ici.

        echo json_encode(["success" => true, "message" => "Connexion réussie."]);
    } else {
        echo json_encode(["success" => false, "message" => "Mot de passe incorrect."]);
    }
} else {
    echo json_encode(["success" => false, "message" => "Nom d'utilisateur introuvable."]);
}
?>
