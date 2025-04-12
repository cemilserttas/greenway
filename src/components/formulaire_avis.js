// src/components/FormAvis.js

export default {
  name: 'FormAvis',
  template: `
    <form @submit.prevent="envoyerAvis">
      <label for="id">Identifiant</label>
      <input type="text" v-model="id" required placeholder="Votre identifiant" />
      <br>

      <label for="conducteur_id">Identifiant conducteur</label>
      <input type="text" v-model="conducteur_id" required placeholder="Identifiant du conducteur" />
      <br>

      <label for="numid">Identifiant course</label>
      <input type="text" v-model="numid" required placeholder="Identifiant de la course" />
      <br>

      <label>Comment s'est déroulé votre dernier trajet ?</label>
      <br>
      <label><input type="radio" v-model="avis" value="Très mauvais" /> Très mauvais</label>
      <label><input type="radio" v-model="avis" value="Mauvais" /> Mauvais</label>
      <label><input type="radio" v-model="avis" value="Moyen" /> Moyen</label>
      <label><input type="radio" v-model="avis" value="Bien" /> Bien</label>
      <label><input type="radio" v-model="avis" value="Très bien" /> Très bien</label>
      <br><br>

      <label for="commentaire">Tu as quelque chose à rajouter ? Ton avis nous intéresse !</label>
      <textarea v-model="commentaire" name="commentaire"></textarea>

      <br>
      <button type="button" @click="retourAccueil">Retour</button>
      <button type="submit">Envoyer</button>
    </form>
  `,
  data() {
    return {
      id: '',
      conducteur_id: '',
      numid: '',
      avis: 'Bien',
      commentaire: ''
    };
  },
  methods: {
    retourAccueil() {
      window.location.href = 'https://greenway.hepl-e-business.be/';
    },
    envoyerAvis() {
      const formData = new FormData();
      formData.append('ride_id', this.numid); // course = ride
      formData.append('evaluator_id', this.id);
      formData.append('evaluated_id', this.conducteur_id);
      formData.append('avis', this.avis);
      formData.append('commentaire', this.commentaire);      

      fetch('/api/submit_avis.php', {
        method: 'POST',
        body: formData
      })
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            alert("Merci pour votre avis !");
          } else {
            alert("Erreur : " + data.message);
          }
        })
        .catch(() => {
          alert("Une erreur est survenue.");
        });
    }
  }
};