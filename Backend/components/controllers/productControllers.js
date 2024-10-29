const Product = require('../models/productmodel');
const path = require('path');
const cloudinary = require('../utils/cloudinary')



// Add a new product
const addProduct = async (req, res) => {
    try {
        // Create a new product with the uploaded images
        const generateNewId = async () => {
            const lastProduct = await Product.findOne().sort({ id: -1 }); // Find the last product by ID
            return lastProduct ? lastProduct.id + 1 : 1; // Increment or start from 1
        };
        const newId = await generateNewId();
        
        const product = new Product({
            id: newId,
            name: req.body.name,
            images: req.body.images, // Directly use uploaded images data
            category: req.body.category,
            newprice: req.body.newprice,
            oldprice: req.body.oldprice,
            description: req.body.description,
        });

        await product.save();
        res.json({ success: true, product });
    } catch (error) {
        console.error("Error adding product:", error);
        res.status(500).json({ success: false, message: 'Failed to save product', error });
    }
};
//edit product 
const editProduct = async (req, res) => {
    try {
        const { id } = req.params;

        // Find the product by ID
        const product = await Product.findOne({ id });
        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }

        // Prepare the update data
        const updatedData = {  // Renamed from `updatedata` to `updatedData`
            name: req.body.name,
            images: req.body.images, // Directly use uploaded images data
            category: req.body.category,
            newprice: req.body.newprice,
            oldprice: req.body.oldprice,
            description: req.body.description,
        };

        // Update the product
        const updatedProduct = await Product.findOneAndUpdate(
            { id },
            updatedData,  // Using the updated data variable here
            { new: true, runValidators: true }
        );

        res.status(200).json({ success: true, message: 'Product updated successfully', product: updatedProduct });
    } catch (error) {
        console.error("Error updating product:", error);
        res.status(500).json({ success: false, message: 'Failed to update product', error });
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
  
      // Delete images from Cloudinary
      const imageDeletionPromises = product.images.map(image => 
        cloudinary.uploader.destroy(image)
      );
      await Promise.all(imageDeletionPromises);
  
      // Delete the product from the database
      await Product.findOneAndDelete({ id: req.body.id });
  
      res.status(200).json({ success: true, message: 'Product and associated images removed successfully' });
    } catch (error) {
      console.error('Error removing product and images:', error);
      res.status(500).json({ success: false, message: 'Server error' });
    }
  };
  

// Get all products
const getAllProducts = async (req, res) => {
    try {
        const products = await Product.find({});

        // Map through products to include image URLs
        const productsWithImages = products.map(product => ({
            id: product.id,
            name: product.name,
            category: product.category,
            newprice: product.newprice,
            oldprice: product.oldprice,
            description: product.description,
            images: product.images ? product.images.map(image => image) : [] // Handle undefined or empty images
        }));
        
        res.json({
            success: true,
            products: productsWithImages
        });
        console.log("Data Sent successfully");
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
