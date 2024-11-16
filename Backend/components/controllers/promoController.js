// controllers/promoCodeController.js

const PromoCode = require('../models/promocode');

// Create a new promo code
const createPromoCode = async (req, res) => {
  const { code, discount, expirationDate } = req.body;

  try {
    // Check if promo code already exists
    const existingPromoCode = await PromoCode.findOne({ code });
    if (existingPromoCode) {
      return res.status(400).json({ message: 'Promo code already exists' });
    }

    const newPromoCode = new PromoCode({
      code,
      discount,
      expirationDate,
    });

    await newPromoCode.save();
    res.status(201).json({ message: 'Promo code created successfully', promoCode: newPromoCode });
  } catch (error) {
    res.status(500).json({ message: 'Error creating promo code', error: error.message });
  }
};


// Validate a promo code
const validatePromoCode = async (req, res) => {
    const { promoCode } = req.body;
  
    try {
      const promo = await PromoCode.findOne({ code: promoCode });
  
      if (!promo) {
        return res.status(400).json({ message: 'Invalid promo code' });
      }
  
      // Check if the promo code is expired
      const currentDate = new Date();
      if (promo.expirationDate && currentDate > promo.expirationDate) {
        return res.status(400).json({ message: 'Promo code expired' });
      }
  
      res.json({ discount: promo.discount, message: 'Promo code valid', success: true });
    } catch (error) {
      res.status(500).json({ message: 'Error validating promo code', error: error.message });
    }
  };
  

// Get all active promo codes (for admin)
const getAllPromoCodes = async (req, res) => {
  try {
    const currentDate = new Date();
    const activePromoCodes = await PromoCode.find({
      expirationDate: { $gte: currentDate },
    });

    res.json({ promoCodes: activePromoCodes });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching promo codes', error: error.message });
  }
};

// Delete a promo code by _id
const deletePromoCode = async (req, res) => {
  const { id } = req.body; // Expecting 'id' in the request body

  try {
    // Check if the promo code exists
    const promoCode = await PromoCode.findById(id);
    if (!promoCode) {
      return res.status(404).json({ message: 'Promo code not found' });
    }

    // Delete the promo code
    await PromoCode.findByIdAndDelete(id);
    res.json({ message: 'Promo code deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting promo code', error: error.message });
  }
};


module.exports = {
  createPromoCode,
  validatePromoCode,
  getAllPromoCodes,
  deletePromoCode,
};

