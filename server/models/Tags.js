// tags given to courses by instructor schema

const mongoose = require('mongoose');

const tagsSchema = new mongoose.Schema({
    name: {
        type: String,
        trim:true,
        required: true,
    },
    description: {
        type: String,
        trim:true,
        required: true,
    },
    course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
        required:true,
    },
});

module.exports = mongoose.model("Tag", tagsSchema);
