import React, { useState, useEffect } from 'react';
import './orderdetails.css';
import { RxCross2 } from "react-icons/rx";

const Orderdetails = ({ onClose, orderId, onStatusUpdate }) => {
  const [orderDetails, setOrderDetails] = useState(null); // State to hold order details
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state
  const [orderStatus, setOrderStatus] = useState(''); // State for order status

  // Function to update order status
  const updateOrderStatus = async () => {
    try {
      const response = await fetch(`http://localhost:5000/updateOrderStatus/${orderId}`, {
        method: 'PUT',
        headers: {
          'auth-token': `${sessionStorage.getItem('auth-token')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: orderStatus }), // Send the updated status
      });

      if (!response.ok) {
        throw new Error('Failed to update order status');
      }

      const updatedData = await response.json();
      if (updatedData.success) {
        onStatusUpdate(); // Trigger the refresh function
        onClose(); // Close the details modal
      }
    } catch (error) {
      setError('Error updating order status: ' + error.message);
    }
  };

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const response = await fetch(`http://localhost:5000/orderdetails/${orderId}`, {
          method: 'GET',
          headers: {
            'auth-token': `${sessionStorage.getItem('auth-token')}`,
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            setOrderDetails(data.order); // Assuming the order is directly returned
            setOrderStatus(data.order.orderStatus); // Set the initial status
          } else {
            setError('Failed to fetch order details');
          }
        } else {
          setError('Failed to fetch order details');
        }
      } catch (error) {
        setError('Error fetching order details: ' + error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [orderId]);

  const handleStatusChange = (event) => {
    setOrderStatus(event.target.value);
  };

  const handleUpdateClick = () => {
    updateOrderStatus(); // Call update function on button click
  };

  if (loading) {
    return <p>Loading order details...</p>; // Loading message
  }

  if (error) {
    return <p className="error-message">{error}</p>; // Error message
  }

  if (!orderDetails) {
    return <p>No order details available.</p>; // Fallback for no order details
  }

  const {
    _id,
    dateOrdered,
    totalPrice,
    orderItems,
    shippingInfo,
    paymentInfo,
  } = orderDetails; // Destructure order details

  return (
    <div className="container">
      <RxCross2 className="close-btn" onClick={onClose} />
      <h2>Order Details</h2>
      <div className="order-info">
        <p><strong>Order ID:</strong> {_id}</p>
        <p><strong>Order Date:</strong> {new Date(dateOrdered).toLocaleString()}</p>
        <p><strong>Order Price:</strong> ${totalPrice.toFixed(2)}</p>
        <p><strong>Payment Method:</strong> {paymentInfo.method}</p>
        <p><strong>Payment Status:</strong> {paymentInfo.status}</p>
        <p><strong>Order Status:</strong> <span className="status">{orderStatus}</span></p>
      </div>

      <div className="order-details">
        <h3>Order Items</h3>
        {orderItems.map((item, index) => (
          <div key={index} className="o-details">
            <p><strong>Title:</strong> {item.name}</p>
            <p><strong>Quantity:</strong> {item.quantity}</p>
            <p><strong>Price:</strong> ${item.price.toFixed(2)}</p>
          </div>
        ))}
      </div>

      <div className="shipping-info">
        <h3>Shipping Info</h3>
        <p><strong>Name:</strong> {orderDetails.user.name}</p>
        <p><strong>Address:</strong> {`${shippingInfo.address}`}</p>
        <p><strong>City,State,Country:</strong> {`${shippingInfo.city} , ${shippingInfo.state} , ${shippingInfo.country}`}</p>
        <p><strong>Postal Code:</strong> {shippingInfo.postcode}</p>
        <p><strong>Phone:</strong> {shippingInfo.phone}</p>
      </div>

      <div className="status-update">
        <h3>Order Status</h3>
        <select value={orderStatus} onChange={handleStatusChange} className="select">
          <option value="Confirmed">Confirmed</option>
          <option value="Processing">Processing</option>
          <option value="Shipped">Shipped</option>
          <option value="Delivered">Delivered</option>
        </select>
        <button className="button" onClick={handleUpdateClick}>Update</button>
      </div>
    </div>
  );
};

export default Orderdetails;
