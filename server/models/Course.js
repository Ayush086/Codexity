// course details schema

const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
    courseName: {
        type: String,
        trim: true,
        required: true
    },
    description: {
        type: String,
        trim: true,
        required: true
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
        required: true
    },
    thumbnail: {
        type: String,
        required: true
    },
    tag: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Tag",
    },
    studentsEnrolled: [
        {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "User",
        }
    ]
});

module.exports = mongoose.model("Course", courseSchema);
