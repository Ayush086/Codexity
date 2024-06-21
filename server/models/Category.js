// categories given to courses by instructor schema

const mongoose = require('mongoose');

const categoriesSchema = new mongoose.Schema({
    name: {
        type: String,
        trim:true,
        required: true,
    },
    description: {
        type: String,
        trim:true,
    },
    courses: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
    }],
});

module.exports = mongoose.model("Category", categoriesSchema);
