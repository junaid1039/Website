const Users = require('../models/usermodel');
//const jwt = require('jsonwebtoken');

// Add item to cart
const addToCart = async (req, res) => {
    try {
        const userdata = await Users.findOne({ _id: req.user.id });
        userdata.cartData[req.body.itemId] += 1;
        await Users.findOneAndUpdate({ _id: req.user.id }, { cartData: userdata.cartData });
        res.send("Added to cart");
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to add to cart', error });
    }
};

// Remove item from cart
const removeFromCart = async (req, res) => {
    try {
        const userdata = await Users.findOne({ _id: req.user.id });
        if (userdata.cartData[req.body.itemId] > 0) {
            userdata.cartData[req.body.itemId] -= 1;
            await Users.findOneAndUpdate({ _id: req.user.id }, { cartData: userdata.cartData });
            res.send("Removed from cart");
        } else {
            res.status(400).json({ success: false, message: 'Item not in cart' });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to remove from cart', error });
    }
};

// Get cart items
const getCart = async (req, res) => {
    try {
        const userdata = await Users.findOne({ _id: req.user.id });
        if (!userdata) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        res.json(userdata.cartData);
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to fetch cart', error });
    }
};


module.exports = { addToCart, removeFromCart, getCart };
