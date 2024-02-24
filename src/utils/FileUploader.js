const cloudinary = require("cloudinary").v2;
const fs = require("fs");
const { DB_NAME } = require("../CONSTANT");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const extractPublicIdFromUrl = (url) => {
  const segments = url.split("/");
  const uploadIndex = segments.indexOf("upload");
  if (uploadIndex !== -1 && uploadIndex < segments.length - 1) {
    return segments[uploadIndex + 1];
  }
  return null;
};

const deleteLocalFile = (filePath) => {
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
    console.log("Local file deleted:", filePath);
    return true; // Return true indicating successful deletion
  }
  console.log("Local file does not exist:", filePath);
  return false; // Return false indicating file does not exist
};

const uploadOnCloudinary = async (localFilePath, folderName) => {
  try {
    if (!localFilePath) {
      console.error("No local file path provided.");
      return null;
    }
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
      folder: `${DB_NAME}/${folderName}`,
    });
    console.log("File uploaded successfully:", response.url);
    deleteLocalFile(localFilePath); // Call the deleteLocalFile function
    return response;
  } catch (error) {
    console.error("Error uploading file to Cloudinary:", error.message);
    deleteLocalFile(localFilePath); // Call the deleteLocalFile function
    return null;
  }
};

const updateOnCloudinary = async (oldFileUrl, localFilePath, folderName) => {
  try {
    if (!oldFileUrl || !localFilePath) {
      console.error("Missing required parameters.");
      return null;
    }
    const deleteResponse = await deleteFromCloudinary(oldFileUrl);
    if (!deleteResponse) {
      console.error("Failed to delete old file from Cloudinary.");
      return null;
    }
    const uploadResponse = await uploadOnCloudinary(localFilePath, folderName);
    if (!uploadResponse) {
      console.error("Failed to upload new file to Cloudinary.");
      return null;
    }
    return uploadResponse;
  } catch (error) {
    console.error("Error updating file on Cloudinary:", error.message);
    return null;
  }
};

const deleteFromCloudinary = async (fileUrl) => {
  try {
    if (!fileUrl) {
      console.error("No file URL provided.");
      return null;
    }
    const response = await cloudinary.uploader.destroy(
      extractPublicIdFromUrl(fileUrl)
    );
    console.log("File deleted successfully:", response);
    return response;
  } catch (error) {
    console.error("Error deleting file from Cloudinary:", error.message);
    return null;
  }
};

module.exports = {
  uploadOnCloudinary,
  updateOnCloudinary,
  deleteFromCloudinary,
};
