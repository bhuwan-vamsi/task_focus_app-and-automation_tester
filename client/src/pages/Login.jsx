import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/login.css';
import { UserContext } from '../context/userContext';

export default function Login() {

  const { setUser } = useContext(UserContext);
  const navigate = useNavigate();
  
  const [data, setData] = useState({
    email: '',
    password: '',
  });

  const loginUser = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:8000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(data)
      });

      const res = await response.json();

      // Check the HTTP status to determine success
      if (!response.ok) {
        console.error('Failed to login');
      } else {
        setData({});  // Clear the form data
        setUser(res.user);  // Store user in context
        navigate('/');  // Redirect to home page
      }
    } catch (error) {
        console.error(error);
    }
  };

  return (
    <div className="login">
      <div className="login-container">
        <form className="login-form" onSubmit={loginUser}>
          <label>Email</label>
          <input
            type="email"
            placeholder="Enter your email"
            value={data.email}
            onChange={(e) => setData({ ...data, email: e.target.value })}
          />
          <label>Password</label>
          <input
            type="password"
            placeholder="Enter your password"
            value={data.password}
            onChange={(e) => setData({ ...data, password: e.target.value })}
          />
          <button type="submit">Login</button>
        </form>
      </div>
    </div>
  );
}
