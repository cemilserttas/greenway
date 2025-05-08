// formulaire_avis.js
const FormAvis = {
  name: 'FormAvis',
  template: `
    <div class="formavis-wrapper">
      <!-- Bouton de bascule -->
      <div class="formavis-toggle" v-if="isConnected">
        <button @click="toggleFormulaire" class="formavis-btn-toggle">
          {{ afficherFormulaire ? 'Voir les avis' : 'Donner un avis' }}
        </button>
      </div>

      <!-- Message si non connecté -->
      <div v-else class="formavis-noconnect">
        <p>
          🔒 <a href="/pages/connexion.html">Connectez-vous</a> pour donner votre avis.
        </p>
      </div>

      <!-- Formulaire d'avis -->
      <div v-if="isConnected && afficherFormulaire" class="formavis-container">
        <form @submit.prevent="envoyerAvis" class="formavis-form">

          <div class="formavis-group">
            <label for="formavis-course">Choisir un trajet</label>
            <select id="formavis-course" v-model="selectedRide" @change="selectionnerTrajet" required>
              <option disabled value="">-- Sélectionner --</option>
              <option v-for="trajet in trajetsDisponibles" :value="trajet">
                {{ trajet.start_location }} → {{ trajet.dest_location }} - {{ formatDate(trajet.start_date) }}
              </option>
            </select>
          </div>

          <div class="formavis-group">
            <label>Note du trajet</label>
            <div class="formavis-radios">
              <label><input type="radio" v-model="avis" value="Très mauvais" /> Très mauvais</label>
              <label><input type="radio" v-model="avis" value="Mauvais" /> Mauvais</label>
              <label><input type="radio" v-model="avis" value="Moyen" /> Moyen</label>
              <label><input type="radio" v-model="avis" value="Bien" /> Bien</label>
              <label><input type="radio" v-model="avis" value="Très bien" /> Très bien</label>
            </div>
          </div>

          <div class="formavis-group">
            <label for="formavis-commentaire">Commentaire</label>
            <textarea id="formavis-commentaire" v-model="commentaire"></textarea>
          </div>

          <div class="formavis-actions">
            <button type="submit" class="formavis-btn-submit">Envoyer</button>
          </div>
        </form>
      </div>

      <!-- Liste des avis affichée dans un slider -->
      <div v-if="avisActuels.length" class="formavis-slider splide">
        <div class="splide__track">
          <ul class="splide__list">
            <li v-for="avis in avisActuels" :key="avis.id" class="splide__slide">
              <div class="formavis-avis-item">
                <strong>{{ avis.auteur }}</strong>
                <span class="avis-note">– {{ avis.note }}</span>
                <p class="avis-commentaire" v-html="avis.message"></p>
                <span class="avis-date">{{ formatDate(avis.date) }}</span>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  `,

  data() {
    return {
      isConnected: false,
      afficherFormulaire: false,
      id: '',
      conducteur_id: '',
      numid: '',
      avis: 'Bien',
      commentaire: '',
      avisActuels: [],
      trajetsDisponibles: [],
      selectedRide: ''
    };
  },

  methods: {
    toggleFormulaire() {
      this.afficherFormulaire = !this.afficherFormulaire;
    },

    formatDate(dateStr) {
      const date = new Date(dateStr);
      return date.toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });
    },

    selectionnerTrajet() {
      this.numid = this.selectedRide.ride_id;
      this.conducteur_id = this.selectedRide.conducteur_id;
    },

    envoyerAvis() {
      const formattedDate = new Date().toISOString().slice(0, 19).replace('T', ' '); // Format MySQL

      const formData = new FormData();
      formData.append('ride_id', this.numid);
      formData.append('evaluator_id', this.id);
      formData.append('evaluated_id', this.conducteur_id);
      formData.append('avis', this.avis);
      formData.append('commentaire', this.commentaire);
      formData.append('date', formattedDate);

      fetch('/api/submit_avis.php', {
        method: 'POST',
        body: formData
      })
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            alert("Merci pour votre avis !");
            this.avisActuels.unshift({
              id: Date.now(),
              auteur: this.prenom + ' ' + this.nom.toUpperCase(),
              note: this.avis,
              message: this.commentaire,
              date: formattedDate
            });
            this.resetForm();
            this.afficherFormulaire = false;
            this.$nextTick(this.monterSlider);
          } else {
            alert("Erreur : " + data.message);
          }
        })
        .catch(() => {
          alert("Une erreur est survenue.");
        });
    },

    resetForm() {
      this.conducteur_id = '';
      this.numid = '';
      this.selectedRide = '';
      this.avis = 'Bien';
      this.commentaire = '';
    },

    monterSlider() {
      if (document.querySelector('.formavis-slider')) {
        new Splide('.formavis-slider', {
          type: 'loop',
          autoplay: true,
          interval: 3000,
          arrows: true,
          pagination: true,
          pauseOnHover: false,
          resetProgress: false
        }).mount();
      }
    }
  },

  mounted() {
    fetch('/api/get_avis.php')
      .then(res => res.json())
      .then(data => {
        this.avisActuels = data.avis ?? [];
        this.$nextTick(this.monterSlider);
      });

    fetch('/api/get_user.php')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          this.isConnected = true;
          this.id = data.user.id;
          this.nom = data.user.name;
          this.prenom = data.user.firstname;

          fetch('/api/get_trajets_participes.php')
            .then(res => res.json())
            .then(data => {
              if (data.success) {
                this.trajetsDisponibles = data.trajets;
              }
            });
        }
      });
  }
};

export default FormAvis;
