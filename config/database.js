const mysql = require('mysql2');

let db;

function connectDatabase() {
  db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
  });

  db.connect((err) => {
    if (err) {
      console.error('Erreur de connexion à la base de données :', err);
      setTimeout(connectDatabase, 2000); // Attendez 2 secondes avant de réessayer
    } else {
      console.log('Connecté à la base de données MySQL');
    }
  });

  db.on('error', (err) => {
    console.error('Erreur avec la connexion à la base de données :', err);
    if (err.code === 'PROTOCOL_CONNECTION_LOST' || err.fatal) {
      connectDatabase(); // Reconnectez automatiquement si la connexion est perdue
    }
  });
}

connectDatabase();

module.exports = db;
