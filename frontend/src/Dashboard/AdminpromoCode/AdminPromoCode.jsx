import React, { useState, useEffect } from 'react';
import './adminPromoCode.css'; // Ensure to create the appropriate CSS for styling

const AdminPromoCode = () => {
  const [promoCodes, setPromoCodes] = useState([]);
  const [newCode, setNewCode] = useState('');
  const [discount, setDiscount] = useState('');
  const [expirationDate, setExpirationDate] = useState('');
  const [promoCodeToValidate, setPromoCodeToValidate] = useState('');
  const [validationMessage, setValidationMessage] = useState('');

  const baseurl = import.meta.env.VITE_REACT_APP_BACKEND_BASEURL;

  // Fetch all active promo codes when the component mounts
  useEffect(() => {
    const fetchPromoCodes = async () => {
      try {
        const response = await fetch(`${baseurl}/allCode`);
        const data = await response.json();
        if (response.ok) {
          setPromoCodes(data.promoCodes);
        } else {
          console.error('Error fetching promo codes:', data.message);
        }
      } catch (error) {
        console.error('Error fetching promo codes:', error);
      }
    };

    fetchPromoCodes();
  }, []);

  // Handle promo code creation
  const handleCreatePromoCode = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${baseurl}/createCode`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          code: newCode,
          discount: discount,
          expirationDate: expirationDate,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        alert(data.message);
        setPromoCodes([...promoCodes, data.promoCode]); // Add new code to the list
        setNewCode('');
        setDiscount('');
        setExpirationDate('');
      } else {
        alert(data.message || 'Error creating promo code');
      }
    } catch (error) {
      alert('Error creating promo code');
      console.error(error);
    }
  };

  // Handle promo code validation
  const handleValidatePromoCode = async () => {
    try {
      const response = await fetch(`${baseurl}/validateCode`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ promoCode: promoCodeToValidate }),
      });

      const data = await response.json();
      if (response.ok) {
        setValidationMessage(`Promo code is valid! Discount: ${data.discount}%`);
      } else {
        setValidationMessage(data.message || 'Error validating promo code');
      }
    } catch (error) {
      setValidationMessage('Error validating promo code');
      console.error(error);
    }
  };

  return (
    <div className="admin-promo-code">
      <h2>Manage Promo Codes</h2>

      {/* Promo code creation form */}
      <form onSubmit={handleCreatePromoCode} className="create-form">
        <h3>Create Promo Code</h3>
        <div className="form-group">
          <label htmlFor="code">Promo Code</label>
          <input
            type="text"
            id="code"
            value={newCode}
            onChange={(e) => setNewCode(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="discount">Discount Percentage</label>
          <input
            type="number"
            id="discount"
            value={discount}
            onChange={(e) => setDiscount(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="expirationDate">Expiration Date</label>
          <input
            type="date"
            id="expirationDate"
            value={expirationDate}
            onChange={(e) => setExpirationDate(e.target.value)}
            required
          />
        </div>
        <button type="submit">Create Promo Code</button>
      </form>

      {/* Promo code validation */}
      <div className="validate-section">
        <h3>Validate Promo Code</h3>
        <input
          type="text"
          value={promoCodeToValidate}
          onChange={(e) => setPromoCodeToValidate(e.target.value)}
          placeholder="Enter promo code"
        />
        <button onClick={handleValidatePromoCode}>Validate</button>
        {validationMessage && <p>{validationMessage}</p>}
      </div>

      {/* List all active promo codes */}
      <div className="promo-codes-list">
        <h3>Active Promo Codes</h3>
        {promoCodes.length === 0 ? (
          <p>No active promo codes available.</p>
        ) : (
          <ul>
            {promoCodes.map((promo) => (
              <li key={promo._id}>
                <strong>{promo.code}</strong> - {promo.discount}% off
                <span> (Expires on {new Date(promo.expirationDate).toLocaleDateString()})</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default AdminPromoCode;
