const FormulaireTrajet = {
    name: "FormulaireTrajet",
    template: `
      <main>
        <h2>Créer un nouveau trajet</h2>
        <form @submit.prevent="submitTrajet" class="form-trajet">
  
          <label for="vehicule_id">Sélectionner votre véhicule</label>
          <select v-model="vehicule_id" id="vehicule_id" required>
            <option value="" disabled>-- Choisir un véhicule --</option>
            <option v-for="v in vehicules" :key="v.id" :value="v.id">
              {{ v.brand }} {{ v.model }} ({{ v.registration_number }})
            </option>
          </select>
  
          <label for="start_location">Emplacement de départ</label>
          <select v-model="start_location" id="start_location" required>
            <option value="" disabled>-- Choisir un emplacement --</option>
            <option v-for="lieu in lieux" :key="'depart-' + lieu" :value="lieu">
              {{ lieu }}
            </option>
          </select>
  
          <label for="dest_location">Campus d'arrivée</label>
          <select v-model="dest_location" id="dest_location" required>
            <option value="" disabled>-- Choisir un campus --</option>
            <option v-for="lieu in lieuxDestination" :key="'dest-' + lieu" :value="lieu">
              {{ lieu }}
            </option>
          </select>
  
          <label for="start_date">Date de départ</label>
          <input type="datetime-local" v-model="start_date" id="start_date" required>
  
          <label for="available_places">Places disponibles</label>
          <select v-model="available_places" id="available_places" required>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
          </select>
  
          <div class="form-actions">
            <button type="reset">Effacer tout</button>
            <button type="submit">Envoyer</button>
          </div>
  
          <p v-if="message" :class="{ success: success, error: !success }">{{ message }}</p>
        </form>
      </main>
    `,
    data() {
      return {
        vehicule_id: '',
        vehicules: [],
        start_location: '',
        dest_location: '',
        start_date: '',
        available_places: '',
        message: '',
        success: false,
        user_id: null,
        lieux: [
            "Jemeppe",
            "Barbou",
            "Beeckman",
            "Gloesener",
            "Huy",
            "La Reid",
            "Kurth",
            "Seraing",
            "Guillemins",
            "Pont d'Avroi",
            "Médiacité",
            "Belle-Île",
            "Coronmeuse",
            "Sart-Tilman"
          ]
      };
    },
    computed: {
      lieuxDestination() {
        return this.lieux.filter(lieu => lieu !== this.start_location);
      }
    },
    async mounted() {
      try {
        const resUser = await fetch('/api/get_user.php');
        const userData = await resUser.json();
        if (userData.success) {
          this.user_id = userData.id;
          await this.fetchVehicules();
        } else {
          window.location.href = '/src/pages/connexion.html';
        }
      } catch (err) {
        this.message = "Erreur lors de la récupération de l'utilisateur.";
        this.success = false;
      }
    },
    methods: {
      async fetchVehicules() {
        try {
          const res = await fetch('/api/get_vehicules.php');
          const data = await res.json();
          if (data.success) {
            this.vehicules = data.vehicules;
          } else {
            this.message = data.message;
          }
        } catch (err) {
          this.message = "Erreur lors du chargement des véhicules.";
        }
      },
      async submitTrajet() {
        const formData = new FormData();
        formData.append("user_id", this.user_id);
        formData.append("vehicule_id", this.vehicule_id);
        formData.append("start_location", this.start_location);
        formData.append("dest_location", this.dest_location);
        formData.append("start_date", this.start_date);
        formData.append("available_places", this.available_places);
  
        try {
          const res = await fetch("/api/create_trajet.php", {
            method: "POST",
            body: formData
          });
          const result = await res.json();
          this.message = result.message;
          this.success = result.success;
          if (result.success) {
            // Optionnel : feedback rapide
            this.message = result.message;
            this.success = true;
          
            // Redirection après 2 secondes
            setTimeout(() => {
              window.location.href = '/index.html';
            }, 2000);
          }
        } catch (err) {
          this.message = "Une erreur est survenue lors de l'envoi.";
          this.success = false;
        }
      },
      resetForm() {
        this.vehicule_id = '';
        this.start_location = '';
        this.dest_location = '';
        this.start_date = '';
        this.available_places = '';
      }
    }
  };
  
  export default FormulaireTrajet;
  