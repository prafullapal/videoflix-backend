const express = require("express");
const router = express.Router();
const channelController = require("../controllers/channel.controller");
const authMiddleware = require("../middlewares/auth.middleware");

router.use(authMiddleware.verifyJWT);

router.route("/stats").get(channelController.getChannelStats);

router.route("/videos").get(channelController.getChannelVideos);

module.exports = router;
