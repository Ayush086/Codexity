// password reset
const User = require('../models/User');
const mailSender = require('../utils/mailSender');
const bcrypt = require('bcrypt');
const crypto = require('crypto');


// password reset token (to generate token to identify user)
exports.resetPasswordToken = async (req, res) => {
    try {
        // fetch data: email
        const email = req.body.email;

        // validate email
        const user = await User.findOne({email: email});
        if(!user){
            return res.status(400).josn({
                success: false,
                message: "invalid email",
            });
        }

        // generate token
        const token = crypto.randomBytes(20).toString('hex'); 

        // update User: token, expiration time
        const updatedDetails = await User.findOneAndUpdate(
                                            {email: email},
                                            {
                                                token: token,
                                                resetPasswordExpires: Date.now() + 3600000,
                                            },
                                            {new: true});

        console.log("Updated Details: ", updatedDetails);

        // create url
        const url = `https://localhost:3000/update-password/${token}`

        // send main containing url
        await mailSender(email, "Password Reset Link", `Your Link for email verification is ${url}. Please click this url to reset you password`);

        // return response
        return res.json({
            success: true,
            message: "password reset email sent successfully"
        });

    } catch (error) {
        console.log("error occurred in password reset (resetPassword.js) ")
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "something went wrong during password reset",
            error: error.message
        })
    }
}



// reset password in db (update in db)
exports.resetPassword = async(req, res) => {
    try {
        // fetch data
        const {password, confirmPassword, token} = req.body;

        // validation
        if(password !== confirmPassword){
            return res.json({
                success: false,
                message: "password and confirm password doesn't match. check password again"
            });
        }

        // get user by token and update password
        const userDetails = await User.findOne({token: token});

        // if not found: token invalid, expired
        if(!userDetails){
            return res.json({
                success: false,
                message: "invalid token"
            })
        }
        if(userDetails.resetPasswordExpires > Date.now()){
            return res.status(403).json({
                success: false,
                message: "link expired, try again"
            })
        }

        // hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // update password
        await User.findOneAndUpdate(
            {token: token},
            {password: hashedPassword},
            {new: true},
        );

        
        // return response
        return res.status(200).json({
            success: true, 
            message: "password reset successful"
        })

    } catch (error) {
        console.log("error occurred (ResetPassword.js)");
        console.log(error);
        return res.status(500).json({
            success: false,
            mesage: error.mesage,
        })
    }
}
