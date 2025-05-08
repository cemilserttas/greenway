<?php
session_start();
header('Content-Type: application/json');
require_once '../api/bd_connect.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['success' => false, 'message' => 'Méthode non autorisée.']);
    exit;
}

$required = ['ride_id', 'evaluator_id', 'evaluated_id', 'avis', 'commentaire'];
foreach ($required as $field) {
    if (empty($_POST[$field])) {
        echo json_encode(['success' => false, 'message' => "Champ '$field' manquant."]);
        exit;
    }
}

$ride_id = (int) $_POST['ride_id'];
$evaluator_id = (int) $_POST['evaluator_id'];
$evaluated_id = (int) $_POST['evaluated_id'];
$avis_text = trim($_POST['avis']);         // ✨ plus de htmlspecialchars ici
$comment = trim($_POST['commentaire']);    // ✨ pareil ici
$date = $_POST['date'] ?? date('Y-m-d H:i:s');

$scores = [
    'Très mauvais' => 1,
    'Mauvais' => 2,
    'Moyen' => 3,
    'Bien' => 4,
    'Très bien' => 5
];
$score = $scores[$avis_text] ?? 3;

try {
    $stmt = $pdo->prepare("
        INSERT INTO opinions (ride_id, evaluator_id, evaluated_id, score, comment, creation_date)
        VALUES (:ride_id, :evaluator_id, :evaluated_id, :score, :comment, :creation_date)
    ");

    $stmt->execute([
        ':ride_id' => $ride_id,
        ':evaluator_id' => $evaluator_id,
        ':evaluated_id' => $evaluated_id,
        ':score' => $score,
        ':comment' => $comment,
        ':creation_date' => $date
    ]);

    echo json_encode(['success' => true, 'message' => 'Avis enregistré avec succès.']);
} catch (PDOException $e) {
    if ($e->getCode() == 23000) {
        echo json_encode(['success' => false, 'message' => "Vous avez déjà évalué ce trajet."]);
    } else {
        echo json_encode(['success' => false, 'message' => 'Erreur BDD : ' . $e->getMessage()]);
    }
}
