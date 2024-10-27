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
app.use(cors({
    origin: 'http://localhost:5173', // Allow only your frontend origin
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Adjust methods as needed
    credentials: true // Allow credentials (cookies, etc.), if needed
}));
app.use(express.json()); // Parse JSON bodies

// Using routes
app.use('/', Routes);

app.listen(port, (err) => {
    if (!err) {
        console.log("Server is running on " + port);
    } else {
        console.log('Error: ' + err);
    }
});
