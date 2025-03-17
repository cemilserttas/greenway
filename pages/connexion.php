<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Connexion</title>
    <script src="https://unpkg.com/vue@3/dist/vue.global.js"></script>
</head>
<body>
    <?php include '../includes/header.php'; ?>
    <h1>Connexion</h1>
    <div id="connexion" class="login-container">
        <h2>Connexion</h2>
        <form @submit.prevent="login">
            <div class="form-group">
                <label for="username">Nom d'utilisateur:</label>
                <input type="text" id="username" v-model="username" required>
            </div>
            <div class="form-group">
                <label for="password">Mot de passe:</label>
                <input type="password" id="password" v-model="password" required>
            </div>
            <button type="submit">Se connecter</button>
            <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
        </form>
        <p>Pas encore inscrit ? <a href="inscription.php">S'inscrire</a></p>
    </div>
/*FIXME: Mettre a jour code VUE JS*/
    <script>
        const { createApp, ref } = Vue;
        createApp({
            setup() {
                const username = ref('');
                const password = ref('');
                const errorMessage = ref('');

                const login = async () => {
                    if (!username.value || !password.value) {
                        errorMessage.value = 'Veuillez remplir tous les champs';
                        return;
                    }
                    errorMessage.value = '';  // Reset the error message

                    const formData = new FormData();
                    formData.append('username', username.value);
                    formData.append('password', password.value);

                    try {
                        const response = await fetch('../includes/bd_connect.php', {
                            method: 'POST',
                            body: formData
                        });

                        const result = await response.json();

                        if (result.success) {
                            window.location.href = '../index.php'; // Redirection si succès
                        } else {
                            errorMessage.value = result.message; // Affichage du message d'erreur
                        }
                    } catch (error) {
                        errorMessage.value = 'Erreur de connexion.';
                    }
                };

                return { username, password, errorMessage, login };
            }
        }).mount('#connexion');
    </script>

    <?php include '../includes/footer.php'; ?>
</body>
</html>
