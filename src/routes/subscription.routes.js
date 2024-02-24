const express = require("express");
const router = express.Router();
const subscriptionController = require("../controllers/subscription.controller");

router.post("/:channelId", subscriptionController.toggleSubscription);
router.get(
  "/subscribers/:channelId",
  subscriptionController.getUserChannelSubscribers
);
router.get(
  "/channels/:subscriberId",
  subscriptionController.getSubscribedChannels
);

module.exports = router;
