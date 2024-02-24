const express = require("express");
const router = express.Router();
const commentController = require("../controllers/commentController");
const authMiddleware = require("../middlewares/auth.middleware");

router
  .route("/:videoId/comments")
  .get(commentController.getVideoComments)
  .post(authMiddleware.verifyJWT, commentController.addComment);

router
  .route("/:videoId/comments/:commentId")
  .put(authMiddleware.verifyJWT, commentController.updateComment)
  .delete(authMiddleware.verifyJWT, commentController.deleteComment);
module.exports = router;
