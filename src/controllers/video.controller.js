const mongoose = require("mongoose");
const Video = require("../models/video.model");
const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");
const asyncHandler = require("../utils/asyncHandler");
const {
  uploadOnCloudinary,
  updateOnCloudinary,
  deleteFromCloudinary,
} = require("../utils/FileUploader");
const User = require("../models/user.model");

const getAllVideos = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 10,
    sortBy = "createdAt",
    sortType = "desc",
    userId,
  } = req.query;

  const options = {
    page: parseInt(page),
    limit: parseInt(limit),
    sort: { [sortBy]: sortType === "desc" ? -1 : 1 },
  };

  const videos = await Video.paginate({ owner: userId }, options);

  return res
    .status(200)
    .json(new ApiResponse(200, videos, "Videos fetched successfully!"));
});

const publishAVideo = asyncHandler(async (req, res) => {
  const { title, description } = req.body;

  if (!title || !description) {
    throw new ApiError(400, "Title and Description are required");
  }

  const videoFilePath = req.files?.videoFile?.path;
  if (!videoFilePath) {
    throw new ApiError(400, "Video file is required");
  }

  const thumbnailPath = req.files?.thumbnail?.path;
  if (!thumbnailPath) {
    throw new ApiError(400, "Thumbnail file is required");
  }

  const [videoResponse, thumbnailResponse] = await Promise.all([
    uploadOnCloudinary(videoFilePath, "videos"),
    uploadOnCloudinary(thumbnailPath, "videos/thumbnail"),
  ]);

  if (!videoResponse) {
    throw new ApiError(400, "Error uploading video file");
  }

  if (!thumbnailResponse) {
    throw new ApiError(400, "Error uploading thumbnail file");
  }

  const newVideo = new Video({
    title,
    description,
    videoFile: videoResponse.url,
    thumbnail: thumbnailResponse?.url,
    isPublished: true,
    owner: req.user?._id,
    duration: videoResponse.duration,
  });

  await newVideo.save();

  return res
    .status(200)
    .json(new ApiResponse(200, newVideo, "Video Uploaded successfully!"));
});

const getVideoById = asyncHandler(async (req, res) => {
  const { videoId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(videoId)) {
    throw new ApiError(400, "Invalid video ID");
  }

  const video = await Video.findByIdAndUpdate(
    videoId,
    { $inc: { views: 1 } },
    { new: true }
  );

  if (!video) {
    throw new ApiError(404, "Video not found");
  }

  const user = await User.findByIdAndUpdate(
    req.user?._id,
    { $addToSet: { watchHistory: videoId } },
    { new: true }
  );

  return res
    .status(200)
    .json(new ApiResponse(200, video, "Video fetched successfully!"));
});

const updateVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  const { title, description } = req.body;

  if (!title && !description) {
    throw new ApiError(400, "Title or Description is required");
  }

  const video = await Video.findById(videoId);

  if (!video) {
    throw new ApiError(404, "Video not found");
  }

  if (title) {
    video.title = title;
  }
  if (description) {
    video.description = description;
  }

  const thumbnailPath = req.file?.path;

  if (thumbnailPath) {
    const thumbnailResponse = await updateOnCloudinary(
      video.thumbnail,
      thumbnailPath,
      "videos/thumbnails"
    );
    video.thumbnail = thumbnailResponse.url;
  }

  await video.save();

  return res
    .status(200)
    .json(new ApiResponse(200, video, "Video details updated successfully!"));
});

const deleteVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(videoId)) {
    throw new ApiError(400, "Invalid video ID");
  }

  const video = await Video.findByIdAndDelete(videoId);

  if (!video) {
    throw new ApiError(404, "Video not found");
  }

  await Promise.all([
    deleteFromCloudinary(video.thumbnail),
    deleteFromCloudinary(video.videoFile),
  ]);

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Video deleted successfully!"));
});

const togglePublishStatus = asyncHandler(async (req, res) => {
  const { videoId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(videoId)) {
    throw new ApiError(400, "Invalid video ID");
  }

  const video = await Video.findByIdAndUpdate(
    videoId,
    { $set: { isPublished: { $not: "$isPublished" } } },
    { new: true }
  );

  if (!video) {
    throw new ApiError(404, "Video not found");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, video, "Video publish status updated successfully!")
    );
});

module.exports = {
  getAllVideos,
  publishAVideo,
  getVideoById,
  updateVideo,
  deleteVideo,
  togglePublishStatus,
};
