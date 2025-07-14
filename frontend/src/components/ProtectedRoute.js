import React from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import LoginPage from './LoginPage';
import SignupPage from './SignupPage';

const ProtectedRoute = ({ children, showNotification }) => {
  const { isAuthenticated, loading } = useAuth();
  const [showSignup, setShowSignup] = React.useState(false);

  if (loading) {
    return (
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
        sx={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        }}
      >
        <CircularProgress 
          size={60} 
          sx={{ 
            color: 'white',
            mb: 3
          }} 
        />
        <Typography 
          variant="h6" 
          color="white"
          sx={{
            fontWeight: 500,
            textAlign: 'center'
          }}
        >
          Loading...
        </Typography>
      </Box>
    );
  }

  if (!isAuthenticated) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          px: 2
        }}
      >
        {showSignup ? (
          <SignupPage
            onSwitchToLogin={() => setShowSignup(false)}
            showNotification={showNotification}
          />
        ) : (
          <LoginPage
            onSwitchToSignup={() => setShowSignup(true)}
            showNotification={showNotification}
          />
        )}
      </Box>
    );
  }

  return children;
};

export default ProtectedRoute;
