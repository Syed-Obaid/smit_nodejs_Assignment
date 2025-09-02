const express = require("express");
const app = express();
const { connectDB } = require("../config/mongoose");
const { User } = require("../model/user");
app.use(express.json());

app.post("/users", async (req, res) => {
  try {
    const data = req.body;
    const user = await User.create(data);
    res.status(201).json({ message: "User created successfully", user });
  } catch (error) {
    res.status(500).json({ message: "Error Creating user", error });
    console.log("Error Creating user", error);
  }
});

app.get("/users", async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json({ message: "Users fetched successfully", users });
  } catch (error) {
    res.status(500).json({ message: "Error fetching users", error });
    console.log("Error fetching users", error);
  }
});

app.get("/users/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const users = await User.findById(id);
    res.status(200).json({ message: "User fetched successfully", users });
  } catch (error) {
    res.status(500).json({ message: "Error fetching user", error });
  }
});

app.put("/users/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;
    const user = await User.findByIdAndUpdate(id, data);
    res.status(200).json({ message: "User updated successfully", data });
  } catch (error) {
    res.status(500).json({ message: "Error updating user", error });
    console.log("Error updating user", error);
  }
});

app.delete("/users/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByIdAndDelete(id);
    res.status(200).json({ message: "User deleted successfully", user });
  } catch (error) {
    res.status(500).json({ message: "Error deleting user", error });
    console.log("Error deleting user", error);
  }
});

connectDB()
  .then(() => {
    console.log("Database connected Successfully");
    app.listen(3000, () => {
      console.log("Server is running on port 3000");
    });
  })
  .catch((err) => {
    console.log("Database connection failed");
  });
