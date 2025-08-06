const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  fName: {
    type: String,
    required: true,
    trim: true,
  },
  sName: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  createdDate: {
    type: String,
    default: () => {
      const now = new Date();
      const day = now.getDate();
      const month = now.getMonth() + 1;
      const year = now.getFullYear();
      return `${day}/${month}/${year}`;
    },
  },
  loginAttempts: {
  type: Number,
  default: 0
},
lockedUntil: {
  type: Date,
  default: null
}
});

const User = mongoose.model("User", userSchema);

module.exports = User;
