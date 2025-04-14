const { createApp, ref } = Vue
const app = createApp({
    setup() {
        /*Les variables */
        const email = ref(''); // Stocke l'email saisi par l'utilisateur
        const motDePasse = ref(''); // Stocke le mot de passe saisi
        const messageErreur = ref(''); // Message d'erreur en cas de problème lors de la connexion
        var connected_state = ref(false)

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
                    connected_state.value = true;
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
        function deconnexion(){
            session_destroy();
            window.location.href = '../index.php';a
        }
        return {
            /*Exporter les rendus */
            email,
            motDePasse,
            messageErreur,
            connexion,
            deconnexion
        }
    }})
    import FormAvis from './components/formulaire_avis.js'
    app.component('baliseavis', FormAvis);  // le nom doit être en minuscule
    import HeaderComponent from './components/header.js';
    app.component('header-component', HeaderComponent);
     
app.mount('#app')