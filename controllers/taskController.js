const { loadTasks, saveTasks } = require("../models/taskModel");

//Get all tasks
async function getAllTasks(req, res) {
  const getTasks = await loadTasks();
  res.json(getTasks);
}

//Add a task
async function addTask(req, res) {
  const tasks = await loadTasks();

  const {title, description, due} = req.body;

  //input validation
  if (!title?.trim() || !due?.trim()) 
return res.status(400).json({error: "Fill out all the fields" });

//converting due into date
const deadline= new Date (due)
  
//date validation
if (isNaN(deadline.getTime()))
return res.status(400).json ({error: "The due is invalid"});

    const newTask = {
    taskID: Date.now(),
    title: title.trim(),
    due: due,
    description: description.trim(),
    completed: false,
  };
  tasks.push(newTask);
  await saveTasks(tasks);
  res.status(201).json(newTask);
}

// Update a task by ID
async function updateTask(req, res) {
  const tasks = await loadTasks();
  
  //find the task by ID
  const taskID = Number(req.params.taskID);
  const findTask = tasks.find(task => task.taskID === taskID);
  if (!findTask) return res.status(404).send("The task is not exist");

  //extract the task data
  const {title, description, due, completed} = req.body;

  //update the data
  if (title) findTask.title = title;
  if (description) findTask.description = description;
  if (due)  findTask.due = due;
    if (completed) findTask.completed = completed;
  
  await saveTasks(tasks);
  return res.status(200).send("The task is updated successfully");
}

// Delete a task by ID
async function deleteTask(req, res) {
  const tasks = await loadTasks();
  const taskID = Number(req.params.taskID);
  const findTask = tasks.find(task => task.taskID === taskID);

  if (!findTask) return res.status(404).send("The task is not exist");

  const deletedTask = tasks.filter (task => task.taskID != taskID);
  await saveTasks(deletedTask);
  return res.status(200).send("The task deleted successfully");
}

module.exports = {
  getAllTasks,
  addTask,
  updateTask,
  deleteTask
};
