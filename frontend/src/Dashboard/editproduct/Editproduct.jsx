import React, { useState, useEffect } from 'react';
import '../addproduct/addproduct.css';
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
        setImages(prevImages => [...prevImages, ...Array.from(e.target.files)]);
    };

    const removeExistingImage = (imageUrl) => {
        setDeletedImages([...deletedImages, imageUrl]);
        setExistingImages(existingImages.filter(img => img !== imageUrl));
    };

    const uploadImages = async (formData) => {
        try {
            const uploadResponse = await fetch(`http://localhost:${port}/uploadimage`, {
                method: 'POST',
                body: formData,
            });
            const uploadData = await uploadResponse.json();

            if (uploadData.success) {
                return uploadData.data.map(img => img.secure_url); // Return array of secure URLs
            } else {
                throw new Error('Failed to upload images');
            }
        } catch (error) {
            throw new Error('Error occurred while uploading images');
        }
    };

    const editProduct = async () => {
        setLoading(true);
        setErrorMessage("");

        // Create a new FormData object only if there are new images
        const formData = new FormData();
        if (images.length > 0) {
            images.forEach(image => {
                formData.append('images', image);
            });
        }

        try {
            let uploadedImageUrls = [];

            // Only call uploadImages if there are new images
            if (images.length > 0) {
                uploadedImageUrls = await uploadImages(formData);
            }

            // Construct the product object
            const product = {
                name: productDetails.name,
                images: [...uploadedImageUrls, ...existingImages], // Combine new and existing images
                category: productDetails.category,
                newprice: productDetails.newprice,
                oldprice: productDetails.oldprice,
                description: productDetails.description,
            };

            // Send the updated product data to the backend
            const response = await fetch(`http://localhost:${port}/product/${id}`, {
                method: 'PUT',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    'auth-token': sessionStorage.getItem('auth-token'),
                },
                body: JSON.stringify(product),
            });

            const data = await response.json();
            if (data.success) {
                alert("Product updated successfully");
                navigate('/admin/productlist');
            } else {
                setErrorMessage("Failed to update product");
            }
        } catch (error) {
            setErrorMessage(error.message); // Use the error message from the upload
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="add-product">
            <h2>Edit Product</h2>
            {/* Input Fields */}
            <div className="addproduct-itemfield">
                <label>Product Title</label>
                <input
                    value={productDetails.name}
                    onChange={changeHandler}
                    type="text"
                    name='name'
                    placeholder='Type here'
                />
            </div>
            <div className="addproduct-price">
                <div className="addproduct-itemfield">
                    <label>Old Price</label>
                    <input
                        value={productDetails.oldprice}
                        onChange={changeHandler}
                        type='text'
                        name='oldprice'
                        placeholder='Type here'
                    />
                </div>
                <div className="addproduct-itemfield">
                    <label>New Price</label>
                    <input
                        value={productDetails.newprice}
                        onChange={changeHandler}
                        type='text'
                        name='newprice'
                        placeholder='Type here'
                    />
                </div>
            </div>
            <div className="addproduct-itemfield">
                <label>Description</label>
                <textarea
                    rows={5}
                    value={productDetails.description}
                    onChange={changeHandler}
                    name="description"
                    placeholder='Description'
                />
            </div>
            <div className="addproduct-itemfield">
                <label>Product Category</label>
                <select
                    value={productDetails.category}
                    onChange={changeHandler}
                    name='category'
                    className='add-product-selector'
                >
                    <option value='men shoes'>Men Shoes</option>
                    <option value='women shoes'>Women Shoes</option>
                    <option value='perfumes'>Perfumes</option>
                    <option value='bags'>Bags</option>
                    <option value='accessories'>Accessories</option>
                    <option value='belts'>Belts</option>
                    <option value='wallets'>Wallets</option>
                    <option value='horse saddle'>Horse Saddle</option>
                </select>
            </div>

            {/* Existing Images */}
            <div className="addproduct-itemfield">
                <label>Existing Images</label>
                <div className="image-preview-container">
                    {existingImages.map((image, index) => (
                        <div key={index} className="image-preview-edit">
                            <img src={image} alt={`Existing Image ${index + 1}`} />
                            <RiCloseCircleLine className="remove-icon" onClick={() => removeExistingImage(image)} />
                        </div>
                    ))}
                </div>
            </div>

            {/* New Image Upload */}
            <div className="addproduct-itemfield">
                <div className="image-previews">
                    {images.length > 0 ? (
                        images.map((image, index) => (
                            <img key={index} src={URL.createObjectURL(image)} alt={`Product Preview ${index + 1}`} />
                        ))
                    ) : (
                        <p>No new images selected</p>
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
                    multiple
                    hidden
                />
            </div>

            {errorMessage && <p className="error-message">{errorMessage}</p>}
            <div className="btn-div">
                <button onClick={editProduct} disabled={loading} className='addproduct-btn'>
                    {loading ? "Updating..." : "Update Product"}
                </button>
            </div>
        </div>
    );
};

export default EditProduct;
