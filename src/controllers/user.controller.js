const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/ApiError");
const User = require("../models/user.model");
const { uploadOnCloudinary } = require("../utils/FileUploader");
const ApiResponse = require("../utils/ApiResponse");

const generateAccessandRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = await user.generateAccessToken();
    const refreshToken = await user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(500, "Something went wrong in generating tokens.");
  }
};

const registerUser = asyncHandler(async (req, res) => {
  const { fullName, email, username, password } = req.body;

  // Input validation
  if (
    ![fullName, email, username, password].every(
      (field) => field && field.trim() !== ""
    )
  ) {
    throw new ApiError(400, "All fields are required");
  }

  // Check if user already exists
  const existingUser = await User.findOne({ $or: [{ username }, { email }] });
  if (existingUser) {
    throw new ApiError(409, "User with email or username already exists");
  }

  // File upload handling
  const avatarLocalPath = req.files?.avatar?.[0]?.path;
  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar file is required");
  }

  const coverImageLocalPath = req.files?.coverImage?.[0]?.path;

  // Upload files to cloudinary
  const [avatar, coverImage] = await Promise.all([
    uploadOnCloudinary(avatarLocalPath),
    uploadOnCloudinary(coverImageLocalPath),
  ]);

  if (!avatar) {
    throw new ApiError(500, "Failed to upload avatar image");
  }

  // Create new user
  const newUser = new User({
    fullName,
    email,
    username: username.toLowerCase(),
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
  });
  await newUser.save();

  // Return response
  const responseData = await User.findById(newUser._id).select(
    "-password -refreshToken"
  );
  if (!responseData) {
    throw new ApiError(500, "Failed to retrieve user data after registration");
  }

  res
    .status(201)
    .json(new ApiResponse(200, responseData, "User registered successfully"));
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new ApiError(400, "Email and password are required");
  }
  const user = await User.findOne({ email });

  if (!user) throw new ApiError(404, "User does not exists!");

  const isPasswordValid = await user.isPasswordCorrect(password);

  if (!isPasswordValid) throw new ApiError(401, "Invalid email or password");

  const { accessToken, refreshToken } = await generateAccessandRefreshToken(
    user._id
  );

  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  const options = { httpOnly: true, secure: true };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        {
          user: loggedInUser,
          accessToken,
          refreshToken,
        },
        "User logged In Successfully"
      )
    );
});

const logoutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    { $unset: { refreshToken: 1 } },
    { new: true }
  );

  // await User.findByIdAndUpdate(req.user._id, {
  //   $set: { refreshToken: undefined },
  // });

  const options = { httpOnly: true, secure: true };

  res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged Out"));
});

const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken =
    req.cookies.refreshToken || req.body.refreshToken;

  if (!incomingRefreshToken) {
    throw new ApiError(404, "Refresh Token  is missing");
  }

  try {
    const decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );

    const user = await User.findById(decodedToken._id);

    if (!user) {
      throw new ApiError(401, "Invalid Refresh Token");
    }

    if (incomingRefreshToken !== user?.refreshToken) {
      throw new ApiError(401, "Refresh token is expired or used");
    }

    const { accessToken, refreshToken } = await generateAccessandRefreshToken(
      user._id
    );

    const options = {
      httpOnly: true,
      secure: true,
    };

    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .json(
        new ApiResponse(
          200,
          {
            user,
            accessToken,
            refreshToken,
          },
          "Access Token generated successfully!"
        )
      );
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid Refresh Token");
  }
});

module.exports = { registerUser, loginUser, logoutUser, refreshAccessToken };
