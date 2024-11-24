const express = require("express");
const router = express.Router();
const {
  getTasks,
  addTask,
  updateTask,
  deleteTask,
} = require("../controllers/taskController");
const { authenticateToken } = require("../helpers/auth");

router.get("/", authenticateToken, getTasks);
router.post("/", authenticateToken, addTask);
router.put("/", authenticateToken, updateTask);
router.delete("/", authenticateToken, deleteTask);

module.exports = router;
