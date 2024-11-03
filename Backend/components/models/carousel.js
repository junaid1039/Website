const mongoose = require('mongoose');
const carouselSchema = new mongoose.Schema({
    carousel: {type: String,  required: true},
    linkto: {type: String, required: false}
})

module.exports = mongoose.model('carousel', carouselSchema);