const db = require('../config/database');
const bcrypt = require('bcryptjs');

// Récupérer tous les utilisateurs
exports.getAllUsers = (req, res) => {
  const query = 'SELECT * FROM users';
  db.query(query, (err, results) => {
    if (err) {
      console.error('Erreur lors de la récupération des utilisateurs :', err);
      return res.status(500).send('Erreur interne lors de la récupération des utilisateurs.');
    }
    if (results.length === 0) {
      return res.status(404).send('Aucun utilisateur trouvé.');
    }
    res.status(200).json(results);
  });
};

// Mettre à jour les informations d'un utilisateur
exports.updateUser = (req, res) => {
  const userId = req.params.id;
  const { username, email, role } = req.body;

  const query = 'UPDATE users SET username = ?, email = ?, role = ? WHERE id = ?';
  db.query(query, [username, email, role, userId], (err, result) => {
    if (err) {
      console.error('Erreur lors de la mise à jour de l\'utilisateur :', err);
      return res.status(500).send('Erreur interne lors de la mise à jour de l\'utilisateur.');
    }
    if (result.affectedRows === 0) {
      return res.status(404).send('Utilisateur non trouvé.');
    }
    res.status(200).send('Utilisateur mis à jour avec succès.');
  });
};

// Supprimer un utilisateur
exports.deleteUser = (req, res) => {
  const userId = req.params.id;

  const query = 'DELETE FROM users WHERE id = ?';
  db.query(query, [userId], (err, result) => {
    if (err) {
      console.error('Erreur lors de la suppression de l\'utilisateur :', err);
      return res.status(500).send('Erreur interne lors de la suppression de l\'utilisateur.');
    }
    if (result.affectedRows === 0) {
      return res.status(404).send('Utilisateur non trouvé.');
    }
    res.status(200).send('Utilisateur supprimé avec succès.');
  });
};

exports.getUserDetails = async (req, res) => {
  try {
    const userId = req.user.id;

    const [results] = await db.promise().query('SELECT * FROM users WHERE id = ?', [userId]);

    if (results.length === 0) {
      return res.status(404).send('Utilisateur non trouvé.');
    }

    const user = results[0];
    delete user.password; // Supprimer le mot de passe avant de renvoyer les données

    res.status(200).json(user);
  } catch (err) {
    console.error('Erreur lors de la récupération des informations utilisateur :', err);
    res.status(500).send('Erreur interne lors de la récupération des informations utilisateur.');
  }
};

// Mise à jour des informations de l'utilisateur
exports.updateUserDetails = async (req, res) => {
  try {
    const userId = req.user.id; // Utilisateur récupéré à partir du token
    const { email, currentPassword, newPassword } = req.body;

    // Vérifier si l'utilisateur existe
    const [userResults] = await db.promise().query('SELECT * FROM users WHERE id = ?', [userId]);
    if (userResults.length === 0) {
      return res.status(404).send('Utilisateur non trouvé.');
    }

    const user = userResults[0];

    // Vérifier le mot de passe actuel
    const passwordIsValid = await bcrypt.compare(currentPassword, user.password);
    if (!passwordIsValid) {
      return res.status(401).send('Mot de passe actuel incorrect.');
    }

    // Mettre à jour l'email et/ou le mot de passe
    let updateQuery = 'UPDATE users SET email = ?';
    let queryParams = [email];

    if (newPassword) {
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      updateQuery += ', password = ?';
      queryParams.push(hashedPassword);
    }

    updateQuery += ' WHERE id = ?';
    queryParams.push(userId);

    await db.promise().query(updateQuery, queryParams);
    res.status(200).send('Informations mises à jour avec succès.');
  } catch (err) {
    console.error('Erreur lors de la mise à jour des informations de l\'utilisateur :', err);
    res.status(500).send('Erreur interne lors de la mise à jour des informations.');
  }
};
