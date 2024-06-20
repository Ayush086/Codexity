// course related handlers: create new course and fetch existing course

const Course = require('../models/Course');
const Category = require('../models/Category');
const User = require('../models/User');
const { uploadImageToCloudinary } = require('../utils/imageUploader');

// create course
exports.createCourse = async (req, res) => {
    try {

        // fetch data
        const { courseName, description, whatYouWillLearn, price, category } = req.body;

        // get thumbnail
        const thumbnail = req.files.thumbnailImage;

        // validation
        // empty check
        if (!courseName || !description || !whatYouWillLearn || !price || !category || !thumbnail) {
            return res.status(400).json({
                success: false,
                message: "all fields are required. please check your input"
            });
        }

        // check isInstructor (it's required because we need to save instructor's details in course model)
        // NOTE: verify that useId ==/!= instructorDetails._id 
        const userId = req.user.id; // since it's stored in payload
        const instructorDetails = await User.findById(userId);
        console.log("Instructor Details: ", instructorDetails);

        if (!instructorDetails) {
            return res.status(404).json({
                success: false,
                message: "instructor details not found",
            });
        }

        // check category is valid?
        const categoryDetails = await Category.findById(category);
        if (!categoryDetails) {
            return res.status(404).json({
                success: false,
                message: "category details not found",
            });
        }

        // upload image to cloudinary
        const thumbnailImage = await uploadImageToCloudinary(thumbnail, process.env.FOLDER_NAME);

        // create new course entry in db
        const newCourse = await Course.create({
            courseName,
            description,
            instructor: instructorDetails._id,
            whatYouWillLearn,
            price,
            category: categoryDetails._id,
            thumbnail: thumbnailImage.secure_url,
        });

        // update instructor's course list
        await User.findByIdAndUpdate(
            { _id: instructorDetails._id },
            {
                $push: { courses: newCourse._id },
            },
            { new: true },
        );

        // update category schema
        await Category.findByIdAndUpdate(
            { _id: categoryDetails._id },
            {
                $push: { course: newCourse._id },
            },
            { new: true },
        );

        // return response
        return res.status(200).json({
            success: true,
            message: "new course created successfully",
            data: newCourse,
        });

    } catch (error) {
        console.log('error occurred in course creation (Couse.js)');
        console.log(error);
        return res.status(500).json({
            success: false,
            message: error.message,
        })
    }
};


// fetch all courses
exports.getAllCourses = async (req, res) => {
    try {

        // fetch data
        // NOTE: need of true parts ?
        const allCourses = await Course.find({}, {
            courseName: true,
            price: true,
            thumbnail: true,
            category: true,
            instructor: true,
            ratingAndReviews: true,
            studentsEnrolled: true,
        }).populate("instructor").exec();

        // return response
        return res.status(200).json({
            success: true,
            message: "all courses fetched successfully",
            data: allCourses,
        })

    } catch (error) {
        console.log("error occured while fetching courses (Course.js)");
        console.log(error);
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};



// get course details
exports.getCourseDetails = async (req, res) => {
    try {
        // fetch data
        const { courseId } = req.body;

        const courseDetails = await Course.find({ _id: courseId })
            .populate({
                path: "instructor",
                populate: {
                    path: 'additionalDetails',
                },
            })
            .populate('category')
            .populate('ratingAndReviews')
            .populate({
                path: 'courseContent',
                populate: {
                    path: 'subSection',
                },
            })
            .exec();

        // validation
        if (!courseDetails) {
            return res.status(400).json({
                success: false,
                message: `course with id:${courseId} doesn't exist`
            });
        }

        // return response
        return res.status(200).json({
            success: true,
            message: 'course details fetched successfully ',
            data: courseDetails,
        });

    } catch (error) {
        console.log("error occurred while fetching course details (Course.js) ");
        console.log(error.message);
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
