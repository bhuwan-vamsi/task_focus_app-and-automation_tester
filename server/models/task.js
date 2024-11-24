const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
  {
    title: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    priority: {
        type: String,
        enum: ["low", "medium", "high"],
        default: "low"
    },
    dueDate: {
        type: Date,
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    }, // Reference to User
    completed: {
        type: Boolean,
        default: false
    }, // Tracks if the task is completed
  },
  { timestamps: true }
);

const task = mongoose.model("Task", taskSchema)
module.exports = task;
