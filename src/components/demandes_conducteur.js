const DemandesConducteur = {
  name: 'DemandesConducteur',
  template: `
    <section class="demandes-conducteur">
      <h2>Demandes de réservation</h2>
      <div v-if="loading">Chargement...</div>
      <div v-else-if="demandes.length === 0">Aucune demande en attente.</div>
      <div v-else class="demande-list">
        <div class="demande-card" v-for="demande in demandes" :key="demande.request_id">
          <p><strong>Trajet :</strong> {{ demande.depart }} → {{ demande.destination }} ({{ formatDate(demande.start_date) }})</p>
          <p><strong>Passager :</strong> {{ demande.passenger_name }}</p>
          <p><strong>Statut :</strong> {{ demande.status }}</p>

          <div class="actions" v-if="demande.status === 'waiting'">
            <button @click="accepter(demande.request_id)">Accepter</button>
            <button class="refuser" @click="refuser(demande.request_id)">Refuser</button>
          </div>
        </div>
      </div>
    </section>
  `,
  data() {
    return {
      demandes: [],
      loading: true
    };
  },
  methods: {
    fetchDemandes() {
      fetch('/api/get_demandes_conducteur.php')
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            this.demandes = data.demandes;
          }
        })
        .finally(() => this.loading = false);
    },
    accepter(id) {
      fetch(`/api/update_request_status.php`, {
        method: 'POST',
        body: JSON.stringify({ id, status: 'accepted' }),
        headers: { 'Content-Type': 'application/json' }
      }).then(res => res.json())
        .then(() => this.fetchDemandes());
    },
    refuser(id) {
  if (!confirm('Refuser cette demande ? Elle sera définitivement supprimée.')) return;

  fetch(`/api/delete_request.php?id=${id}`, {
    method: 'DELETE'
  })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        this.fetchDemandes();
      } else {
        alert(data.message || 'Erreur lors de la suppression de la demande.');
      }
    })
    .catch(() => alert('Erreur réseau lors de la suppression.'));
},

    formatDate(dateStr) {
      const d = new Date(dateStr);
      return d.toLocaleDateString('fr-FR');
    }
  },
  mounted() {
    this.fetchDemandes();
  }
};

export default DemandesConducteur;
