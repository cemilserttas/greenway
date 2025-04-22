const InscriptionComponent = {
    name: "InscriptionComponent",
    template: `
      <div class="form-container">
        <h2>Inscription</h2>
        <form @submit.prevent="submitForm">
          <label>Prénom :</label>
          <input type="text" v-model="prenom" required>
  
          <label>Nom :</label>
          <input type="text" v-model="nom" required>
  
          <label>Email :</label>
          <input type="email" v-model="email" required>
  
          <label>Mot de passe :</label>
          <input type="password" v-model="password" required minlength="6">
  
          <label>Confirmer le mot de passe :</label>
          <input type="password" v-model="confirmPassword" required>
  
          <label>Téléphone :</label>
          <input type="tel" v-model="phone" pattern="[0-9]{10}" required>
  
          <label>Date de naissance :</label>
          <input type="date" v-model="birth_date" required>
  
          <label>Numéro de permis :</label>
          <input type="text" v-model="licence_number" required>
  
          <button type="submit">S'inscrire</button>
        </form>
  
        <p>Déjà inscrit ? <a href="/pages/connexion.html">Se connecter</a></p>
        <p class="error" v-if="error">{{ error }}</p>
        <p class="success" v-if="success">{{ success }}</p>
      </div>
    `,
    data() {
      return {
        prenom: '',
        nom: '',
        email: '',
        password: '',
        confirmPassword: '',
        phone: '',
        birth_date: '',
        licence_number: '',
        error: '',
        success: ''
      };
    },
    methods: {
      async submitForm() {
        if (this.password !== this.confirmPassword) {
          this.error = "Les mots de passe ne correspondent pas.";
          return;
        }
  
        const formData = new FormData();
        formData.append('prenom', this.prenom);
        formData.append('nom', this.nom);
        formData.append('email', this.email);
        formData.append('password', this.password);
        formData.append('phone', this.phone);
        formData.append('birth_date', this.birth_date);
        formData.append('licence_number', this.licence_number);
  
        try {
          const response = await fetch('/api/submit_inscription.php', {
            method: 'POST',
            body: formData
          });
  
          const data = await response.json();
  
          if (data.success) {
            this.success = data.message;
            this.error = '';
            setTimeout(() => {
              window.location.href = "/pages/connexion.html";
            }, 2000);
          } else {
            this.error = data.message;
            this.success = '';
          }
        } catch (err) {
          this.error = "Une erreur est survenue.";
          this.success = '';
        }
      }
    }
  };
  
  export default InscriptionComponent;  