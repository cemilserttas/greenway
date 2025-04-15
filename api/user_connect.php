<?php
session_start();
header('Content-Type: application/json');

require_once 'bd_connect.php';

// Récupération sécurisée des données du formulaire
$email = isset($_POST['email']) ? trim($_POST['email']) : '';
$motDePasse = isset($_POST['motDePasse']) ? trim($_POST['motDePasse']) : '';

// Vérification des champs obligatoires
if (empty($email) || empty($motDePasse)) {
    http_response_code(400);
    echo json_encode([
        "success" => false,
        "message" => "Veuillez remplir tous les champs."
    ]);
    exit;
}

// Vérification du format email
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode([
        "success" => false,
        "message" => "Adresse e-mail invalide."
    ]);
    exit;
}

try {
    // Requête pour trouver l'utilisateur correspondant
    $sql = "SELECT id, email, password, firstname, name FROM users WHERE email = :email";
    $stmt = $pdo->prepare($sql);
    $stmt->bindParam(':email', $email, PDO::PARAM_STR);
    $stmt->execute();
    $utilisateur = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($utilisateur) {
        // Pause volontaire (anti-brute-force)
        sleep(1);

        // ⚠️ Comparaison de mot de passe en clair (à sécuriser en prod avec password_verify)
        if ($motDePasse === $utilisateur['password']) {
            // Stocker les infos utiles en session
            $_SESSION['user_id'] = $utilisateur['id'];
            $_SESSION['email'] = $utilisateur['email'];
            $_SESSION['firstname'] = $utilisateur['firstname'];
            $_SESSION['name'] = $utilisateur['name'];

            echo json_encode([
                "success" => true,
                "message" => "Connexion réussie.",
                "user" => [
                    "id" => $utilisateur['id'],
                    "email" => $utilisateur['email'],
                    "firstname" => $utilisateur['firstname'],
                    "name" => $utilisateur['name']
                ]
            ]);
        } else {
            http_response_code(401);
            echo json_encode([
                "success" => false,
                "message" => "Mot de passe incorrect."
            ]);
        }
    } else {
        http_response_code(404);
        echo json_encode([
            "success" => false,
            "message" => "Utilisateur introuvable."
        ]);
    }
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => "Erreur serveur : " . $e->getMessage()
    ]);
}
?>