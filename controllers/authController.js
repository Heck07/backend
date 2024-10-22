// authController.js
const db = require('../config/database'); // Importer la connexion à la base de données
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Inscription d'un utilisateur
exports.register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).send('Tous les champs sont requis.');
    }

    // Vérifier si l'email existe déjà
    const [checkUser] = await db.promise().query('SELECT * FROM users WHERE email = ?', [email]);
    if (checkUser.length > 0) {
      return res.status(400).send('Cet email est déjà utilisé.');
    }

    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insérer l'utilisateur dans la base de données
    const insertQuery = 'INSERT INTO users (username, email, password) VALUES (?, ?, ?)';
    await db.promise().query(insertQuery, [username, email, hashedPassword]);

    res.status(201).send('Utilisateur créé avec succès.');
  } catch (err) {
    console.error('Erreur lors de la création de l\'utilisateur :', err);
    res.status(500).send('Erreur interne lors de la création de l\'utilisateur.');
  }
};

// Connexion d'un utilisateur
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).send('Email et mot de passe sont requis.');
    }

    // Vérifier si l'utilisateur existe
    const [results] = await db.promise().query('SELECT * FROM users WHERE email = ?', [email]);
    if (results.length === 0) {
      return res.status(404).send('Utilisateur non trouvé.');
    }

    const user = results[0];
    const passwordIsValid = await bcrypt.compare(password, user.password);

    if (!passwordIsValid) {
      return res.status(401).send('Mot de passe incorrect.');
    }

    // Générer un token
    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: '24h', // Token expirera après 24 heures
    });

    res.status(200).send({ auth: true, token });
  } catch (err) {
    console.error('Erreur lors de la connexion de l\'utilisateur :', err);
    res.status(500).send('Erreur interne lors de la connexion.');
  }
};
