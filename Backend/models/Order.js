const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    customerDetails: {
        name: { type: String, required: true },
        email: { type: String, required: true },
        address: { type: String, required: true },
        city: { type: String, required: true },
        postalCode: { type: String, required: true },
        country: { type: String, required: true },
    },
    orderItems: [
        {
            name: { type: String, required: true },
            quantity: { type: Number, required: true },
            price: { type: Number, required: true },
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product',
                required: true,
            },
        },
    ],
    totalAmount: {
        type: Number,
        required: true,
    },
    publicId: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        required: true,
        enum: ['Pending', 'Preparing', 'Shipped', 'Finished', 'Cancelled'],
        default: 'Pending',
    },
}, {
    timestamps: true,
});

module.exports = mongoose.model('Order', orderSchema);
