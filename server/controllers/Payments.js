// payment gateway integration

const { instance } = require('../config/razorpay');
const Course = require('../models/Course');
const User = require('../models/User');
const mailSender = require('../utils/mailSender');

// template import
const { courseEnrollmentEmail } = require('../mail/templates/courseEnrollmentEmail');


// capture payment and intiate razorpay order
exports.capturePayment = async (req, res) => {
    // get data
    const { courseId } = req.body;
    const userId = req.user.id;

// validation
    // empty check
    if (!courseId) {
        return res.status(400).json({
            success: false,
            message: "provide valid course ID",
        });
    }

    // valid course ?: course exist or not
    const course = await Course.findById(courseId);
    try {
        if (!course) {
            return res.status(401).json({
                success: false,
                message: "couldn't find course",
            });
        }

    // user already enrolled for course ?
        const uid = new mongoose.Types.ObjectId(userId); // converting userId to objectId since it was string while fetching
        if(course.student){
            console.log("student already for the course");
            return res.status(200).json({
                success: false,
                message: "student is already enrolled",
            });
        }

    } catch (error) {
        console.log("error occuerred in capture payment (Payments.js)");
        console.log(error.message);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message,
        });
    }

    // create order
    const amount = course.price;
    const currency = 'INR';
    const receipt = `${userId}-${course.courseName}-${course.price}`;

    const options = {
        amount: amount*100,
        currency,
        receipt: receipt,
        notes: {
            courseId:courseId,
            userId:userId,
            By: req.user.email,
            On: Date.now().toString()
        }
    };

    try {
        // initiate payment using razorpay
        const paymentResponse = await instance.orders.create(options);
        console.log(paymentResponse);

        // return response
        return res.status(200).json({
            success: true, 
            message: "order initiation successful",
            courseName: course.courseName,
            courseDesc: course.description,
            thumbnail: course.thumbnail,
            orderId: paymentResponse.id,
            amount: paymentResponse.amount,
        })
        
    } catch (error) {
        console.log("payment initiation failed");
        console.log(error.message);
        return res.status(500).json({
            success: false,
            message: "order initiation failed",
            error: error.message,
        });
    }

};




// signature verification 
exports.verifySignature = async (req, res) => {
    const webhookSecret = "webhooksecret@086"; // server's signature

    const razorpaySignature = req.headers('x-razorpay-signature'); // razorpay's signature

// while sending the response, razorpay will send encrypted signature which will be a hexadecimal string so we need to convert our webhook secret key to an encrypted string so that we can compare both response and contradict the observation.

    // hmac definition
    const SHAsum = crypto.createHmac({
        algorithm: 'sha256',
        key: webhookSecret
    });
    SHAsum.update(JSON.stringify(req.body)); // convert to string
    const digest = SHAsum.digest('hex'); // convert to hexadecimal

    // if razorpaySignature and digest are equal => payment is authorised
    if(razorpaySignature === digest) {
        console.log('payment is authorised'); 

    // payment done 
        // now course allocation to student

        const {courseId, userId} = req.body.payload.payment.entity.notes; // path can be verified during testing

        // no need of validation, before sending the response we validated it
        try {
            // find course and enroll the student
            const enrolledCourse = await Course.findOneAndUpdate(
                                                                {_id: courseId},
                                                                {$push: {studentEnrolled: userId}},
                                                                {new:true},
                                                            );
            
            if(!enrolledCourse) {
                return res.status(500).json({
                    success: false,
                    message: "Course not found",
                });
            }

            console.log("enrolled course: ", enrolledCourse);

            // update course list of student
            const enrolledStudent = await User.findByIdAndUpdate(
                                                            {_id: userId},
                                                            {$push: {courses: courseId}},
                                                            {new: true},
            );

            // formalities completion
            // send mail of course enrollment confirmation
            const emailResponse = await mailSender(req.user.email, "New journey begins | codexity", "Congratulations, course enrollment successful" );


            // return response
            return res.status(200).json({
                success: true,
                message: "signature verified and course enrolled",
            });
            
        } catch (error) {
            console.log("error occurred during signature verification (Payments.js) ");
            console.error(error.message);
            return res.status(500).json({
                success: false,
                message: "signature verification failed",
                error: error.message,
            })
        }
    }

    // if signatures doesn't match
    else {
        return res.status(400).json({
            success: false,
            message: "Invalid request",
        });
    }

};

