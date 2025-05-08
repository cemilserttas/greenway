const ListeTrajets = {
  name: 'ListeTrajets',
  template: `
    <div class="trajets-container">
  <div v-if="loading">Chargement des trajets...</div>
  <template v-else>
    <div v-if="trajets.length === 0">Aucun trajet trouvé.</div>
    <div v-for="trajet in trajets" :key="trajet.id" class="trajet">
      <div class="trajet-info">
        <p><span class="trajet-label">Nom d'utilisateur :</span> <span class="trajet-value">{{ formatNom(trajet.firstname, trajet.name) }}</span></p>
        <p><span class="trajet-label">Places disponibles :</span> <span class="trajet-value">{{ trajet.places }}</span></p>
        <p><span class="trajet-label">Heure :</span> <span class="trajet-value">{{ formatHeure(trajet.start_date) }}</span></p>
        <p><span class="trajet-label">Départ :</span> <span class="trajet-value">{{ trajet.depart }}</span></p>
        <p><span class="trajet-label">Destination :</span> <span class="trajet-value">{{ trajet.destination }}</span></p>
        <p><span class="trajet-label">Date :</span> <span class="trajet-value">{{ formatDate(trajet.start_date) }}</span></p>
      </div>

      <div class="trajet-actions">
        <button v-if="!connected" @click="goLogin" class="trajet-reserve-btn">Se connecter</button>
        <button v-else-if="trajet.user_id === currentUserId" @click="supprimerTrajet(trajet)" class="trajet-delete-btn">Supprimer</button>
        <button v-else @click="reserverTrajet(trajet)" class="trajet-reserve-btn">Réserver</button>
      </div>
    </div>
  </template>
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
    },
    goLogin() {
      window.location.href = 'pages/connexion.html';
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
