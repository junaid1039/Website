const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    id: { type: Number, required: true },
    name: { type: String, required: true },
    images: [{ type: String, required: true }],
    category: { type: String, required: true },
    colors: [{ type: String }],
    sizes: [{ type: String }],
    newprice: { type: Number, required: true },
    oldprice: { type: Number, required: true },
    description: { type: String, required: true },
    brand: { type: String }, // Add brand field
    date: { type: Date, default: Date.now },
    available: { type: Boolean, default: true },
    visible: { type: Boolean, required: true },
});

module.exports = mongoose.model('Product', productSchema);
