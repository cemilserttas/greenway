const ListeTrajets = {
  name: 'ListeTrajets',
  template: `
    <div class="trajets-container">
      <div v-if="loading">Chargement des trajets...</div>
      <div v-else>
        <div v-if="trajets.length === 0">Aucun trajet trouvé.</div>
        <div v-for="trajet in trajets" :key="trajet.id" class="trajet">
          <div class="trajet-info">
            <p><span class="label">Nom d'utilisateur :</span> {{ formatNom(trajet.firstname, trajet.name) }}</p>
            <p><span class="label">Places disponibles :</span> {{ trajet.places }}</p>
            <p><span class="label">Heure :</span> {{ formatHeure(trajet.start_date) }}</p>
            <p><span class="label">Départ :</span> {{ trajet.depart }}</p>
            <p><span class="label">Destination :</span> {{ trajet.destination }}</p>
            <p><span class="label">Date :</span> {{ formatDate(trajet.start_date) }}</p>
          </div>

          <!-- Boutons -->
          <div class="trajet-actions">
            <button v-if="!connected" @click="goLogin" class="reserve-btn">Se connecter</button>
            <button v-else-if="trajet.user_id === currentUserId" @click="supprimerTrajet(trajet)" class="delete-btn">Supprimer</button>
            <button v-else @click="reserverTrajet(trajet)" class="reserve-btn">Réserver</button>
          </div>
        </div>
      </div>
    </div>
  `,
  data() {
    return {
      trajets: [],
      loading: true,
      connected: false,
      currentUserId: null
    };
  },
  methods: {
    async fetchTrajets() {
      try {
        const res = await fetch('/api/get_trajets.php');
        const data = await res.json();
        if (data.success) {
          this.trajets = data.trajets;
        }
      } catch (err) {
        console.error("Erreur lors du chargement des trajets :", err);
      } finally {
        this.loading = false;
      }
    },
    async fetchUser() {
      try {
        const res = await fetch('/api/get_user.php');
        const data = await res.json();
        if (data.success) {
          this.connected = true;
          this.currentUserId = data.id; // doit être renvoyé par get_user.php
        }
      } catch (err) {
        this.connected = false;
        this.currentUserId = null;
      }
    },
    reserverTrajet(trajet) {
      alert(`Réservation du trajet de ${trajet.depart} vers ${trajet.destination}`);
      // Ajouter un appel fetch ici si API de réservation
    },
    goLogin() {
      window.location.href = '/src/pages/connexion.html';
    },
    supprimerTrajet(trajet) {
      if (confirm(`Supprimer le trajet de ${trajet.depart} vers ${trajet.destination} ?`)) {
        fetch(`/api/delete_trajet.php?id=${trajet.id}`, { method: 'DELETE' })
          .then(res => res.json())
          .then(data => {
            if (data.success) {
              this.trajets = this.trajets.filter(t => t.id !== trajet.id);
              alert('Trajet supprimé avec succès.');
            } else {
              alert('Erreur : ' + data.message);
            }
          });
      }
    },
    formatDate(datetime) {
      const date = new Date(datetime);
      return date.toLocaleDateString('fr-FR');
    },
    formatHeure(datetime) {
      const date = new Date(datetime);
      return date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
    },
    formatNom(prenom, nom) {
      return `${prenom} ${nom}`;
    }
  },
  mounted() {
    this.fetchUser().then(() => this.fetchTrajets());
  }
};

export default ListeTrajets;
