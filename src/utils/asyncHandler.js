const asyncHandler = (requestHandler) => {
  return (req, res, next) => {
    Promise.resolve(requestHandler(req, res, next))
      // If the promise resolves successfully, continue to the next middleware
      .catch((err) => next(err)); // If the promise is rejected with an error, pass the error to the next middleware
  };
};

module.exports = asyncHandler;
