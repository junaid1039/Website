const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Define the path for the uploads directory
const uploadPath = path.join(__dirname, '../uploads');

// Ensure the uploads directory exists
if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath, { recursive: true });
}

// Set up storage using multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadPath); // Use the defined path
    },
    filename: (req, file, cb) => {
        cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`); // File naming convention
    }
});

// Initialize multer with the storage configuration
const upload = multer({ storage: storage });

// Export the multer instance
module.exports = upload;
