const express = require('express');
const router = express.Router();

const userRoutes = require('./userRoutes');
const productRoutes = require('./productRoutes');
const orderRoutes = require('./orderRoutes');
const purchasedRoutes = require('./purchasedRoutes');
const categoryRoutes = require('./categoryRoutes');
const statsRoutes = require('./statsRoutes');
const roleRoutes = require('./roleRoutes');
const permissionsRoutes = require('./permissionsRoutes');

router.use('/users', userRoutes);
router.use('/products', productRoutes);
router.use('/orders', orderRoutes);
router.use('/purchases', purchasedRoutes);
router.use('/categories', categoryRoutes);
router.use('/stats', statsRoutes);
router.use('/roles', roleRoutes);
router.use('/permissions', permissionsRoutes);

module.exports = router;
