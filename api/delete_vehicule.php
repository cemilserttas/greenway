<?php
session_start();
header('Content-Type: application/json');
require_once 'bd_connect.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST' && $_SERVER['REQUEST_METHOD'] !== 'DELETE') {
    echo json_encode(['success' => false, 'message' => 'Méthode non autorisée.']);
    exit;
}

$user_id = $_SESSION['user_id'] ?? null;
$vehicule_id = $_POST['id'] ?? $_GET['id'] ?? null;

if (!$user_id || !$vehicule_id) {
    echo json_encode(['success' => false, 'message' => 'Paramètres manquants.']);
    exit;
}

try {
    $pdo->beginTransaction();

    // Vérifie que le véhicule appartient à l'utilisateur
    $stmt = $pdo->prepare("SELECT id FROM vehicules WHERE id = ? AND user_id = ?");
    $stmt->execute([$vehicule_id, $user_id]);
    if (!$stmt->fetch()) {
        echo json_encode(['success' => false, 'message' => 'Véhicule introuvable ou non autorisé.']);
        exit;
    }

    // Récupère les rides liés à ce véhicule
    $stmt = $pdo->prepare("SELECT id FROM rides WHERE vehicule_id = ?");
    $stmt->execute([$vehicule_id]);
    $ride_ids = $stmt->fetchAll(PDO::FETCH_COLUMN);

    if (!empty($ride_ids)) {
        $placeholders = implode(',', array_fill(0, count($ride_ids), '?'));

        // Supprimer les opinions
        $pdo->prepare("DELETE FROM opinions WHERE ride_id IN ($placeholders)")->execute($ride_ids);

        // Supprimer les demandes liées aux trajets
        $pdo->prepare("DELETE FROM requests WHERE ride_id IN ($placeholders)")->execute($ride_ids);

        // Supprimer les trajets
        $pdo->prepare("DELETE FROM rides WHERE id IN ($placeholders)")->execute($ride_ids);
    }

    // Enfin, supprimer le véhicule
    $pdo->prepare("DELETE FROM vehicules WHERE id = ?")->execute([$vehicule_id]);

    $pdo->commit();
    echo json_encode(['success' => true]);

} catch (PDOException $e) {
    $pdo->rollBack();
    echo json_encode(['success' => false, 'message' => 'Erreur BDD : ' . $e->getMessage()]);
}
