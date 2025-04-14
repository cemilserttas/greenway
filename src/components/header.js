const HeaderComponent = {
    name: 'HeaderComponent',
    template: `
      <header class="sticky-header">
        <div class="container">
          <a href="/index.html"><img src="src/assets/img/GreenWay_logo.png" alt="Logo GreenWay" class="logo"></a>
          <nav>
            <ul>
              <li><a href="/index.html">Accueil</a></li>
              <li v-if="isConnected"><a href="../../pages/a-propos.html">Á propos</a></li>
              <li v-if="isConnected"><a href="../../pages/faq.html">FAQ</a></li>
              <li v-else><a href="../../pages/connexion.html" class="btn-login">Connexion</a></li>
              <li><a href="#">Contact</a></li>
              <li v-if="isConnected"><a href="../../pages/logout.php" class="btn-logout">Déconnexion</a></li>
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
          if (data.success) {
            this.isConnected = true;
          }
        })
        .catch(() => {
          this.isConnected = false;
        });
    }
  };
  
  export default HeaderComponent;
  