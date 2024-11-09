const Product = require('../models/productmodel');
const cloudinary = require('../utils/cloudinary');

// Add a new product
const addProduct = async (req, res) => {
    try {
        // Generate a new ID
        const generateNewId = async () => {
            const lastProduct = await Product.findOne().sort({ id: -1 });
            return lastProduct ? lastProduct.id + 1 : 1;
        };
        const newId = await generateNewId();
        
        // Create a new product with the uploaded data
        const product = new Product({
            id: newId,
            name: req.body.name,
            images: req.body.images,
            category: req.body.category,
            newprice: req.body.newprice,
            oldprice: req.body.oldprice,
            description: req.body.description,
            colors: req.body.colors,
            sizes: req.body.sizes,
            brand: req.body.brand,
            visible: req.body.visible,
        });  

        await product.save();
        res.json({ success: true, product });
    } catch (error) {
        console.error("Error adding product:", error);
        res.status(500).json({ success: false, message: 'Failed to save product', error });
    }
};

// Edit product
const editProduct = async (req, res) => {
    try {
        const { id } = req.params;
        // Find the product by ID
        const product = await Product.findOne({ id });
        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }

        // Prepare the update data
        const updatedData = {
            name: req.body.name,
            images: req.body.images,
            category: req.body.category,
            newprice: req.body.newprice,
            oldprice: req.body.oldprice,
            description: req.body.description,
            colors: req.body.colors,
            sizes: req.body.sizes,
            brand: req.body.brand,
            visible: req.body.visible // Include visibility
        };        

        // Update the product
        const updatedProduct = await Product.findOneAndUpdate(
            { id },
            updatedData,
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
// Get all products for admin
const adminAllProducts = async (req, res) => {
    try {
        // Fetch all products, regardless of visibility
        const products = await Product.find();
        // Map through products to include necessary details
        const productsWithDetails = products.map(product => ({
            id: product.id,
            name: product.name,
            category: product.category,
            newprice: product.newprice,
            oldprice: product.oldprice,
            description: product.description,
            images: product.images ? product.images.map(image => image) : [],
            colors: product.colors || [], // Include colors
            sizes: product.sizes || [], // Include sizes
            brand: product.brand, // Include brand
            visible: product.visible, // Include visibility status
        }));
        res.json({
            success: true,
            products: productsWithDetails
        });
        console.log("Admin product data sent successfully");
    } catch (error) {
        console.error("Error fetching admin products:", error);
        res.status(500).json({ success: false, message: 'Failed to fetch admin products', error });
    }
};


// Get all visible products for users
const userAllProducts = async (req, res) => {
    try {
        // Fetch all visible products
        const products = await Product.find({ visible: true});
        // Map through products to include necessary details
        const productsWithDetails = products.map(product => ({
            id: product.id,
            name: product.name,
            category: product.category,
            newprice: product.newprice,
            oldprice: product.oldprice,
            description: product.description,
            images: product.images ? product.images.map(image => image) : [],
            colors: product.colors || [], // Include colors
            sizes: product.sizes || [], // Include sizes
            brand: product.brand // Include brand
        }));

        res.json({
            success: true,
            products: productsWithDetails
        });
    } catch (error) {
        console.error("Error fetching user products:", error);
        res.status(500).json({ success: false, message: 'Failed to fetch user products', error });
    }
};

// Get a single product by ID
const getProductById = async (req, res) => {
    const { id } = req.params;
    try {
        const product = await Product.findOne({ id });
        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }
        res.json({
            success: true,
            product: {
                id: product.id,
                name: product.name,
                category: product.category,
                newprice: product.newprice,
                oldprice: product.oldprice,
                description: product.description,
                images: product.images,
                colors: product.colors, // Include colors
                sizes: product.sizes, // Include sizes
                brand: product.brand, // Include brand
                visible: product.visible,
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to fetch product', error });
    }
};

// Fetch perfumes or other categories
const subcategorys = async (req, res) => {
    try {
        const { category } = req.query; // Read from query instead of body
        if (!category) {
            return res.status(400).json({ success: false, message: 'Category is required' });
        }
        const products = await Product.find({ category }).limit(4);
        res.json({ success: true, products });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to fetch products', error });
    }
};


module.exports = { addProduct, removeProduct, userAllProducts, adminAllProducts, editProduct, subcategorys, getProductById };
