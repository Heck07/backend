const mysql = require('mysql2');
require('dotenv').config();

// Connexion à la base de données
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
});

db.connect((err) => {
  if (err) {
    console.error('Erreur de connexion à la base de données :', err);
    return;
  }
  console.log('Connecté à la base de données MySQL');

  // Récupérer toutes les tables de la base de données
  db.query('SHOW TABLES', (err, results) => {
    if (err) {
      console.error('Erreur lors de la récupération des tables :', err);
      db.end();
      return;
    }

    const tables = results.map((row) => Object.values(row)[0]);

    if (tables.length === 0) {
      console.log('Aucune table trouvée. Création des tables...');
      createTables();
    } else {
      // Supprimer chaque table
      tables.forEach((table, index) => {
        db.query(`DROP TABLE ${table}`, (err) => {
          if (err) {
            console.error(`Erreur lors de la suppression de la table ${table} :`, err);
          } else {
            console.log(`Table ${table} supprimée avec succès.`);
          }

          // Vérifier si c'est la dernière table pour créer les nouvelles
          if (index === tables.length - 1) {
            console.log('Toutes les tables ont été supprimées. Création des nouvelles tables...');
            createTables();
          }
        });
      });
    }
  });
});

// Fonction pour créer toutes les tables nécessaires
const createTables = () => {
  const usersTable = `
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      username VARCHAR(255) NOT NULL,
      email VARCHAR(255) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      role VARCHAR(50) DEFAULT 'user',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;

  const productsTable = `
    CREATE TABLE IF NOT EXISTS products (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      price DECIMAL(10, 2) NOT NULL,
      description TEXT,
      category TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
    )
  `;

  const ordersTable = `
    CREATE TABLE IF NOT EXISTS orders (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT,
      total DECIMAL(10, 2) NOT NULL,
      status VARCHAR(50) DEFAULT 'pending',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `;

  const purchasesTable = `
    CREATE TABLE IF NOT EXISTS purchases (
      id INT AUTO_INCREMENT PRIMARY KEY,
      order_id INT,
      product_id INT,
      quantity INT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
      FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
    )
  `;

  const rolesTable = `
    CREATE TABLE IF NOT EXISTS roles (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(50) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;

  const permissionsTable = `
    CREATE TABLE IF NOT EXISTS permissions (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(50) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;

  // Exécuter les requêtes de création de tables
  const tables = [
    usersTable,
    productsTable,
    ordersTable,
    purchasesTable,
    rolesTable,
    permissionsTable,
  ];

  tables.forEach((query, index) => {
    db.query(query, (err, result) => {
      if (err) {
        console.error('Erreur lors de la création de la table :', err);
      } else {
        console.log('Table créée avec succès ou déjà existante.');
      }

      // Vérifier si c'est la dernière table pour fermer la connexion
      if (index === tables.length - 1) {
        db.end(() => {
          console.log('Connexion à la base de données fermée après création des tables.');
        });
      }
    });
  });
};
