const express = require("express");
const router = express.Router();
const videoController = require("../controllers/video.controller");
const multerMiddleware = require("../middlewares/multer.middleware");
const authMiddleware = require("../middlewares/auth.middleware");

// Public routes
router.get("/", videoController.getAllVideos);
router.get("/:videoId", videoController.getVideoById);

// Secured routes
router.use(authMiddleware.verifyJWT);

router.post(
  "/",
  multerMiddleware.upload.fields([
    { name: "videoFile", maxCount: 1 },
    { name: "thumbnail", maxCount: 1 },
  ]),
  videoController.publishAVideo
);
router.put(
  "/:videoId",
  multerMiddleware.upload.single("thumbnail"),
  videoController.updateVideo
);
router.delete("/:videoId", videoController.deleteVideo);
router.put("/:videoId/toggle-publish", videoController.togglePublishStatus);

module.exports = router;
