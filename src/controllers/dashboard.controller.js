const Video = require("../models/video.model");
const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");
const asyncHandler = require("../utils/asyncHandler");

const getChannelStats = asyncHandler(async (req, res) => {
  // TODO: Get the channel stats like total video views, total subscribers, total videos, total likes etc.
  const userId = req.user?._id;
  const channelStats = await Video.aggregate([
    {
      $match: {
        owner: userId,
      },
    },
    {
      $lookup: {
        from: "subscribers",
        localField: "owner",
        foreignField: "channel",
        as: "subscribers",
      },
    },
    {
      $lookup: {
        from: "likes",
        localField: "_id",
        foreignField: "video",
        as: "likes",
      },
    },
    {
      $addFields: {
        totalView: { $sum: "$views" },
        totalSubscribers: { $size: "$subscribers" },
        totalLikes: { $size: "$likes" },
      },
    },
  ]);

  if (!channelStats?.length) throw new ApiError(404, "Channel stats not found");

  return res
    .status(200)
    .json(
      new ApiResponse(200, channelStats, "Channel Stats fetched successfully.")
    );
});

const getChannelVideos = asyncHandler(async (req, res) => {
  // TODO: Get all the videos uploaded by the channel
  const userId = req.user?._id;
  const video = await Video.find({ owner: userId });

  return res
    .status(200)
    .json(new ApiResponse(200, video, "Videos fetched successfully."));
});

module.exports = {
  getChannelStats,
  getChannelVideos,
};
