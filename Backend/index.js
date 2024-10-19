const express = require('express');
const cors = require('cors');
const connectDB = require('./components/config/db'); // MongoDB connection
const path = require('path');
const Routes = require('./components/routes/routes'); // Importing routes
require('dotenv').config(); // Load environment variables
const cloudinary = require('cloudinary');
const bodyparser = require('body-parser');
const fileupload = require('express-fileupload');


const app = express();
const port = process.env.PORT || 5008;

connectDB();
app.use(express.json());
app.use(cors());
app.use(bodyparser.urlencoded({extended: true}));
app.use(fileupload());

//cloudinary.config({
//    cloud_name : process.env.CLOUD_NAME,
//    api_key : process.env.API_KEY,
//    api_secret: process.evn.API_SECRET,
//});


app.use('/', Routes);   // Using routes


app.listen(port, (err) => {
    if (!err) {
        console.log("Server is running on " + port);
    } else {
        console.log('Error: ' + err);
    }
});
