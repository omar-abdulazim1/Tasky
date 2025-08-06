const express = require("express");
const tasky= express();
const cookieParser = require("cookie-parser");
const errorHandler = require("./middlewares/errorHandler");
const morgan= require("morgan");
require("dotenv").config();
const connectDB = require("./config/db");
connectDB();
const port = 3000;

// Middleware to parse incoming JSON requests
tasky.use(express.json());

// Import task routes from the routes
const taskRoutes = require("./routes/tasks");
tasky.use("/tasks", taskRoutes);

//import user routes from routes
const userRoutes = require("./routes/users");
tasky.use ("/users", userRoutes);

//custom middleware to handle errors
tasky.use(errorHandler);

//middleware to track the requests
tasky.use(morgan("dev"));

// Middleware to parse cookie
tasky.use(cookieParser());

  // Start the server
tasky.listen(port, () => console.log("Server is running"));