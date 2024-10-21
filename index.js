// index.js à la racine de votre backend
const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const db = require('./config/database');
const routes = require('./routes'); // Ce fichier routes est l'index.js du dossier routes

dotenv.config();
const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json()); // Pour parser les requêtes JSON
app.use('/routes', routes); // Enregistre les routes avec le préfixe /api

db.connect((err) => {
  if (err) {
    console.error('Erreur de connexion à la base de données :', err);
    throw err;
  }
  console.log('Connecté à la base de données MySQL');
});

// Démarrage du serveur
app.listen(port, () => {
  console.log(`Serveur backend en écoute sur le port ${port}`);
});
