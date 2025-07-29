const express = require("express");
const tasky= express();

// Middleware to parse incoming JSON requests
tasky.use(express.json());

// Import task routes from the routes folder
const taskRoutes = require("./routes/tasks");
tasky.use("/tasks", taskRoutes);

tasky.get('/', (req, res) => res.send("Welcome to Tasky"));

  // Start the server
tasky.listen(3000, () => console.log("Server is running"));