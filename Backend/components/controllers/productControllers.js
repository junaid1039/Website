const Product = require('../models/productmodel');
const fs = require('fs');
const path = require('path');

// Add a new product
const addProduct = async (req, res) => {
    try {
        const products = await Product.find({});
        const id = products.length > 0 ? products[products.length - 1].id + 1 : 1;

        const product = new Product({
            id: id,
            name: req.body.name,
            images: req.body.images,
            category: req.body.category,
            newprice: req.body.newprice,
            oldprice: req.body.oldprice,
            description: req.body.description,  // This should capture the description field
        });
        
        await product.save();
        res.json({ success: true, product });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to save product', error });
    }
};



// Remove product from database
const removeProduct = async (req, res) => {
  try {
    // Find the product by ID
    const product = await Product.findOne({ id: req.body.id });
    
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    // Delete the product from the database
    await Product.findOneAndDelete({ id: req.body.id });
    console.log('Product removed from database');

  } catch (error) {
    console.error('Error removing product and images:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Get all products
const getAllProducts = async (req, res) => {
    try {
        const products = await Product.find({});
        res.json(products);
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to fetch products', error });
    }
};

// Get a single product by ID
const getProductById = async (req, res) => {
    const { id } = req.params; // Get the product ID from the URL

    try {
        const product = await Product.findOne({ id }); // Find the product by ID
        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }
        res.json(product); // Send the product data back as JSON
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to fetch product', error });
    }
};

//edit product 
const editProduct = async (req, res, next) => {
    try {
        const { id } = req.params;

        // Find the product by ID
        let product = await Product.findById(id);
        if (!product) {
            console.log("Product not found.");
            return res.status(404).json({ success: false, message: "Product not found" });
        }

        // Update the product
        product = await Product.findByIdAndUpdate(id, req.body, {
            new: true, // return the updated product
            runValidators: true, // run schema validations
            useFindAndModify: false, // use modern MongoDB function //false
        });

        res.status(200).json({ success: true, message: "Product updated successfully", product });
    } catch (error) {
        console.error("Error updating product:", error);
        res.status(500).json({ success: false, message: "Failed to update product", error });
    }
};




// Fetch perfumes or other categories
const perfumes = async (req, res) => {
    try {
        const perfumeProducts = await Product.find({ category: 'perfume' });
        res.json({ success: true, perfumes: perfumeProducts });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to fetch perfumes', error });
    }
};

module.exports = { addProduct, removeProduct, getAllProducts, editProduct, perfumes, getProductById };
