const express = require("express");
const router = express.Router();

//Load controller functions
const {
 reg,
 login,
 getUsers,
 updateUser,
 deleteUser
} = require ("../controllers/userController");

router.get ("/", getUsers);
router.post ("/register", reg);
router.post("/login", login);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);

module.exports = router;