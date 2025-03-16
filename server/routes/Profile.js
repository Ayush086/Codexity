
const express = require('express');
const router = express.Router();

const {
    deleteAccount,
    updateProfile, 
    getAllUserDetails,
    updateDisplayPicture, 
    getEnrolledCourses,
    instructorDashboard, 
} = require('../controllers/Profile');

const {auth, isInstructor} = require('../middlewares/auth');


// ******************************************************************************************************
//                                     PROFILE ROUTES
// ******************************************************************************************************
// update profile
router.put('/updateProfile', auth, updateProfile);
// delete account
router.delete('/deleteAccount', auth, deleteAccount);
// get whole details
router.get('/getUserDetails', auth, getAllUserDetails);

// get enrolled courses
router.get('/getEnrolledCourses', auth, getEnrolledCourses);
router.put("/updateDisplayPicture", auth, updateDisplayPicture)
router.get("/instructorDashboard", auth, isInstructor, instructorDashboard)

module.exports = router;