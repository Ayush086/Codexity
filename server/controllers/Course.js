// course related handlers: create new course and fetch existing course

const Course = require('../models/Course');
const Category = require('../models/Category');
const Section = require('../models/Section')
const SubSection = require('../models/SubSection')
const User = require('../models/User');
const CourseProgress = require('../models/CourseProgress')

const { uploadImageToCloudinary } = require('../utils/imageUploader');
const { convertSecondsToDuration } = require('../utils/secToDuration');

// create course
exports.createCourse = async (req, res) => {
    try {
        const userId = req.user.id;
        // fetch data
        console.log(req.body);
        let { courseName, courseDescription, whatYouWillLearn, price, tag: _tag, category, status, instructions: _instructions } = req.body;

        // get thumbnail
        console.log("files: ", req.files);
        const thumbnail = req.files?.thumbnailImage;

        // validate thumbnail
        if (!thumbnail) {
          return res.status(400).json({
              success: false,
              message: "Thumbnail image is required."
          });
      }

      const tag = JSON.parse(_tag);
      const instructions = JSON.parse(_instructions);

      console.log("tag", tag)
      console.log('instructions', instructions)
      

        // validation
        // empty check
        if (!courseName || !courseDescription || !whatYouWillLearn || !price || !tag.length || !category || !thumbnail || !instructions.length) {
            return res.status(400).json({
                success: false,
                message: "all fields are required. please check your input"
            });
        }

        if(!status || status === undefined) {
            status = "Draft";
        }

        // check isInstructor (it's required because we need to save instructor's details in course model)
        // NOTE: verify that useId ==/!= instructorDetails._id 
        
        const instructorDetails = await User.findById(userId, {accountType: "Instructor"});
        console.log("Instructor Details: ", instructorDetails);

        if (!instructorDetails) {
            return res.status(404).json({
                success: false,
                message: "Instructor Details Not Found",
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
            courseDescription,
            instructor: instructorDetails._id,
            whatYouWillLearn: whatYouWillLearn,
            price,
            tag,
            category: categoryDetails._id,
            thumbnail: thumbnailImage.secure_url,
            status: status,
            instructions
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
            { _id: category },
            {
                $push: { courses: newCourse._id },
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
        console.log('error occurred in course creation (Course.js)');
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Failed to create new course",
            error: error.message,
        })
    }
};


// edit existed course
exports.editCourse = async (req, res) => {
    try {
      const { courseId } = req.body
      const updates = req.body
      const course = await Course.findById(courseId)
  
      if (!course) {
        return res.status(404).json({ error: "Course not found" })
      }
  
      // If Thumbnail Image is found, update it
      if (req.files) {
        console.log("thumbnail update")
        const thumbnail = req.files.thumbnailImage
        const thumbnailImage = await uploadImageToCloudinary(
          thumbnail,
          process.env.FOLDER_NAME
        )
        course.thumbnail = thumbnailImage.secure_url
      }
  
      // Update only the fields that are present in the request body
      for (const key in updates) {
        if (updates.hasOwnProperty(key)) {
          if (key === "tag" || key === "instructions") {
            course[key] = JSON.parse(updates[key])
          } else {
            course[key] = updates[key]
          }
        }
      }
  
      await course.save()
  
      const updatedCourse = await Course.findOne({
        _id: courseId,
      })
        .populate({
          path: "instructor",
          populate: {
            path: "additionalDetails",
          },
        })
        .populate("category")
        .populate("ratingAndReviews")
        .populate({
          path: "courseContent",
          populate: {
            path: "subSection",
          },
        })
        .exec()
  
      res.json({
        success: true,
        message: "Course updated successfully",
        data: updatedCourse,
      })
    } catch (error) {
      console.log("error occurred while updating course (Course.js)")
      console.error(error)
      res.status(500).json({
        success: false,
        message: "Internal server error",
        error: error.message,
      })
    }
  }


// fetch all courses
exports.getAllCourses = async (req, res) => {
    try {

        // fetch data
        // NOTE: need of true parts ?
        const allCourses = await Course.find({ status: "Published"}, {
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
            message: "Failed to fetch Course Data",
            error: error.message,
        });
    }
};



// get single course details
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
                    select: '-videoUrl',
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

        let totalDuration = 0;
        courseDetails.courseContent.forEach((content) => {
            content.subSection.forEach((subSection) => {
                const timeDuration = parseInt(subSection.timeDuration);
                totalDuration += timeDuration;
            })
        })

        const totalDurationInSeconds = convertSecondsToDuration(totalDuration);

        // return response
        return res.status(200).json({
            success: true,
            message: 'course details fetched successfully ',
            data: {courseDetails, totalDurationInSeconds}
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

exports.getFullCourseDetails = async (req, res) => {
    try {
      const { courseId } = req.body
      const userId = req.user.id
      const courseDetails = await Course.findOne({
        _id: courseId,
      })
        .populate({
          path: "instructor",
          populate: {
            path: "additionalDetails",
          },
        })
        .populate("category")
        .populate("ratingAndReviews")
        .populate({
          path: "courseContent",
          populate: {
            path: "subSection",
          },
        })
        .exec()
  
      let courseProgressCount = await CourseProgress.findOne({
        courseID: courseId,
        userId: userId,
      })
  
      console.log("courseProgressCount : ", courseProgressCount)
  
      if (!courseDetails) {
        return res.status(400).json({
          success: false,
          message: `Could not find course with id: ${courseId}`,
        })
      }

      let totalDurationInSeconds = 0
    courseDetails.courseContent.forEach((content) => {
      content.subSection.forEach((subSection) => {
        const timeDurationInSeconds = parseInt(subSection.timeDuration)
        totalDurationInSeconds += timeDurationInSeconds
      })
    })

    const totalDuration = convertSecondsToDuration(totalDurationInSeconds)

    return res.status(200).json({
      success: true,
      data: {
        courseDetails,
        totalDuration,
        completedVideos: courseProgressCount?.completedVideos
          ? courseProgressCount?.completedVideos
          : [],
      },
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}


// instructor specific courses
exports.getInstructorCourses = async (req, res) => {
    try {
      // Get the instructor ID from the authenticated user or request body
      const instructorId = req.user.id
  
      // Find all courses belonging to the instructor
      const instructorCourses = await Course.find({
        instructor: instructorId,
      }).sort({ createdAt: -1 })
  
      // Return the instructor's courses
      res.status(200).json({
        success: true,
        data: instructorCourses,
      })
    } catch (error) {
      console.error(error)
      res.status(500).json({
        success: false,
        message: "Failed to retrieve instructor courses",
        error: error.message,
      })
    }
}


// delete course
exports.deleteCourse = async (req, res) => {
    try {
      const { courseId } = req.body
  
      // Find the course
      const course = await Course.findById(courseId)
      if (!course) {
        return res.status(404).json({ message: "Course not found" })
      }
  
      // Unenroll students from the course
      const studentsEnrolled = course.studentsEnrolled
      for (const studentId of studentsEnrolled) {
        await User.findByIdAndUpdate(studentId, {
          $pull: { courses: courseId },
        })
      }
  
      // Delete sections and sub-sections
      const courseSections = course.courseContent
      for (const sectionId of courseSections) {
        // Delete sub-sections of the section
        const section = await Section.findById(sectionId)
        if (section) {
          const subSections = section.subSection
          for (const subSectionId of subSections) {
            await SubSection.findByIdAndDelete(subSectionId)
          }
        }
  
        // Delete the section
        await Section.findByIdAndDelete(sectionId)
      }
  
      // Delete the course
      await Course.findByIdAndDelete(courseId)
  
      return res.status(200).json({
        success: true,
        message: "Course deleted successfully",
      })
    } catch (error) {
      console.error(error)
      return res.status(500).json({
        success: false,
        message: "Server error",
        error: error.message,
      })
    }
  }