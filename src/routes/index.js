const express = require("express");
const router = express.Router();

// Import individual route modules
const userRoutes = require("./user.routes");
const videoRoutes = require("./video.routes");
const subscriptionRoutes = require("./subscription.routes");
const commentRoutes = require("./comment.routes");

router.use("/users", userRoutes);
router.use("/videos", videoRoutes);
router.use("/subscription", subscriptionRoutes);
router.use("/comments", commentRoutes);

module.exports = router;
