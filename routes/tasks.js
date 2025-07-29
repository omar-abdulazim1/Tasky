const express = require("express");
const router = express.Router();
  
const {
  getAllTasks,
  addTask,
  updateTask,
  deleteTask,
} = require("../controllers/taskController");

router.get("/", getAllTasks);
router.post("/", addTask);
router.put("/:id", updateTask);
router.delete("/:id", deleteTask);

module.exports = router;
