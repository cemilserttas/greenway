const FormAvis = {
  name: 'FormAvis',
  template: `
    <div class="formavis-wrapper">
      <div class="formavis-toggle" v-if="isConnected">
        <button @click="toggleFormulaire" class="formavis-btn-toggle">
          {{ afficherFormulaire ? 'Voir les avis' : 'Donner un avis' }}
        </button>
      </div>

      <!-- 🔐 Non connecté -->
      <div v-else class="formavis-noconnect">
        <p>
          🔒 <a href="/pages/connexion.html">Connectez-vous</a> pour donner votre avis.
        </p>
      </div>

      <!-- ✅ Formulaire si connecté -->
      <div v-if="isConnected && afficherFormulaire" class="formavis-container">
        <form @submit.prevent="envoyerAvis" class="formavis-form">

          <div class="formavis-group">
            <label for="formavis-conducteur">ID du conducteur</label>
            <input id="formavis-conducteur" type="text" v-model="conducteur_id" required />
          </div>

          <div class="formavis-group">
            <label for="formavis-course">ID du trajet</label>
            <input id="formavis-course" type="text" v-model="numid" required />
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
            <button type="submit">Envoyer</button>
          </div>
        </form>
      </div>

      <!-- ✅ Liste des avis (toujours affichée) -->
      <div class="formavis-avis-list" v-if="avisActuels.length">
        <ul>
          <li v-for="avis in avisActuels" :key="avis.id" class="formavis-avis-item">
            <strong>{{ avis.auteur }}</strong>
            <span class="avis-note">– {{ avis.note }}</span>
            <p class="avis-commentaire">{{ avis.message }}</p>
            <span class="avis-date">{{ formatDate(avis.date) }}</span>
          </li>
        </ul>
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
      const formData = new FormData();
      formData.append('ride_id', this.numid);
      formData.append('evaluator_id', this.id);
      formData.append('evaluated_id', this.conducteur_id);
      formData.append('avis', this.avis);
      formData.append('commentaire', this.commentaire);
      formData.append('date', new Date().toISOString());

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
              auteur: this.id,
              note: this.avis,
              message: this.commentaire,
              date: new Date().toISOString()
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
    // 🔎 Récupération des avis depuis le serveur
    fetch('/api/get_avis.php')
      .then(res => res.json())
      .then(data => {
        this.avisActuels = data;
      });

    // 👤 Vérification de la connexion
    fetch('/api/get_user.php')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          this.isConnected = true;
          this.id = data.user_id;
        }
      });
  }
};

export default FormAvis;