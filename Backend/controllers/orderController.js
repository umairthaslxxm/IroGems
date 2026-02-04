const Order = require('../models/Order');

// @desc    Create new order
// @route   POST /api/orders
// @access  Public
const createOrder = async (req, res) => {
    try {
        const {
            customerDetails,
            orderItems,
            totalAmount,
            publicId
        } = req.body;

        if (orderItems && orderItems.length === 0) {
            res.status(400);
            throw new Error('No order items');
        }

        const order = new Order({
            customerDetails,
            orderItems,
            totalAmount,
            publicId
        });

        const createdOrder = await order.save();
        res.status(201).json(createdOrder);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Get all orders
// @route   GET /api/orders
// @access  Public (Admin)
const getOrders = async (req, res) => {
    try {
        const orders = await Order.find({});
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get user orders
// @route   GET /api/orders/user/:email
// @access  Public
const getUserOrders = async (req, res) => {
    try {
        const orders = await Order.find({ 'customerDetails.email': req.params.email });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// @desc    Update order status
// @route   PUT /api/orders/:id
// @access  Public (Admin)
const updateOrderStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const order = await Order.findById(req.params.id);

        if (order) {
            order.status = status;
            const updatedOrder = await order.save();
            res.json(updatedOrder);
        } else {
            res.status(404).json({ message: 'Order not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createOrder,
    getOrders,
    getUserOrders,
    updateOrderStatus
};
