const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");
const asyncHandler = require("../utils/asyncHandler");
const Video = require("../models/video.model");

const getVideoComments = asyncHandler(async (req, res) => {
  //TODO: get all comments for a video
  const { videoId } = req.params;
  const { page = 1, limit = 10 } = req.query;

  if (!videoId) throw new ApiError(400, "VideoId is required");

  const options = {
    page: parseInt(page),
    limit: parseInt(limit),
    sort: { createdAt: -1 },
  };

  const comments = Comment.paginate({ video: videoId }, options);

  if (!comments) throw new ApiError(404, "No comments found for the video");

  return res
    .status(200)
    .json(new ApiResponse(200, comments, "Comments fetched successfully!"));
});

const addComment = asyncHandler(async (req, res) => {
  // TODO: add a comment to a video
  const { videoId } = req.params;
  const { content } = req.body;

  if (!videoId) throw new ApiError(400, "VideoId is required");

  if (!content) throw new ApiError(400, "Content is required!");

  const video = await Video.findById(videoId);

  if (!video) throw new ApiError(404, "Invalid videoId");

  const comment = await Comment.create({
    content: content,
    owner: req.user?._id,
    video: videoId,
  });

  return res
    .status(200)
    .json(new ApiResponse(200, comment, "Comment added successfully!"));
});

const updateComment = asyncHandler(async (req, res) => {
  // TODO: update a comment
  const { commentId } = req.params;
  const { content } = req.body;

  if (!commentId) throw new ApiError(400, "VideoId is required");

  if (!content) throw new ApiError(400, "Content is required!");

  const comment = await Comment.findByIdAndUpdate(
    commentId,
    { content },
    { new: true }
  );

  return res
    .status(200)
    .json(new ApiResponse(200, comment, "Comment updated successfully!"));
});

const deleteComment = asyncHandler(async (req, res) => {
  // TODO: delete a comment
  const { commentId } = req.params;

  if (!commentId) throw new ApiError(400, "VideoId is required");

  const comment = await Comment.findByIdAndDelete(commentId);

  return res
    .status(200)
    .json(new ApiResponse(200, comment, "Comment deleted successfully!"));
});

module.exports = {
  getVideoComments,
  addComment,
  updateComment,
  deleteComment,
};
