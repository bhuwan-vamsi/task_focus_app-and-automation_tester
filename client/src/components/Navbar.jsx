import React, { useContext, useEffect, useState } from 'react';
import { UserContext } from '../context/userContext.jsx';
import { Link, useNavigate } from 'react-router-dom';
import { logoutUser } from "../services/userServices";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import '../styles/Navbar.css';

export default function Navbar() {
  const { user, setUser, loading } = useContext(UserContext);
  const navigate = useNavigate();

  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    setIsAuthenticated(!!user);
  }, [user]);

  const handleLogout = async () => {
    try {
        await logoutUser(); // Call API to log out
        setUser(null);
        navigate("/login");
    } catch (err) {
        console.error("Logout failed. Please try again.");
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <nav className="navbar navbar-expand-lg bg-body-tertiary custom-navbar">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">
          <img src="/Images/icon.png" alt="Logo" />
        </Link>
        <div><h2>Task Focus</h2></div>
        <div className="d-flex align-items-center ms-auto">
          {!isAuthenticated ? (
            <div>
              <Link to="/register" className="btn btn-outline-primary me-2">Sign Up</Link>
              <Link to="/login" className="btn btn-outline-primary me-3">Login</Link>
            </div>
          ) : (
            <>
              {isAuthenticated && (
                <div>
                  <button onClick={handleLogout} className="btn btn-outline-primary me-2" name="logout">Log Out</button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
