import React, { useContext, useState } from 'react';
import PropTypes from 'prop-types';
import './productdisplay.css';
import { FaStar, FaStarHalfAlt } from 'react-icons/fa';
import { Context } from '../../context API/Contextapi';
import { useNavigate } from 'react-router-dom';

const Productdisplay = ({ product }) => {
    const [mainImage, setMainImage] = useState(product.image);
    const { addToCart } = useContext(Context);
    const navigate = useNavigate();

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
        <div className="product-display">
            <div className="productdisplay-left">
                <div className="p-main-img">
                    <img src={mainImage} alt="Main product" />
                </div>
                <div className="pimage-list">
                    {product.images ? (
                        product.images.map((img, index) => (
                            <img
                                key={index}
                                src={img}
                                alt={`product-thumbnail-${index}`}
                                onClick={() => handleImageClick(img)}
                                style={{ cursor: 'pointer' }}
                            />
                        ))
                    ) : (
                        <img src={product.image} alt="Main product thumbnail" />
                    )}
                </div>
            </div>
            <div className="productdisplay-right">
                <h1>{product.name}</h1>
                <div className="pdisplay-right-star">
                    <FaStar />
                    <FaStar />
                    <FaStar />
                    <FaStar />
                    <FaStarHalfAlt />
                    <p>(15)</p>
                </div>
                <div className="pright-prices">
                    {product.oldprice && <div className="pright-oldprice">${product.oldprice}</div>}
                    <div className="pright-newprice">${product.newprice}</div>
                </div>
                {/*<div className="pright-description">
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Odio nemo non, ex totam accusamus aliquid!
                </div>*/}
                {product.size && (
                    <div className="pd-right-size">
                        <h1>Select Size</h1>
                        <div className="sizes">
                            <div>S</div>
                            <div>M</div>
                            <div>L</div>
                            <div>XL</div>
                        </div>
                    </div>
                )}
                <div className="buttons">
                    <button onClick={handleAddToCart}>Add to Cart</button>
                    <button onClick={handleBuyNow}>Buy Now</button>
                </div>
                <p className="pd-right-category"><span>Category :</span> {product.category}</p>
                <p className="pd-right-category"><span>Tags :</span> Latest</p>
            </div>
        </div>
    );
};

Productdisplay.propTypes = {
    product: PropTypes.shape({
        id: PropTypes.number.isRequired,
        image: PropTypes.string.isRequired,
        images: PropTypes.array, // Add images array
        name: PropTypes.string.isRequired,
        oldprice: PropTypes.number,
        newprice: PropTypes.number.isRequired,
        size: PropTypes.bool,
        category: PropTypes.string.isRequired,
    }).isRequired,
};

export default Productdisplay;
