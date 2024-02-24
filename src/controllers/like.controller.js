const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");
const asyncHandler = require("../utils/asyncHandler");
const Video = require("../models/video.model");
const Like = require("../models/like.model");
const Tweet = require("../models/tweet.model");

const toggleVideoLike = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  //TODO: toggle like on video

  const video = await Video.findById(videoId);
  if (!video) throw new ApiError(404, "Invalid videoId");

  const like = await Like.findByIdAndDelete({
    owner: req.user?._id,
    video: videoId,
  });
  if (!like) {
    await Like.create({
      owner: req.user?._id,
      video: videoId,
    });
    return res
      .status(200)
      .json(new ApiResponse(200, {}, "Video liked successfully!"));
  } else {
    return res
      .status(200)
      .json(new ApiResponse(200, {}, "Unlike successfully!"));
  }
});

const toggleCommentLike = asyncHandler(async (req, res) => {
  const { commentId } = req.params;
  //TODO: toggle like on comment

  const comment = await Comment.findById(commentId);
  if (!comment) throw new ApiError(404, "Invalid CommentId");

  const like = await Like.findByIdAndDelete({
    owner: req.user?._id,
    comment: commentId,
  });

  if (!like) {
    await Like.create({
      owner: req.user?._id,
      comment: commentId,
    });
    return res
      .status(200)
      .json(new ApiResponse(200, {}, "Comment liked successfully!"));
  } else {
    return res
      .status(200)
      .json(new ApiResponse(200, {}, "Unlike successfully!"));
  }
});

const toggleTweetLike = asyncHandler(async (req, res) => {
  const { tweetId } = req.params;
  //TODO: toggle like on tweet

  const tweet = await Tweet.findById(tweetId);
  if (!tweet) throw new ApiError(404, "Invalid TweetId");

  const like = await Like.findByIdAndDelete({
    owner: req.user?._id,
    tweet: tweetId,
  });

  if (!like) {
    await Like.create({
      owner: req.user?._id,
      tweet: tweetId,
    });
    return res
      .status(200)
      .json(new ApiResponse(200, {}, "Tweet liked successfully!"));
  } else {
    return res
      .status(200)
      .json(new ApiResponse(200, {}, "Unlike successfully!"));
  }
});

const getLikedVideos = asyncHandler(async (req, res) => {
  //TODO: get all liked videos

  const likedVideos = await Like.find({
    owner: req.user?._id,
    video: { $exists: true },
  });

  if (!likedVideos) throw new ApiError(404, "No videos liked by user");

  return res
    .status(200)
    .json(200, likedVideos, "Liked videos fetched successfully!");
});

module.exports = {
  toggleCommentLike,
  toggleTweetLike,
  toggleVideoLike,
  getLikedVideos,
};
