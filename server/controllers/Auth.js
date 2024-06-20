// authentication


const User = require('../models/User');
const Profile = require('../models/Profile')
const OTP = require('../models/OTP');
const otpGenerator = require('otp-generator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mailSender = require('../utils/mailSender');
const {passwordUpdated} = require('../mail/templates/passwordUpdate')

require('dotenv').config();


// sendOTP
exports.sendOTP = async (req, res) => {
    try {

        // fetch email to send mail
        const {email} = req.body;

        // check if already exist or not
        const doesExist = await User.findOne({email});
        if(doesExist){
            return res.status(401).json({
                success: false,
                message: "User with given email already exist"
            })
        }

        // generate otp and save it in db
        let otp = otpGenerator.generate(6, {
            upperCaseAlphabets:false,
            lowerCaseAlphabets:false,
            specialChars: false,
        });
        console.log("generated OTP: ", otp);

        // generated otp must be unique, check unique
        let otpCheck = await OTP.findOne({otp: otp});

        while(otpCheck){
            otp = otpGenerator.generate(6, {
                upperCaseAlphabets:false,
                lowerCaseAlphabets:false,
                specialChars: false,
            });

            otpCheck = await OTP.findOne({otp: otp});
        }
// above code is brute force must be optimized: repeatitive db calls can affects the performance, use such library which always generates unique otp 

        // create and insert entry into db
        const otpPayload = new OTP({otp, email});

        const otpBody = await OTP.create(otpPayload);
        console.log('otp entry inserted into db');
        console.log("otp payload: ", otpBody);

        return res.status(200).json({
            sucess:true,
            message: "OTP sent successfully!",
            otp
        })

    } catch (error) {
        console.log("error occurred while sending otp (Auth.js) ");
        console.log(error);
        return res.status(500).json({
            success:false,
            message: error.message,
        })
    }
};


// signUp
exports.signUp = async (req, res) => {
    try {
        // fetch data
        const {firstName, lastName, email, password, confirmPassword, accountType, contactNumber, otp} = req.body;

        // validation
        if(!firstName || !lastName || !email || !password || !confirmPassword || !otp ) {
            return res.status(403).json({
                success: false,
                message: "all fields are required"
            })
        }

        // password match check (pass, confirm pass)
        if( password !== confirmPassword) {
            return res.status(400).json({
                success: false,
                message: "password doesn't match with confirm password"
            });
        }

        // already exist check
        const existingUser = await User.findOne({email});
        if(existingUser){
            return res.status(400).json({
                success: false,
                message: "email already registered"
            });
        }

        // otp cross check and validate it
        const recentOtp = await OTP.find({email}).sort({createdAt:-1}).limit(1); // recent most otp fetched
        if(recentOtp.length === 0 || recentOtp[0].otp !== otp) {
            return res.status(400).json({
                success: false,
                message: "invalid OTP"
            });
        }

        // hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // create user
        let approved = '';
        approved === "Instructor" ? (approved = false) : (approved = true);

        // create entry in db
        const profileDetails = await Profile.create({
            gender: null,
            dateOfBirth: null,
            about: null,
            contactNumber: null,
        })

        const user = await User.create({
            firstName,
            lastName,
            email,
            password:hashedPassword,
            accountType:accountType,
            approved: approved,
            contactNumber,
            additionalDetails:profileDetails._id,
            image: `https://api.dicebear.com/5.x/initials/svg?seed=${firstName} ${lastName}`
        })

        // return response
        return res.status(200).json({
            success:true,
            message: 'user registration successful',
            user,
        });

    } catch (error) {
        console.log('error occurred during signing up (signUp.js)')
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "user registration failed. Please try again"
        });
    }
}



// login
exports.login = async (req, res) => {
    try {
        // fetch data
        const {email, password} = req.body;

        // validation
        if(!email || !password){
            return res.status(403).json({
                success: false,
                message: "all fields are required"
            });
        } 

        // check user exist
        const user = await User.findOne({email}).populate("additionalDetails");
        // if user doesn't exist
        if(!user) {
            return res.status(401).json({
                success: false,
                message: "email is not registered"
            });
        }

        // password match check
        if(await bcrypt.compare(password, user.password)) {
            const payload = {
                email: user.email,
                id: user._id,
                accountType: user.accountType,
            }
            // jwt generate
            const token = jwt.sign(payload, process.env.JWT_SECRET, {
                expiresIn: "2h",
            });
            user.token = token;
            user.password = undefined;


            // generate cookie
            const options = {
                expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
                httpOnly: true,
            }

            // return response
            res.cookie('token', token, options).status(200).json({
                success: true,
                message: "logged in successfully",
                token,
                user,
            });
        }
        else {
            return res.status(401).json({
                success: false,
                message: "incorrect password"
            })
        }

    } catch (error) {
        console.log("error occurred while logging in (Auth.js)");
        console.log(error);
        return res.status(500).json({
            success: false,
            message: 'login failed. try again',
        })
    }
}

// changePassword
exports.changePassword = async (req, res) => {
    try {
        // fetch data: oldPassword, newPassword, confirm newPassword
        const {oldPassword, newPassword, confirmPassword, email} = req.body;

        // validaion: empty check, pass = confirm pass, old password check
        if(!oldPassword || !newPassword || !confirmPassword){
            return res.status(403).json({
                success: false,
                message: "all fields are required. check input"
            });
        }

        if(newPassword !== confirmPassword) {
            return res.status(401).json({
                success: false,
                message: "check your password and try again"
            });
        }

        // user existence check
        const existingUser = await User.findOne({email});
        
        if(!existingUser){
            return res.status(400).json({
                success: false,
                message: "user not found"
            });
        }

        // old password validation
        const isValidPassword = await bcrypt.compare(oldPassword, existingUser.password);
        if(!isValidPassword){
            return res.status(400).json({
                success: false,
                message: "old password is incorrect",
            });
        }

        // password update in db
        const newHashedPassword = await bcrypt.hash(newPassword, 10);

        await User.findOneAndUpdate(
            {email},
            {password: newHashedPassword},
            {new: true},
        );

        // send mail: password update
        await mailSender(email, "Password Changed", "Your password updated successfully");

        // return res
        return res.status(200).json({
            success: true,
            message: "password changed successfully"
        });

    } catch (error) {
        console.log('error occurred while changing the password (Auth.js)');
        console.log(error);
        return res.status(500).json({
            success: false,
            message: error.message,
        })
    }
}
