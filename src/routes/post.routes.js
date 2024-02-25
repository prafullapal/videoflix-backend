const express = require("express");
const router = express.Router();
const postController = require("../controllers/post.controller");
const authMiddleware = require("../middlewares/auth.middleware");

router.route("/").post(authMiddleware.verifyJWT, postController.createPost);

router.route("/user/:userId").get(postController.getUserPosts);

router
  .route("/:postId")
  .put(authMiddleware.verifyJWT, postController.updatePost)
  .delete(authMiddleware.verifyJWT, postController.deletePost);

module.exports = router;
