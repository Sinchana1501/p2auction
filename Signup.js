const mongoose = require("mongoose")
const SignupSchema = new mongoose.Schema({
    fname: {
        type: String,
        required: true,
    },
    lname: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    dob: {
        type: Date,
        required: true,
    },
    rollNo: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    college: {
        type: String,
        required: true,
        trim: true,
    },
});
    

const SignupModel = mongoose.model("Signup", SignupSchema)
module.exports = SignupModel

