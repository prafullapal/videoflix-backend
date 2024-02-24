const express = require("express");
const router = express.Router();

const userController = require("../controllers/user.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const multerMiddleware = require("../middlewares/multer.middleware");

// Public routes
router.post(
  "/register",
  multerMiddleware.upload.fields([
    { name: "avatar", maxCount: 1 },
    { name: "coverImage", maxCount: 1 },
  ]),
  userController.registerUser
);

router.post("/login", userController.loginUser);

// Secured routes
router.use(authMiddleware.verifyJWT);

router.get("/logout", userController.logoutUser);
router.post("/refresh-token", userController.refreshAccessToken);

router.get("/current", userController.getCurrentUser);
router.put("/account", userController.updateAccountDetails);
router.put(
  "/avatar",
  multerMiddleware.upload.single("avatar"),
  userController.updateUserAvatar
);
router.put(
  "/cover-image",
  multerMiddleware.upload.single("coverImage"),
  userController.updateUserCoverImage
);
router.put("/change-password", userController.changeCurrentPassword);

router.get("/channel/:username", userController.getUserChannelProfile);
router.get("/watch-history", userController.getWatchHistory);

module.exports = router;
