<?php
session_start();
?>
<!DOCTYPE html>
<html lang="fr">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>GreenWay</title>
        <link rel="stylesheet" href="../assets/css/header.css">
    </head>
    <body>
        <header class="sticky-header">
            <div class="container">
                <a href="../index.php"><img src="../assets/img/GreenWay_logo.png" alt="Logo GreenWay" class="logo"></a>
                <nav>
                    <ul>
                        <li><a href="../index.php">Accueil</a></li>
                        <?php if (isset($_SESSION['user_id'])) : ?>
                            <li><a href="../pages/formulaire_trajet.html">Proposer un trajet</a></li>
                            <li><a href="../pages/formulaire_avis.html">Donner un avis</a></li>
                            <li><a href="../includes/logout.php" class="btn-logout">Déconnexion</a></li>
                        <?php else : ?>
                            <li><a href="../pages/connexion.php" class="btn-login">Connexion</a></li>
                        <?php endif; ?>
                        <li><a href="../pages/formulaire_contact.html">Contact</a></li>
                    </ul>
                </nav>
            </div>
        </header>
    </body>
</html>