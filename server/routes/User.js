// routes for login, signup and authentication
const express = require('express');
const router = express.Router();

const {
       login, 
       signup,
       sendotp,
       changePassword
} = require('../controllers/Auth');

const { 
       resetPasswordToken, 
       resetPassword 
} = require('../controllers/ResetPassword');

const { auth } = require('../middlewares/auth');

// *****************************************************************************************************************************************************************************
//                                                                     AUTHENTICATION ROUTES
// *****************************************************************************************************************************************************************************

// user login
router.post('/login', login);

// user signup
router.post('/signup', signup);

// send otp to user's email
router.post('/sendotp', sendotp);

// change password
router.post('/changepassword', auth, changePassword);


// *****************************************************************************************************************************************************************************
//                                                                    PASSWORD RESET ROUTES
// *****************************************************************************************************************************************************************************

// generate password token route
router.post('/reset-password-token', resetPasswordToken);

// reset password after verification
router.post('/reset-password', resetPassword);

// export to use it in main application 
module.exports = router;