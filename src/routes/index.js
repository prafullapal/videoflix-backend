const express = require("express");
const router = express.Router();

// Import individual route modules
const userRoutes = require("./user.routes");
const videoRoutes = require("./video.routes");

router.use("/users", userRoutes);
router.use("/videos", videoRoutes);

module.exports = router;
