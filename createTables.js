const mysql = require('mysql2');
require('dotenv').config();

// Connexion à la base de données
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  connectTimeout: 30000 // Augmentez le délai d'attente à 10 secondes
});

db.connect((err) => {
  if (err) {
    console.error('Erreur de connexion à la base de données :', err);
    return;
  }
  console.log('Connecté à la base de données MySQL');

  // Création des tables après connexion réussie
  createTables();
});

function createTables() {
  const userTable = `
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      email VARCHAR(100) NOT NULL UNIQUE,
      password VARCHAR(255) NOT NULL,
      role VARCHAR(50) DEFAULT 'user'
    );
  `;

  const productsTable = `
    CREATE TABLE IF NOT EXISTS products (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      description TEXT,
      price DECIMAL(10, 2) NOT NULL,
      category_id INT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;

  const ordersTable = `
    CREATE TABLE IF NOT EXISTS orders (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT,
      total DECIMAL(10, 2),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;

  // Exécution des requêtes
  db.query(userTable, (err) => {
    if (err) {
      console.error('Erreur lors de la création de la table users :', err);
      return;
    }
    console.log('Table users créée avec succès.');
  });

  db.query(productsTable, (err) => {
    if (err) {
      console.error('Erreur lors de la création de la table products :', err);
      return;
    }
    console.log('Table products créée avec succès.');
  });

  db.query(ordersTable, (err) => {
    if (err) {
      console.error('Erreur lors de la création de la table orders :', err);
      return;
    }
    console.log('Table orders créée avec succès.');
  });

  db.end();
}
