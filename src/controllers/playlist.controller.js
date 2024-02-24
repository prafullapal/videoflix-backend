const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");
const Playlist = require("../models/playlist.model");

const createPlaylist = asyncHandler(async (req, res) => {
  const { name, description } = req.body;
  //TODO: create playlist

  if (!name || !description)
    throw new ApiError(400, "Name and description required");

  const playlist = await Playlist.create({
    name,
    description,
    owner: req.user?._id,
  });

  return res
    .status(200)
    .json(new ApiResponse(200, playlist, "Playlist created successfully!"));
});

const getUserPlaylists = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  //TODO: get user playlists

  if (!userId) throw new ApiError("userId required");

  const playlists = await Playlist.find({ owner: userId });

  if (!playlists.length) throw new ApiError(404, "No playlists found.");

  return res
    .status(200)
    .json(new ApiResponse(200, playlists, "Playlists fetched successfully!"));
});

const getPlaylistById = asyncHandler(async (req, res) => {
  const { playlistId } = req.params;
  //TODO: get playlist by id

  if (!playlistId) throw new ApiError("playlistId required");

  const playlist = await Playlist.findById(playlistId);

  if (!playlist) throw new ApiError(404, "Playlist not found.");

  return res
    .status(200)
    .json(new ApiResponse(200, playlist, "Playlist fetched successfully!"));
});

const addVideoToPlaylist = asyncHandler(async (req, res) => {
  const { playlistId, videoId } = req.params;

  if (!playlistId || !videoId)
    throw new ApiError(400, "PlaylistId and VideoId are required");

  const playlist = await Playlist.findByIdAndUpdate(
    playlistId,
    {
      $addToSet: {
        videos: videoId,
      },
    },
    { new: true }
  );

  if (!playlist) throw new ApiError(404, "Playlist not found");

  return res
    .status(200)
    .json(
      new ApiResponse(200, playlist, "Video added to Playlist successfuly!")
    );
});

const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
  const { playlistId, videoId } = req.params;
  // TODO: remove video from playlist

  if (!playlistId || !videoId)
    throw new ApiError(400, "PlaylistId and VideoId are required");

  const playlist = await Playlist.findByIdAndUpdate(
    playlistId,
    {
      $pull: {
        videos: videoId,
      },
    },
    { new: true }
  );

  if (!playlist) throw new ApiError(404, "Playlist not found");

  return res
    .status(200)
    .json(
      new ApiResponse(200, playlist, "Video removed from Playlist successfuly!")
    );
});

const deletePlaylist = asyncHandler(async (req, res) => {
  const { playlistId } = req.params;
  // TODO: delete playlist

  if (!playlistId) throw new ApiError(400, "PlaylistId required");

  const playlist = await Playlist.findByIdAndDelete(playlistId);

  if (!playlist)
    throw new ApiError(404, "Playlist not found. Invalid playlist id");

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Playlist deleted successfully"));
});

const updatePlaylist = asyncHandler(async (req, res) => {
  const { playlistId } = req.params;
  const { name, description } = req.body;
  //TODO: update playlist

  if (!name || !description)
    throw new ApiError(400, "New name and description are required");

  if (!playlistId) throw new ApiError(400, "PlaylistId is required");

  const playlist = await Playlist.findByIdAndUpdate(
    playlistId,
    { name, description },
    { new: true }
  );

  if (!playlist) throw new ApiError(404, "Playlist not found");

  return res
    .status(200)
    .json(new ApiResponse(200, playlist, "Playlist updated successfully!"));
});

module.exports = {
  createPlaylist,
  getUserPlaylists,
  getPlaylistById,
  addVideoToPlaylist,
  removeVideoFromPlaylist,
  deletePlaylist,
  updatePlaylist,
};
