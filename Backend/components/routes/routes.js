const express = require('express');
const multer = require('multer'); 
const router = express.Router();
const productController = require('../controllers/productControllers');
const userController = require('../controllers/userControllers');
const cartController = require('../controllers/cartControllers');
const orderController = require('../controllers/orderControllers');
const uploadImages = require('../controllers/imageControllers') // Image controller for upload
const { auth, userauth } = require('../middleware/auth'); // Middleware for authenticating users
const upload = require('../middleware/multer')


router.post('/uploadimage', upload.array('images', 5), uploadImages); // Handles multiple images
 // Handles multiple images

// Get single product
router.get('/productdata/:id', productController.getProductById);

// Product routes
router.put('/product/:id', auth,  productController.editProduct); 
router.post('/addproduct',auth, productController.addProduct); // Adds a new product
router.post('/removeproduct', auth, productController.removeProduct); // Removes a product
router.get('/allproducts', productController.getAllProducts); // Fetches all products

//verify Token
router.get('/verification', auth);

// User routes (Signup and Login)
router.post('/signup', userController.signup); // User registration
router.post('/login', userController.login); // User login

// Cart routes
router.post('/addtocart', cartController.addToCart); // Adds an item to the user's cart
router.post('/removefromcart', cartController.removeFromCart); // Removes an item from the user's cart
router.post('/getcart', userauth, cartController.getCart); // Retrieves the current user's cart items

// Users route
router.get('/users', auth, userController.getAllUsers); // Retrieves all users (admin only)
// Single user details
router.get('/userdetails/:id', userauth , userController.getSingleUser); // Retrieves a user's
// Update user details
router.put('/updateuserdetails/:id', auth, userController.updateUserDetails); // Updates a user's
// Delete user
router.delete('/deleteuser/:id', auth, userController.deleteUser); // Deletes a user 


// Order Routes
router.post('/confirmorder', userauth, orderController.newOrder); // Places an order
//get all orders
router.get('/allorders', auth, orderController.getAllOrders); // Retrieves all orders for a user
//order details
router.get('/orderdetails/:id', auth, orderController.getOrderDetails); // Retrieves order details
//loged in user order details
router.get('/myorders/:id', userauth, orderController.getMyOrders); // Retrieves order details for the user

router.put('/updateOrderStatus/:id', auth, orderController.updateOrderStatus);  // Updates the status of an order

router.delete('/delorder/:id', auth, orderController.deleteOrder); //delete orders

// Error handling middleware (for handling multer or any unknown errors)
router.use((err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        // Multer error
        return res.status(500).json({ success: false, message: err.message });
    } else if (err) {
        // General error
        return res.status(500).json({ success: false, message: 'An unknown error occurred.', error: err.message });
    }
    next(); // Move to the next middleware if no error
});

module.exports = router;
