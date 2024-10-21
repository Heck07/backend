const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const roleMiddleware = require('../middlewares/roleMiddleware');

// Récupérer tous les produits
router.get('/', productController.getAllProducts);

// Ajouter un produit
router.post('/', roleMiddleware('admin'), productController.addProduct);

// Mettre à jour un produit
router.put('/:id', roleMiddleware('admin'), productController.updateProduct);

// Supprimer un produit
router.delete('/:id', roleMiddleware('admin'), productController.deleteProduct);

module.exports = router;
