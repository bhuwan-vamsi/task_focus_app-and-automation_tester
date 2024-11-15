import React from "react";
import { Link } from "react-router-dom";
import TaskItem from "./TaskItem";

export default function TaskList({ tasks = [], setTasks }) {
  // Handle task completion toggle
  const handleToggleComplete = (taskId) => {
    const updatedTasks = tasks.map((task) =>
      task.id === taskId ? { ...task, completed: !task.completed } : task
    );
    setTasks(updatedTasks);
  };

  // Handle task deletion
  const handleDeleteTask = (taskId) => {
    const updatedTasks = tasks.filter((task) => task.id !== taskId);
    setTasks(updatedTasks);
  };

  // Sorting logic: Priority first, completed tasks last
  const sortedTasks = [...tasks].sort((a, b) => {
    if (a.completed !== b.completed) return a.completed ? 1 : -1;
    const priorityOrder = { high: 1, medium: 2, low: 3 };
    return priorityOrder[a.priority] - priorityOrder[b.priority];
  });

  return (
    <div>
      {sortedTasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          onToggleComplete={handleToggleComplete}
          onDelete={handleDeleteTask}
        />
      ))}
      <Link
        to="/tasks/new"
        className="btn btn-success rounded-circle position-fixed"
        style={{
          width: "60px",
          height: "60px",
          bottom: "20px",
          right: "20px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <i className="bi bi-plus" style={{ fontSize: "24px" }}></i>
      </Link>
    </div>
  );
}
