const express = require("express");
const router = express.Router();
const dashboardController = require("../controllers/dashboard.controller");
const authMiddleware = require("../middlewares/auth.middleware");

router.use(authMiddleware.verifyJWT);

router.route("/stats").get(dashboardController.getChannelStats);

router.route("/videos").get(dashboardController.getChannelVideos);

module.exports = router;
