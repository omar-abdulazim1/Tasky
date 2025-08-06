const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema ({
user: {
type: mongoose.Schema.Types.ObjectId,
  ref: 'User',
  required: true
},
  title: {
  type: String,
  required: true,
  trim: true
},
due: {
  type: Date,
  required: true
},
priority: {
type: Number,
enum: [1, 2, 3],
default: 2,
required: true
},
description: {
  type: String,
  trim: true
},
createdDate: {
  type: String,
  default: () => {
    const taskDate= new Date();
    const day = taskDate.getDate();
    const month = taskDate.getMonth() + 1;
    const year = taskDate.getFullYear();
    return `${day}/${month}/${year}`;
  }
}
});

const Task = mongoose.model("Task", taskSchema);

module.exports= Task;
