const FooterComponent = {
  name: 'FooterComponent',
  template: `
    <footer class="footer-greenway">
      <div class="footer-greenway-container">
        <p>&copy; {{ annee }} Mon Site. Tous droits réservés.</p>
      </div>
      <div class="footer-greenway-links">
        <a href="/pages/politique_confidentialite.html">Politique de confidentialité</a>
        <br><a href="/pages/faq.html">FAQ</a>
      </div>
    </footer>
  `,
  data() {
    return {
      annee: new Date().getFullYear()
    };
  }
};

export default FooterComponent;
