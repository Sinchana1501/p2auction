const mongoose = require("mongoose");

const BidSchema = new mongoose.Schema({
    bidderRollNo: { type: String, required: true },
    bidderName: { type: String, required: true },
    amount: { type: Number, required: true },
    placedAt: { type: Date, default: Date.now },
});

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
    startingBid: {
        type: Number,
        default: 0,
    },
    currentBid: {
        type: Number,
        default: 0,
    },
    highestBidderName: {
        type: String,
        default: null,
    },
    highestBidderRollNo: {
        type: String,
        default: null,
    },
    sellerRollNo: {
        type: String,
        default: null,
    },
    sellerName: {
        type: String,
        default: null,
    },
    status: {
        type: String,
        enum: ["open", "sold"],
        default: "open",
    },
    soldTo: {
        type: String,
        default: null,
    },
    soldAmount: {
        type: Number,
        default: null,
    },
    soldAt: {
        type: Date,
        default: null,
    },
    bids: {
        type: [BidSchema],
        default: [],
    },
});

const AuctionModel = mongoose.model("Auction", AuctionSchema);
module.exports = AuctionModel;

