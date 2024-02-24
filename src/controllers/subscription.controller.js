const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");
const Subscription = require("../models/subscription.model");

const toggleSubscription = asyncHandler(async (req, res) => {
  const { channelId } = req.params;
  if (!channelId) throw new ApiError(400, "ChannelId is required!");
  // TODO: toggle subscription
  const userId = req.user?._id;

  const subs = await Subscription.findOneAndDelete({
    subscriber: userId,
    channel: channelId,
  });

  if (!subs) {
    await Subscription.create({
      subscriber: userId,
      channel: channelId,
    });
    return res
      .status(201)
      .json(new ApiResponse(200, {}, "Subscription added successfully!"));
  } else {
    return res.status(200).json(new ApiResponse(200, {}, "Unsubscribed"));
  }
});

// controller to return subscriber list of a channel
const getUserChannelSubscribers = asyncHandler(async (req, res) => {
  const { channelId } = req.params;

  if (!channelId) throw new ApiError(400, "ChannelId is required!");

  const subscribers = await Subscription.find({ channel: channelId });

  if (!subscribers.length) throw new ApiError(404, "No Subscribers found!");

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        subscribers,
        "Subscribers list fetched successfully!"
      )
    );
});

// controller to return channel list to which user has subscribed
const getSubscribedChannels = asyncHandler(async (req, res) => {
  const { subscriberId } = req.params;

  if (!subscriberId) throw new ApiError(400, "SubscriberId is required!");

  const channels = await Subscription.find({ subscriber: subscriberId });

  if (!channels.length) throw new ApiError(404, "No Channel Found");

  return res
    .status(200)
    .json(new ApiResponse(200, channels, "Successfully Fetched Channels List"));
});

module.exports = {
  toggleSubscription,
  getUserChannelSubscribers,
  getSubscribedChannels,
};
