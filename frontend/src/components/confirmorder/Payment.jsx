import React, { useState, useContext } from 'react';
import './payment.css';
import { FaCreditCard, FaMoneyBillAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { Context } from '../../context API/Contextapi';
import Stepper from '../stepper/Stepper';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe('YOUR_STRIPE_PUBLIC_KEY'); // Replace with your Stripe public key

const Payment = () => {
    const [currentStep] = useState(3);
    const { getTotalCartAmount, handlePaymentSubmit } = useContext(Context);
    const [paymentMethod, setPaymentMethod] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleStripePayment = async () => {
        const stripe = await stripePromise;
        const response = await fetch('/create-checkout-session', { // Your backend endpoint to create checkout session
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ amount: getTotalCartAmount() * 100 }), // Amount in cents
        });

        const session = await response.json();

        if (response.ok) {
            // Redirect to Stripe checkout
            const result = await stripe.redirectToCheckout({ sessionId: session.id });
            if (result.error) {
                setError(result.error.message);
            }
        } else {
            setError('Failed to create checkout session.');
        }
    };

    const handleConfirmOrder = () => {
        if (paymentMethod === 'COD') {
            // Handle Cash on Delivery payment
            handlePaymentSubmit(navigate, setError, paymentMethod);
        } else if (paymentMethod === 'CreditCard') {
            handleStripePayment();
        } else {
            setError('Please select a payment method.');
        }
    };

    return (
        <>
            <Stepper currentStep={currentStep} />
            <div className="payment">
                <h2>Payment</h2>
                <div className="payment-options">
                    <div className={`payment-option ${paymentMethod === 'COD' ? 'selected' : ''}`} onClick={() => setPaymentMethod('COD')}>
                        <FaMoneyBillAlt size={24} />
                        <p>Cash on Delivery (COD)</p>
                    </div>
                    <div className={`payment-option ${paymentMethod === 'CreditCard' ? 'selected' : ''}`} onClick={() => setPaymentMethod('CreditCard')}>
                        <FaCreditCard size={24} />
                        <p>Pay with Credit Card</p>
                    </div>
                </div>

                {/* Show error if no payment method is selected */}
                {error && <p className="error">{error}</p>}

                {/* Order summary */}
                <div className="payment-summary">
                    <h3>Order Summary</h3>
                    <div className="summary-item">
                        <p>Total Amount:</p>
                        <p>${getTotalCartAmount()}</p>
                    </div>
                    <div className="summary-item">
                        <p>Shipping Fee:</p>
                        <p>Free</p>
                    </div>
                    <div className="summary-item">
                        <p><strong>Total:</strong></p>
                        <p><strong>${getTotalCartAmount()}</strong></p>
                    </div>
                </div>
                <button className="submit-button" onClick={handleConfirmOrder}>Confirm Order</button>
            </div>
        </>
    ); 
};

export default Payment;
