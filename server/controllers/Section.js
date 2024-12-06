/* Handlers related to sections during course creation are defined here */

const Section = require('../models/Section');
const Course = require('../models/Course');
const SubSection = require('../models/SubSection');

// create new section
exports.createSection = async (req, res) => {
    try {
        
        // fetch data
        const {sectionName, courseId} = req.body;

        // validation
        if(!sectionName || !courseId) {
            return res.status(400).json({
                success: false,
                message: "all fields are required. check your input"
            });
        }

        // create new section
        const newSection = await Section.create({sectionName});

        // update to course schema about section creation
// NOTE: populate section as well as subsection here only, how?
        const updatedCourse = await Course.findByIdAndUpdate(
                                                        courseId,
                                                        {
                                                            $push:{
                                                                courseContent:newSection._id
                                                            }
                                                        },
                                                        {new:true}
        ).populate({
            path:"courseContent",
            populate: {
                path: "subSection",
            },
        })
        .exec();

        // return response
        return res.status(200).json({
            success:true,
            message: "section creation successful",
            data: updatedCourse,
        });
        
    } catch (error) {
        console.log("error occurred during section creation (Section.js) ");
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error:error.message,
        });
    }
}



// update existing section
exports.updateSection = async (req, res) => {
    try {

        // fetch data
        const {sectionName, sectionId, courseId } = req.body;

        // validation
        // empty check
        if(!sectionName || !sectionId) {
            return res.status(400).json({
                success: false,
                message: "all fields are required. check your input"
            });
        }

        // update changes
        const updatedSection = await Section.findByIdAndUpdate(
            sectionId,
            {sectionName},
            {new:true}
        );

        const updatedCourse = await Course.findById(courseId)
            .populate({
                path: 'courseContent',
                populate: {
                    path: 'subSection'
                },
            })
            .exec();

        // return response
        return res.status(200).json({
            success:true,
            message: "section updated successfully",
            data: updatedCourse,
        });
        
    } catch (error) {
        console.log("error occurred during section updation (Section.js) ");
        console.log(error);
        return res.status(500).json({
            success: false,
            message:error.message,
        });
    }
};



// TODO: implement it with req.params
// delete existing section
exports.deleteSection = async (req, res) => {
    try {

        // fetch data: sending id through params
        const { sectionId, courseId } = req.body;
        // update course schema
        await Course.findByIdAndUpdate(courseId, {
            $pull: {
                courseContent: sectionId,
            }
        })
        
        const section = await Section.findById(sectionId);
		console.log(sectionId, courseId);

        // validate
        if(!section) {
            return res.status(404).json({
                success:false,
				message:"Section not Found",
			})
		}

        // delete subsection
        await SubSection.deleteMany({_id: {$in: section.subSection}});
        // delete section
        await Section.findByIdAndDelete(sectionId);

        //find the updated course and return 
		const course = await Course.findById(courseId).populate({
			path:"courseContent",
			populate: {
				path: "subSection"
			}
		})
		.exec();

        res.status(200).json({
			success:true,
			message:"Section deleted",
			data:course
		});
        
    } catch (error) {
        console.log("error occurred during section deletion (Section.js) ");
        console.log(error);
        return res.status(500).json({
            success: false,
            message:error.message,
        });
    }
};