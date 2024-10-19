import React, { useEffect, useState, useContext } from 'react';
import './orders.css';
import { Context } from '../../../context API/Contextapi';

const Myorders = () => {
  const { myorders } = useContext(Context);

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
        // Set the error state without logging to console
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [myorders]);

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
              <div>{item.name}</div> {/* Display product name */}
              <div>{order.orderStatus}</div> {/* Order Status */}
              <div>{item.quantity}</div> {/* Quantity */}
              <div>${(item.price * item.quantity).toFixed(0)}/{order.paymentStatus}</div> {/* Price */}
              <div>
                <button>View</button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Myorders;
