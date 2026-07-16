const mongoose = require("mongoose");

const SigninSchema = new mongoose.Schema({
    rollNo: {
        type: String,
        required: true,
        trim: true,
    },
    password: {
        type: String,
        required: true,
    },
});

const SigninModel = mongoose.model("Signin", SigninSchema);
module.exports = SigninModel;
