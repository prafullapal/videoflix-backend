const express = require("express");
const router = express.Router();
const likeController = require("../controllers/like.controller");
const authMiddleware = require("../middlewares/auth.middleware");

router.use(authMiddleware.verifyJWT);

router.route("/videos/:videoId/like").post(likeController.toggleVideoLike);

router
  .route("/comments/:commentId/like")
  .post(likeController.toggleCommentLike);

router.route("/tweets/:tweetId/like").post(likeController.toggleTweetLike);

router.route("/videos/liked").get(likeController.getLikedVideos);

module.exports = router;
