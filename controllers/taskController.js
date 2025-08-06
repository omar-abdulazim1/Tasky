const joi = require("joi");
const tasks = require("../models/taskModel");

//Add a task
async function addTask(req, res, next) {
const taskSchema = joi.object ({
title: joi.string().required(),
due: joi.date().required(),
priority: joi.number().valid(1, 2, 3).required(),
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
  status,
user: req.user.id
});

await newTask.save();
return res.status (201).send("The task created successfully");
} catch (err) {
  next(err);
}
}

// Update a task by ID
async function updateTask(req, res, next) {
const taskID = req.params.id;
  const {title, due, priority, description, status} = req.body;

  try {
  const findTask = await tasks.findOne({ _id: taskID, user: req.user.id });
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
  next(err);
}
}

// Delete a task by ID
async function deleteTask(req, res, next) {
  const taskID = req.params.id;

  try {
    const findTask = await tasks.findOneAndDelete({
      _id: taskID,
      user: req.user.id
    });
if(!findTask) return res.status(404).send("The task is not found");

    return res.status(200).send("The task is deleted successfully");
  } catch (err) {
    next(err);
  }
}

//Get all tasks
async function getAllTasks(req, res, next) {
  try {
const {sort, status} = req.query;

//build filter logic
    const filter = { user: req.user.id };
    if (status)
      filter.status = status;

//build sort logic
    const sortOptions = req.query.sort;
let sortBy = {};

if (sortOptions === "due")
  sortBy= { due: 1 };
else if (sortOptions === "priority")
sortBy= { priority: -1 };

const allTasks = await tasks.find(filter).sort(sortBy);
    return res.status(200).json(allTasks);
  } catch (err) {
    next(err);
  }
}

module.exports = {
    addTask,
  updateTask,
  deleteTask,
  getAllTasks
};
