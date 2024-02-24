const express = require("express");
const router = express.Router();
const playlistController = require("../controllers/playlist.controller");
const authMiddleware = require("../middlewares/auth.middleware");

router.use(authMiddleware.verifyJWT);

router.route("/").post(playlistController.createPlaylist);

router.route("/user/:userId").get(playlistController.getUserPlaylists);

router
  .route("/:playlistId")
  .get(playlistController.getPlaylistById)
  .delete(playlistController.deletePlaylist)
  .put(playlistController.updatePlaylist);

router
  .route("/:playlistId/videos/:videoId")
  .post(playlistController.addVideoToPlaylist)
  .delete(playlistController.removeVideoFromPlaylist);

module.exports = router;
