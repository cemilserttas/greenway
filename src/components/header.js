const HeaderComponent = {
  name: 'HeaderComponent',
  template: `
    <header class="sticky-header">
      <div class="container">
        <a href="/index.html">
          <img src="/src/assets/img/GreenWay_logo.png" alt="Logo GreenWay" class="logo">
        </a>
        <nav>
          <ul>
            <li v-if="isConnected"><a href="/pages/formulaire_trajet.html">Proposer un trajet</a></li>
            <li><a href="/pages/contact.html">Contact</a></li>
            <li><a href="/pages/a-propos.html">A Propos</a></li>
            <li v-if="!isConnected"><a href="/pages/connexion.html" class="btn-login">Connexion</a></li>
            <li v-if="isConnected"><a href="/pages/logout.php" class="btn-logout">Déconnexion</a></li>
            <li v-if="isConnected"><a href="/pages/parametres_profil.html" class="btn-logout">Profil</a></li>
          </ul>
        </nav>
      </div>
    </header>
  `,
  data() {
    return {
      isConnected: false
    };
  },
  mounted() {
    fetch('/api/get_user.php')
      .then(res => res.json())
      .then(data => {
        this.isConnected = data.success;
      })
      .catch(() => {
        this.isConnected = false;
      });
  }
};

export default HeaderComponent;
