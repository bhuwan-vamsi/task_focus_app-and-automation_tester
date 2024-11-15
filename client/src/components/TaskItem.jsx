import React from "react";
import { Link } from "react-router-dom";

export default function TaskItem({ task, onToggleComplete, onDelete }) {
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
          <span className="ms-2">{task.dueDate}</span>
        </div>
        <div>
          <button
            className="btn btn-outline-white me-2"
            onClick={() => onToggleComplete(task.id)}
          >
            <i
              className="bi bi-check-circle-fill"
              style={{ color: "green", fontSize: "1.2rem" }}
            ></i>
          </button>
          <Link to={`/tasks/edit/${task.id}`} className="btn btn-outline-primary me-2">
            Edit
          </Link>
          <button
            className="btn btn-outline-danger"
            onClick={() => onDelete(task.id)}
          >
            <i className="bi bi-trash-fill"></i>
          </button>
        </div>
      </div>
    </div>
  );
}
