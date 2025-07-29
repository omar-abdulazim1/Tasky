const fs = require("fs");
const path = require("path");
const tasksFilePath = path.join(__dirname, "../data/tasks.json");

// load tasks from the JSON file
function loadTasks() {
  const readTasks = fs.readFileSync(tasksFilePath, "utf-8");
  return JSON.parse(readTasks);
}

// save tasks to the JSON file
function saveTasks(task) {
  fs.writeFileSync(tasksFilePath, JSON.stringify(task, null, 2));
}

module.exports = { loadTasks, saveTasks };