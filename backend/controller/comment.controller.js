const { Post, User, Comment } = require("../db")

const createComment = async (req, res) => {
    const {content} = req.body
    const {email} = req.headers
    const {postId} = req.params

    try {
        const post = await Post.findById(postId);
        const user = await User.findOne({email});
        if(!post) {
            return res.status(404).json({
                msg: "No post found"
            })
        }

        if(!user){
            return res.status(404).json({
                msg: "no user found"
            })
        }

        const comment = await Comment.create({
            postId: postId,
            user: user._id,
            content: content
        })

        await Post.findByIdAndUpdate(postId, {
            $addToSet: {
                comment: comment._id
            }
        }, {
            new: true
        })
        res.json({
            msg: `You commented on ${postId}`,
            comment
        })
    } catch (error) {
        res.status(500).json({
            error: error.message
        })
    }
}
const updateComment = async (req, res) => {
    const {commentId} = req.params
    const {email} = req.headers
    const content = req.body.content

    try {
        const user = await User.findOne({email});
        const comment = await Comment.findById(commentId);
        if(!comment.user.equals(user._id)){
            return res.status(403).json({
                msg: "You are not authorized to update this comment",
            });
        }
        const updatedComment = await Comment.findByIdAndUpdate(commentId, {
            content
        })
        res.json({
            msg: "Comment Updated"
        })
    } catch (error) {
        res.status(500).json({
            error: error.message
        })
    }
}
const deleteComment = async (req, res) => {
    const {commentId} = req.params
    const {email} = req.headers
    try {
        const user = await User.findOne({email});
        const comment = await Comment.findById(commentId);

        if(!comment.user.equals(user._id)){
            return res.status(403).json({
                msg: "You are not authorized to delete this comment",
            });
        }

        const deleteComment = await Comment.findByIdAndDelete(commentId);
        res.json({
            msg: "Commnet deleted"
        })
    } catch (error) {
        res.status(500).json({
            error: error.message
        })
    }
}

module.exports = {
    createComment,
    updateComment,
    deleteComment
}