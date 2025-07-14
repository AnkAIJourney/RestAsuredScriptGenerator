import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // API Base URL
  const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

  // Check if user is authenticated on app load
  useEffect(() => {
    const checkAuth = async () => {
      const storedToken = localStorage.getItem('token');
      if (storedToken) {
        try {
          const response = await fetch(`${API_BASE_URL}/auth/me`, {
            headers: {
              'Authorization': `Bearer ${storedToken}`,
              'Content-Type': 'application/json'
            }
          });

          if (response.ok) {
            const data = await response.json();
            setUser(data.data.user);
            setToken(storedToken);
            setIsAuthenticated(true);
          } else {
            // Token is invalid
            localStorage.removeItem('token');
            setToken(null);
            setUser(null);
            setIsAuthenticated(false);
          }
        } catch (error) {
          console.error('Auth check failed:', error);
          localStorage.removeItem('token');
          setToken(null);
          setUser(null);
          setIsAuthenticated(false);
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, [API_BASE_URL]);

  // Login function
  const login = async (identifier, password) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ identifier, password })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        const { user, token } = data.data;
        
        // Store token in localStorage
        localStorage.setItem('token', token);
        
        // Update state
        setUser(user);
        setToken(token);
        setIsAuthenticated(true);
        
        return { success: true, message: data.message };
      } else {
        return { 
          success: false, 
          message: data.message || 'Login failed' 
        };
      }
    } catch (error) {
      console.error('Login error:', error);
      return { 
        success: false, 
        message: 'Network error. Please try again.' 
      };
    }
  };

  // Register function
  const register = async (userData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
      });

      const data = await response.json();

      if (response.ok && data.success) {
        const { user, token } = data.data;
        
        // Store token in localStorage
        localStorage.setItem('token', token);
        
        // Update state
        setUser(user);
        setToken(token);
        setIsAuthenticated(true);
        
        return { success: true, message: data.message };
      } else {
        return { 
          success: false, 
          message: data.message || 'Registration failed',
          errors: data.errors || []
        };
      }
    } catch (error) {
      console.error('Registration error:', error);
      return { 
        success: false, 
        message: 'Network error. Please try again.' 
      };
    }
  };

  // Logout function
  const logout = async () => {
    try {
      if (token) {
        await fetch(`${API_BASE_URL}/auth/logout`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
      }
    } catch (error) {
      console.error('Logout API error:', error);
    } finally {
      // Clear local storage and state regardless of API call result
      localStorage.removeItem('token');
      setUser(null);
      setToken(null);
      setIsAuthenticated(false);
    }
  };

  // Update profile function
  const updateProfile = async (profileData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/profile`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(profileData)
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setUser(data.data.user);
        return { success: true, message: data.message };
      } else {
        return { 
          success: false, 
          message: data.message || 'Profile update failed',
          errors: data.errors || []
        };
      }
    } catch (error) {
      console.error('Profile update error:', error);
      return { 
        success: false, 
        message: 'Network error. Please try again.' 
      };
    }
  };

  // Get authentication headers for API calls
  const getAuthHeaders = () => {
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
  };

  // Upload profile picture
  const uploadProfilePicture = async (file) => {
    try {
      const formData = new FormData();
      formData.append('profilePicture', file);

      const response = await fetch(`${API_BASE_URL}/auth/upload-profile-picture`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Update user state with new profile picture
        setUser(prev => ({
          ...prev,
          profilePicture: data.data.profilePicture
        }));
        return { success: true, message: data.message, data: data.data };
      } else {
        return { 
          success: false, 
          message: data.message || 'Profile picture upload failed' 
        };
      }
    } catch (error) {
      console.error('Profile picture upload error:', error);
      return { 
        success: false, 
        message: 'Network error. Please try again.' 
      };
    }
  };

  // Delete profile picture
  const deleteProfilePicture = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/profile-picture`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Update user state to remove profile picture
        setUser(prev => ({
          ...prev,
          profilePicture: null,
          profilePictureOriginalName: null
        }));
        return { success: true, message: data.message };
      } else {
        return { 
          success: false, 
          message: data.message || 'Profile picture deletion failed' 
        };
      }
    } catch (error) {
      console.error('Profile picture delete error:', error);
      return { 
        success: false, 
        message: 'Network error. Please try again.' 
      };
    }
  };

  // Get profile picture URL
  const getProfilePictureUrl = (filename) => {
    if (!filename) return null;
    return `${API_BASE_URL}/auth/profile-picture/${filename}`;
  };

  const value = {
    user,
    token,
    loading,
    isAuthenticated,
    login,
    register,
    logout,
    updateProfile,
    uploadProfilePicture,
    deleteProfilePicture,
    getProfilePictureUrl,
    getAuthHeaders
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
