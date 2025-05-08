<?php
session_start();
header('Content-Type: application/json');
require_once '../api/bd_connect.php';

try {
    $stmt = $pdo->prepare("
        SELECT o.ride_id, o.score, o.comment AS message, o.creation_date AS date,
               u.firstname, u.name
        FROM opinions o
        JOIN users u ON o.evaluator_id = u.id
        ORDER BY o.creation_date DESC
    ");
    $stmt->execute();

    $avis = $stmt->fetchAll(PDO::FETCH_ASSOC);

    $noteText = [
        1 => "Très mauvais",
        2 => "Mauvais",
        3 => "Moyen",
        4 => "Bien",
        5 => "Très bien"
    ];

    foreach ($avis as &$a) {
        $a['note'] = $noteText[$a['score']] ?? 'Non noté';
        $a['auteur'] = $a['firstname'] . ' ' . strtoupper($a['name']);
        unset($a['score'], $a['firstname'], $a['name']);
    }

    echo json_encode(['success' => true, 'avis' => $avis]);

} catch (PDOException $e) {
    echo json_encode(['success' => false, 'message' => 'Erreur : ' . $e->getMessage()]);
}
