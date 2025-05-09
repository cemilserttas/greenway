const CookieBanner = {
  name: 'CookieBanner',
  template: `
    <div v-if="!consentGiven" id="cookie-modal">
      <div id="cookie-box">
        <img src="/src/assets/img/GreenWay_icon.svg" alt="Logo GreenWay" />
        <h2>Votre confidentialité est notre priorité</h2>
        <p>
          Nous utilisons des cookies pour améliorer votre expérience, analyser le trafic et proposer du contenu personnalisé.
        </p>
        <p><strong>Nous traitons les données suivantes :</strong></p>
        <ul>
          <li>Cookies de session</li>
          <li>Mesure d’audience</li>
          <li>Contenus personnalisés</li>
        </ul>

        <div class="cookie-actions">
          <button class="info-btn" @click="openInfo">En savoir plus →</button>
          <button class="reject-btn" @click="refuser">Rejeter</button>
          <button class="accept-btn" @click="accepter">Accepter</button>
        </div>
      </div>
    </div>
  `,
  data() {
    return {
      consentGiven: false
    };
  },
  mounted() {
    const consent = localStorage.getItem('cookieConsent');
    this.consentGiven = !!consent;
  },
  methods: {
    accepter() {
      localStorage.setItem('cookieConsent', 'accepted');
      this.consentGiven = true;
    },
    refuser() {
      localStorage.setItem('cookieConsent', 'rejected');
      this.consentGiven = true;
    },
    openInfo() {
      window.open('/pages/politique_confidentialite.html', '_blank');
    }
  }
};

export default CookieBanner;
