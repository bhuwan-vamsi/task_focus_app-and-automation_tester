import React from "react";
import { Link } from "react-router-dom";
import TaskItem from "./TaskItem";
import { deleteTask, toggleTaskComplete } from "../services/taskServices";

export default function TaskList({ tasks, setTasks }) {

  // Handle task completion toggle
  const handleToggleComplete = async (taskId) => {
    try {
      await toggleTaskComplete(taskId, !tasks.find((task) => task._id === taskId).completed);
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task._id === taskId ? { ...task, completed: !task.completed } : task
        )
      );
    } catch (error) {
      console.error("Error toggling task completion:", error);
    }
  };  

  // Handle task deletion
  const handleDeleteTask = async (taskId) => {
    try {
      await deleteTask(taskId); // Call API to delete task
      setTasks((prevTasks) => prevTasks.filter((task) => task._id !== taskId)); // Update state with a new array
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };  

  // Sorting logic: Priority first, completed tasks last
  const sortedTasks = [...tasks].sort((a, b) => {
    if (a.completed !== b.completed) return a.completed ? 1 : -1;
    const priorityOrder = { high: 1, medium: 2, low: 3 };
    return priorityOrder[a.priority] - priorityOrder[b.priority];
  });

  return (
    <>
      <div className="container mt-4">
        {sortedTasks.length === 0 ? (
          <p>No tasks found. Add a new task!</p>
        ) : (
          sortedTasks.map((task) => (
            <TaskItem
              key={task._id}
              task={task}
              onToggleComplete={handleToggleComplete}
              onDelete={handleDeleteTask}
            />
          ))
        )}
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
    </>
  );
}
