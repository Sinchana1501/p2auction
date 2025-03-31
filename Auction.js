const mongoose = require("mongoose");

const AuctionSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, "Please enter title"],  // Corrected message format
    },
    description: {
        type: String,
        required: [true, "Please enter description"],  // Improved message
    },
    link: {
        type: String,
        required: false,  
    },
    img: {
        type: String,  // Assuming image URL as a string
    },
});

const AuctionModel = mongoose.model("Auction", AuctionSchema);
module.exports = AuctionModel;
