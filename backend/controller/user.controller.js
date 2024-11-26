const zod = require("zod");
const { User } = require("../db");

const userInput = zod.object({
    username: zod.string(2,"Username is required"),
    email: zod.string().email("Invalid email address"),
    password: zod.string().min(6, "Password nust be at least 6 characters"),
    profilePicture: zod.string().optional(),
    bio: zod.string().optional()
})

const updateUserInput = zod.object({
    username: zod.string().optional(),
    password: zod.string().optional(),
    profilePicture: zod.string().optional(),
    bio: zod.string().optional(),
})

const createUser = async (req, res) => {
    const validation = userInput.safeParse(req.body);
    if(!validation.success){
        return res.status(403).json({
            msg: "Please enter correct input"
        })
    }

    const {username, email, password, profilepicture, bio} = validation.data;
    try {
        const user = await User.create({
            username,
            email,
            password,
            profilepicture,
            bio
        })
        res.json({
            msg: 'User created successfully'
        })
    } catch (error) {
        res.status(500).json({
            error: error.message
        })
    }
    
}

const getUserInfo = async (req, res) => {
    const {email, password} = req.headers;

    try {
        const user = await User.findOne({
            email,
            password
        })
        if(!user) {
            return res.json({
                msg: 'User not found'
            })
        }

        res.json({
            user: user.username,
            email: user.email
        })
    } catch (error) {
        res.status(500).json({
            error: error.message
        })
    }
}

const updateUser = async (req, res) => {
    const {email, password} = req.headers
    const validation = updateUserInput.safeParse(req.body);
    if(!validation.success){
        return res.status(403).json({
            msg: "Please enter correct input"
        })
    }

    const {username, newPassword, profilepicture, bio} = validation.data;

    try {
        const user = await User.findOneAndUpdate({
            email
        }, {
            username,
            password,
            profilepicture,
            bio
        })
        res.json({
            msg: 'User info updated successfully'
        })
    } catch (error) {
        res.json({
            error: error.message
        })
    }
}

module.exports = {
    createUser,
    getUserInfo,
    updateUser
}