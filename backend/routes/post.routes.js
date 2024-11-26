const {Router} = require("express");
const UserMiddleware = require("../middleware/user.middleware");
const { createPost, updatePost, deletePost, readPost } = require("../controller/post.controller");
const router = Router();

router.post('/createPost', UserMiddleware, createPost);
router.get('/read', readPost)
router.put('/:postId', UserMiddleware, updatePost);
router.delete('/:postId', UserMiddleware, deletePost);

module.exports = router;