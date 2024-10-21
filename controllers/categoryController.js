const db = require('../config/database');

// Récupérer toutes les catégories
exports.getAllCategories = (req, res) => {
  const query = 'SELECT * FROM categories';
  db.query(query, (err, results) => {
    if (err) {
      console.error('Erreur lors de la récupération des catégories :', err);
      return res.status(500).send('Erreur interne lors de la récupération des catégories.');
    }
    if (results.length === 0) {
      return res.status(404).send('Aucune catégorie trouvée.');
    }
    res.status(200).json(results);
  });
};

// Ajouter une nouvelle catégorie
exports.addCategory = (req, res) => {
  const { name, description } = req.body;

  const query = 'INSERT INTO categories (name, description) VALUES (?, ?)';
  db.query(query, [name, description], (err, result) => {
    if (err) {
      console.error('Erreur lors de l\'ajout de la catégorie :', err);
      return res.status(500).send('Erreur interne lors de l\'ajout de la catégorie.');
    }
    res.status(201).send('Catégorie ajoutée avec succès. ID de la catégorie : ' + result.insertId);
  });
};

// Mettre à jour une catégorie
exports.updateCategory = (req, res) => {
  const categoryId = req.params.id;
  const { name, description } = req.body;

  const query = 'UPDATE categories SET name = ?, description = ? WHERE id = ?';
  db.query(query, [name, description, categoryId], (err, result) => {
    if (err) {
      console.error('Erreur lors de la mise à jour de la catégorie :', err);
      return res.status(500).send('Erreur interne lors de la mise à jour de la catégorie.');
    }
    if (result.affectedRows === 0) {
      return res.status(404).send('Catégorie non trouvée.');
    }
    res.status(200).send('Catégorie mise à jour avec succès.');
  });
};

// Supprimer une catégorie
exports.deleteCategory = (req, res) => {
  const categoryId = req.params.id;

  const query = 'DELETE FROM categories WHERE id = ?';
  db.query(query, [categoryId], (err, result) => {
    if (err) {
      console.error('Erreur lors de la suppression de la catégorie :', err);
      return res.status(500).send('Erreur interne lors de la suppression de la catégorie.');
    }
    if (result.affectedRows === 0) {
      return res.status(404).send('Catégorie non trouvée.');
    }
    res.status(200).send('Catégorie supprimée avec succès.');
  });
};
