const HeaderComponent = {
  name: "HeaderComponent",
  template: `
    <header class="header-greenway">
      <div class="header-greenway-container">
        <a href="/index.html" class="header-greenway-logo">
          <img src="/src/assets/img/GreenWay_logo.png" alt="Logo GreenWay" />
        </a>
        <nav class="header-greenway-nav" aria-label="Navigation principale">
          <ul class="header-greenway-menu">
            <li><a href="/pages/a-propos.html">À propos</a></li>
            <li v-if="isConnected"><a href="/pages/formulaire_trajet.html">Proposer un trajet</a></li>
            <li><a href="/pages/contact.html">Contact</a></li>
            <li v-if="!isConnected"><a href="/pages/connexion.html" class="btn-login">Connexion</a></li>
            <li v-if="isConnected"><a href="/pages/parametres_profil.html">Profil</a></li>
            <li v-if="isConnected"><a href="/pages/logout.php" class="btn-logout">Déconnexion</a></li>
            
          </ul>
        </nav>
      </div>
    </header>
  `,
  data() {
    return {
      isConnected: false,
    };
  },
  mounted() {
    fetch("/api/get_user.php")
      .then((res) => res.json())
      .then((data) => {
        this.isConnected = data.success;
      })
      .catch(() => {
        this.isConnected = false;
      });
  },
};

export default HeaderComponent;
