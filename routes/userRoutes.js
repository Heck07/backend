const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const roleMiddleware = require('../middlewares/roleMiddleware');
const authenticateToken = require('../middlewares/authMiddleware');


// Récupérer tous les utilisateurs
router.get('/', roleMiddleware('admin'), userController.getAllUsers);

// Mettre à jour un utilisateur
router.put('/:id', roleMiddleware('admin'), userController.updateUser);

router.get('/', authenticateToken, userController.getUserDetails);

router.put('/', authenticateToken, userController.updateUserDetails);


module.exports = router;
