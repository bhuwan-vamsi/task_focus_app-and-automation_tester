import React, { useContext, useState, useEffect } from "react";
import { UserContext } from "../context/userContext";
import TaskList from "../components/TaskList";
import { getTasks } from "../services/taskServices";
import { useNavigate } from "react-router-dom"; // To redirect unauthenticated users

export default function Dashboard() {
  const { user, loading } = useContext(UserContext); // Access user and loading state from context
  const navigate = useNavigate(); // To navigate if user is not logged in

  const [tasks, setTasks] = useState([]);
  const [taskLoading, setTaskLoading] = useState(true); // Separate loading for tasks
  const [error, setError] = useState("");

  useEffect(() => {
    if (!loading && !user) {
      navigate("/login");
    }
  }, [loading, user, navigate]);  

  useEffect(() => {
    if (user) {
      const loadData = async () => {
        try {
          setTaskLoading(true);

          // Fetch tasks
          const taskData = await getTasks();
          setTasks(taskData);

          setTaskLoading(false);
        } catch (err) {
          console.error("Error loading data:", err);
          setError("Failed to load tasks or categories.");
          setTaskLoading(false);
        }
      };

      loadData();
    }
  }, [user]);

  const currentHour = new Date().getHours();
  const greeting =
    currentHour < 4
      ? "Hello! Midnight Tasker"
      : currentHour < 12
      ? "Good Morning"
      : currentHour < 18
      ? "Good Afternoon"
      : "Good Evening";

  if (loading) {
    return <p>Loading...</p>; // Wait until UserContext finishes loading
  }

  if (!user) {
    return <p>Please Login to continue.</p>; // Show message if user is not logged in
  }

  return (
    <div className="dashboard-container">
      {taskLoading ? (
        <p>Loading tasks...</p>
      ) : error ? (
        <p className="text-danger">{error || "No tasks found"}</p>
      ) : (
        <>
          {/* Main Content */}
          <div className="main-content">
            <h2>
              {greeting}, {user?.name}!
            </h2>
            <TaskList tasks={tasks} setTasks={setTasks} />
          </div>
        </>
      )}
    </div>
  );
}
