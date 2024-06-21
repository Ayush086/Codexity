// utility function for image uploading

/* This JavaScript code snippet is defining a utility function named `uploadImageToCloudinary` that is
used for uploading images to the Cloudinary service. Here's a breakdown of what the code is doing: */

const cloudinary = require('cloudinary').v2

exports.uploadImageToCloudinary = async (file, folder, height, quality) => {
    const options = {folder};
    if(height){
        options.height = height;
    }
    if(quality){
        options.quality = quality;
    }
    options.resource_type = 'auto';

    return await cloudinary.uploader.upload(file.tempFilePath, options);
