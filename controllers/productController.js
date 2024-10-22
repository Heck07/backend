const db = require('../config/database');

// Récupérer tous les produits
exports.getAllProducts = (req, res) => {
  const query = 'SELECT * FROM products';
  db.query(query, (err, results) => {
    if (err) {
      console.error('Erreur lors de la récupération des produits :', err);
      return res.status(500).send('Erreur interne lors de la récupération des produits.');
    }
    if (results.length === 0) {
      return res.status(404).send('Aucun produit trouvé.');
    }
    res.status(200).json(results);
  });
};

// Ajouter un nouveau produit
exports.addProduct = (req, res) => {
  const { name, price, description, category_id } = req.body;

  const query = 'INSERT INTO products (name, price, description, category_id) VALUES (?, ?, ?, ?)';
  db.query(query, [name, price, description, category_id], (err, result) => {
    if (err) {
      console.error('Erreur lors de l\'ajout du produit :', err);
      return res.status(500).send('Erreur interne lors de l\'ajout du produit.');
    }
    res.status(201).send('Produit ajouté avec succès. ID du produit : ' + result.insertId);
  });
};

// Mettre à jour un produit
exports.updateProduct = (req, res) => {
  const productId = req.params.id;
  const { name, price, description, category_id } = req.body;

  const query = 'UPDATE products SET name = ?, price = ?, description = ?, category_id = ? WHERE id = ?';
  db.query(query, [name, price, description, category_id, productId], (err, result) => {
    if (err) {
      console.error('Erreur lors de la mise à jour du produit :', err);
      return res.status(500).send('Erreur interne lors de la mise à jour du produit.');
    }
    if (result.affectedRows === 0) {
      return res.status(404).send('Produit non trouvé.');
    }
    res.status(200).send('Produit mis à jour avec succès.');
  });
};

// Supprimer un produit
exports.deleteProduct = (req, res) => {
  const productId = req.params.id;

  const query = 'DELETE FROM products WHERE id = ?';
  db.query(query, [productId], (err, result) => {
    if (err) {
      console.error('Erreur lors de la suppression du produit :', err);
      return res.status(500).send('Erreur interne lors de la suppression du produit.');
    }
    if (result.affectedRows === 0) {
      return res.status(404).send('Produit non trouvé.');
    }
    res.status(200).send('Produit supprimé avec succès.');
  });
};

// Récupérer les produits par ID de catégorie
exports.getProductsByCategory = (req, res) => {
  const categoryId = req.params.categoryId;
  const query = 'SELECT * FROM products WHERE category_id = ?';
  db.query(query, [categoryId], (err, results) => {
    if (err) {
      console.error('Erreur lors de la récupération des produits par catégorie :', err);
      return res.status(500).send('Erreur interne lors de la récupération des produits par catégorie.');
    }
    res.status(200).json(results);
  });
};