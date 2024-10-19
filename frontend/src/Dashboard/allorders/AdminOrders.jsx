import React, { useState, useEffect } from 'react';
import './adminorders.css';
import Orderdetails from '../orderdetails/Orderdetails';
import { LuPencilLine } from "react-icons/lu";
import { RiDeleteBin6Line } from "react-icons/ri";

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false); // For delete modal
  const [orderToDelete, setOrderToDelete] = useState(null); // Track the order ID to delete

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/allorders', {
        method: 'GET',
        headers: {
          'auth-token': `${sessionStorage.getItem('auth-token')}`,
          'Content-Type': 'application/json',
        },
      });
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setOrders(data.orders);
        } else {
          setError('Failed to fetch orders');
        }
      } else {
        setError('Failed to fetch orders');
      }
    } catch (error) {
      setError('Error fetching orders: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const viewOrderDetails = (id) => {
    setSelectedOrderId(id);
  };

  const closeOrderDetails = () => {
    setSelectedOrderId(null);
  };

  const confirmDeleteOrder = (id) => {
    setOrderToDelete(id);
    setShowConfirmDelete(true); // Show the delete confirmation modal
  };

  const deleteOrder = async () => {
    if (!orderToDelete) return;

    setDeleting(true);
    try {
      const response = await fetch(`http://localhost:5000/delorder/${orderToDelete}`, {
        method: 'DELETE',
        headers: {
          'auth-token': `${sessionStorage.getItem('auth-token')}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setOrders(orders.filter(order => order._id !== orderToDelete)); // Remove the deleted order from state
        } else {
          setError('Failed to delete the order');
        }
      } else {
        setError('Failed to delete the order');
      }
    } catch (error) {
      setError('Error deleting the order: ' + error.message);
    } finally {
      setDeleting(false);
      setShowConfirmDelete(false); // Close the modal
      setOrderToDelete(null); // Reset the order to delete
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'Processing':
        return 'status-processing';
      case 'Shipped':
        return 'status-shipped';
      case 'Delivered':
        return 'status-delivered';
      default:
        return '';
    }
  };

  const handleStatusUpdate = () => {
    fetchOrders();
  };

  return (
    <div className="admin-orders-container">
      <h2 className="admin-orders-title">Order Management</h2>
      {loading && <p>Loading orders...</p>}
      {error && <p className="error-message">{error}</p>}
      {deleting && <p>Deleting order...</p>}
      <table className="admin-orders-table">
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Order Date</th>
            <th>Order Status</th>
            <th>Total Price</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders.length > 0 ? (
            orders.map((order) => (
              <tr key={order._id} className="table-row">
                <td>{order._id}</td>
                <td>{new Date(order.dateOrdered).toLocaleString()}</td>
                <td className="status-cell">
                  <span className={getStatusClass(order.orderStatus)}>
                    {order.orderStatus}
                  </span>
                </td>
                <td>${order.totalPrice.toFixed(2)}</td>
                <td>
                  <button onClick={() => viewOrderDetails(order._id)} className="o-db">
                    <LuPencilLine />
                  </button>
                  <button onClick={() => confirmDeleteOrder(order._id)} className="o-db" disabled={deleting}>
                    <RiDeleteBin6Line />
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5">No orders available</td>
            </tr>
          )}
        </tbody>
      </table>

      {selectedOrderId && (
        <div className="order-details-container">
          <Orderdetails
            orderId={selectedOrderId}
            onClose={closeOrderDetails}
            onStatusUpdate={handleStatusUpdate}
          />
        </div>
      )}

      {/* Confirm Delete Modal */}
      {showConfirmDelete && (
        <div className="confirm-delete-overlay">
          <div className="confirm-delete-modal">
            <h3>Confirm Delete</h3>
            <p>Are you sure you want to delete this order?</p>
            <div className="modal-buttons">
              <button className="button confirm-button" onClick={deleteOrder}>Delete</button>
              <button className="button cancel-button" onClick={() => setShowConfirmDelete(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;
