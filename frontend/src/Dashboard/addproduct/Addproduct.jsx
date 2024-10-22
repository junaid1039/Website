import React, { useState } from 'react';
import './addproduct.css';
import { IoMdCloudUpload } from "react-icons/io";

const port = 5000;

const Addproduct = () => {
    const [images, setImages] = useState([]);
    const [productDetails, setProductDetails] = useState({
        name: "",
        category: '',
        newprice: '',
        oldprice: '',
        description: ''
    });
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const changeHandler = (e) => {
        setProductDetails({ ...productDetails, [e.target.name]: e.target.value });
    }

    const imageHandler = (e) => {
        setImages(Array.from(e.target.files));
    }

    const addProduct = async () => {
        setLoading(true);
        setErrorMessage("");

        const formData = new FormData();
        images.forEach(image => {
            formData.append('images', image);
        });
        formData.append('name', productDetails.name);
        formData.append('category', productDetails.category);
        formData.append('newprice', productDetails.newprice);
        formData.append('oldprice', productDetails.oldprice);
        formData.append('description', productDetails.description);

        try {
            const uploadResponse = await fetch(`http://localhost:${port}/uploadimage`, {
                method: 'POST',
                body: formData,
            });
            const uploadData = await uploadResponse.json();
            console.log('Upload Data:', uploadData.data.map(img=>img.secure_url));

            if (uploadData.success) {
                const product = {
                    name: productDetails.name,
                    images: uploadData.data.map(img => img.secure_url),
                    category: productDetails.category,
                    newprice: productDetails.newprice,
                    oldprice: productDetails.oldprice,
                    description: productDetails.description
                };

                const addProductResponse = await fetch(`http://localhost:${port}/addproduct`, {
                    method: 'POST',
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json',
                        'auth-token': sessionStorage.getItem('auth-token'),
                    },
                    body: JSON.stringify(product),
                });

                const data = await addProductResponse.json();
                console.log(data);

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
