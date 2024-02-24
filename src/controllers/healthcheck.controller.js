const asyncHandler = require("../utils/asyncHandler");

const healthcheck = asyncHandler(async (req, res) => {
  //TODO: build a healthcheck response that simply returns the OK status as json with a message
  return res
    .status(200)
    .json(new ApiResponse(200, { health: "ok" }, "Server is healthy"));
});

module.exports = {
  healthcheck,
};