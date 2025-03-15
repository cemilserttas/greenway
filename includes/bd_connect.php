<?php 
define('USER','ag32eg0enyr');
define('PASSWD','w1:w0a#4wr');
define('SERVER','https://greenway.hepl-e-business.be/php2admin/');
define('BASE','ebus2_projet06_yenw61');

$dsn = 'mysql:host=' . SERVER . ';dbname=' . BASE;

try {
    $connection = new PDO($dsn, USER, PASSWD);
} catch(PDOException $e) {
    echo 'Échec de la connexion : ' . $e->getMessage(); // ! donnée confidentielle
    exit();
}
?>