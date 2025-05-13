const HeaderComponent = {
  name: "HeaderComponent",
  template: `
    <header class="header-greenway">
      <div class="header-greenway-container">
        <div class="header-greenway-logo">
          <a href="/"><img src="/src/assets/img/GreenWay_icon.svg" alt="GreenWay"></a>
        </div>

        <div class="hamburger" @click="toggleMenu">
          <span :class="{ 'rotate-top': menuOpen }"></span>
          <span :class="{ 'fade-out': menuOpen }"></span>
          <span :class="{ 'rotate-bottom': menuOpen }"></span>
        </div>

        <ul :class="['header-greenway-menu', { active: menuOpen }]">
          <li><a href="/">Accueil</a></li>
          <li><a href="/pages/a-propos.html">À propos</a></li>
          <li><a href="/pages/contact.html">Contact</a></li>
          <li><a href="/pages/meetzone.html">Points de RDV</a></li>

          <template v-if="isConnected">
            <li><a href="/pages/formulaire_trajet.html">Proposer un trajet</a></li>
            <li><a href="/pages/parametres_profil.html">Mon profil</a></li>
            <li><a href="/pages/logout.php">Déconnexion</a></li>
          </template>

          <li v-else><a href="/pages/connexion.html">Connexion</a></li>
        </ul>

      </div>
    </header>
  `,
  data() {
    return {
      isConnected: false,
      menuOpen: false
    };
  },
  methods: {
    toggleMenu() {
      this.menuOpen = !this.menuOpen;
    }
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
  }
};

export default HeaderComponent;
