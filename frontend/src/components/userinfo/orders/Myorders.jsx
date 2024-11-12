import React, { useEffect, useState, useContext, memo } from 'react';
import './orders.css';
import { Context } from '../../../context API/Contextapi';
import Clientorderdetails from '../../clientorderdetails/Clientorderdetails';

const MyOrders = () => {
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
        if (!Array.isArray(data)) throw new Error('Expected data to be an array');
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

  if (loading) return <div>Loading orders...</div>;
  if (error) return <div>Error: {error}</div>;
  if (orders.length === 0) return <div>No orders found.</div>;

  return (
    <div className="myOrders">
      <div className="myOrders__header">
        <h3 className="myOrders__title">Name</h3>
        <h3 className="myOrders__title">Status</h3>
        <h3 className="myOrders__title">Qty</h3>
        <h3 className="myOrders__title">Price</h3>
        <h3 className="myOrders__title">Action</h3>
      </div>
      <div className="myOrders__list">
        {orders.map((order) =>
          order.orderItems.map((item) => (
            <OrderItem
              key={item._id}
              item={item}
              orderStatus={order.orderStatus}
              onView={() => handleViewOrder(order._id)}
            />
          ))
        )}
      </div>

      {showDetails && (
        <div className="myOrders__detailsContainer">
          <Clientorderdetails onClose={handleCloseDetails} orderId={selectedOrderId} />
        </div>
      )}
    </div>
  );
};

const OrderItem = memo(({ item, orderStatus, onView }) => (
  <div className="myOrders__item">
    <div className="myOrders__field">{item.name}</div>
    <div className="myOrders__field">{orderStatus}</div>
    <div className="myOrders__field">{item.quantity}</div>
    <div className="myOrders__field">${(item.price * item.quantity).toFixed(0)}</div>
    <div className="myOrders__field">
      <button className="myOrders__viewButton" onClick={onView}>View</button>
    </div>
  </div>
));

export default MyOrders;
