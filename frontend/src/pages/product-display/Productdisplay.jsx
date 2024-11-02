import React, { useContext, useState } from 'react';
import PropTypes from 'prop-types';
import './productdisplay.css';
import { FaStar, FaStarHalfAlt } from 'react-icons/fa';
import { Context } from '../../context API/Contextapi';
import { useNavigate } from 'react-router-dom';
import Description from '../../components/description/Description';

const Productdisplay = ({ product }) => {

    const [mainImage, setMainImage] = useState(product.images && product.images.length > 0 ? product.images[0] : product.image);
    const [selectedSize, setSelectedSize] = useState(product.sizes ? product.sizes[0] : null); // Default to the first size
    const [selectedColor, setSelectedColor] = useState(product.colors ? product.colors[0] : null); // Default to the first color
    const { addToCart } = useContext(Context);
    const navigate = useNavigate();
    console.log("Here are the product data", product);

    const handleAddToCart = () => {
        addToCart(product.id);
    };

    const handleImageClick = (image) => {
        setMainImage(image);
    };

    const handleBuyNow = () => {
        addToCart(product.id);
        navigate('/cart/checkout');
    };

    return (
        <>
            <div className="product-display">
                <div className="product-display__left">
                    <div className="product-display__main-img">
                        <img src={mainImage} alt={product.name} />
                    </div>
                    <div className="product-display__image-list">
                        {product.images && product.images.length > 0 ? (
                            product.images.map((img, index) => (
                                <img
                                    key={img} // Using image URL as key, ensure it's unique
                                    src={img}
                                    alt={`Product thumbnail ${index + 1}`}
                                    onClick={() => handleImageClick(img)}
                                    style={{ cursor: 'pointer' }}
                                />
                            ))
                        ) : (
                            <img src={product.image} alt="Main product thumbnail" />
                        )}
                    </div>
                </div>
                <div className="product-display__right">
                    <h1>{product.name}</h1>
                    <div className="product-display__stars">
                        <FaStar />
                        <FaStar />
                        <FaStar />
                        <FaStar />
                        <FaStarHalfAlt />
                        <p>(15)</p>
                    </div>
                    <div className="product-display__prices">
                        {product.oldprice && (
                            <div className="product-display__old-price">${product.oldprice}</div>
                        )}
                        <div className="product-display__new-price">${product.newprice}</div>
                    </div>

                    {/* Size Selection */}
                    {product.sizes && product.sizes.length > 0 && (
                        <div className="product-display__size-selection">
                            <h4>Select Size</h4>
                            <div className="sizes">
                                {product.sizes.map((size) => (
                                    <div 
                                        key={size} 
                                        className={`size-option ${selectedSize === size ? 'selected' : ''}`} 
                                        onClick={() => setSelectedSize(size)}
                                    >
                                        {size}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Color Selection */}
                    {product.colors && product.colors.length > 0 && (
                        <div className="product-display__color-selection">
                            <h4>Select Color</h4>
                            <div className="colors">
                                {product.colors.map((color) => (
                                    <div 
                                        key={color} 
                                        className={`color-option ${selectedColor === color ? 'selected' : ''}`} 
                                        style={{ backgroundColor: color }} 
                                        onClick={() => setSelectedColor(color)}
                                    />
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="product-display__buttons">
                        <button onClick={handleAddToCart}>Add to Cart</button>
                        <button onClick={handleBuyNow}>Buy Now</button>
                    </div>
                    <p className="product-display__category"><span>Category :</span> {product.category}</p>
                    <p className="product-display__tags"><span>Tags :</span> Latest</p>
                </div>
            </div>
            <Description description={product.description} />
        </>
    );
};

Productdisplay.propTypes = {
    product: PropTypes.shape({
        id: PropTypes.number.isRequired,
        image: PropTypes.string.isRequired,
        images: PropTypes.arrayOf(PropTypes.string), // Specify the type of items in the images array
        name: PropTypes.string.isRequired,
        oldprice: PropTypes.number,
        newprice: PropTypes.number.isRequired,
        sizes: PropTypes.arrayOf(PropTypes.string), // Array of sizes
        colors: PropTypes.arrayOf(PropTypes.string), // Array of colors
        category: PropTypes.string.isRequired,
        description: PropTypes.string.isRequired,
    }).isRequired,
};

export default Productdisplay;
