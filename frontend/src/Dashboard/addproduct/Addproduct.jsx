import React, { useState } from 'react';
import './addproduct.css';
import { IoMdCloudUpload } from "react-icons/io";


const port = 5000;

const Addproduct = () => {
    const [images, setImages] = useState([]); // Changed to handle multiple images
    const [productdetails, setProductDetails] = useState({
        name: "",
        category: '',
        newprice: '',
        oldprice: '',
        description: ''
    });

    const [loading, setLoading] = useState(false); // Loading state
    const [errorMessage, setErrorMessage] = useState(""); // Error state

    const changeHandler = (e) => {
        setProductDetails({ ...productdetails, [e.target.name]: e.target.value });
    }

    const imageHandler = (e) => {
        setImages(Array.from(e.target.files)); // Changed to handle multiple files
    }

    const Addproduct = async () => {
        setLoading(true); // Show loading
        setErrorMessage(""); // Reset error
        let responseData;

        let formdata = new FormData();
        images.forEach(image => {
            formdata.append('images', image); // Use 'images' for multiple files
        });
        formdata.append('name', productdetails.name);
        formdata.append('category', productdetails.category);
        formdata.append('newprice', productdetails.newprice);
        formdata.append('oldprice', productdetails.oldprice);
        formdata.append('description', productdetails.description);

        try {
            const response = await fetch(`http://localhost:${port}/uploadimage`, {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                },
                body: formdata,
            });
            responseData = await response.json();

            if (responseData.success) {
                const product = {
                    name: productdetails.name,
                    category: productdetails.category,
                    newprice: productdetails.newprice,
                    oldprice: productdetails.oldprice,
                    description: productdetails.description,
                    images: responseData.image_urls, // Ensure this matches the response format
                };

                const addProductResponse = await fetch(`http://localhost:${port}/addproduct`, {
                    method: 'POST',
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(product),
                });

                const data = await addProductResponse.json();

                if (data.success) {
                    alert("Product added successfully");
                    window.location.reload();
                } else {
                    alert("Failed to add product");
                }
            } else {
                setErrorMessage("Failed to upload images");
            }
        } catch (error) {
            setErrorMessage('Error occurred while uploading the images or adding product');
            console.error('Error:', error);
        } finally {
            setLoading(false); // Hide loading
        }
    };

    return (
        <div className="add-product">
            <div className="addproduct-itemfield">
                <p>Product Title</p>
                <input value={productdetails.name} onChange={changeHandler} type="text" name='name' placeholder='Type here' />
            </div>
            <div className="addproduct-price">
                <div className="addproduct-itemfield">
                    <p>Old Price</p>
                    <input value={productdetails.oldprice} onChange={changeHandler} type='text' name='oldprice' placeholder='Type here' />
                </div>
                <div className="addproduct-itemfield">
                    <p>New Price</p>
                    <input value={productdetails.newprice} onChange={changeHandler} type='text' name='newprice' placeholder='Type here' />
                </div>
            </div>
            <div className="addproduct-itemfield">
                <p>Description</p>
                <textarea type="textarea" rows={10} value={productdetails.description} onChange={changeHandler} name="description" placeholder='Description' />
            </div>
            <div className="addproduct-itemfield">
                <p>Product Category</p>
                <select value={productdetails.category} onChange={changeHandler} name='category' className='add-product-selector'>
                    <option value='women'>men shoes</option>
                    <option value='men'>women shoes</option>
                    <option value='perfumes'>perfumes</option>
                    <option value='bags'>bags</option>
                    <option value='accessories'>accessories</option>
                    <option value='belts'>belts</option>
                    <option value='wallets'>wallets</option>
                    <option value='horse saddle'>horse saddle</option>
                </select>
            </div>

            {/* Display image previews */}
            <div className="addproduct-itemfield">
                <div className="image-previews">
                    {images.length > 0 ? (
                        images.map((image, index) => (
                            <img key={index} src={URL.createObjectURL(image)} alt={`Product Preview ${index + 1}`} />
                        ))
                    ) : (
                        <p style={{ fontSize: '0.7em',color: 'red' }}>No images selected</p>
                    )}
                </div>

                {/* Trigger file upload */}
                <label htmlFor='file-input' className='upload-box'>
                    <IoMdCloudUpload size={20} />
                    Click to upload images
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
            <button onClick={Addproduct} disabled={loading} className='addproduct-btn'>
                {loading ? "Adding..." : "Add"}
            </button>
        </div>
    )
};

export default Addproduct;
