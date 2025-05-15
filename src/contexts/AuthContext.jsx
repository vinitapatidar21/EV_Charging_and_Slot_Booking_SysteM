
import React, { createContext, useState, useEffect, useContext } from 'react';
import { toast } from '@/components/ui/use-toast';

// Create auth context
const AuthContext = createContext();

// Create a provider component
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // In a real app, this would check JWT or session cookie
  useEffect(() => {
    // Check if user is logged in via localStorage (this would be a JWT check in real app)
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        setCurrentUser(userData);
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Failed to parse user data', error);
        localStorage.removeItem('currentUser');
      }
    }
    setLoading(false);
  }, []);

  // Mock signup function
  const signup = async (email, password, name) => {
    try {
      // This would be an API call in a real app
      console.log("Signing up:", email);
      setLoading(true);
      
      // Simulate request delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Create a new user
      const newUser = {
        id: `user-${Date.now()}`,
        email,
        name,
        // In a real app, password would be hashed on the server
        createdAt: new Date().toISOString()
      };
      
      // Save to localStorage (would be JWT in real app)
      localStorage.setItem('currentUser', JSON.stringify(newUser));
      
      // Update state
      setCurrentUser(newUser);
      setIsAuthenticated(true);
      
      toast({
        title: "Success!",
        description: "Account created successfully.",
        variant: "default",
      });
      
      return newUser;
    } catch (error) {
      console.error("Signup error:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to create account.",
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Mock login function
  const login = async (email, password) => {
    try {
      // This would be an API call in a real app
      console.log("Logging in:", email);
      setLoading(true);
      
      // Simulate request delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock validation
      if (email !== 'demo@example.com' && email !== 'user@example.com') {
        throw new Error('Invalid email or password');
      }
      
      // Create a mock user
      const user = {
        id: email === 'demo@example.com' ? 'user-demo' : 'user-123',
        email,
        name: email === 'demo@example.com' ? 'Demo User' : 'John Doe',
        createdAt: new Date().toISOString()
      };
      
      // Save to localStorage (would be JWT in real app)
      localStorage.setItem('currentUser', JSON.stringify(user));
      
      // Update state
      setCurrentUser(user);
      setIsAuthenticated(true);
      
      toast({
        title: "Success!",
        description: "Logged in successfully.",
        variant: "default",
      });
      
      return user;
    } catch (error) {
      console.error("Login error:", error);
      toast({
        title: "Error",
        description: error.message || "Invalid email or password.",
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('currentUser');
    setCurrentUser(null);
    setIsAuthenticated(false);
    toast({
      title: "Logged out",
      description: "You've been successfully logged out.",
      variant: "default",
    });
  };

  const value = {
    currentUser,
    isAuthenticated,
    loading,
    signup,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
