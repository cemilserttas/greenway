    import HeaderComponent from './components/header.js';
    import FooterComponent from './components/footer.js'; // facultatif
    import FormAvis from './components/formulaire_avis.js';
    import ListeTrajets from './components/afficher_trajets.js';
    import InscriptionComponent from './components/formulaire_inscription.js';
    import FormulaireTrajet from './components/formulaire_trajet.js';
    import ParametreProfil from './components/parametres_profil.js';

    const { createApp, ref } = Vue;

    const app = createApp({
    setup() {
        // ✅ Données réactives pour la connexion (utilisé sur page connexion.html)
        const email = ref('');
        const motDePasse = ref('');
        const messageErreur = ref('');
        const connected_state = ref(false);

        // ✅ Fonction de connexion utilisateur
        function connexion() {
        if (!email.value || !motDePasse.value) {
            messageErreur.value = "Veuillez remplir tous les champs.";
            return;
        }

        const formData = new FormData();
        formData.append('email', email.value);
        formData.append('motDePasse', motDePasse.value);

        fetch('../api/user_connect.php', {
            method: 'POST',
            body: formData
        })
            .then(res => res.json())
            .then(data => {
            if (data.success) {
                // Redirige vers l'accueil si la connexion est réussie
                window.location.href = '/index.html';
                connected_state.value = true;
            } else {
                messageErreur.value = data.message;
            }
            })
            .catch(() => {
            messageErreur.value = "Une erreur est survenue. Veuillez réessayer.";
            });
        }

        function deconnexion() {
        // Optionnel : peut être déclenché depuis un composant plus tard
        window.location.href = '/includes/logout.php';
        }

        return {
        email,
        motDePasse,
        messageErreur,
        connexion,
        deconnexion,
        connected_state
        };
    }
    });

    // ✅ Composants globaux
    app.component('header-component', HeaderComponent);
    app.component('footer-component', FooterComponent); // si tu l'ajoutes
    app.component('baliseavis', FormAvis); // pour les avis
    app.component('liste-trajets', ListeTrajets);
    app.component('formulaire-trajet', FormulaireTrajet);
    app.component('formulaire-inscription', InscriptionComponent); // pour l'inscription
    app.component('parametre-profil', ParametreProfil);
    // ✅ Lancement de l'app Vue
    app.mount('#app');