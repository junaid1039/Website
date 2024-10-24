import React, { useEffect, useState, useContext } from 'react';
import './productlist.css';
import { RiDeleteBin5Line, RiEdit2Fill } from "react-icons/ri";
import { useNavigate } from 'react-router-dom';
import { Context } from '../../context API/Contextapi';

const Productlist = () => {
  const { confirmDelete, fetchInfo } = useContext(Context);
  const [allproducts, setallproducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  
  const navigate = useNavigate();

  useEffect(() => {
    fetchInfo(setError, setLoading, setallproducts);
  }, [fetchInfo]);

  // Show confirmation modal
  const handleDeleteClick = (id) => {
    setProductToDelete(id);
    console.log("this is product for delete", productToDelete);
    setShowModal(true);
  };

  // Confirm product removal
  const handleConfirmDelete = () => {
    confirmDelete(productToDelete, setShowModal,setError,setLoading,setallproducts);
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
              <button onClick={handleConfirmDelete} className="confirm-btn">Yes</button>
              <button onClick={() => setShowModal(false)} className="cancel-btn">No</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Productlist;
