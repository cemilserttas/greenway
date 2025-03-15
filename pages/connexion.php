<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Connexion</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <?php include '../includes/header.php'; ?>
    <h1>Connexion</h1>
    <div class="login-container">
        <h2>Connexion</h2>
        <form action="process_login.php" method="post">
            <div class="form-group">
                <label for="username">Nom d'utilisateur:</label>
                <input type="text" id="username" name="username" required>
            </div>
            <div class="form-group">
                <label for="password">Mot de passe:</label>
                <input type="password" id="password" name="password" required>
            </div>
            <button type="submit">Se connecter</button>
        </form>
        <p>Pas encore inscrit ? <a href="inscription.php">S'inscrire</a></p>
    </div>
    <?php include '../includes/footer.php'; ?>
</body>
</html>