import { createContext, useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export const UserContext = createContext({});

export function UserContextProvider({ children }) {

    const navigate = useNavigate();
    const location = useLocation();

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
              const response = await fetch('http://localhost:8000/verify-profile', {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',  // Ensure cookies are included
              });
          
              if (response.ok) {
                const data = await response.json();
                setUser(data);  // Update user state
              } else {
                setUser(null);  // Clear user if profile fetch fails
                console.log('Profile fetch failed: ', await response.json());
              }
            } catch (error) {
              setUser(null);
              console.error('Error fetching profile:', error);
            } finally {
              setLoading(false);  // Stop loading after fetch completes
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
