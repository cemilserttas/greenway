// parametres_profil.js
const ParametreProfil = {
    name: 'ParametreProfil',
    template: `
      <section class="profile-section">
        <h1>Informations personnelles</h1>
        <h2>Bienvenue, <span>{{ prenom }} {{ nom }}</span> !</h2>
        <p>Modifiez vos informations ci-dessous :</p>
  
        <form @submit.prevent="enregistrerModifications">
          <label>Nom</label>
          <input type="text" v-model="nom">
  
          <label>Prénom</label>
          <input type="text" v-model="prenom">
  
          <label>Mot de passe</label>
          <input type="password" v-model="mdp" placeholder="Nouveau mot de passe">
  
          <label>Adresse e-mail</label>
          <input type="email" v-model="email">
  
          <label>Date de naissance</label>
          <input type="date" v-model="dateNaissance">
  
          <label>Numéro de licence</label>
          <input type="text" v-model="numLicence">
  
          <div class="form-buttons">
            <button type="submit">Enregistrer les modifications</button>
            <button @click.prevent="supprimerCompte" class="delete-button">Supprimer mon compte</button>
          </div>
  
          <p class="success-message" v-if="successMessage">{{ successMessage }}</p>
          <p class="error-message" v-if="errorMessage">{{ errorMessage }}</p>
        </form>
      </section>
    `,
    data() {
      return {
        nom: '',
        prenom: '',
        email: '',
        dateNaissance: '',
        numLicence: '',
        mdp: '',
        successMessage: '',
        errorMessage: ''
      };
    },
    mounted() {
      fetch('/api/get_user.php')
        .then(res => res.json())
        .then(data => {
          if (data.success && data.user) {
            const u = data.user;
            this.nom = u.name;
            this.prenom = u.firstname;
            this.email = u.email;
            this.dateNaissance = u.birth_date;
            this.numLicence = u.licence_number;
          } else {
            this.errorMessage = 'Impossible de récupérer les données utilisateur.';
          }
        })
        .catch(() => {
          this.errorMessage = 'Erreur lors de la récupération des données utilisateur';
        });
    },
    methods: {
      enregistrerModifications() {
        const formData = new FormData();
        formData.append('name', this.nom);
        formData.append('firstname', this.prenom);
        formData.append('email', this.email);
        formData.append('birth_date', this.dateNaissance);
        formData.append('licence_number', this.numLicence);
        if (this.mdp.trim()) {
          formData.append('password', this.mdp);
        }
  
        fetch('/api/update_user.php', {
          method: 'POST',
          body: formData
        })
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            this.successMessage = 'Profil mis à jour avec succès';
            setTimeout(() => window.location.reload(), 2000);
          } else {
            this.errorMessage = data.message || 'Erreur lors de la mise à jour';
          }
        })
        .catch(() => {
          this.errorMessage = 'Erreur réseau lors de la mise à jour';
        });
      },
      supprimerCompte() {
        if (!confirm('Voulez-vous vraiment supprimer votre compte ? Cette action est définitive.')) return;
        fetch('/api/delete_account.php', { method: 'POST' })
          .then(res => res.json())
          .then(data => {
            if (data.success) {
              alert('Compte supprimé avec succès.');
              window.location.href = '/index.html';
            } else {
              alert(data.message || 'Erreur lors de la suppression.');
            }
          })
          .catch(() => alert('Erreur réseau lors de la suppression.'));
      }
    }
  };
  
  export default ParametreProfil;