const fs = require("fs/promises");
const path = require("path");
const tasksFilePath = path.join(__dirname, "../data/tasks.json");

// load tasks from the JSON file
async function loadTasks() {
  const readTasks = await fs.readFile(tasksFilePath, "utf-8");
  return JSON.parse(readTasks);
}

// save tasks to the JSON file
async function saveTasks(task) {
  const json = JSON.stringify(task, null, 2);
  await fs.writeFile(tasksFilePath, json);
}

module.exports = { loadTasks, saveTasks };