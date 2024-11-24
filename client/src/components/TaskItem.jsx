import React from "react";
import { Link } from "react-router-dom";

export default function TaskItem({ task, onToggleComplete, onDelete }) {
  const isOverdue = new Date(task.dueDate) < new Date();

  // Format the due date
  const formattedDueDate = new Date(task.dueDate).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className={`card mb-3 ${task.completed ? "bg-light" : ""}`}>
      <div className="card-body d-flex justify-content-between align-items-center">
        <div>
          <h5
            className="card-title"
            style={{
              textDecoration: task.completed ? "line-through" : "none",
              color: task.completed ? "grey" : "black",
            }}
          >
            {task.title}
          </h5>
          <p className="card-text text-muted">{task.description}</p>
          <span
            className={`badge ${
              task.priority === "high"
                ? "bg-danger"
                : task.priority === "medium"
                ? "bg-warning"
                : "bg-success"
            }`}
          >
            {task.priority}
          </span>
          <span className="ms-2">{formattedDueDate}</span>
          {isOverdue && (
            <div className="text-danger mt-2">
              Task not completed. Due date has passed.
            </div>
          )}
        </div>
        <div>
          <button
            className="btn btn-outline-white me-2"
            onClick={() => onToggleComplete(task.id)}
            disabled={isOverdue}
          >
            <i
              className="bi bi-check-circle-fill"
              style={{ color: isOverdue ? "gray" : "green", fontSize: "1.2rem" }}
            ></i>
          </button>
          <Link
            to={`/tasks/edit/${task._id}`} // Ensure this dynamically uses the task's id
            state={{ task }}
            className="btn btn-outline-primary me-2"
            style={{
              pointerEvents: isOverdue ? "none" : "auto",
              opacity: isOverdue ? 0.5 : 1,
            }}
          >
            Edit
          </Link>
          <button
            className="btn btn-outline-danger"
            onClick={() => onDelete(task._id)}
            disabled={isOverdue}
          >
            <i
              className="bi bi-trash-fill"
              style={{ color: isOverdue ? "gray" : "red" }}
            ></i>
          </button>
        </div>
      </div>
    </div>
  );
}
