import React, { useContext, useState } from "react";
import { UserContext } from "../context/userContext";
import LeftMenu from "../components/LeftMenu";
import TaskList from "../components/TaskList";
import tasksData from "../fakeTasks";

export default function Dashboard() {
  const { user } = useContext(UserContext);

  const [categories, setCategories] = useState([
    "All",
    "Work",
    "Personal",
    "Leisure",
    "Health",
    "Hobby",
  ]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [tasks, setTasks] = useState(tasksData);

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
  };

  const handleAddCategory = (newCategory) => {
    setCategories([...categories, newCategory]);
  };

  const filteredTasks = tasks.filter(
    (task) =>
      selectedCategory === "All" || task.category === selectedCategory
  );

  const currentHour = new Date().getHours();
  const greeting =
    currentHour < 12
      ? "Good Morning"
      : currentHour < 18
      ? "Good Afternoon"
      : "Good Evening";

  return (
    <>
      {/* Dashboard Layout */}
      <div className="dashboard-container">
        {/* Left Menu */}
        <div className="left-menu">
          <LeftMenu
            categories={categories}
            onCategorySelect={handleCategorySelect}
            onAddCategory={handleAddCategory}
          />
        </div>

        {/* Main Content */}
        <div className="main-content">
          <h2>
            {greeting}, {user?.name || "Guest"}!
          </h2>
          <TaskList tasks={filteredTasks} setTasks={setTasks} />
        </div>
      </div>
    </>
  );
}
