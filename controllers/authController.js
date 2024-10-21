// authController.js
const db = require('../config/database'); // Importer la connexion à la base de données
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Inscription d'un utilisateur
exports.register = (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).send('Tous les champs sont requis.');
  }

  const hashedPassword = bcrypt.hashSync(password, 8);

  const checkEmailQuery = 'SELECT * FROM users WHERE email = ?';
  db.query(checkEmailQuery, [email], (err, results) => {
    if (err) {
      console.error('Erreur lors de la vérification de l\'utilisateur :', err);
      return res.status(500).send('Erreur interne lors de la vérification de l\'utilisateur.');
    }

    if (results.length > 0) {
      return res.status(400).send('Cet email est déjà utilisé.');
    }

    const insertQuery = 'INSERT INTO users (username, email, password) VALUES (?, ?, ?)';
    db.query(insertQuery, [username, email, hashedPassword], (err) => {
      if (err) {
        console.error('Erreur lors de la création de l\'utilisateur :', err);
        return res.status(500).send('Erreur lors de la création de l\'utilisateur.');
      }
      res.status(201).send('Utilisateur créé avec succès.');
    });
  });
};

// Connexion d'un utilisateur
exports.login = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).send('Email et mot de passe sont requis.');
  }

  const query = 'SELECT * FROM users WHERE email = ?';
  db.query(query, [email], (err, results) => {
    if (err) {
      console.error('Erreur lors de la vérification de l\'utilisateur :', err);
      return res.status(500).send('Erreur interne lors de la vérification de l\'utilisateur.');
    }

    if (results.length === 0) {
      return res.status(404).send('Utilisateur non trouvé.');
    }

    const user = results[0];
    const passwordIsValid = bcrypt.compareSync(password, user.password);

    if (!passwordIsValid) {
      return res.status(401).send('Mot de passe incorrect.');
    }

    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: 86400
    });

    res.status(200).send({ auth: true, token });
  });
};
