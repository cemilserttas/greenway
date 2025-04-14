const FormAvis = {
  name: 'FormAvis',

  template: `
    <div class="formavis-wrapper">

      <div class="formavis-toggle">
        <button @click="toggleFormulaire" class="formavis-btn-toggle">
          {{ afficherFormulaire ? 'Voir les avis' : 'Évaluer un trajet' }}
        </button>
      </div>

      <!-- Formulaire -->
      <div v-if="afficherFormulaire" class="formavis-container">
        <form @submit.prevent="envoyerAvis" class="formavis-form">

          <!-- Identifiant évaluateur -->
          <div class="formavis-group" v-if="!id">
            <label for="formavis-id">Votre identifiant</label>
            <input id="formavis-id" type="text" v-model="id" required placeholder="Votre identifiant" />
          </div>

          <!-- Identifiant conducteur -->
          <div class="formavis-group">
            <label for="formavis-conducteur">Identifiant du conducteur</label>
            <input id="formavis-conducteur" type="text" v-model="conducteur_id" required placeholder="ID du conducteur" />
          </div>

          <!-- Identifiant course -->
          <div class="formavis-group">
            <label for="formavis-course">Identifiant du trajet</label>
            <input id="formavis-course" type="text" v-model="numid" required placeholder="ID du trajet" />
          </div>

          <!-- Note -->
          <div class="formavis-group">
            <label>Comment s'est déroulé votre trajet ?</label>
            <div class="formavis-radios">
              <label><input type="radio" v-model="avis" value="Très mauvais" /> Très mauvais</label>
              <label><input type="radio" v-model="avis" value="Mauvais" /> Mauvais</label>
              <label><input type="radio" v-model="avis" value="Moyen" /> Moyen</label>
              <label><input type="radio" v-model="avis" value="Bien" /> Bien</label>
              <label><input type="radio" v-model="avis" value="Très bien" /> Très bien</label>
            </div>
          </div>

          <!-- Commentaire -->
          <div class="formavis-group">
            <label for="formavis-commentaire">Commentaire</label>
            <textarea id="formavis-commentaire" v-model="commentaire" name="commentaire"></textarea>
          </div>

          <!-- Envoi -->
          <div class="formavis-actions">
            <button type="submit" class="formavis-btn-submit">Envoyer</button>
          </div>
        </form>
      </div>

      <!-- Liste des avis -->
      <div v-else class="formavis-avis-list">
        <div v-if="chargement" class="formavis-loader">Chargement des avis...</div>
        <div v-else-if="avisActuels.length === 0" class="formavis-empty">Aucun avis trouvé.</div>
        <ul v-else>
          <li v-for="avis in avisActuels" :key="avis.id" class="formavis-avis-item">
            <div class="avis-header">
              <strong>{{ avis.auteur }}</strong>
              <span class="avis-date">{{ formatDate(avis.date) }}</span>
            </div>
            <div class="avis-note">{{ avis.note }}</div>
            <p class="avis-commentaire">{{ avis.message }}</p>
          </li>
        </ul>
      </div>

    </div>
  `,

  data() {
    return {
      afficherFormulaire: false,
      id: '',
      conducteur_id: '',
      numid: '',
      avis: 'Bien',
      commentaire: '',
      chargement: true,
      avisActuels: []
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

    envoyerAvis() {
      const now = new Date().toISOString();

      const formData = new FormData();
      formData.append('ride_id', this.numid);
      formData.append('evaluator_id', this.id);
      formData.append('evaluated_id', this.conducteur_id);
      formData.append('avis', this.avis);
      formData.append('commentaire', this.commentaire);
      formData.append('date', now);

      fetch('/api/submit_avis.php', {
        method: 'POST',
        body: formData
      })
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            alert(data.message || "Merci pour votre avis !");
            this.avisActuels.unshift({
              id: Date.now(),
              auteur: this.id,
              note: this.avis,
              message: this.commentaire,
              date: now
            });
            this.resetForm();
            this.afficherFormulaire = false;
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
      this.avis = 'Bien';
      this.commentaire = '';
    }
  },

  mounted() {
    fetch('/api/get_avis.php')
      .then(res => res.json())
      .then(data => {
        this.avisActuels = data;
        this.chargement = false;
      })
      .catch(() => {
        console.error("Erreur lors du chargement des avis.");
        this.chargement = false;
      });

    fetch('/api/get_user.php')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          this.id = data.user_id;
        }
      })
      .catch(() => {
        console.warn("Utilisateur non connecté.");
      });
  }
};

export default FormAvis;
