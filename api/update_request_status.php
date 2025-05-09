const DemandePassagers = {
  name: 'DemandePassagers',
  template: `
    <section class="demande-passagers">
      <h2>Demandes de réservation reçues</h2>

      <div v-if="loading">Chargement...</div>
      <div v-else-if="demandes.length === 0">Aucune demande pour l’instant.</div>

      <ul v-else class="demandes-list">
        <li v-for="demande in demandes" :key="demande.id" class="demande-item">
          <div class="demande-info">
            <p><strong>Passager :</strong> {{ demande.firstname }} {{ demande.name }}</p>
            <p><strong>Trajet :</strong> {{ demande.depart }} → {{ demande.destination }}</p>
            <p><strong>Date :</strong> {{ formatDate(demande.start_date) }} à {{ formatHeure(demande.start_date) }}</p>
            <p><strong>Status :</strong> {{ demande.status }}</p>
          </div>
          <div class="demande-actions" v-if="demande.status === 'waiting'">
            <button @click="accepter(demande.id)" class="btn-accept">Accepter</button>
            <button @click="refuser(demande.id)" class="btn-refuse">Refuser</button>
          </div>
        </li>
      </ul>
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
      fetch('/api/get_requests_conducteur.php')
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            this.demandes = data.demandes;
          } else {
            alert(data.message || 'Erreur lors du chargement des demandes.');
          }
        })
        .catch(() => alert('Erreur réseau.'))
        .finally(() => this.loading = false);
    },
    accepter(requestId) {
      fetch('/api/update_request_status.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ request_id: requestId, status: 'accepted' })
      })
        .then(res => res.json())
        .then(data => {
          if (data.success) this.fetchDemandes();
          else alert(data.message);
        });
    },
    refuser(requestId) {
      if (!confirm("Refuser cette demande supprimera la réservation. Confirmer ?")) return;
      fetch(`/api/delete_request.php?id=${requestId}`, { method: 'DELETE' })
        .then(res => res.json())
        .then(data => {
          if (data.success) this.fetchDemandes();
          else alert(data.message || "Erreur lors du refus.");
        });
    },
    formatDate(dateStr) {
      return new Date(dateStr).toLocaleDateString('fr-FR');
    },
    formatHeure(dateStr) {
      return new Date(dateStr).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
    }
  },
  mounted() {
    this.fetchDemandes();
  }
};

export default DemandePassagers;
