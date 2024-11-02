const fs = require('fs');
const cloudinary = require('../utils/cloudinary');

const uploadImages = async (req, res) => {
    if (!req.files || req.files.length === 0) {
        return res.status(400).json({ success: false, message: "No files uploaded" });
    }

    try {
        const uploadPromises = req.files.map((file) => {
            return cloudinary.uploader.upload(file.path, {
                transformation: [
                    { width: 500, height: 500, crop: "fill" }, // Crop to 1:1 ratio
                    { quality: "auto" }
                ]
            })
            .then((result) => {
                // Remove the local file after upload
                fs.unlinkSync(file.path);
                return result;
            });
        });

        // Wait for all the uploads to complete
        const uploadResults = await Promise.all(uploadPromises);

        return res.status(200).json({ 
            success: true, 
            message: "Images uploaded and optimized successfully!",
            data: uploadResults
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Please reduce images sizes"
        });
    }
};

module.exports = uploadImages;
