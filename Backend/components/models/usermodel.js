const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { type: String, required: [true, "Please enter you username."] },
    email: { type: String, required: [true, "Please enter you email."] },
    password: { type: String, required: [true, "Please enter your password"], select: false },
    avatar: {
        public_id: {
            type: String
        },
        url: {
            type: String
        }
    },
    role: {
        type: String,
        default: "user",
    },
    cartData: { type: Object },
    date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);
