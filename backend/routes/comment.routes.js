const {Router} = require("express");
const { createComment, updateComment, deleteComment } = require("../controller/comment.controller");
const UserMiddleware = require("../middleware/user.middleware");
const router = Router();

router.post('/posts/:postId',UserMiddleware, createComment);
router.put('/posts/:commentId',UserMiddleware, updateComment);
router.delete('/posts/:commentId',UserMiddleware, deleteComment);

module.exports = router;