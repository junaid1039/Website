const uploadImage = (req, res) => {
    // Log the files and body to debug
    console.log(req.files, "files");
    console.log(req.body, "body");

    if (!req.files || req.files.length === 0) {
        return res.status(400).json({ success: false, message: 'No files uploaded' });
    }

    const imageUrls = req.files.map(file => `http://localhost:5000/images/${file.filename}`);

    res.json({
        success: true,
        image_urls: imageUrls // Return an array of image URLs
    });
};

module.exports = { uploadImage };
