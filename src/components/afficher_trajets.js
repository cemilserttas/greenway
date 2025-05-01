const ListeTrajets = {
    name: 'ListeTrajets',
    template: `
      <div class="trajets-container">
        <div v-for="trajet in trajets" :key="trajet.id" class="trajet">
          <div class="trajet-info">
            <p><span class="label">Nom d'utilisateur :</span> <span class="value">{{ trajet.utilisateur }}</span></p>
            <p><span class="label">Places disponibles :</span> <span class="value">{{ trajet.places }}</span></p>
            <p><span class="label">Heure :</span> <span class="value">{{ trajet.heure }}</span></p>
            <p><span class="label">Départ :</span> <span class="value">{{ trajet.depart }}</span></p>
            <p><span class="label">Destination :</span> <span class="value">{{ trajet.destination }}</span></p>
            <p><span class="label">Date :</span> <span class="value">{{ trajet.date }}</span></p>
          </div>
          <button class="reserve-btn" @click="reserverTrajet(trajet)">Réserver</button>
        </div>
      </div>
    `,
    data() {
      return {
        trajets: [
          {
            id: 1,
            utilisateur: 'Lucie',
            places: 1,
            heure: '7h45',
            depart: 'Liège-Guillemins',
            destination: 'Campus 2000 Jemeppe',
            date: '19/05/2025'
          },
          {
            id: 2,
            utilisateur: 'Thomas',
            places: 2,
            heure: '12h30',
            depart: 'Liège-Guillemins',
            destination: 'Campus Barbou',
            date: '19/05/2025'
          },
          {
            id: 3,
            utilisateur: 'Lucas',
            places: 3,
            heure: '9h30',
            depart: 'Campus Gloesener',
            destination: 'Liège-Saint Lambert',
            date: '20/05/2025'
          },
          {
            id: 4,
            utilisateur: 'Valentine',
            places: 4,
            heure: '17h30',
            depart: 'Campus 2000 - Jemeppe',
            destination: 'Liège-Guillemins',
            date: '20/05/2025'
          }
        ]
      };
    },
    methods: {
      reserverTrajet(trajet) {
        alert(`Réservation du trajet avec ${trajet.utilisateur}`);
        // Ici, tu pourrais déclencher une requête vers l'API de réservation
      }
    }
  };
  
  export default ListeTrajets;  