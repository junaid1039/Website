import React, { useContext,useState } from 'react';
import './cart.css';
import { RiDeleteBin6Line } from "react-icons/ri";
import { LuHeading, LuShoppingCart } from "react-icons/lu";
import { AiOutlineMinus, AiOutlinePlus } from "react-icons/ai";
import { PiHandbagBold } from "react-icons/pi";
import { Context } from '../../context API/Contextapi';
import { RxCross2 } from "react-icons/rx";
import { SlHandbag } from "react-icons/sl";
import { Link } from 'react-router-dom';
import { FiPhone } from "react-icons/fi";
import Stepper from '../../components/stepper/Stepper';




export const Cart = () => {
    const { allproducts, addToCart, cartItems, removeFromCart, getTotalCartAmount } = useContext(Context);
    const [currentStep] = useState(1); // Set current step to 1 for Cart
    // Ensure allProducts and cartItems are defined before processing
    /*if (!allproducts || !cartItems) {
        return <h5>Loading cart...</h5>; // Or display a loading spinner
    }*/

    // Check if the cart is empty by verifying all product quantities
    const isCartEmpty = allproducts.every((product) => cartItems[product.id] === 0);
    //const isCartEmpty= true;
    return (
        <>
            <div className="cart-page">
            <Stepper currentStep={currentStep} /> {/**stepper */}
                
                <div className="cartitem">
                    <div className="sub-cartitem">
                        <div className="cartitem-cart">
                            {isCartEmpty ? (
                                <div className="emptycart">
                                    <SlHandbag />
                                    <h4>Your cart is Empty</h4>
                                    <Link to='/' className='cl' ><button>Continue Shopping</button></Link>

                                </div>
                            ) : (
                                allproducts.map((product) => {
                                    // Safely check if the product is in the cart and its quantity is greater than 0
                                    if (cartItems[product.id] && cartItems[product.id] > 0) {
                                        return (
                                            <div className="main-format" key={product.id}>
                                                <div className="cartitem-format">
                                                    <img className='mi' src={product.image} alt='Image' />
                                                    <div className="dside">
                                                        <div className='name'>
                                                            <span>{product.name}</span>
                                                            <RxCross2 onClick={() => removeFromCart(product.id)} />
                                                        </div>
                                                        <div className='details'>
                                                            <div className="color"> other details here</div>
                                                            <div className="d-q"><AiOutlineMinus onClick={() => {
                                                                if (cartItems[product.id] > 0) removeFromCart(product.id);
                                                            }} />
                                                                <span className='cartitem-quantity'>{cartItems[product.id]}</span>
                                                                <AiOutlinePlus onClick={() => addToCart(product.id)} />

                                                            </div>
                                                            <span className="tprice">{"$" + (product.newprice * cartItems[product.id]).toFixed(2)}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        );
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
                                        {/* Use the 'tel:' scheme inside an <a> tag for clickable phone numbers */}
                                        <p><FiPhone /> <a href="tel:+923021725822">+92302-1725822</a></p>
                                        <p>Monday to Friday: 9am to 9pm PST</p>
                                    </div>
                                    <div className="dlv"></div>
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
                                            <p>${getTotalCartAmount()}</p>
                                        </div>
                                        <hr />
                                        <div className="ct-item">
                                            <p>Shipping Fee</p>
                                            <p>Free</p>
                                        </div>
                                        <hr />
                                        <div className="ct-item">
                                            <h3>Total</h3>
                                            <h3>${getTotalCartAmount()}</h3>
                                        </div>
                                    </div>
                                    <Link to='/cart/checkout' className='cl' ><button><LuShoppingCart /> Checkout</button></Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};
