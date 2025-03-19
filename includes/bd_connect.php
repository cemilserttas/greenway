<?php
session_start();
header('Content-Type: application/json'); // Réponse au format JSON

// Paramètres de connexion à la base de données
define('UTILISATEUR', 'ag32eg0enyr'); // Nom d'utilisateur pour la base de données
define('MOT_DE_PASSE', 'w1:w0a#4wr'); // Mot de passe pour la base de données
define('SERVEUR', 'localhost'); // Serveur de base de données
define('BASE_DE_DONNEES', 'ebus2_projet06_yenw61'); // Nom de la base de données

// Construction du DSN pour la connexion à la base de données
$dsn = "mysql:host=" . SERVEUR . ";dbname=" . BASE_DE_DONNEES . ";charset=utf8";

try {
    // Connexion à la base de données avec PDO
    $pdo = new PDO($dsn, UTILISATEUR, MOT_DE_PASSE, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION, // Mode d'erreur : exceptions
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_OBJ, // Retourne les résultats sous forme d'objets
    ]);
} catch (PDOException $e) {
    http_response_code(500); // Code HTTP 500 (Erreur serveur)
    die(json_encode(["success" => false, "message" => "Erreur de connexion à la base de données."]));
}

// Récupérer les données envoyées via POST
$email = isset($_POST['email']) ? trim($_POST['email']) : '';
$motDePasse = isset($_POST['motDePasse']) ? trim($_POST['motDePasse']) : '';

// Vérifier si les champs sont remplis
if (empty($email) || empty($motDePasse)) {
    http_response_code(400); // Code HTTP 400 (Bad Request)
    echo json_encode(["success" => false, "message" => "Veuillez remplir tous les champs."]);
    exit;
}

// Rechercher l'utilisateur dans la base de données
$sql = "SELECT id, email, password FROM users WHERE email = :email";
$stmt = $pdo->prepare($sql);
$stmt->bindParam(':email', $email, PDO::PARAM_STR);
$stmt->execute();
$utilisateur = $stmt->fetch();

// Vérifier l'utilisateur
if ($utilisateur) {
    // Pause de 1 seconde pour ralentir les attaques par force brute
    sleep(1);

    // Comparer le mot de passe (en texte clair)
    if ($motDePasse === $utilisateur->password) {
        // Stocker les informations de l'utilisateur en session
        $_SESSION['user_id'] = $utilisateur->id;
        $_SESSION['email'] = $utilisateur->email;

        echo json_encode(["success" => true, "message" => "Connexion réussie."]);
    } else {
        http_response_code(401); // Code HTTP 401 (Non autorisé)
        echo json_encode(["success" => false, "message" => "Mot de passe incorrect."]);
    }
} else {
    http_response_code(404); // Code HTTP 404 (Non trouvé)
    echo json_encode(["success" => false, "message" => "Nom d'utilisateur introuvable."]);
}
?>