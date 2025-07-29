const { loadTasks, saveTasks } = require("../models/taskModel");

//Get all tasks
function getAllTasks(req, res) {
  const getTasks = loadTasks();
  res.json(getTasks);
}

//Add a task
function addTask(req, res) {
  const tasks = loadTasks();

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
    id: Date.now().toString(),
    title: title.trim(),
    due: due,
    description: description.trim(),
    completed: false,
  };
  tasks.push(newTask);
  saveTasks(tasks);
  res.status(201).json(newTask);
}

// Update a task by ID
function updateTask(req, res) {
  const tasks = loadTasks();
  const taskId = req.params.id;
  const task = tasks.find(t => t.id === taskId);

  if (!task) return res.status(404).json({ message: "Task not found" });

  task.title = req.body.title || task.title;
  task.completed = req.body.completed !== undefined ? req.body.completed : task.completed;

  saveTasks(tasks);
  res.json(task);
}

// Delete a task by ID
function deleteTask(req, res) {
  let tasks = loadTasks();
  const taskId = req.params.id;
  const taskIndex = tasks.findIndex(t => t.id === taskId);

  if (taskIndex === -1) return res.status(404).json({ message: "Task not found" });

  const deletedTask = tasks.splice(taskIndex, 1)[0];
  saveTasks(tasks);
  res.json(deletedTask);
}

module.exports = {
  getAllTasks,
  addTask,
  updateTask,
  deleteTask,
};
