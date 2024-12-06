// payment gateway integration
const mongoose = require('mongoose');
const { instance } = require('../config/razorpay');
const crypto = require('crypto');

const Course = require('../models/Course');
const User = require('../models/User');
const CourseProgress = require('../models/CourseProgress')

const mailSender = require('../utils/mailSender');

// template import
const { courseEnrollmentEmail } = require('../mail/templates/courseEnrollmentEmail');
const { paymentSuccessEmail } = require('../mail/templates/paymentSuccessEmail');

// capture payment and initiate order (payment attempt)
exports.capturePayment = async (req, res) => {
    // get data
    const {courses} = req.body;
    const userId = req.user.id;

    // validation
    if(courses.length === 0) {
        return res.json({
            success: false,
            message: "No courses found. Please provide course Id (Payments.js)"
        })
    }

    // calculate total amount
    let totalAmount = 0;
    for(const course_id of courses){
        let course;
        try {
            // find course
            course = await Course.findByCourseId(course_id);

            // validate
            if(!course){
                return res.status(200).json({
                    success: false,
                    message: `Course not found. CourseId: ${course}`
                })
            }
            
            // check if already enrolled in course
            const uid = new mongoose.Types.ObjectId(userId);
            if(course.studentsEnrolled.includes(uid)){
                return res.status(200).json({
                    success: false,
                    message: "Already enrolled in course"
                })
            }
            totalAmount += course.price

        } catch (error) {
            console.log("error occured while capturing payment (Payments.js)")
            console.log(error)
            return res.status(500).json({
                success: false,
                message: error.message
            })
        }
    }

    // create order
    const options = {
        amount: totalAmount * 100,
        currency: "INR",
        receipt: Math.random(Date.now()).toString(),
    }

    // initiate order
    try {
        const paymentResponse = await instance.orders.create(options);
        console.log("Payment Response: ", paymentResponse)
        res.json({
            success: true,
            data: paymentResponse
        })
    } catch (error) {
        console.log("error occured while initiating order (Payments.js)")
        console.log(error)
        return res.status(500).json({
            success: false,
            message: "could not initiate order"
        })
    }
};

// payment verification
exports.verifyPayment = async(req, res) => {
    const razorpay_orderId = req.body?.razorpay_order_id;
    const razorpay_paymentId = req.body?.razorpay_payment_id;
    const razorpay_signature = req.body?.razorpay_signature;
    const courses = req.body?.courses;
    
    const userId = req.user.id

    // validate
    if(
        !razorpay_orderId ||
        !razorpay_paymentId ||
        !razorpay_signature ||
        !courses ||
        !userId
    ) {
        return res.status(200).json({
            success: false,
            message: "Payment Failed"
        });
    }

    let body = razorpay_orderId + "|" + razorpay_paymentId;

    const expectedSignature = crypto
        .createHmac('sha256', process.env.RAZORPAY_SECRET)
        .update(body.toString())
        .digest('hex')

    // if signature matches, enroll students
    if(expectedSignature === razorpay_signature) {
        await enrollStudent(courses, userId, res)
        return res.status(200).json({
            success: true,
            message: "Payment Verified"
        })
    }

    return res.status(200).json({
        success: false,
        message: "Payment Failed"
    })
}


// send payment success email to user
exports.sendPaymentSuccessEmail = async (req, res) => {
    // get data
    const {orderId, paymentId, amount} = req.body
    const userId = req.user.id
    
    // valide
    if(!orderId || !paymentId || !amount || !userId){
        return res.status(403).json({
            success: false,
            message: "Please provide correct details"
        })
    }

    try {
        // check if student exist
        const enrolledStudent = await User.findById(userId);
        
        // send success mail
        await mailSender(
            enrolledStudent.email,
            `Successfully Payment Received`,
            paymentSuccessEmail(
              `${enrolledStudent.firstName} ${enrolledStudent.lastName}`,
              amount / 100,
              orderId,
              paymentId
            )
        )
    } catch (error) {
        console.log('error in sending mail (Payments.js)')
        console.log(error);
        return res.status(400).json({
            success: false,
            message: "Couldn't send payment success email"
        })
    }
}


// enrol student in course
const enrollStudent = async (courses, userId, res) => {
    // validate
    if (!courses || !userId) {
        return res
          .status(400)
          .json({ success: false, message: "Please Provide Course ID and User ID" })
    }

    for (const courseId of courses) {
        try {
            // find course and eroll student
            const enrolledCourse = await Course.findOneAndUpdate(
                { _id: courseId },
                { $push: { studentsEnrolled: userId } },
                { new: true }
            )

            // validate
            if (!enrolledCourse) {
                return res.status(500).json({ 
                    success: false, 
                    error: "Course not found" 
                })
            }
            console.log("enrolled course: ", enrolledCourse)

            // mark course progress to 0
            const courseProgress = await CourseProgress.create({
                courseId: courseId,
                userId: userId,
                completedVideos: [],
            })

            // add new course to students enrolledCourse list
            const enrolledStudent = await User.findByIdAndUpdate(
                userId,
                {
                  $push: {
                    courses: courseId,
                    courseProgress: courseProgress._id,
                  },
                },
                { new: true }
            )
            console.log("Enrolled student: ", enrolledStudent);

            // send enrolled email
            const emailResponse = await mailSender(
                enrolledStudent.email,
                `Successfully Enrolled into ${enrolledCourse.courseName}`,
                courseEnrollmentEmail(
                  enrolledCourse.courseName,
                  `${enrolledStudent.firstName} ${enrolledStudent.lastName}`
                )
            )
            console.log("Email sent successfully: ", emailResponse.response)

        } catch (error) {
            console.log("error occurred while enrolling student in new course (Payments.js)")
            console.log(error);
            return res.status(400).json({
                success: false,
                error: error.message
            })
        }
    }
}