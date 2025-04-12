<?php
session_start();
header('Content-Type: application/json');
require_once '../includes/bd_connect.php'; // adapter si nécessaire

// Vérifie que la requête est en POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['success' => false, 'message' => 'Méthode non autorisée.']);
    exit;
}

// Vérifie les champs nécessaires
$required = ['ride_id', 'evaluator_id', 'evaluated_id', 'avis', 'commentaire'];
foreach ($required as $field) {
    if (empty($_POST[$field])) {
        echo json_encode(['success' => false, 'message' => "Champ '$field' manquant."]);
        exit;
    }
}

// Récupération et nettoyage des données
$ride_id = (int) $_POST['ride_id'];
$evaluator_id = (int) $_POST['evaluator_id'];
$evaluated_id = (int) $_POST['evaluated_id'];
$avis_text = htmlspecialchars($_POST['avis']);
$comment = htmlspecialchars($_POST['commentaire']);

// Convertir avis textuel en score
$scores = [
    'Très mauvais' => 1,
    'Mauvais' => 2,
    'Moyen' => 3,
    'Bien' => 4,
    'Très bien' => 5
];
$score = $scores[$avis_text] ?? 3;

try {
    $stmt = $connexion->prepare("INSERT INTO opinions (ride_id, evaluator_id, evaluated_id, score, comment)
                                  VALUES (:ride_id, :evaluator_id, :evaluated_id, :score, :comment)");

    $stmt->execute([
        ':ride_id' => $ride_id,
        ':evaluator_id' => $evaluator_id,
        ':evaluated_id' => $evaluated_id,
        ':score' => $score,
        ':comment' => $comment
    ]);

    echo json_encode(['success' => true, 'message' => 'Avis enregistré avec succès.']);
} catch (PDOException $e) {
    if ($e->getCode() == 23000) {
        // Conflit de clé primaire
        echo json_encode(['success' => false, 'message' => "Vous avez déjà évalué ce trajet."]);
    } else {
        echo json_encode(['success' => false, 'message' => 'Erreur BDD : ' . $e->getMessage()]);
    }
}