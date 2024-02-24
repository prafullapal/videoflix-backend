const express = require("express");
const router = express.Router();

// Import individual route modules
const healthCheckRoutes = require("./healthcheck.routes");
const userRoutes = require("./user.routes");
const videoRoutes = require("./video.routes");
const subscriptionRoutes = require("./subscription.routes");
const commentRoutes = require("./comment.routes");
const likeRoutes = require("./like.routes");
const playlistRoutes = require("./playlist.routes");
const dashboardRoutes = require("./dashboard.routes");

router.use("/health-check", healthCheckRoutes);
router.use("/users", userRoutes);
router.use("/videos", videoRoutes);
router.use("/c", commentRoutes);
router.use("/subscription", subscriptionRoutes);
router.use("/likes", likeRoutes);
router.use("/playlists", playlistRoutes);
router.use("/router", dashboardRoutes);

module.exports = router;
