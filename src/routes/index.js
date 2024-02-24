const express = require("express");
const router = express.Router();

// Import individual route modules
const userRoutes = require("./user.routes");
const videoRoutes = require("./video.routes");
const subscriptionRoutes = require("./subscription.routes");
const commentRoutes = require("./comment.routes");
const likeRoutes = require("./like.routes");

router.use("/users", userRoutes);
router.use("/videos", videoRoutes);
router.use("/c", commentRoutes);
router.use("/subscription", subscriptionRoutes);
router.use("/likes", likeRoutes);

module.exports = router;
