import React, { useEffect, useState, useContext } from 'react';
import './productlist.css';
import { RiDeleteBin5Line, RiEdit2Fill } from "react-icons/ri";
import { useNavigate } from 'react-router-dom';
import { Context } from '../../context API/Contextapi';
import Adminloader from '../adminloader/Adminloader';

const Productlist = () => {
  const { confirmDelete, allproducts } = useContext(Context);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  
  const navigate = useNavigate();

  // Optional: Uncomment if you need to fetch product data on mount
  // useEffect(() => {
  //   const getData = async () => {
  //     setLoading(true);
  //     const data = await fetchInfo(); // Assuming fetchInfo() is available
  //     if (data.success) {
  //       setLoading(false);
  //     } else {
  //       setError(data.error); // Set the error if fetch failed
  //       setLoading(false);
  //     }
  //   };
  //
  //   getData();
  // }, []);

  const handleDeleteClick = (id) => {
    setProductToDelete(id);
    setShowModal(true);
  };

  const handleConfirmDelete = () => {
    confirmDelete(productToDelete, setShowModal);
  };

  const handleEditClick = (id) => {
    navigate(`editproduct/${id}`);
  };

  if (loading) {
    return <Adminloader />;
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
