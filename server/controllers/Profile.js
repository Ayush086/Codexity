// handlers related to profile schema are defined here
const mongoose = require('mongoose');
const Profile = require('../models/Profile');
const CourseProgress = require('../models/CourseProgress');
const User = require('../models/User');
const Course = require('../models/Course');

const { uploadImageToCloudinary } = require('../utils/imageUploader')
const { convertSecondsToDuration } = require('../utils/secToDuration')


// update profile
exports.updateProfile = async (req, res) => {
    try {

        // fetch data
        const {
            firstName = "",
            lastName = "",
            dateOfBirth = "",
            about = "",
            contactNumber = "",
            gender = "",
        } = req.body;

        // fetch userId from token(decode->payload)
        const userId = req.user.id;

        // find profile
        const userDetails = await User.findById(userId);
        const profile = await Profile.findById(userDetails.additionalDetails)

        // update profile data
        const user = await User.findByIdAndUpdate(userId, {
            firstName,
            lastName
        })
        await user.save();

        // update other fields
        profile.dateOfBirth = dateOfBirth
        profile.about = about
        profile.contactNumber = contactNumber
        profile.gender = gender

        // save updates
        await profile.save();

        // Find the updated user details
        const updatedUserDetails = await User.findById(userId)
            .populate("additionalDetails")
            .exec()

        return res.json({
            success: true,
            message: "Profile updated successfully",
            updatedUserDetails,
        })

    } catch (error) {
        console.log("error occurred during prfile updation (Profile.js) ");
        console.log(error);
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};



// NOTE: I want to schedule this request to ensure that it's not a mistake by user
// delete account
exports.deleteAccount = async (req, res) => {
    try {

        // get id
        // console.log("printing id from deleteAccount handler: ", req.user.id);
        const id = req.user.id;

        // validation
        const userDetails = await User.findById({ _id: id });
        if (!userDetails) {
            return res.staus(404).json({
                success: false,
                message: 'user not found'
            });
        }

        // NOTE: since account deleted then courses related to his account also disbanded so enrol count must be decreased 
        // make db changes
        // delete associated profile details
        await Profile.findByIdAndDelete({
            _id: new mongoose.Types.ObjectId(userDetails.additionalDetails),
        });
        for (const courseId of userDetails.courses) {
            await Course.findByIdAndUpdate(
                courseId,
                { $pull: { studentsEnrolled: id } },
                { new: true }
            )
        }

        // user delete
        await User.findByIdAndDelete({ _id: id });


        // return response
        return res.status(200).json({
            success: true,
            message: "account deletion successful"
        })
        // await CourseProgress.deleteMany({ userId: id })

    } catch (error) {
        console.log("error occurred while deleting account (Profile.js) ");
        console.log(error.message);
        return res.status(500).json({
            success: false,
            message: "account deletion failed",
            error: error.message
        });
    }
};



// get all details
exports.getAllUserDetails = async (req, res) => {
    try {

        // get id
        const id = req.user.id;

        // make db call
        const userDetails = await User.findById(id).populate('additionalDetails').exec();

        console.log("User Details: ", userDetails);

        // return response
        return res.status(200).json({
            success: true,
            message: "details fetched successfully",
            data: userDetails,
        });

    } catch (error) {
        console.log("error occurred while fetching account details (Profile.js) ");
        console.log(error.message);
        return res.status(500).json({
            success: false,
            message: "details fetching failed",
            error: error.message
        });
    }
};


// get user's all enrolled courses
exports.getEnrolledCourses = async (req, res) => {
    try {
        const userId = req.user.id;
        let userDetails = await User.findOne({
            _id: userId,
        }).populate({
            path: 'courses',
            populate: {
                path: 'courseContent',
                populate: {
                    path: 'subSection'
                },
            },
        })
            .exec()

        // course progress calculation
        userDetails = userDetails.toObject();
        let SubsectionLength = 0
        for (let i = 0; i < userDetails.courses.length; i++) {
            let totalDurationInSeconds = 0
            SubsectionLength = 0;

            for (let j = 0; j < userDetails.courses[i].courseContent.length; j++) {
                totalDurationInSeconds += userDetails.courses[i].courseContent[j].subSection.reduce((acc, curr) => acc + parseInt(curr.timeDuration), 0)
                userDetails.courses[i].totalDuration = convertSecondsToDuration(totalDurationInSeconds)
                SubsectionLength += userDetails.courses[i].courseContent[j].subSection.length
            }

            let courseProgressCount = await CourseProgress.findOne({
                courseID: userDetails.courses[i]._id,
                userId: userId,
            })
            
            courseProgressCount = courseProgressCount?.completedVideos.length

            if (SubsectionLength === 0) {
                userDetails.courses[i].progressPercentage = 100
            } else {
                // To make it up to 2 decimal point
                const multiplier = Math.pow(10, 2)
                userDetails.courses[i].progressPercentage =
                    Math.round(
                        (courseProgressCount / SubsectionLength) * 100 * multiplier
                    ) / multiplier
            }
        }

        if (!userDetails) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            })
        }

        return res.status(200).json({
            success: true,
            data: userDetails.courses,
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
};



// update profile picture
exports.updateDisplayPicture = async (req, res) => {
    try {
        const displayPicture = req.files.displayPicture
        const userId = req.user.id
        const image = await uploadImageToCloudinary(
            displayPicture,
            process.env.FOLDER_NAME,
            1000,
            1000
        )
        console.log(image)
        const updatedProfile = await User.findByIdAndUpdate(
            { _id: userId },
            { image: image.secure_url },
            { new: true }
        )
        res.send({
            success: true,
            message: `Image Updated successfully`,
            data: updatedProfile,
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        })
    }
}


exports.instructorDashboard = async (req, res) => {
    try {
        const courseDetails = await Course.find({ instructor: req.user.id })

        const courseData = courseDetails.map((course) => {
            const totalStudentsEnrolled = course.studentsEnrolled.length
            const totalAmountGenerated = totalStudentsEnrolled * course.price

            // Create a new object with the additional fields
            const courseDataWithStats = {
                _id: course._id,
                courseName: course.courseName,
                courseDescription: course.courseDescription,
                totalStudentsEnrolled,
                totalAmountGenerated,
            }

            return courseDataWithStats
        })

        res.status(200).json({ 
            success: true,
            courses: courseData
        })

    } catch (error) {
        console.error(error)
        res.status(500).json({ 
            success: false,
            message: "Internal Server Error" 
        })
    }
}