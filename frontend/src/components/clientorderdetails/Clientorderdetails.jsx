import React, { useState, useEffect, useContext } from 'react';
import './clientorderdetails.css';
import { RxCross2 } from "react-icons/rx";
import { Context } from '../../context API/Contextapi'

const Clientorderdetails = ({ onClose, orderId }) => {
    const { myorders } = useContext(Context);
    const [orderDetails, setOrderDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Fetch the specific order details by orderId
        const fetchOrderDetails = async () => {
            try {
                const data = await myorders(); // Fetch all orders from context
                const order = data.find((order) => order._id === orderId); // Find the specific order by ID

                if (order) {
                    setOrderDetails(order);
                } else {
                    setError('Order not found');
                }
            } catch (err) {
                setError('Error fetching order details: ' + err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchOrderDetails();
    }, [myorders, orderId]);

    if (loading) {
        return <p>Loading order details...</p>;
    }

    if (error) {
        return <p className="client-error-message">{error}</p>;
    }

    if (!orderDetails) {
        return <p>No order details available.</p>;
    }

    const {
        _id,
        dateOrdered,
        totalPrice,
        orderItems,
        shippingInfo,
        paymentInfo,
    } = orderDetails;

    return (
        <div className="client-container">
            <RxCross2 className="client-close-btn" onClick={onClose} />
            <h2>Order Details</h2>
            <div className="client-order-info">
                <p><strong>Order ID:</strong> {_id}</p>
                <p><strong>Order Date:</strong> {new Date(dateOrdered).toLocaleString()}</p>
                <p><strong>Order Price:</strong> ${totalPrice?.toFixed(2)}</p>
                <p><strong>Payment Method:</strong> {paymentInfo?.method}</p>
                <p><strong>Payment Status:</strong> {paymentInfo?.status}</p>
                <p><strong>Order Status:</strong> <span className="client-status">{orderDetails.orderStatus}</span></p>
            </div>

            <div className="client-order-details">
                <h3>Order Items</h3>
                {orderItems.map((item, index) => (
                    <div key={index} className="client-o-details">
                        <p><strong>Title:</strong> {item.name}</p>
                        <p><strong>Quantity:</strong> {item.quantity}</p>
                        <p><strong>Price:</strong> ${item.price.toFixed(2)}</p>
                    </div>
                ))}
            </div>

            <div className="client-shipping-info">
                <h3>Shipping Info</h3>
                {shippingInfo ? (
                    <>
                        <p><strong>Name:</strong> {orderDetails.user?.name}</p>
                        <p><strong>Address:</strong> {shippingInfo.address}</p>
                        <p><strong>City, State, Country:</strong> {`${shippingInfo.city}, ${shippingInfo.state}, ${shippingInfo.country}`}</p>
                        <p><strong>Postal Code:</strong> {shippingInfo.postcode}</p>
                        <p><strong>Phone:</strong> {shippingInfo.phone}</p>
                    </>
                ) : (
                    <p>No shipping information available.</p>
                )}
            </div>
        </div>
    );
};

export default Clientorderdetails;
