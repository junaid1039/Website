const Order = require('../models/ordermodel');

// Create new order
const newOrder = async (req, res) => {
    const {
        shippingInfo,
        orderItems,
        paymentInfo,
        totalPrice,
        shippingPrice
    } = req.body;


    try {
        const order = await Order.create({
            shippingInfo,
            orderItems,
            paymentInfo,
            orderStatus: "Processing",
            totalPrice,
            shippingPrice,
            //paidAt: paymentInfo.method === 'COD' ? Date.now() : Date.now(),  // Mark COD as unpaid
            isPaid: paymentInfo.method === 'COD' ? false : true,       // Indicate payment status
            user: req.user.id,
        });
        res.status(201).json({success: true,order,});
    } catch (error) {
        res.status(500).json({success: false, message: 'Failed to create order',error: error.message,});
        console.log(error);
    }
};


// Get all orders -- Admin
const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find().populate('user', 'name email');
        let totalamount = 0;
        orders.forEach((order) => {
            totalamount += order.totalPrice;
        });
        res.status(200).json({ success: true, orders });
    } catch {
        res.status(500).json({ success: false, message: 'No order found' });
    }
};

// Order details -- Admin
const getOrderDetails = async (req, res) => {
    try {
        // Retrieve the order by ID and populate user details
        const order = await Order.findById(req.params.id).populate('user', 'name email');
        
        // Check if the order was found
        if (!order) {
            return res.status(404).json({ success: false, message: "Order not found." });
        }
        
        // Respond with the order details
        res.status(200).json({ success: true, order });
    } catch (error) {
        // Handle any errors that occur during the database operation
        res.status(500).json({ success: false, message: "Failed to get order details", error: error.message });
    }
};

// User order details show to -- User
const getMyOrders = async (req, res) => {
    try {
        // Retrieve orders for the logged-in user and populate user details
        const orders = await Order.find({ user: req.user.id }).populate('user', 'name email');
        
        // Check if any orders were found
        if (orders.length === 0) {
            return res.status(404).json({ success: false, message: "No orders found." });   
        }
        
        // Create a filtered array with only the required fields: product name, price, quantity, status
        const filteredOrders = orders.map(order => ({
            orderId: order._id, // Include Order ID
            orderStatus: order.orderStatus,
            paymentStatus: order.paymentInfo.status, // Include payment status
            orderItems: order.orderItems.map(item => ({
                name: item.name,
                price: item.price,
                quantity: item.quantity
            }))
        }));        
        
        // Respond with the filtered order details
        res.status(200).json({ success: true, orders: filteredOrders });
    } catch (error) {
        // Handle any errors that occur during the database operation
        res.status(500).json({ success: false, message: "Failed to get order details", error: error.message });
    }
};

// Update order status -- Admin
const updateOrderStatus = async (req, res) => {
    try {
        // Find the order by ID
        const order = await Order.findById(req.params.id); 
        
        // Check if the order was found
        if (!order) {
            return res.status(404).json({ success: false, message: 'Order not found.' });
        }
        
        order.orderStatus = req.body.status;

        if (order.orderStatus === "Delivered") {
            order.deliveredAt = Date.now();
        }

        await order.save(); // Save the updated order
        
        // Respond with success
        res.status(200).json({ success: true, message: 'Order status updated successfully', order });
    } catch (error) {
        // Handle any errors that occur during the update
        res.status(500).json({ success: false, message: 'Failed to update order status', error: error.message });
    }
};

// Delete order
const deleteOrder = async (req, res) => {
    try { 
        const order = await Order.findByIdAndDelete(req.params.id);
        
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }
        
        res.status(200).json({ message: 'Order deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = { newOrder, getOrderDetails, getAllOrders, getMyOrders, updateOrderStatus, deleteOrder };
