<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Formulaire d'inscription</title>
</head>
<body>
    <h2>Formulaire d'inscription</h2>
    <form action="submit_inscription.php" method="post">
        <label for="nom">Nom:</label>
        <input type="text" id="nom" name="nom" required><br><br>

        <label for="prenom">Prénom:</label>
        <input type="text" id="prenom" name="prenom" required><br><br>

        <label for="email">Email:</label>
        <input type="email" id="email" name="email" required><br><br>

        <label for="password">Mot de passe:</label>
        <input type="password" id="password" name="password" required><br><br>

        <label for="confirm_password">Confirmer le mot de passe:</label>
        <input type="password" id="confirm_password" name="confirm_password" required><br><br>

        <input type="submit" value="S'inscrire">
    </form>
    <p>Déjà inscrit ? <a href="connexion.php">Se connecter</a></p>
</body>
</html>