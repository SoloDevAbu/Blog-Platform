const {Router} = require("express");
const { createUser, getUserInfo, updateUser } = require("../controller/user.controller");
const UserMiddleware = require("../middleware/user.middleware");
const router = Router();

router.post("/signup", createUser)
router.get("/profile",UserMiddleware, getUserInfo);
router.put("/update",UserMiddleware, updateUser)

module.exports = router;