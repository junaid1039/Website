import React, { useState, useContext, useMemo } from 'react';
import './payment.css';
import { FaCreditCard, FaMoneyBillAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { Context } from '../../context API/Contextapi';
import Stepper from '../stepper/Stepper';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe('YOUR_STRIPE_PUBLIC_KEY'); // Replace with your Stripe public key

const Payment = () => {
    const navigate = useNavigate();
    const { getTotalCartAmount, handlePaymentSubmit } = useContext(Context);

    const [currentStep] = useState(3);
    const [paymentMethod, setPaymentMethod] = useState('');
    const [error, setError] = useState('');

    // Memoize the total cart amount to avoid recalculating
    const totalAmount = useMemo(() => getTotalCartAmount(), [getTotalCartAmount]);

    const handleStripePayment = async () => {
        try {
            const stripe = await stripePromise;
            const response = await fetch('/create-checkout-session', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ amount: totalAmount * 100 }), // Stripe expects amount in cents
            });

            if (!response.ok) throw new Error('Failed to create checkout session.');

            const session = await response.json();
            const result = await stripe.redirectToCheckout({ sessionId: session.id });

            if (result.error) setError(result.error.message);
        } catch (err) {
            setError(err.message);
        }
    };

    const handleConfirmOrder = () => {
        if (!paymentMethod) {
            setError('Please select a payment method.');
            return;
        }
        
        if (paymentMethod === 'COD') {
            handlePaymentSubmit(navigate, setError, paymentMethod);
        } else if (paymentMethod === 'CreditCard') {
            handleStripePayment();
        }
    };

    return (
        <>
            <Stepper currentStep={currentStep} />
            <div className="payment">
                <h2>Payment</h2>

                {/* Payment Options */}
                <div className="payment-options">
                    <div
                        className={`payment-option ${paymentMethod === 'COD' ? 'selected' : ''}`}
                        onClick={() => setPaymentMethod('COD')}
                    >
                        <FaMoneyBillAlt size={24} />
                        <p>Cash on Delivery (COD)</p>
                    </div>
                    <div
                        className={`payment-option ${paymentMethod === 'CreditCard' ? 'selected' : ''}`}
                        onClick={() => setPaymentMethod('CreditCard')}
                    >
                        <FaCreditCard size={24} />
                        <p>Pay with Credit Card</p>
                    </div>
                </div>

                {/* Error Message */}
                {error && <p className="error">{error}</p>}

                {/* Order Summary */}
                <div className="payment-summary">
                    <h3>Order Summary</h3>
                    <div className="summary-item">
                        <p>Total Amount:</p>
                        <p>${totalAmount}</p>
                    </div>
                    <div className="summary-item">
                        <p>Shipping Fee:</p>
                        <p>Free</p>
                    </div>
                    <div className="summary-item">
                        <p><strong>Total:</strong></p>
                        <p><strong>${totalAmount}</strong></p>
                    </div>
                </div>
                
                <button className="submit-button" onClick={handleConfirmOrder}>Confirm Order</button>
            </div>
        </>
    );
};

export default Payment;
