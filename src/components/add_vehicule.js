// composant: add_vehicule.js
const AddVehicule = {
    name: 'AddVehicule',
    template: `
      <section class="vehicule-form-container">
        <h2>Ajouter un véhicule</h2>
        <form @submit.prevent="ajouterVehicule" class="vehicule-form">
          <label>Marque</label>
          <input type="text" v-model="brand" required>
  
          <label>Modèle</label>
          <input type="text" v-model="model" required>
  
          <label>Année</label>
          <input type="number" v-model="year" min="1900" max="2100" required>
  
          <label>Couleur</label>
          <input type="text" v-model="color" required>
  
          <label>Numéro d'immatriculation</label>
          <input type="text" v-model="registration_number" required>
  
          <button type="submit">Ajouter le véhicule</button>
          <p class="success-message" v-if="successMessage">{{ successMessage }}</p>
          <p class="error-message" v-if="errorMessage">{{ errorMessage }}</p>
        </form>
      </section>
    `,
    data() {
      return {
        brand: '',
        model: '',
        year: '',
        color: '',
        registration_number: '',
        successMessage: '',
        errorMessage: ''
      };
    },
    methods: {
      async ajouterVehicule() {
        const resUser = await fetch('/api/get_user.php');
        const userData = await resUser.json();
        if (!userData.success || !userData.user?.id) {
          this.errorMessage = "Utilisateur non connecté.";
          return;
        }
  
        const formData = new FormData();
        formData.append('brand', this.brand);
        formData.append('model', this.model);
        formData.append('year', this.year);
        formData.append('color', this.color);
        formData.append('registration_number', this.registration_number);
        formData.append('user_id', userData.user.id);
  
        fetch('/api/ajouter_vehicule.php', {
          method: 'POST',
          body: formData
        })
          .then(res => res.json())
          .then(data => {
            if (data.success) {
              this.successMessage = 'Véhicule ajouté avec succès';
              this.errorMessage = '';
              this.brand = this.model = this.year = this.color = this.registration_number = '';
            } else {
              this.errorMessage = data.message || 'Erreur lors de l\'ajout';
              this.successMessage = '';
            }
          })
          .catch(() => {
            this.errorMessage = 'Erreur réseau';
            this.successMessage = '';
          });
      }
    }
  };
  
  export default AddVehicule;
  