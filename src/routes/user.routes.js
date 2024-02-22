const express = require("express");
const {
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
} = require("../controllers/user.controller");
const { upload } = require("../middlewares/multer.middleware");
const verifyJWT = require("../middlewares/auth.middleware");

const userRouter = express.Router();

userRouter.route("/register").post(
  upload.fields([
    {
      name: "avatar",
      maxCount: 1,
    },
    {
      name: "coverImage",
      maxCount: 1,
    },
  ]),
  registerUser
);

userRouter.route("/login").post(loginUser);

//Secured Routes
userRouter.route("/logout").post(verifyJWT, logoutUser);
userRouter.route("/refreshtoken").post(refreshAccessToken);

module.exports = userRouter;
