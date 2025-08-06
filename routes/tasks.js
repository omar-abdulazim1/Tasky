const express = require("express");
const auth = require("../middlewares/authentication");
const router = express.Router();

//Loading the main function from taskController module
const {
  getAllTasks,
  addTask,
  updateTask,
  deleteTask,
} = require("../controllers/taskController");

router.get("/", auth, getAllTasks);
router.post("/", auth, addTask);
router.put("/:id", auth, updateTask);
router.delete("/:id", auth, deleteTask);

module.exports = router;