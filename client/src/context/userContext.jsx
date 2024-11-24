import { createContext, useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { verifyProfile } from "../services/userServices"; // Import verifyProfile function

export const UserContext = createContext({});

export function UserContextProvider({ children }) {

    const navigate = useNavigate();
    const location = useLocation();

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      const fetchUserProfile = async () => {
        try {
          const data = await verifyProfile(); // Use verifyProfile from userServices.js
          setUser(data); // Update user state
        } catch (error) {
          setUser(null); // Clear user state if verification fails
          console.error("Profile fetch failed:", error.message);
        } finally {
          setLoading(false); // Stop loading after fetch completes
        }
      };
  
      fetchUserProfile();
    }, []);

    // Redirect to /login if the user is not logged in and tries to access other routes
    useEffect(() => {
        // Wait until loading completes before triggering any navigation
        if (loading) return;
    
        const allowedPaths = ['/', '/register', '/home'];  // Paths that do not require login
    
        if (!user && !allowedPaths.includes(location.pathname)) {
          navigate('/login', { replace: true });  // Replace history to avoid loop
        }
      }, [user, loading, location.pathname, navigate]);

    return (
        <UserContext.Provider value={{ user, setUser, loading }}>
            {children}
        </UserContext.Provider>
    );
}
