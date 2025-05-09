import HeaderComponent from './components/header.js';
import FooterComponent from './components/footer.js';
import FormAvis from './components/formulaire_avis.js';
import ListeTrajets from './components/afficher_trajets.js';
import InscriptionComponent from './components/formulaire_inscription.js';
import FormulaireTrajet from './components/formulaire_trajet.js';
import ParametreProfil from './components/parametres_profil.js';
import AddVehicule from './components/add_vehicule.js';
import ListeVehicules from './components/liste_vehicules.js';
import DemandesConducteur from './components/demandes_conducteur.js';
import CookieBanner from './components/cookie_banner.js';

const { createApp, ref } = Vue;

const app = createApp({
  setup() {
    const email = ref('');
    const motDePasse = ref('');
    const messageErreur = ref('');
    const connected_state = ref(false);
    const depart = ref('');
    const destination = ref('');
    const date = ref('');

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
      window.location.href = '/includes/logout.php';
    }

    // ✅ Réinitialiser les filtres
    function resetFiltres() {
      depart.value = '';
      destination.value = '';
      date.value = '';
    }

    return {
      email,
      motDePasse,
      messageErreur,
      connexion,
      deconnexion,
      connected_state,
      depart,
      destination,
      date,
      resetFiltres // important : maintenant défini avant d'être retourné
    };
  }
});

// ✅ Composants globaux
app.component('header-component', HeaderComponent);
app.component('footer-component', FooterComponent);
app.component('baliseavis', FormAvis);
app.component('liste-trajets', ListeTrajets);
app.component('formulaire-trajet', FormulaireTrajet);
app.component('formulaire-inscription', InscriptionComponent);
app.component('parametre-profil', ParametreProfil);
app.component('ajout-vehicule', AddVehicule);
app.component('liste-vehicules', ListeVehicules);
app.component('demandes-conducteur', DemandesConducteur);
app.component('cookie-banner', CookieBanner);

app.mount('#app');
