import React, { useContext, useEffect, useState } from 'react';
import { UserContext } from '../context/userContext.jsx';
import { Link, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import '../styles/Navbar.css';

export default function Navbar() {
  const { user, setUser, loading } = useContext(UserContext);
  const navigate = useNavigate();

  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    if (user) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
  }, [user]);

  const handleLogout = async () => {
    try {
      const response = await fetch('http://localhost:8000/logout', {
        method: 'POST',
        credentials: 'include',
      });

      if (response.ok) {
        setUser(null);
        navigate('/login');
      } else {
        console.error('Logout failed');
      }
    } catch (error) {
      console.error('Logout error:', error);
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
                  <button onClick={handleLogout} className="btn btn-outline-primary me-2">Log Out</button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
