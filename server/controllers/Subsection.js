// handler's related to subsection schema are defined here

const SubSection = require('../models/SubSection');
const Section = require("../models/Section");
const {uploadImageToCloudinary} = require('../utils/imageUploader');

require('dotenv').config();


// create new Subsection
exports.createSubSection = async (req, res) => {
    try {

        // fetch data
        const {sectionId, title, description} = req.body;

        // fetch video from files
        const video = req.files.video;

        // validation
        if(!sectionId || !title || !description || !video){
            return res.status(404).json({
                success: false,
                message: "missing inputs. check and try again",
            });
        }

        // upload video to cloudinary
        const uploadDetails = await uploadImageToCloudinary(video, process.env.FOLDER_NAME);

        // create db entry in subsection
        const subsectionDetails = await SubSection.create({
            title:title,
            timeDuration:`${uploadDetails.duration}`,
            description:description,
            videoUrl: uploadDetails.secure_url,

        });

        // update changes in section schema
    // NOTE: add populate for subsection
        const updatedSection = await Section.findByIdAndUpdate(
            {_id:sectionId},
            {
                $push: {subSection:subsectionDetails._id}
            },
            {new:true},
        ).populate('subSection')

        // return response
        return res.status(200).json({
            success: true,
            message: "subsection creation successful",
            data: updatedSection,
        });
        
    } catch (error) {
        console.log("error occurred during sub-section creation (Subsection.js) ");
        console.log(error);
        return res.status(500).json({
            success: false,
            message:error.message,
        });
    }
};



// update subsection
exports.updateSubSection = async (req, res) => {
    try {

        // fetch data
        const { sectionId, subSectionId, title, description } = req.body;
        const subSection = await SubSection.findById(subSectionId);


        // validation
        // empty check
        if(!subSection)  {
            return res.status(404).json({
                success: false,
                message: "subsection not found"
            });
        }
        // if input not given then consider previous inputs for other fields
        if(title !== undefined) {
            subSection.title = title;
        }
        if(description !== undefined) {
            subSection.description = description;
        }
        if(req.files && req.files.video !== undefined) {
            const video = req.files.video;
            const uploadVideo = await uploadImageToCloudinary(video, process.env.FOLDER_NAME);
            subSection.videoUrl = uploadVideo.secure_url;
            subSection.timeDuration = `${uploadVideo.duration}`;
        }

        // save changes
        await subSection.save();

        const updatedSection = await Section.findById(sectionId).populate("subSection")

        console.log('updated section', updatedSection)

        // return response
        return res.status(200).json({
            success:true,
            data: updatedSection,
            message: "Sub-section updated successfully",
        });
        
    } catch (error) {
        console.log("error occurred during section updation (Subsection.js) ");
        console.log(error);
        return res.status(500).json({
            success: false,
            message:error.message,
        });
    }
};



// delete subsection
exports.deleteSubSection = async (req, res) => {
    try {

        // fetch data: sending id through params
        console.log('running well')
        const {subSectionId, sectionId} = req.body;

        await Section.findByIdAndUpdate(
            { _id: sectionId },
            {
              $pull: {
                subSection: subSectionId,
              },
            }
          )
          const subSection = await SubSection.findByIdAndDelete({ _id: subSectionId })

        // validate
        if(!subSection){
            return res.status(400).json({
                success: false,
                message: "subsection not found",
            });
        }


        const updatedSection = await Section.findById(sectionId).populate("subSection")

        // return response
        return res.status(200).json({
            success: true,
            message: "sub-section deleted successfully",
            data: updatedSection,
        });
        
    } catch (error) {
        console.log("error occurred during sub-section deletion (SubSection.js) ");
        console.log(error);
        return res.status(500).json({
            success: false,
            message:"sub-section deletion failed",
            error: error.message
        });
    }
};

// NOTE: update and delete handler are not confirmed, supposed to be updated