const express = require("express");
const router = express.Router();
const subscriptionController = require("../controllers/subscription.controller");
const authMiddleware = require("../middlewares/auth.middleware");

router
  .route("/:channelId")
  .post(authMiddleware.verifyJWT, subscriptionController.toggleSubscription);
router
  .route("/subscribers/:channelId")
  .get(subscriptionController.getUserChannelSubscribers);
router
  .route("/channels/:subscriberId")
  .get(subscriptionController.getSubscribedChannels);

module.exports = router;
