
const express = require('express');
const router = express.Router();

// import course controllers
const {
    createCourse,
    getAllCourses,
    getCourseDetails,
    getFullCourseDetails,
    editCourse,
    getInstructorCourses,
    deleteCourse,
} = require('../controllers/Course');

// import category controlloers 
const {
    showAllCategories,
    createCategory,
    categoryPageDetails
} = require('../controllers/Category');

// import section controllers
const {
    createSection,
    updateSection,
    deleteSection
} = require('../controllers/Section');

// import sub-section controllers
const {
    createSubSection,
    updateSubSection,
    deleteSubSection,
} = require('../controllers/Subsection');

// import ratings and reviews controllers
const {
    createRating,
    getAverageRating,
    getAllRating,
    getCourseRatings
} = require('../controllers/RatingAndReview');

// course progress controllers
const {
    updateCourseProgress
} = require('../controllers/CourseProgress');

// middlewares
const { auth, isInstructor, isAdmin, isStudent } = require('../middlewares/auth');

// *****************************************************************************************************************************************************************************
//                                                                  COURSE ROUTES                        
// *****************************************************************************************************************************************************************************

// NEW COURSE CREATION
// course can be created by only instructor
router.post('/createCourse', auth, isInstructor, createCourse);

// SECTION
// add section to new course
router.post('/addSection', auth, isInstructor, createSection);
// update existing section
router.post('/updateSection', auth, isInstructor, updateSection);
// delete existing section
router.post('/deleteSection', auth, isInstructor, deleteSection);

// SUB-SECTION
// add sub section to a section
router.post('/addSubSection', auth, isInstructor, createSubSection);
// edit sub section
router.post('/updateSubSection', auth, isInstructor, updateSubSection);
// delete sub section
router.post('/deleteSubSection', auth, isInstructor, deleteSubSection);


// get all registered courses
router.get('/getAllCourses', getAllCourses);
// get details for specific course
router.post('/getCourseDetails', getCourseDetails);
// Get Details for a Specific Courses
router.post("/getFullCourseDetails", auth, getFullCourseDetails)
// Edit Course routes
router.post("/editCourse", auth, isInstructor, editCourse)
// Get all Courses Under a Specific Instructor
router.get("/getInstructorCourses", auth, isInstructor, getInstructorCourses)
// Delete a Course
router.delete("/deleteCourse", deleteCourse)



// *************************************************************************************************************************************************************************
//                                                                  CATEGORY ROUTES                        
// *************************************************************************************************************************************************************************
// handled only by admin
router.post('/createCategory', auth, isAdmin, createCategory);
router.get('/showAllCategories', showAllCategories);
router.post('/getCategoryPageDetails', categoryPageDetails);

router.post('/getCourseDetails', getCourseDetails);
router.get('/getAllCourses', getAllCourses);





// *****************************************************************************************************************************************************************************
//                                                                  RATING AND REVIEW                         
// *****************************************************************************************************************************************************************************
router.post('/createRating', auth, isStudent, createRating);
router.get('/getAverageRating', getAverageRating);
router.get('/getReviews', getAllRating);
// router.get('/getCourseRating', getCourseRatings);


// *****************************************************************************************************************************************************************************
//                                                                 COURSE PROGRESS                      
// ***************************************************************
// Update Course Progress
router.post("/updateCourseProgress", auth, isStudent, updateCourseProgress);


module.exports = router;