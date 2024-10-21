const mysql = require('mysql2');
require('dotenv').config();

// Connexion à la base de données
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT
});

db.connect((err) => {
  if (err) {
    console.error('Erreur de connexion à la base de données :', err);
    return;
  }
  console.log('Connecté à la base de données MySQL');

  // Récupérer toutes les tables de la base de données
  db.query("SHOW TABLES", (err, results) => {
    if (err) {
      console.error("Erreur lors de la récupération des tables :", err);
      db.end();
      return;
    }

    const tables = results.map(row => Object.values(row)[0]);

    if (tables.length === 0) {
      console.log("Aucune table trouvée.");
      db.end();
      return;
    }

    // Supprimer chaque table
    tables.forEach((table, index) => {
      db.query(`DROP TABLE ${table}`, (err) => {
        if (err) {
          console.error(`Erreur lors de la suppression de la table ${table} :`, err);
        } else {
          console.log(`Table ${table} supprimée avec succès.`);
        }

        // Vérifier si c'est la dernière table pour fermer la connexion
        if (index === tables.length - 1) {
          db.end(() => {
            console.log("Connexion à la base de données fermée après suppression des tables.");
          });
        }
      });
    });
  });
});
