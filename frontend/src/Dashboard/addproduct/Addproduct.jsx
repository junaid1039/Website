import React, { useState } from 'react';
import './addproduct.css';
import { IoMdCloudUpload } from "react-icons/io";

const baseurl = import.meta.env.VITE_REACT_APP_BACKEND_BASEURL;

const Addproduct = () => {
    const [images, setImages] = useState([]);
    const [productDetails, setProductDetails] = useState({
        name: "",
        category: '',
        newprice: '',
        oldprice: '',
        description: '',
        brand: '',
        colors: [],
        sizes: [],
        visible: false // Initialize as boolean
    });
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const changeHandler = (e) => {
        const { name, value, type, checked } = e.target;
        setProductDetails(prevDetails => ({
            ...prevDetails,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const arrayHandler = (e, fieldName) => {
        setProductDetails({
            ...productDetails,
            [fieldName]: e.target.value.split(',').map(item => item.trim())
        });
    };

    const imageHandler = (e) => {
        setImages(Array.from(e.target.files));
    };

    const addProduct = async () => {
        setLoading(true);
        setErrorMessage("");

        // Validate required fields
        if (!productDetails.name || !productDetails.category || !productDetails.newprice || !productDetails.oldprice || !productDetails.description || images.length === 0) {
            setErrorMessage("Please fill in all required fields and upload at least one image.");
            setLoading(false);
            return;
        }

        const formData = new FormData();
        images.forEach(image => {
            formData.append('images', image);
        });

        // Create the product object
        const product = {
            ...productDetails,
            images: [] // Placeholder for image URLs after upload
        };

        Object.entries(product).forEach(([key, value]) => {
            formData.append(key, Array.isArray(value) ? JSON.stringify(value) : value);
        });

        try {
            // Upload images
            const uploadResponse = await fetch(`${baseurl}/uploadimage`, {
                method: 'POST',
                body: formData,
            });
            const uploadData = await uploadResponse.json();

            if (uploadData.success) {
                product.images = uploadData.data.map(img => img.secure_url); // Assign the uploaded image URLs
                
                // Now send the product data to add it to the database
                const addProductResponse = await fetch(`${baseurl}/addproduct`, {
                    method: 'POST',
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json',
                        'auth-token': sessionStorage.getItem('auth-token'),
                    },
                    body: JSON.stringify(product),
                });

                const data = await addProductResponse.json();

                if (data.success) {
                    alert("Product added successfully");
                    window.location.reload();
                } else {
                    setErrorMessage("Failed to add product");
                }
            } else {
                setErrorMessage("Failed to upload images");
            }
        } catch (error) {
            setErrorMessage('Error occurred while uploading the images or adding the product');
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="add-product">
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

            {/* Row for Brand and Colors */}
            <div className="addproduct-row">
                <div className="addproduct-itemfield">
                    <label>Brand</label>
                    <input 
                        value={productDetails.brand} 
                        onChange={changeHandler} 
                        type="text" 
                        name='brand' 
                        placeholder='Brand' 
                    />
                </div>
                <div className="addproduct-itemfield">
                    <label>Colors (comma-separated)</label>
                    <input 
                        value={productDetails.colors.join(', ')} 
                        onChange={(e) => arrayHandler(e, 'colors')} 
                        type="text" 
                        placeholder='e.g., red, blue, green' 
                    />
                </div>
            </div>

            {/* Row for Visible */}
            <div className="addproduct-row2">
                <div className="addproduct-itemfield2">
                    <label>Visibility</label>
                    <input 
                        type="checkbox" 
                        name="visible" 
                        checked={productDetails.visible} 
                        onChange={changeHandler} 
                    />
                </div>
            </div>

            <div className="addproduct-itemfield">
                <label>Sizes (comma-separated)</label>
                <input 
                    value={productDetails.sizes.join(', ')} 
                    onChange={(e) => arrayHandler(e, 'sizes')} 
                    type="text" 
                    placeholder='e.g., S, M, L' 
                />
            </div>

            <div className="addproduct-itemfield">
                <div className="image-previews">
                    {images.length > 0 ? (
                        images.map((image, index) => (
                            <img key={index} src={URL.createObjectURL(image)} alt={`Product Preview ${index + 1}`} />
                        ))
                    ) : (
                        <p>No images selected</p>
                    )}
                </div>
                <label htmlFor='file-input' className='upload-box'>
                    <IoMdCloudUpload size={20} />
                    Upload images
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
                <button onClick={addProduct} disabled={loading} className='addproduct-btn'>
                    {loading ? "Adding..." : "Add"}
                </button>
            </div>
        </div>
    );
};

export default Addproduct;
