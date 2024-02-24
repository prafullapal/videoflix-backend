const express = require("express");
const router = express.Router();
const videoController = require("../controllers/video.controller");
const multerMiddleware = require("../middlewares/multer.middleware");
const authMiddleware = require("../middlewares/auth.middleware");

// Public routes
router
  .route("/")
  .get(videoController.getAllVideos)
  .post(
    authMiddleware.verifyJWT, // Adding verifyJWT middleware here
    multerMiddleware.upload.fields([
      { name: "videoFile", maxCount: 1 },
      { name: "thumbnail", maxCount: 1 },
    ]),
    videoController.publishAVideo
  );

router
  .route("/:videoId")
  .get(videoController.getVideoById)
  .put(
    authMiddleware.verifyJWT,
    multerMiddleware.upload.single("thumbnail"),
    videoController.updateVideo
  )
  .delete(authMiddleware.verifyJWT, videoController.deleteVideo);

router.put(
  "/:videoId/toggle-publish",
  authMiddleware.verifyJWT,
  videoController.togglePublishStatus
);

module.exports = router;
