const joi = require("joi");
const tasks = require("../models/taskModel");

//Get all tasks
async function getAllTasks(req, res) {
  try {
    const allTasks = await tasks.find({});
    return res.status(200).json(allTasks);
  } catch (err) {
    return res.status(500).send("Failed to find tasks");
  }
}

//Add a task
async function addTask(req, res) {
const taskSchema = joi.object ({
user: joi.string().required(),
  title: joi.string().required(),
due: joi.date().required(),
priority: joi.string().valid("low", "medium", "high").required(),
description: joi.string().allow("").optional(),
status: joi.string().valid("completed", "incompleted").required()
})

const result = taskSchema.validate(req.body);
if (result.error) 
  return res.status(400).send(result.error.details[0].message);

const {title, due, priority, description, status} = result.value;
try {
const newTask = new tasks ({
  title,
  due,
  priority,
  description,
  status
});

await newTask.save();
return res.status (201).send("The task created successfully");
} catch (err) {
  return res.status(500).send("Faild to create the task");
}
}

// Update a task by ID
async function updateTask(req, res) {
const taskID = req.params.id;
  const {title, due, priority, description, status} = req.body;

  try {
  const findTask = await tasks.findById(taskID);  
if(!findTask)
  return res.status(404).send("The task is not found");

//updating the provided fields
  if (title) findTask .title = title;
  if (due)  findTask .due = due;
  if(priority) findTask .priority = priority;
  if (description) findTask .description = description;
    if (status) findTask .status= status;
  
  await findTask .save();
  return res.status(200).send("The task is updated successfully");
} catch (err) {
  return res.status(500).send("Something went wrong");
}
}

// Delete a task by ID
async function deleteTask(req, res) {
  const taskID = req.params.id;

  try {
    const findTask = await tasks.findByIdAndDelete (taskID);
if(!findTask) return res.status(404).send("The task is not found");

    return res.status(200).send("The task is deleted successfully");
  } catch (err) {
    return res.status(500).send("Something went wrong");
  }
}

module.exports = {
  getAllTasks,
  addTask,
  updateTask,
  deleteTask
};
