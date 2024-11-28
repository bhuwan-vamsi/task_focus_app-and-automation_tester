const Task = require("../models/task");

const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.userId });
    res.json(tasks);
  } catch (error) {
    console.error("Error fetching tasks:", error.message);
    res.status(500).json({ error: "Failed to fetch tasks" });
  }
};

const addTask = async (req, res) => {
  try {
    const { title, description, priority, dueDate } = req.body;

    if (!title || !dueDate) {
      return res.status(400).json({ error: "Title and due date are required" });
    }

    const task = await Task.create({
      user: req.userId,
      title,
      description,
      priority,
      dueDate,
    });

    res.status(201).json({_id: task._id, task});
  } catch (error) {
    console.error("Error adding task:", error.message);
    res.status(500).json({ error: "Failed to add task" });
  }
};

const updateTask = async (req, res) => {
  try {
    const { id } = req.body;

    if (!id) {
      return res.status(400).json({ error: "Task ID is required" });
    }

    const task = await Task.findOneAndUpdate(
      { _id: id, user: req.userId },
      req.body,
      { new: true }
    );

    if (!task) {
      return res.status(404).json({ error: "Task not found or unauthorized" });
    }

    res.json(task);
  } catch (error) {
    console.error("Error updating task:", error.message);
    res.status(500).json({ error: "Failed to update task" });
  }
};

const deleteTask = async (req, res) => {
  try {
    const { id } = req.body;

    if (!id) {
      return res.status(400).json({ error: "Task ID is required" });
    }

    const task = await Task.findOneAndDelete({
      _id: id, // Ensure ObjectId
      user: req.userId,
    });

    if (!task) {
      return res.status(404).json({ error: "Task not found or unauthorized" });
    }

    res.status(200).json({ message: "Task deleted successfully", taskId: id });
  } catch (error) {
    console.error("Error deleting task:", error.message);
    res.status(500).json({ error: "Failed to delete task" });
  }
};

module.exports = { getTasks, addTask, updateTask, deleteTask };
