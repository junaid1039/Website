const Carousel = require('../models/carousel');

// Add a new carousel entry
const addCarousel = async (req, res) => {
    try {
        const { carousel, linkto } = req.body; // Destructure carousel from request body
        if (!carousel) {
            return res.status(400).json({ message: 'Carousel entry is required.' });
        }

        const newCarousel = new Carousel({ carousel, linkto });
        await newCarousel.save();

        return res.status(201).json({ success: true, carousel: newCarousel });
    } catch (error) {
        console.error('Error adding carousel:', error);
        return res.status(500).json({ success: false, message: 'Server error' });
    }
};

// Fetch all carousel entries
const getAllCarousels = async (req, res) => {
    try {
        const carousels = await Carousel.find();
        return res.status(200).json({ success: true, carousels });
    } catch (error) {
        console.error('Error fetching carousels:', error);
        return res.status(500).json({ success: false, message: 'Server error' });
    }
};

// Delete a carousel entry
const deleteCarousel = async (req, res) => {
    const { id } = req.body; // Get the ID from request parameters

    try {
        const deletedCarousel = await Carousel.findByIdAndDelete(id);
        if (!deletedCarousel) {
            return res.status(404).json({ success: false, message: 'Carousel not found' });
        }

        return res.status(200).json({ success: true, message: 'Carousel deleted successfully' });
    } catch (error) {
        console.error('Error deleting carousel:', error);
        return res.status(500).json({ success: false, message: 'Server error' });
    }
};

module.exports = {
    addCarousel,
    getAllCarousels,
    deleteCarousel,
};
