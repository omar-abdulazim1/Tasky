const express = require("express");
const router = express.Router();
const auth = require("../middlewares/authintication");
const authLimiter = require("../middlewares/rateLimiter");

//Load controller functions
const {
 reg,
 login,
 logout,
 userProfile,
 getUsers,
 updateUser,
 deleteUser,
 refreshToken
} = require ("../controllers/userController");

router.get ("/", auth, getUsers);
router.get("/profile", auth, userProfile);
router.post ("/register", reg);
router.post("/login", authLimiter, login);
router.post("/logout", auth, logout);
router.post("/refresh", refreshToken);
router.put("/update", auth, updateUser);
router.delete("/delete", auth, deleteUser);

module.exports = router;