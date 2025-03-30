<?php
// Informations de connexion
define('DB_HOST', 'localhost');
define('DB_NAME', 'ebus2_projet06_yenw61');
define('DB_USER', 'ag32eg0enyr');
define('DB_PASSWORD', 'w1:w0a#4wr');

try {
    $pdo = new PDO("mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=utf8", DB_USER, DB_PASSWORD, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC
    ]);
} catch (PDOException $e) {
    die("Erreur de connexion à la base de données : " . $e->getMessage());
}
?>