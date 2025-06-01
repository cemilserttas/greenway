
# 📘 Documentation pour les composants Vue.js

## 🧩 Qu’est-ce qu’un composant ?

Un **composant** est une partie autonome d’une application web. C’est comme une brique de LEGO que l’on peut réutiliser. Par exemple, un formulaire pour ajouter un véhicule est un composant.

---

## 🏗️ Structure d’un composant

Voici un exemple simplifié de composant :

```js
const MonComposant = {
  name: 'MonComposant',
  template: `<div>Hello</div>`,
  data() {
    return {
      message: ''
    };
  },
  methods: {
    direBonjour() {
      alert("Bonjour !");
    }
  }
};
```

### ✳️ `name`
- Donne un **nom** au composant.
- Sert à l’identifier lors de son utilisation.

### 🧾 `template`
- Contient le **code HTML** qui sera affiché à l’écran.
- C’est l’interface utilisateur (le formulaire, les boutons, les champs...).

### 🧠 `data()`
- C’est une **fonction qui retourne un objet**.
- Cet objet contient des **valeurs dynamiques** utilisées dans le template.
- Par exemple : `brand`, `model`, `year`, etc.

```js
data() {
  return {
    brand: '',
    model: ''
  };
}
```

### 🛠️ `methods`
- Ce sont les **fonctions** qui exécutent des actions.
- Par exemple : envoyer un formulaire, afficher un message...

---

## 🎯 Comprendre les éléments courants

### ✅ `v-model`
- Fait le **lien entre un champ de formulaire et une donnée** du composant.
- Exemple : `v-model="brand"` relie la saisie de l’utilisateur à `brand`.

### ✅ `v-if`
- Permet **d’afficher ou non un élément**.
- Exemple :
  ```html
  <p v-if="successMessage">{{ successMessage }}</p>
  ```
  Le message s’affiche **seulement** si `successMessage` contient quelque chose.

### ✅ `@submit.prevent="..."`, `@click="..."`, etc.
- `@` est un raccourci pour **écouter un événement** comme un clic ou un envoi de formulaire.
- `.prevent` empêche l’action par défaut (comme recharger la page).
- Exemple : `@click="supprimerCompte"` appelle la méthode `supprimerCompte` quand on clique.

---

## 🔄 Exemple : Ajouter un véhicule (`AddVehicule`)

### Objectif :
Permettre à un utilisateur d’enregistrer un véhicule dans le système.

### Fonctionnement :
1. L’utilisateur remplit un formulaire (marque, modèle...).
2. Lorsqu’il clique sur "Ajouter", la méthode `ajouterVehicule` est appelée.
3. La méthode vérifie si l’utilisateur est connecté.
4. Elle envoie les données à un fichier PHP (`ajouter_vehicule.php`).
5. Elle affiche un message de succès ou d’erreur.

---

## 👤 Exemple : Paramètres du profil (`ParametreProfil`)

### Objectif :
Permettre à l’utilisateur de modifier ses informations personnelles.

### Fonctionnement :
- Les données sont **chargées automatiquement** à l’ouverture du composant (dans `mounted()`).
- L’utilisateur peut :
  - Modifier son nom, email, etc.
  - Changer son mot de passe.
  - Supprimer son compte (avec confirmation).
- Les modifications sont envoyées à `update_user.php`.

---

## 🔁 Cycle de vie : `mounted()`

- Cette fonction est **exécutée automatiquement** dès que le composant est affiché.
- On l’utilise souvent pour **récupérer des données** depuis un serveur.
- Exemple : récupérer les informations de l’utilisateur à l’ouverture du profil.

---

## 🌐 main.js : Point d’entrée de l’application

```js
import { createApp, ref } from 'vue';
```
- `createApp()` lance l’application.
- `ref()` crée des **valeurs réactives** (qui changent dynamiquement).

### ⚙️ Exemple de fonctions :

```js
function connexion() {
  // Connecte un utilisateur
}

function resetFiltres() {
  // Vide les champs de recherche
}
```

---

## 🧩 Enregistrement des composants

```js
app.component('ajout-vehicule', AddVehicule);
```

- Cette ligne dit : **"J’utilise ce composant dans l’application"**.
- On peut alors l’appeler dans le HTML avec :
```html
<ajout-vehicule></ajout-vehicule>
```

---

## 🛑 Erreurs fréquentes

- **Oublier `.prevent`** : le formulaire recharge la page au lieu d’exécuter le code.
- **Ne pas remplir les champs** : l’utilisateur voit une erreur.
- **Problème de connexion réseau** : une erreur s’affiche si l’appel à l’API échoue.

---

## 📦 Conclusion

Un composant Vue.js :
- a un **nom**,
- affiche une interface HTML (**template**),
- contient des **données dynamiques** (**data()**),
- exécute des **actions** (**methods**),
- et peut écouter des **événements** (comme des clics ou soumissions).

Même sans être développeur, comprendre ces principes permet de **modifier ou créer des pages dynamiques** facilement !