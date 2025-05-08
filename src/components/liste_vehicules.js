// composant: ListeVehicules.js
const ListeVehicules = {
    name: 'ListeVehicules',
    template: `
      <section class="vehicule-list-section">
        <h2>Mes véhicules</h2>
  
        <transition-group name="fade" tag="div" class="vehicule-cards">
          <div v-for="vehicule in vehicules" :key="vehicule.id" class="vehicule-card">
            <p><strong>Marque :</strong> {{ vehicule.brand }}</p>
            <p><strong>Modèle :</strong> {{ vehicule.model }}</p>
            <p><strong>Année :</strong> {{ vehicule.year }}</p>
            <p><strong>Couleur :</strong> {{ vehicule.color }}</p>
            <p><strong>Immatriculation :</strong> {{ vehicule.registration_number }}</p>
  
            <div class="vehicule-actions">
              <button @click="modifierVehicule(vehicule)">Modifier</button>
              <button class="delete" @click="supprimerVehicule(vehicule.id)">Supprimer</button>
            </div>
          </div>
        </transition-group>
  
        <p v-if="message" class="vehicule-message">{{ message }}</p>
      </section>
    `,
  
    data() {
      return {
        vehicules: [],
        message: ''
      };
    },
  
    methods: {
      fetchVehicules() {
        fetch('/api/get_vehicules.php')
          .then(res => res.json())
          .then(data => {
            if (data.success) {
              this.vehicules = data.vehicules;
            } else {
              this.message = data.message || 'Aucun véhicule trouvé.';
            }
          })
          .catch(() => {
            this.message = 'Erreur lors de la récupération des véhicules.';
          });
      },
  
      supprimerVehicule(id) {
        if (!confirm('Supprimer ce véhicule ?')) return;
        fetch(`/api/delete_vehicule.php?id=${id}`, { method: 'DELETE' })
          .then(res => res.json())
          .then(data => {
            if (data.success) {
              this.vehicules = this.vehicules.filter(v => v.id !== id);
            } else {
              this.message = data.message || 'Erreur lors de la suppression';
            }
          })
          .catch(() => {
            this.message = 'Erreur réseau lors de la suppression.';
          });
      },
  
      modifierVehicule(vehicule) {
        alert(`Rediriger vers formulaire de modification du véhicule ${vehicule.brand} (${vehicule.id})`);
        // Ici, tu pourrais utiliser un modal ou rediriger vers une page dédiée
      }
    },
  
    mounted() {
      this.fetchVehicules();
    }
  };
  
  export default ListeVehicules;
  