const express = require('express');
const router = express.Router();
const { createOrder, getOrders, getUserOrders, updateOrderStatus } = require('../controllers/orderController');

router.route('/').post(createOrder).get(getOrders);
router.route('/:id').put(updateOrderStatus);
router.route('/user/:email').get(getUserOrders);

module.exports = router;
