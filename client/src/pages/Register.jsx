import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/register.css";
import { registerUser } from "../services/userServices"; // Import the registerUser function

export default function Register() {
  const navigate = useNavigate();

  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [error, setError] = useState(""); // Track errors
  const [successMessage, setSuccessMessage] = useState(""); // Track success messages

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      const response = await registerUser(data.name, data.email, data.password); // Use registerUser service

      if (response.error) {
        // Handle registration errors
        setError(response.error);
        console.error("Registration failed:", response.error);
      } else {
        // Clear form data and display success message
        setData({ name: "", email: "", password: "" });
        setError("");
        setSuccessMessage("Registration successful! Redirecting to login...");

        // Redirect to login after a short delay
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      }
    } catch (err) {
      console.error("Error during registration:", err);
      setError("An unexpected error occurred. Please try again.");
    }
  };

  return (
    <div className="register">
      <div className="register-container">
        <form className="register-form" onSubmit={handleRegister}>
          <label>Name</label>
          <input
            type="text"
            placeholder="Enter your name"
            name="name"
            value={data.name}
            onChange={(e) => setData({ ...data, name: e.target.value })}
            required
          />
          <label>Email</label>
          <input
            type="email"
            name="email"
            placeholder="Enter your email"
            value={data.email}
            onChange={(e) => setData({ ...data, email: e.target.value })}
            required
          />
          <label>Password</label>
          <input
            type="password"
            name="password"
            placeholder="Enter your password"
            value={data.password}
            onChange={(e) => setData({ ...data, password: e.target.value })}
            required
          />
          <button type="submit" name="register">Register</button>
        </form>
        {error && <p className="text-danger mt-2">{error}</p>} {/* Display errors */}
        {successMessage && <p className="text-success mt-2">{successMessage}</p>} {/* Display success message */}
      </div>
    </div>
  );
}
