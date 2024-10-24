const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const roleMiddleware = require('../middlewares/roleMiddleware');
const authenticateToken = require('../middlewares/authMiddleware');

// Récupérer toutes les catégories (accessible uniquement aux utilisateurs authentifiés)
router.get('/', authenticateToken, categoryController.getAllCategories);

// Ajouter une catégorie (accessible uniquement aux administrateurs)
router.post('/', authenticateToken, roleMiddleware('admin'), categoryController.addCategory);

// Mettre à jour une catégorie (accessible uniquement aux administrateurs)
router.put('/:id', authenticateToken, roleMiddleware('admin'), categoryController.updateCategory);

// Supprimer une catégorie (accessible uniquement aux administrateurs)
router.delete('/:id', authenticateToken, roleMiddleware('admin'), categoryController.deleteCategory);

module.exports = router;
