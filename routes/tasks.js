const express = require("express");
const router = express.Router();

//Loading the main function from taskController module
const {
  getAllTasks,
  addTask,
  updateTask,
  deleteTask,
} = require("../controllers/taskController");

router.get("/", getAllTasks);
router.post("/", addTask);
router.put("/:taskID", updateTask);
router.delete("/:taskID", deleteTask);

module.exports = router;