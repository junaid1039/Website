const mongoose = require('mongoose');


const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId, // Reference to User
        ref: 'User',
        required: true
    },

    orderItems: [{
        product: {
            type: mongoose.Schema.Types.ObjectId, // Reference to Product
            ref: 'Products', // Assuming you have a Products model
            required: false
        },

        name: { type: String, required: true },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true },
        image: { type: String, required: true }
    }],
    shippingInfo: {
        address: { type: String, required: true },
        city: { type: String, required: true },
        state: { type: String, required: true },
        country: { type: String, required: true },
        postcode: { type: Number, required: true },
        phone: { type: Number, required: true }
    },
    paymentInfo: {
        id: { type: String, required: true }, // Payment ID from the payment gateway
        status: { type: String, required: true },
        method: {type: String, required: true}, // Payment status (e.g., "completed", "pending")
        paidAt: { type: Date, required: true,}

    },
    orderStatus: {
        type: String,
        default: 'Processing', // Default status of the order
        required: true
    },
    totalPrice: {
        type: Number,
        required: true
    },
    shippingPrice: { type: Number, required: true },

    dateOrdered: {
        type: Date,
        default: Date.now // Automatically set the order creation date
    }
});

module.exports = mongoose.model('Order', orderSchema);