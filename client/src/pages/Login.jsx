import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/login.css";
import { UserContext } from "../context/userContext";
import { loginUser } from "../services/userServices"; // Import loginUser service

export default function Login() {
  const { setUser } = useContext(UserContext);
  const navigate = useNavigate();

  const [data, setData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState(""); // Track login errors

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await loginUser(data.email, data.password); // Use loginUser from userServices

      if (res.error) {
        // Handle login errors (based on API response structure)
        setError(res.error);
        console.error("Login failed:", res.error);
      } else {
        setData({}); // Clear the form data
        setUser(res.user); // Store user in context
        navigate("/"); // Redirect to home page
      }
    } catch (err) {
      console.error("Error during login:", err);
      setError("An unexpected error occurred. Please try again.");
    }
  };

  return (
    <div className="login">
      <div className="login-container">
        <form className="login-form" onSubmit={handleLogin}>
          <label>Email</label>
          <input
            type="email"
            name="email"
            placeholder="Enter your email"
            value={data.email}
            onChange={(e) => setData({ ...data, email: e.target.value })}
          />
          <label>Password</label>
          <input
            type="password"
            name="password"
            placeholder="Enter your password"
            value={data.password}
            onChange={(e) => setData({ ...data, password: e.target.value })}
          />
          <button type="submit" name="login">Login</button>
        </form>
        {error && <p className="text-danger mt-2">{error}</p>} {/* Display login errors */}
      </div>
    </div>
  );
}
