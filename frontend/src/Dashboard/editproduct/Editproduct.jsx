import React, { useState, useEffect } from 'react';
import '../addproduct/addproduct.css'; // Reusing the same CSS as AddProduct
import { IoMdCloudUpload } from "react-icons/io";
import { RiCloseCircleLine } from 'react-icons/ri'; // Icon for removing images
import { useParams, useNavigate } from 'react-router-dom';

const port = 5000;

const EditProduct = () => {
    const { id } = useParams(); // Get product ID from URL
    const navigate = useNavigate(); // Initialize navigation
    const [productDetails, setProductDetails] = useState({
        name: "",
        category: '',
        newprice: '',
        oldprice: '',
        description: '',
    });
    const [images, setImages] = useState([]); // New images to be added
    const [existingImages, setExistingImages] = useState([]); // Existing images
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [deletedImages, setDeletedImages] = useState([]); // Track deleted images

    useEffect(() => {
        // Fetch product details by ID
        const fetchProductDetails = async () => {
            try {
                const response = await fetch(`http://localhost:${port}/productdata/${id}`);
                const data = await response.json();
                setProductDetails({
                    name: data.name,
                    category: data.category,
                    newprice: data.newprice,
                    oldprice: data.oldprice,
                    description: data.description,
                });
                setExistingImages(data.images); // Set existing images
            } catch (error) {
                console.error('Error fetching product:', error);
            }
        };
        fetchProductDetails();
    }, [id]);

    const changeHandler = (e) => {
        setProductDetails({ ...productDetails, [e.target.name]: e.target.value });
    };

    const imageHandler = (e) => {
        setImages(prevImages => [...prevImages, ...Array.from(e.target.files)]); // Handle new images
    };

    const removeExistingImage = (imagePath) => {
        setDeletedImages([...deletedImages, imagePath]); // Mark image for deletion
        setExistingImages(existingImages.filter(img => img !== imagePath)); // Remove from existing images
    };

    const editProduct = async () => {
        setLoading(true);
        setErrorMessage("");
    
        // Create a FormData object to handle both text and file data
        const formData = new FormData();
    
        // Append the product details to the FormData object
        formData.append('name', productDetails.name);
        formData.append('category', productDetails.category);
        formData.append('newprice', productDetails.newprice);
        formData.append('oldprice', productDetails.oldprice);
        formData.append('description', productDetails.description);
    
        // Append existing images
        existingImages.forEach((image, index) => {
            formData.append(`existingImages[${index}]`, image);
        });
    
        // Append new images if there are any
        if (images.length > 0) {
            images.forEach((image, index) => {
                formData.append('newImages', image);
            });
        }
    
        // Append images marked for deletion
        deletedImages.forEach((image, index) => {
            formData.append(`deleteImages[${index}]`, image);
        });
    
        try {
            // Send FormData to the server
            const response = await fetch(`http://localhost:${port}/product/${id}`, {
                method: 'PUT',
                body: formData // Sending FormData directly
            });
    
            const data = await response.json();
    
            if (data.success) {
                alert("Product updated successfully");
                navigate('/productlist'); // Redirect after successful update
            } else {
                setErrorMessage("Failed to update product");
            }
        } catch (error) {
            setErrorMessage('Error occurred while updating the product');
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };
    
    

    return (
        <div className="add-product">
            <h2>Edit Product</h2>
            <div className="addproduct-itemfield">
                <p>Product Title</p>
                <input value={productDetails.name} onChange={changeHandler} type="text" name='name' placeholder='Type here' />
            </div>
            <div className="addproduct-price">
                <div className="addproduct-itemfield">
                    <p>Old Price</p>
                    <input value={productDetails.oldprice} onChange={changeHandler} type='text' name='oldprice' placeholder='Type here' />
                </div>
                <div className="addproduct-itemfield">
                    <p>New Price</p>
                    <input value={productDetails.newprice} onChange={changeHandler} type='text' name='newprice' placeholder='Type here' />
                </div>
            </div>
            <div className="addproduct-itemfield">
                <p>Product Category</p>
                <select value={productDetails.category} onChange={changeHandler} name='category' className='add-product-selector'>
                    <option value='men shoes'>men shoes</option>
                    <option value='women shoes'>women shoes</option>
                    <option value='perfumes'>perfumes</option>
                    <option value='bags'>bags</option>
                    <option value='belts'>belts</option>
                    <option value='wallets'>wallets</option>
                    <option value='accessories'>accessories</option>
                    <option value='horse saddle'>horse saddle</option>
                </select>
            </div>
            <div className="addproduct-itemfield">
                <p>Product Description</p>
                <textarea
                    value={productDetails.description}
                    onChange={changeHandler}
                    name="description"
                    rows={10}
                    placeholder='Description'
                />
            </div>

            {/* Existing images */}
            <div className="addproduct-itemfield">
                <p>Product Images</p>
                <div className="image-preview-container">
                    {existingImages.map((image, index) => (
                        <div key={index} className="image-preview-edit">
                            <img src={image} alt={`Existing Image ${index + 1}`} />
                            <RiCloseCircleLine className="remove-icon" onClick={() => removeExistingImage(image)} />
                        </div>
                    ))}
                </div>
            </div>

            {/* New image upload */}
            <div className="addproduct-itemfield">
                <div className="image-previews">
                    {images.length > 0 ? (
                        images.map((image, index) => (
                            <img key={index} src={URL.createObjectURL(image)} alt={`Product Preview ${index + 1}`} />
                        ))
                    ) : (
                        <p style={{ fontSize: '0.7em', color: 'red' }}>No new images selected</p>
                    )}
                </div>
                <label htmlFor='file-input' className='upload-box'>
                    <IoMdCloudUpload size={20} />
                    Upload new images
                </label>
                <input
                    type='file'
                    name='images'
                    id='file-input'
                    onChange={imageHandler}
                    multiple // Allow multiple files
                    hidden
                />
            </div>

            {errorMessage && <p className="error-message">{errorMessage}</p>}
            <button onClick={editProduct} disabled={loading} className='addproduct-btn'>
                {loading ? "Updating..." : "Update Product"}
            </button>
        </div>
    );
};

export default EditProduct;
