const { User } = require("../db");

const UserMiddleware = async (req, res, next) => {
    const {email, password} = req.headers;

    try {
        const user = User.findOne({
            email,
            password
        })
        .then((user) => {
            if(user) {
                next()
            } else {
                res.status(403).json({
                    msg: "Unauthorized access"
                })
            }
        })
    } catch (error) {
        res.json({
            error: error.message
        })
    }
}

module.exports = UserMiddleware;