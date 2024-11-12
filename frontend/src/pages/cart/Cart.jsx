import React, { useContext, useState, useCallback } from 'react';
import './cart.css';
import { RiDeleteBin6Line } from "react-icons/ri";
import { LuShoppingCart } from "react-icons/lu";
import { AiOutlineMinus, AiOutlinePlus } from "react-icons/ai";
import { SlHandbag } from "react-icons/sl";
import { Link } from 'react-router-dom';
import { FiPhone } from "react-icons/fi";
import { RxCross2 } from "react-icons/rx";
import Stepper from '../../components/stepper/Stepper';
import { Context } from '../../context API/Contextapi';

// Helper function to get currency symbol based on country code
const getCurrencySymbol = (currency) => {
  switch (currency) {
    case 'US': return '$';
    case 'EU': return '€';
    case 'GB': return '£';
    case 'AE': return 'د.إ';
    case 'PK': return '₨';
    default: return '$'; // Default currency symbol
  }
};

const Cart = () => {
  const { allproducts, countryCode, cart, removeFromCart, addToCart, getTotalCartAmount } = useContext(Context);
  const [currentStep] = useState(1);
  const [isUpdating, setIsUpdating] = useState(false); // Track ongoing update to prevent duplicate actions
  
  // Check if the cart is empty
  const isCartEmpty = !cart || Object.keys(cart).length === 0;
  const currencySymbol = getCurrencySymbol(countryCode);

  // Prevent multiple clicks by debouncing the addToCart/removeFromCart calls
  const handleAddToCart = useCallback((productId) => {
    if (isUpdating) return; // Skip if already updating
    setIsUpdating(true);
    addToCart(productId);  // Trigger addToCart action
    setTimeout(() => setIsUpdating(false), 500);  // Reset after delay
  }, [isUpdating, addToCart]);

  const handleRemoveFromCart = useCallback((productId) => {
    if (isUpdating) return; // Skip if already updating
    setIsUpdating(true);
    removeFromCart(productId);  // Trigger removeFromCart action
    setTimeout(() => setIsUpdating(false), 500);  // Reset after delay
  }, [isUpdating, removeFromCart]);

  return (
    <div className="cart-page">
      <Stepper currentStep={currentStep} />
      
      <div className="cartitem">
        <div className="sub-cartitem">
          <div className="cartitem-cart">
            {isCartEmpty ? (
              <div className="emptycart">
                <SlHandbag />
                <h4>Your cart is Empty</h4>
                <Link to='/' className='cl'><button>Continue Shopping</button></Link>
              </div>
            ) : (
              Object.entries(cart).map(([productId, { quantity, color, size }]) => {
                // Check if `products` exists and has items, then find the product
                const product = allproducts && allproducts.length > 0 ? 
                  allproducts.find((p) => p.id === parseInt(productId)) : null;

                if (product) {
                  return (
                    <div className="main-format" key={productId}>
                      <div className="cartitem-format">
                        <img className='mi' src={product.images && product.images[0]} alt={product.name} />
                        <div className="dside">
                          <div className='name'>
                            <span>{product.name}</span>
                            {/* Delete Icon to remove the item */}
                            <RxCross2 onClick={() => handleRemoveFromCart(productId)} />
                          </div>
                          <div className='details'>
                            <div className="color">
                              <span>Color: {color}</span>
                              <br/>
                              <span>Size: {size}</span>
                            </div>
                            <div className="d-q">
                              <AiOutlineMinus onClick={() => handleRemoveFromCart(productId)} />
                              <span className='cartitem-quantity'>{quantity}</span>
                              <AiOutlinePlus onClick={() => handleAddToCart(productId)} />
                            </div>
                            <span className="tprice">
                              {currencySymbol}{(product.newprice * quantity).toFixed(2)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                } else {
                  console.warn(`Product with ID ${productId} not found in products array.`);
                }
                return null;
              })
            )}
          </div>

          {/* Cart Totals Section */}
          <div className="cartitem-down">
            <div className="cs">
              <div className="sub-cs">
                <h4>Customer Service</h4>
                <div className="cntct">
                  <p><FiPhone /> <a href="tel:+923021725822">+92302-1725822</a></p>
                  <p>Monday to Friday: 9am to 9pm PST</p>
                </div>
              </div>
            </div>

            <div className="sub-down">
              <div className="ct-promoCode">
                <p>ENTER PROMO CODE</p>
                <div className="ct-promoBox">
                  <input type='text' placeholder='Promo Code' />
                  <button>Submit</button>
                </div>
              </div>
              <div className="cartitem-total">
                <div>
                  <div className="ct-item">
                    <p>Subtotal</p>
                    <p>{currencySymbol}{getTotalCartAmount()}</p>
                  </div>
                  <hr />
                  <div className="ct-item">
                    <p>Shipping Fee</p>
                    <p>Free</p>
                  </div>
                  <hr />
                  <div className="ct-item">
                    <h3>Total</h3>
                    <h3>{currencySymbol}{getTotalCartAmount()}</h3>
                  </div>
                </div>
                <Link to='/cart/checkout' className='cl'>
                  <button><LuShoppingCart /> Checkout</button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
