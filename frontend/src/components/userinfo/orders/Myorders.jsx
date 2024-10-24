import React, { useEffect, useState, useContext } from 'react';
import './orders.css';
import { Context } from '../../../context API/Contextapi';
import Clientorderdetails from '../../clientorderdetails/Clientorderdetails';

const Myorders = () => {
  const { myorders } = useContext(Context);

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await myorders();
        console.log(data);
        if (!Array.isArray(data)) {
          throw new Error('Expected data to be an array');
        }
        setOrders(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [myorders]);

  const handleViewOrder = (orderId) => {
    setSelectedOrderId(orderId);
    setShowDetails(true);
  };

  const handleCloseDetails = () => {
    setShowDetails(false);
    setSelectedOrderId(null);
  };

  if (loading) {
    return <div>Loading orders...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (orders.length === 0) {
    return <div>No orders found.</div>;
  }

  return (
    <div className="orders">
      <div className="o-head">
        <h3>Name</h3>
        <h3>Status</h3>
        <h3>Qty</h3>
        <h3>Price</h3>
        <h3>Action</h3>
      </div>
      <div className="allorders">
        {orders.map((order) =>
          order.orderItems.map((item) => (
            <div key={item._id} className="order">
              <div>{item.name}</div>
              <div>{order.orderStatus}</div>
              <div>{item.quantity}</div>
             <div>${(item.price * item.quantity).toFixed(0)}/{order.paymentInfo?.status}</div>
              <div>
                <button onClick={() => handleViewOrder(order._id)}>View</button>
              </div>
            </div>
          ))
        )}
      </div>

      {showDetails && (
        <div className="order-details-container">
        <Clientorderdetails 
          onClose={handleCloseDetails} 
          orderId={selectedOrderId} 
        />
        </div>
      )}
    </div>
  );
};

export default Myorders;
