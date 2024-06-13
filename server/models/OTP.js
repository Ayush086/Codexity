// otp schema

const mongoose = require('mongoose');
const mailSender = require('../utils/mailSender');

const OTPSchema = new mongoose.Schema({
    email: {
        type: String,
        trim:true,
        required: true,
    },
    otp: {
        type: String,
        trim:true,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now(),
        expires: 5 * 60,
    },
});

// to send otp mail to new user
async function sendVerificationEmail(email, otp){
    try {
        const mailResponse = await mailSender(email, "Verification email from Codexity", otp);
        console.log('otp mail successfully', mailResponse);

    } catch (error) {
        console.log('error occurred in OTP.JS');
        console.error(error); 
    }
}
f
// pre save middleware to ensure otp mail sent before creating entry in db
OTPSchema.pre('save', async function(next) {
    await sendVerificationEmail(this.email, this.otp);
    next();
})

module.exports = mongoose.model("OTP", OTPSchema);
