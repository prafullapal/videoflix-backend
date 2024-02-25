const asyncHandler = require("../utils/asyncHandler");
const Post = require("../models/post.model");
const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");

// Controller to create a new post
const createPost = asyncHandler(async (req, res) => {
  const { content } = req.body;

  // Check if content is provided
  if (!content) {
    throw new ApiError(400, "Content is required");
  }

  // Create the post
  const newPost = await Post.create({
    owner: req.user._id, // Assuming user ID is available in the request
    content,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, newPost, "Post created successfully"));
});

// Controller to get posts of a specific user
const getUserPosts = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  // Find posts by the user ID
  const userPosts = await Post.find({ owner: userId });

  return res
    .status(200)
    .json(new ApiResponse(200, userPosts, "User posts retrieved successfully"));
});

// Controller to update a post
const updatePost = asyncHandler(async (req, res) => {
  const { postId } = req.params;
  const { content } = req.body;

  // Find the post by ID
  let post = await Post.findById(postId);

  if (!post) {
    throw new ApiError(404, "Post not found");
  }

  // Update the post content
  post.content = content;
  post = await post.save();

  return res
    .status(200)
    .json(new ApiResponse(200, post, "Post updated successfully"));
});

// Controller to delete a post
const deletePost = asyncHandler(async (req, res) => {
  const { postId } = req.params;

  // Find and delete the post by ID
  const deletedPost = await Post.findByIdAndDelete(postId);

  if (!deletedPost) {
    throw new ApiError(404, "Post not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Post deleted successfully"));
});

module.exports = {
  createPost,
  getUserPosts,
  updatePost,
  deletePost,
};
