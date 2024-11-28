const API_BASE_URL = "http://localhost:8000/tasks";

export const getTasks = async () => {
  try {
    const response = await fetch(API_BASE_URL, {
      method: "GET",
      credentials: "include", // Include cookies for authentication
    });
    if (!response.ok) {
      throw new Error("Failed to fetch tasks");
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching tasks:", error);
    throw error;
  }
};

export const addTask = async (taskData) => {
  try {
    const response = await fetch(API_BASE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include", // Include cookies for authentication
      body: JSON.stringify(taskData),
    });
    return await response.json();
  } catch (error) {
    console.error("Error adding task:", error);
    throw error;
  }
};

export const updateTask = async (taskId, taskData) => {
  try {
    const response = await fetch(`${API_BASE_URL}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ id: taskId, ...taskData }),
    });

    if (!response.ok) {
      throw new Error("Failed to update task");
    }

    return await response.json();
  } catch (error) {
    console.error("Error updating task:", error);
    throw error;
  }
};

export const deleteTask = async (taskId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/tasks`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include", // Pass cookies
      body: JSON.stringify({ id: taskId }), // Send task ID in body
    });

    if (!response.ok) {
      const error = await response.json();
      console.error("Error deleting task:", error);
      throw new Error(error.error || "Failed to delete task");
    }

    return await response.json();
  } catch (error) {
    console.error("Error deleting task:", error.message);
    throw error;
  }
};

export const toggleTaskComplete = async (taskId, completed) => {
  try {
    const response = await fetch(`${API_BASE_URL}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ id: taskId, completed }), // Update only completed status
    });

    if (!response.ok) {
      throw new Error("Failed to update task completion status");
    }

    return await response.json();
  } catch (error) {
    console.error("Error updating task completion status:", error);
    throw error;
  }
};
