import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function TaskForm({ tasks, setTasks }) {
  const { id } = useParams(); // Extract task ID from the route
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: "low",
    dueDate: "",
    category: "Work",
  });

  useEffect(() => {
    if (id) {
      // Find the task to edit based on the ID
      const taskToEdit = tasks.find((task) => task.id === parseInt(id, 10));
      if (taskToEdit) {
        setFormData(taskToEdit); // Pre-fill the form with task details
      }
    }
  }, [id, tasks]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (id) {
      // Update an existing task
      const updatedTasks = tasks.map((task) =>
        task.id === parseInt(id, 10) ? { ...task, ...formData } : task
      );
      setTasks(updatedTasks);
      console.log("Updated Task:", formData);
    } else {
      // Add a new task
      const newTask = { ...formData, id: Date.now() }; // Add unique ID for the new task
      setTasks((prevTasks) => [...prevTasks, newTask]);
      console.log("New Task:", newTask);
    }

    navigate("/"); // Redirect to the home/dashboard page
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
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
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
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Category</label>
          <select
            className="form-select"
            value={formData.category}
            onChange={(e) =>
              setFormData({ ...formData, category: e.target.value })
            }
          >
            <option value="Work">Work</option>
            <option value="Personal">Personal</option>
            <option value="Leisure">Leisure</option>
            <option value="Health">Health</option>
            <option value="Hobby">Hobby</option>
          </select>
        </div>
        <button type="submit" className="btn btn-primary">
          {id ? "Update Task" : "Add Task"}
        </button>
      </form>
    </div>
  );
}
