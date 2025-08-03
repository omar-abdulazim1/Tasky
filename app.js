const express = require("express");
const tasky= express();
const port = 3000;

// Middleware to parse incoming JSON requests
tasky.use(express.json());

// Import task routes from the routes
const taskRoutes = require("./routes/tasks");
tasky.use("/tasks", taskRoutes);

//import user routes from routes
const userRoutes = require("./routes/users");
tasky.use ("/users", userRoutes);

tasky.get('/', (req, res) => res.send("Welcome to Tasky"));

  // Start the server
tasky.listen(port, () => console.log("Server is running"));