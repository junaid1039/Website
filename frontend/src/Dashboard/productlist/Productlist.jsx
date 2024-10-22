import React, { useEffect, useState } from 'react';
import './productlist.css';
import { RiDeleteBin5Line, RiEdit2Fill } from "react-icons/ri";
import { useNavigate } from 'react-router-dom';

const Productlist = () => {
  const [allproducts, setallproducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  
  const navigate = useNavigate();

  // Fetch all products
  const fetchInfo = async () => {
    try {
      const response = await fetch('http://localhost:5000/allproducts');
      if (!response.ok) {
        throw new Error("Failed to fetch products");
      }
      const data = await response.json();
      setallproducts(data.products); // Assuming the response contains products in a 'products' field
      setLoading(false);
      
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInfo();
  }, []);

  // Show confirmation modal
  const handleDeleteClick = (id) => {
    setProductToDelete(id);
    setShowModal(true);
  };

  // Confirm product removal
  const confirmDelete = async () => {
    try {
      await fetch(`http://localhost:5000/removeproduct`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'auth-token': `${sessionStorage.getItem('auth-token')}`,
        },
        body: JSON.stringify({ id: productToDelete })
      });
      fetchInfo(); // Refresh the product list
      setShowModal(false); // Close the modal
    } catch (error) {
      console.error('Failed to remove product:', error);
      setShowModal(false);
    }
  };

  // Navigate to Edit Product page
  const handleEditClick = (id) => {
    navigate(`editproduct/${id}`);
  };

  if (loading) {
    return <div>Loading products...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="list-product">
      <h1>All Products</h1>
      <div className="listproduct-format-main">
        <p>Products</p>
        <p>Title</p>
        <p>Old Price</p>
        <p>New Price</p>
        <p>Category</p>
        <p>Actions</p>
      </div>
      <div className="listproduct-allproducts">
        <hr />
        {allproducts.length === 0 ? (
          <p>No products available</p>
        ) : (
          allproducts.map((product) => (
            <React.Fragment key={product.id}>
              <div className="listproduct-format-main listproduct-format">
                {/* Render the first image from the images array */}
                <img src={product.images[0]} alt={product.name} className="listproduct-product-img" />
                <p>{product.name}</p>
                <p>${product.oldprice}</p>
                <p>${product.newprice}</p>
                <p>{product.category}</p>
                <p>
                  <RiEdit2Fill onClick={() => handleEditClick(product.id)} className="edit-icon" />
                  <RiDeleteBin5Line onClick={() => handleDeleteClick(product.id)} className="delete-icon" />
                </p>
              </div>
              <hr />
            </React.Fragment>
          ))
        )}
      </div>

      {/* Confirmation Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <p>Are you sure you want to delete this product?</p>
            <div className="confirm-buttons">
              <button onClick={confirmDelete} className="confirm-btn">Yes</button>
              <button onClick={() => setShowModal(false)} className="cancel-btn">No</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Productlist;
