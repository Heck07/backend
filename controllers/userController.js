const db = require('../config/database');

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
