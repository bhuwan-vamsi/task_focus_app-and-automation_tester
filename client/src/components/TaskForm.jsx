import React, { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { updateTask, addTask } from "../services/taskServices";

export default function TaskForm({ tasks, setTasks }) {
  const { id } = useParams(); // Extract task ID from the route
  const location = useLocation(); // Access the state passed from the previous page
  const navigate = useNavigate();

  const task = location.state?.task; // Retrieve task from state

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: "low",
    dueDate: "",
  });

  const [error, setError] = useState("");

  useEffect(() => {
    if (task) {
      // Pre-fill form data with the task details
      setFormData({
        title: task.title,
        description: task.description,
        priority: task.priority,
        dueDate: task.dueDate.split("T")[0], // Format date for input
      });
    }
  }, [task]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (id) {
        await updateTask(task._id, formData); // Pass task ID and updated data
      } else {
        await addTask(formData);
      }
      navigate("/");
    } catch (error) {
      setError("Failed to save task. Please try again.");
    }
  };  

  return (
    <div className="container mt-4">
      <h2>{id ? "Edit Task" : "Add Task"}</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Title</label>
          <input
            type="text"
            className="form-control"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Description</label>
          <textarea
            className="form-control"
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
          ></textarea>
        </div>
        <div className="mb-3">
          <label className="form-label">Priority</label>
          <select
            className="form-select"
            value={formData.priority}
            onChange={(e) =>
              setFormData({ ...formData, priority: e.target.value })
            }
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>
        <div className="mb-3">
          <label className="form-label">Due Date</label>
          <input
            type="date"
            className="form-control"
            value={formData.dueDate}
            onChange={(e) =>
              setFormData({ ...formData, dueDate: e.target.value })
            }
            required
          />
          {error && <p className="text-danger mt-1">{error}</p>}
        </div>
        <button type="submit" className="btn btn-primary">
          {id ? "Update Task" : "Add Task"}
        </button>
      </form>
    </div>
  );
}
