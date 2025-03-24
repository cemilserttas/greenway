<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Connexion</title>
    <link rel="stylesheet" href="../assets/css/connexion.css">
    <script src="https://unpkg.com/vue@3/dist/vue.global.js"></script>
</head>
<body>
    <div id="connexion">
        <form class="formulaire" @submit.prevent="connexion">
            <h2 class="titre">Connexion</h2>
            
            <!-- Affichage du message d'erreur -->
            <p v-if="messageErreur" class="erreur">{{ messageErreur }}</p>

            <!-- Champ pour l'email -->
            <label for="utilisateur" class="etiquette">E-mail :</label>
            <input type="email" id="utilisateur" class="champ" v-model="email" required>
            
            <!-- Champ pour le mot de passe -->
            <label for="motdepasse" class="etiquette">Mot de passe :</label>
            <input type="password" id="motdepasse" class="champ" v-model="motDePasse" required>
            
            <!-- Option pour rester connecté -->
            <div class="checkbox-container">
                <input type="checkbox" id="resterconnecte" name="resterconnecte">
                <label for="resterconnecte">Rester connecté</label>
            </div>

            <!-- Bouton pour soumettre le formulaire -->
            <button type="submit" class="bouton">Se connecter</button>
            
            <!-- Lien vers la page d'inscription -->
            <p class="inscription-lien">Pas de compte ? <a href="inscription.php">S'inscrire</a></p>
        </form>
    </div>

    <script>
    // Importation de Vue.js 3
    const { createApp, ref } = Vue;

    // Création de l'application Vue.js
    const app = createApp({
        setup() {
            // Déclaration des variables réactives avec ref()
            const email = ref(''); // Stocke l'email saisi par l'utilisateur
            const motDePasse = ref(''); // Stocke le mot de passe saisi
            const messageErreur = ref(''); // Message d'erreur en cas de problème lors de la connexion

            // Fonction pour gérer la connexion
            function connexion() {
                // Validation basique côté client (si les champs sont vides)
                if (!email.value || !motDePasse.value) {
                    messageErreur.value = "Veuillez remplir tous les champs.";
                    return;
                }

                // Envoi des données au serveur via fetch() avec method 'POST'
                const formData = new FormData();
                formData.append('email', email.value);
                formData.append('motDePasse', motDePasse.value);

                fetch('../includes/user_connect.php', {
                    method: 'POST', // Méthode HTTP pour envoyer les données
                    body: formData // Envoi des données sous forme de FormData
                })
                .then(reponse => reponse.json()) // Convertir la réponse en JSON
                .then(donnees => {
                    if (donnees.success) {
                        // Redirection vers la page d'accueil en cas de succès
                        window.location.href = '../index.php';
                    } else {
                        // Affichage du message d'erreur si la connexion échoue
                        messageErreur.value = donnees.message;
                    }
                })
                .catch(() => {
                    // Gestion des erreurs de connexion (problème serveur par exemple)
                    messageErreur.value = "Une erreur est survenue. Veuillez réessayer.";
                });
            }

            // Retourne les variables et la fonction pour les utiliser dans le template HTML
            return {
                email, // Champ email réactif
                motDePasse, // Champ mot de passe réactif
                messageErreur, // Message d'erreur à afficher
                connexion // Fonction de connexion
            };
        }
    });

    // Monte l'application Vue.js sur l'élément avec l'ID "connexion"
    app.mount('#connexion');
</script>
</body>
</html>
