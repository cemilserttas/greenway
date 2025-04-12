export default {
  name: 'FormContact',
  template: `
    <div class="contact-form">
      <h2>Contactez-nous</h2>
      <form @submit.prevent="envoyerMessage">
        <label for="name">Nom :</label>
        <input type="text" id="name" v-model="name" required />

        <label for="email">Email :</label>
        <input type="email" id="email" v-model="email" required />

        <label for="message">Message :</label>
        <textarea id="message" v-model="message" required></textarea>

        <button type="submit">Envoyer</button>
      </form>
      <p>{{ responseMessage }}</p>
    </div>
  `,
  data() {
    return {
      name: '',
      email: '',
      message: '',
      responseMessage: ''
    };
  },
  methods: {
    async envoyerMessage() {
      const formData = new FormData();
      formData.append('name', this.name);
      formData.append('email', this.email);
      formData.append('message', this.message);

      try {
        const res = await fetch('/api/contact.php', {
          method: 'POST',
          body: formData
        });

        const data = await res.json();
        if (data.success) {
          this.responseMessage = 'Merci pour votre message !';
          this.name = '';
          this.email = '';
          this.message = '';
        } else {
          this.responseMessage = 'Erreur : ' + data.message;
        }
      } catch {
        this.responseMessage = "Une erreur est survenue, veuillez réessayer.";
      }
    }
  }
};