const { User, Post } = require("../db");
const zod = require("zod");

const postValidation = zod.object({
    title: zod.string(),
    content: zod.string(),
    tags: zod.string().array().optional(),
});

const updatedPostValidation = zod.object({
    title: zod.string().optional(),
    content: zod.string().optional(),
    tags: zod.string().array().optional(),
});

const createPost = async (req, res) => {
    const { email } = req.headers;

    const validation = postValidation.safeParse(req.body);
    if (!validation.success) {
        return res.status(400).json({
            msg: "Validation failed",
            errors: validation.error.issues,
        });
    }

    const { title, content, tags } = validation.data;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ msg: "User not found" });
        }

        const post = await Post.create({
            title,
            content,
            author: user._id,
            tags,
        });

        await User.findOneAndUpdate({
            email
        }, {
            $addToSet: {
                posts: post._id
            }
        })

        res.status(201).json({
            msg: "Post created successfully",
            post,
        });
    } catch (error) {
        res.status(500).json({
            error: error.message,
        });
    }
};

const readPost = async (req, res) => {
    try {
        const posts = await Post.find({}).populate("author", "email");
        res.json({ posts });
    } catch (error) {
        res.status(500).json({
            error: error.message,
        });
    }
};

const updatePost = async (req, res) => {
    const { email } = req.headers;
    const postId = req.params.postId;

    const validation = updatedPostValidation.safeParse(req.body);
    if (!validation.success) {
        return res.status(400).json({
            msg: "Validation failed",
            errors: validation.error.issues,
        });
    }

    const { title, content, tags } = validation.data;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ msg: "User not found" });
        }

        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ msg: "Post not found" });
        }

        if (!post.author.equals(user._id)) {
            return res.status(403).json({
                msg: "You are not authorized to update this post",
            });
        }

        const updatedPost = await Post.findByIdAndUpdate(
            postId,
            { $set: { title, content, tags } },
            { new: true }
        );

        res.json({
            msg: "Post updated successfully",
            updatedPost,
        });
    } catch (error) {
        res.status(500).json({
            error: error.message,
        });
    }
};

const deletePost = async (req, res) => {
    const { email } = req.headers;
    const postId = req.params.postId;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ msg: "User not found" });
        }

        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ msg: "Post not found" });
        }

        if (!post.author.equals(user._id)) {
            return res.status(403).json({
                msg: "You are not authorized to delete this post",
            });
        }

        await Post.findByIdAndDelete(postId);
        res.json({
            msg: "Post deleted successfully",
            postId,
        });
    } catch (error) {
        res.status(500).json({
            error: error.message,
        });
    }
};

module.exports = {
    createPost,
    readPost,
    updatePost,
    deletePost,
};
