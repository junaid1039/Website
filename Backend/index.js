const express = require('express');
const cors = require('cors');
const connectDB = require('./components/config/db'); // MongoDB connection
const Routes = require('./components/routes/routes'); // Importing routes
require('dotenv').config(); // Load environment variables

const app = express();
const port = process.env.PORT || 5008;

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors()); // Enable CORS
app.use(express.json()); // Parse JSON bodies

// Multer for file uploads
//const multer = require('multer');
//const storage = multer.memoryStorage();
//const upload = multer({ storage });
//app.use(upload.any()); // This allows for file uploads; it might be a better option than express-fileupload if you are using multer
// Using routes
app.use('/', Routes);

app.listen(port, (err) => {
    if (!err) {
        console.log("Server is running on " + port);
    } else {
        console.log('Error: ' + err);
    }
});
