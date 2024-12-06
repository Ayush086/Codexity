// ratings and reviews controllers

const RatingAndReview = require('../models/RatingAndReview');
const Course = require('../models/Course');
const mongoose = require('mongoose');

// create rating/review
exports.createRating = async (req, res) => {
    try {

        // fetch data
        const { rating, review, courseId } = req.body;

        // get user id
        const userId = req.user.id;

        // validation:  
        // check student enrolment
        const courseDetails = await Course.findOne({ _id: courseId, studentsEnrolled: { $elementMatch: { $eq: userId } } });

        if (!courseDetails) {
            return res.status(404).json({
                success: false,
                message: 'student not enrolled in course',
            });
        }

        // check already reviewed
        const alreadyReviewed = await RatingAndReview.findOne({ user: userId, course: courseId });
        if (alreadyReviewed) {
            return res.status(403).json({
                success: false,
                message: "already reviewed",
            });
        }

        // update changes in db: ratingandreview, course
        const ratingAndReview = await RatingAndReview.create({ rating, review, course: courseId, user: userId });
        await Course.findByIdAndUpdate( {_id: courseId}, { $push: { ratingAndReviews: ratingAndReview._id } }, { new: true });

        // return response
        return res.status(200).json({
            success: true,
            message: "new rating and review added successfully",
            data: ratingAndReview,
        });


    } catch (error) {
        console.log('error occurred while creating new rating and review');
        console.log(error.message);
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}

// find average rating
exports.getAverageRating = async(req, res) => {
    try {

        // get data:  courseId
        const courseId = req.body.courseId;

        // calculate average of all ratings per course
        const result = await RatingAndReview.aggregate([
            {
                $match: { 
                    course: new mongoose.Types.ObjectId(courseId) 
                },
            },
            {
                $group: {
                    _id: null,
                    averageRating: {$avg: "$rating"},
                }
            }
        ]);

        // return response
        if(result.length > 0) {
            return res.status(200).json({
                success: true,
                message: "average rating calculated successfully",
                averageRating: result[0].averageRating,
            });
        }

        // if no reviews exist
        return res.status(200).json({
            success: true,
            message: "no ratings exist for this course",
            averageRating: 0,
        });
        
    } catch (error) {
        console.log('error occurred while calculating ratings avg');
        console.log(error.message);
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};



// get all ratings/reviews
exports.getAllRating = async(req, res) => {
    try {
        // make db call
        const allRatings = await RatingAndReview.find({})
        .sort({rating: 'desc'})
        .populate({
            path: 'user',
            select: "firstName lastName email image",
        })
        .populate({
            path: 'course',
            select: 'courseName'
        })
        .exec();

        // return response
        return res.status(200).json({
            success: true,
            message: "fetched all reviews",
            data: allRatings
        });
        
    } catch (error) {
        console.log('error occurred while fetching all ratings');
        console.log(error.message);
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};



// get all course specific ratings and reviews (need to be reviewed)
// exports.getCourseRatings = async(req, res) => {
//     try {

//         // get course id
//         const {courseId} = req.body;

//         // validation
//         if(!courseId){
//             return res.status(404).json({
//                 success: false,
//                 message: "course not found",
//             });
//         }

//         // fetch data using db call, sort and populate fields
//         const courseSpecificRatings = await RatingAndReview.find({course:courseId})
//         .sort({rating: 'desc'})
//         .populate('user')
//         .exec();

        
//         // return response
//         return res.status(200).json({
//             success: true,
//             message: "ratings and reviews fetched successfully",
//             data: courseSpecificRatings,
//         });
        
//     } catch (error) {
//         console.log('error occurred while fetching ratings');
//         console.log(error.message);
//         return res.status(500).json({
//             success: false,
//             message: error.message,
//         });
//     }
// }