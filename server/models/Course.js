// course details schema

/* This code snippet is defining a Mongoose schema for a course in a Node.js application. Here's a
breakdown of what each part of the code is doing: */

const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
    courseName: {
        type: String,
    },
    description: {
        type: String,
    },
    instructor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    whatYouWillLearn: {
        type: String,
    },
    courseContent: [
        {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "Section",
        }
    ],
    ratingAndReviews: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "RatingAndReview",
        }
    ],
    price: {
        type: Number,
    },
    thumbnail: {
        type: String,
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
    },
    tag: {
        type: [String],
        required: true
    },
    studentsEnrolled: [
        {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "User",
        }
    ],
    instructions: {
        type: [String],
    },
    status: {
        type: String,
        enum: ["Draft", "Published"],
    },
});

module.exports = mongoose.model("Course", courseSchema);
