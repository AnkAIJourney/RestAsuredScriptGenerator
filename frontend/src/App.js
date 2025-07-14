import React, { useState } from 'react';
import {
  ThemeProvider,
  createTheme,
  CssBaseline,
  Container,
  Box,
  Typography,
  Paper,
  Stepper,
  Step,
  StepLabel,
  Button,
  CircularProgress,
  Snackbar,
  Alert,
  useMediaQuery,
  Chip,
  AppBar,
  Toolbar,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  Divider
} from '@mui/material';
import { 
  CloudUpload, 
  Settings, 
  Code, 
  Download,
  PlayArrow,
  CheckCircle,
  Info,
  ArrowBack,
  Science,
  Build,
  AccountCircle,
  Logout,
  Person,
  Login,
  PersonAdd
} from '@mui/icons-material';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import DataSourceStep from './components/DataSourceStep';
import FileUploadStep from './components/FileUploadStep';
import GenerationStep from './components/GenerationStep';
import ResultsStep from './components/ResultsStep';
import AboutPage from './components/AboutPage';
import ProfilePage from './components/ProfilePage';
import LoginPage from './components/LoginPage';
import SignupPage from './components/SignupPage';
import { checkHealth, testAzureOpenAI } from './api';
import './App.css';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#667eea',
    },
    secondary: {
      main: '#764ba2',
    },
    background: {
      default: 'transparent',
      paper: 'rgba(255, 255, 255, 0.95)',
    },
  },
  typography: {
    fontFamily: 'Roboto, sans-serif',
    h4: {
      fontWeight: 700,
      color: '#2d3748',
    },
    h6: {
      fontWeight: 600,
      color: '#4a5568',
    },
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          textTransform: 'none',
          fontWeight: 600,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: '0 12px 40px 0 rgba(31, 38, 135, 0.25)',
          },
        },
      },
    },
  },
});

const steps = ['Data Source', 'File Upload', 'Generate', 'Results'];

const stepIcons = {
  0: <Settings />,
  1: <CloudUpload />,
  2: <Code />,
  3: <Download />,
};

function App() {
  const { isAuthenticated, user } = useAuth();
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [dataSource, setDataSource] = useState('excel');
  const [files, setFiles] = useState({});
  const [testrailConfig, setTestrailConfig] = useState({});
  const [testrailConnectionStatus, setTestrailConnectionStatus] = useState(null);
  const [useDefaultFiles, setUseDefaultFiles] = useState(false);
  const [generatedFiles, setGeneratedFiles] = useState({
    methodFile: '',
    testFile: '',
    methodFilename: '',
    testFilename: ''
  });
  const [apiDetails, setApiDetails] = useState({});
  const [scenarios, setScenarios] = useState([]);
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'info' });
  const [backendStatus, setBackendStatus] = useState('checking'); // 'checking', 'connected', 'error'
  const [currentView, setCurrentView] = useState('about'); // 'about', 'login', 'signup', 'generator', 'profile'
  const [testingAI, setTestingAI] = useState(false);
  
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // Check backend connection on component mount
  React.useEffect(() => {
    const checkBackendHealth = async () => {
      try {
        await checkHealth();
        setBackendStatus('connected');
      } catch (error) {
        console.error('Backend health check failed:', error);
        setBackendStatus('error');
        showNotification('Unable to connect to backend server. Please ensure it is running on port 3001.', 'error');
      }
    };

    checkBackendHealth();
  }, []);

  const showNotification = (message, severity = 'info') => {
    setNotification({ open: true, message, severity });
  };

  const handleTestAI = async () => {
    setTestingAI(true);
    try {
      await testAzureOpenAI();
      showNotification('Azure OpenAI connection test successful!', 'success');
    } catch (error) {
      console.error('Azure OpenAI test failed:', error);
      showNotification(`Azure OpenAI test failed: ${error.message}`, 'error');
    } finally {
      setTestingAI(false);
    }
  };

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
    setGeneratedFiles({
      methodFile: '',
      testFile: '',
      methodFilename: '',
      testFilename: ''
    });
    setFiles({});
    setTestrailConfig({});
    setApiDetails({});
    setScenarios([]);
  };

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <DataSourceStep
            dataSource={dataSource}
            setDataSource={setDataSource}
            testrailConfig={testrailConfig}
            setTestrailConfig={setTestrailConfig}
            connectionStatus={testrailConnectionStatus}
            setConnectionStatus={setTestrailConnectionStatus}
            showNotification={showNotification}
          />
        );
      case 1:
        return (
          <FileUploadStep
            files={files}
            setFiles={setFiles}
            dataSource={dataSource}
            useDefaultFiles={useDefaultFiles}
            setUseDefaultFiles={setUseDefaultFiles}
            showNotification={showNotification}
          />
        );
      case 2:
        return (
          <GenerationStep
            dataSource={dataSource}
            files={files}
            testrailConfig={testrailConfig}
            useDefaultFiles={useDefaultFiles}
            setGeneratedFiles={setGeneratedFiles}
            setApiDetails={setApiDetails}
            setScenarios={setScenarios}
            showNotification={showNotification}
            loading={loading}
            setLoading={setLoading}
            onNext={handleNext}
          />
        );
      case 3:
        return (
          <ResultsStep
            generatedFiles={generatedFiles}
            apiDetails={apiDetails}
            scenarios={scenarios}
            showNotification={showNotification}
          />
        );
      default:
        return 'Unknown step';
    }
  };

  const UserMenu = () => {
    const { user, logout, getProfilePictureUrl } = useAuth();
    const [anchorEl, setAnchorEl] = useState(null);

    const handleMenu = (event) => {
      setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
      setAnchorEl(null);
    };

    const handleProfile = () => {
      setCurrentView('profile');
      handleClose();
    };

    const handleLogout = async () => {
      await logout();
      setCurrentView('about');
      handleClose();
    };

    return (
      <>
        <IconButton
          size="large"
          aria-label="account of current user"
          aria-controls="menu-appbar"
          aria-haspopup="true"
          onClick={handleMenu}
          color="inherit"
          sx={{
            bgcolor: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: 2,
            transition: 'all 0.3s ease-in-out',
            '&:hover': {
              bgcolor: 'rgba(255, 255, 255, 0.2)',
              transform: 'translateY(-2px)',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)'
            }
          }}
        >
          <Avatar 
            src={user?.profilePicture ? getProfilePictureUrl(user.profilePicture) : undefined}
            sx={{ width: 32, height: 32, bgcolor: 'secondary.main' }}
          >
            {!user?.profilePicture && (user?.firstName?.[0]?.toUpperCase() || 'U')}
          </Avatar>
        </IconButton>
        <Menu
          id="menu-appbar"
          anchorEl={anchorEl}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          keepMounted
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          open={Boolean(anchorEl)}
          onClose={handleClose}
          sx={{
            mt: 1,
            '& .MuiPaper-root': {
              borderRadius: 2,
              minWidth: 180,
              bgcolor: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
            }
          }}
        >
          <Box sx={{ px: 2, py: 1 }}>
            <Typography variant="subtitle2" color="text.secondary">
              Welcome back!
            </Typography>
            <Typography variant="body2" fontWeight="600">
              {user?.firstName} {user?.lastName}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              @{user?.username}
            </Typography>
          </Box>
          <Divider />
          <MenuItem onClick={handleProfile}>
            <Person sx={{ mr: 2 }} />
            Profile
          </MenuItem>
          <MenuItem onClick={handleLogout}>
            <Logout sx={{ mr: 2 }} />
            Logout
          </MenuItem>
        </Menu>
      </>
    );
  };

  const AuthButtons = () => {
    return (
      <Box sx={{ display: 'flex', gap: 2 }}>
        <Button
          variant="outlined"
          startIcon={<Login />}
          onClick={() => setCurrentView('login')}
          sx={{
            color: 'white',
            borderColor: 'rgba(255, 255, 255, 0.5)',
            bgcolor: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            borderRadius: 2,
            transition: 'all 0.3s ease-in-out',
            '&:hover': {
              bgcolor: 'rgba(255, 255, 255, 0.2)',
              borderColor: 'rgba(255, 255, 255, 0.8)',
              transform: 'translateY(-2px)',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)'
            }
          }}
        >
          Login
        </Button>
        <Button
          variant="contained"
          startIcon={<PersonAdd />}
          onClick={() => setCurrentView('signup')}
          sx={{
            bgcolor: 'rgba(255, 255, 255, 0.2)',
            backdropFilter: 'blur(10px)',
            color: 'white',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            borderRadius: 2,
            transition: 'all 0.3s ease-in-out',
            '&:hover': {
              bgcolor: 'rgba(255, 255, 255, 0.3)',
              transform: 'translateY(-2px)',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)'
            }
          }}
        >
          Sign Up
        </Button>
      </Box>
    );
  };

  return (
    <div className="gradient-background">
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {/* AppBar with Navigation */}
        <AppBar position="fixed" sx={{ 
          background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.95) 0%, rgba(118, 75, 162, 0.95) 100%)', 
          backdropFilter: 'blur(20px)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
          zIndex: 1100,
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
        }}>
          <Toolbar>
            <Typography 
              variant="h6" 
              component="div" 
              onClick={() => setCurrentView('about')}
              sx={{ 
                flexGrow: 1,
                color: 'white',
                fontWeight: 700,
                letterSpacing: '0.5px',
                textShadow: '2px 2px 4px rgba(0,0,0,0.4)',
                fontSize: '1.4rem',
                background: 'linear-gradient(45deg, #ffffff 30%, #f0f0f0 90%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                filter: 'drop-shadow(1px 1px 2px rgba(0,0,0,0.3))',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'scale(1.02)'
                }
              }}
            >
              🚀 RestAssured Script Generator
            </Typography>
            
            {/* Test AI Button - Only show for authenticated users in generator view */}
            {isAuthenticated && currentView === 'generator' && (
              <Button
                color="inherit"
                onClick={handleTestAI}
                disabled={testingAI || backendStatus !== 'connected'}
                startIcon={testingAI ? <CircularProgress size={20} color="inherit" /> : <Science />}
                sx={{ 
                  mr: 2,
                  bgcolor: 'rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: 2,
                  px: 2,
                  py: 1,
                  transition: 'all 0.3s ease-in-out',
                  '&:hover': {
                    bgcolor: 'rgba(255, 255, 255, 0.2)',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)'
                  },
                  '&:disabled': {
                    bgcolor: 'rgba(255, 255, 255, 0.05)',
                    color: 'rgba(255, 255, 255, 0.5)'
                  }
                }}
              >
                {testingAI ? 'Testing...' : 'Test AI'}
              </Button>
            )}
            
            {/* Navigation Button - Show different options based on view and auth status */}
            {isAuthenticated && currentView !== 'about' && (
              <IconButton
                color="inherit"
                onClick={() => {
                  if (currentView === 'profile') {
                    setCurrentView('generator');
                  } else if (currentView === 'generator') {
                    setCurrentView('about');
                  }
                }}
                title={currentView === 'profile' ? "Back to Generator" : "Back to Home"}
                sx={{
                  bgcolor: 'rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: 2,
                  mr: 1,
                  transition: 'all 0.3s ease-in-out',
                  '&:hover': {
                    bgcolor: 'rgba(255, 255, 255, 0.2)',
                    transform: 'translateY(-2px) rotate(5deg)',
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)'
                  }
                }}
              >
                {currentView === 'profile' ? <ArrowBack /> : <Info />}
              </IconButton>
            )}

            {/* Start Generator Button - Only show for authenticated users on about page */}
            {isAuthenticated && currentView === 'about' && (
              <Button
                variant="contained"
                startIcon={<Build />}
                onClick={() => setCurrentView('generator')}
                sx={{
                  bgcolor: 'rgba(255, 255, 255, 0.2)',
                  backdropFilter: 'blur(10px)',
                  color: 'white',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  borderRadius: 2,
                  mr: 1,
                  transition: 'all 0.3s ease-in-out',
                  '&:hover': {
                    bgcolor: 'rgba(255, 255, 255, 0.3)',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)'
                  }
                }}
              >
                Start Generator
              </Button>
            )}

            {/* Show appropriate buttons based on authentication status */}
            {isAuthenticated ? <UserMenu /> : <AuthButtons />}
          </Toolbar>
        </AppBar>

        <Container maxWidth="lg" sx={{ py: 4, mt: '80px' }}>
          {/* Render different views based on currentView state */}
          {currentView === 'about' && (
            <AboutPage 
              onGetStarted={() => isAuthenticated ? setCurrentView('generator') : setCurrentView('login')}
              isAuthenticated={isAuthenticated}
            />
          )}
          
          {currentView === 'login' && (
            <LoginPage 
              showNotification={showNotification}
              onSuccess={() => setCurrentView('generator')}
              onSwitchToSignup={() => setCurrentView('signup')}
              onBack={() => setCurrentView('about')}
            />
          )}
          
          {currentView === 'signup' && (
            <SignupPage 
              showNotification={showNotification}
              onSuccess={() => setCurrentView('generator')}
              onSwitchToLogin={() => setCurrentView('login')}
              onBack={() => setCurrentView('about')}
            />
          )}
          
          {currentView === 'profile' && (
            <ProfilePage 
              showNotification={showNotification}
              onBack={() => setCurrentView('generator')}
            />
          )}
          
          {currentView === 'generator' && isAuthenticated && (
            <>
              {/* Header */}
              <Box textAlign="center" mb={4} sx={{ position: 'relative' }}>
                {/* Animated Background Elements */}
                <Box sx={{
                  position: 'absolute',
                  top: -20,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: '200px',
                  height: '200px',
                  background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)',
                  borderRadius: '50%',
                  animation: 'pulse 3s ease-in-out infinite',
                  zIndex: -1
                }} />
                
                <Typography variant="h2" component="h1" gutterBottom sx={{ 
                  color: 'white', 
                  fontWeight: 900,
                  background: 'linear-gradient(45deg, #ffffff 30%, #f8f9fa 90%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  textShadow: '0 0 20px rgba(255,255,255,0.3)',
                  mb: 2,
                  animation: 'fadeInUp 1s ease-out',
                  fontSize: { xs: '2rem', md: '3rem' }
                }}>
                  ✨ API Test Automation
                </Typography>
                <Typography variant="h5" sx={{ 
                  color: 'rgba(255,255,255,0.95)',
                  textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
                  fontWeight: 500,
                  animation: 'fadeInUp 1s ease-out 0.2s both',
                  fontSize: { xs: '1rem', md: '1.25rem' }
                }}>
                  🤖 Generate intelligent RestAssured test scripts with AI power
                </Typography>
                
                {/* Enhanced Backend Status Indicator */}
                <Box sx={{ 
                  mt: 3, 
                  display: 'flex', 
                  justifyContent: 'center', 
                  alignItems: 'center',
                  animation: 'fadeInUp 1s ease-out 0.4s both'
                }}>
                  {backendStatus === 'checking' && (
                    <Chip 
                      icon={<CircularProgress size={16} sx={{ color: 'inherit' }} />} 
                      label="Connecting to backend..." 
                      size="medium"
                      sx={{ 
                        bgcolor: 'rgba(255,193,7,0.9)', 
                        color: 'white',
                        fontWeight: 600,
                        boxShadow: '0 4px 15px rgba(255,193,7,0.4)',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(255,255,255,0.2)'
                      }}
                    />
                  )}
                  {backendStatus === 'connected' && (
                    <Chip 
                      icon={<CheckCircle />} 
                      label="Backend Connected & Ready" 
                      size="medium"
                      sx={{ 
                        bgcolor: 'rgba(76,175,80,0.9)', 
                        color: 'white',
                        fontWeight: 600,
                        boxShadow: '0 4px 15px rgba(76,175,80,0.4)',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(255,255,255,0.2)',
                        animation: 'pulse 2s ease-in-out infinite'
                      }}
                    />
                  )}
                  {backendStatus === 'error' && (
                    <Chip 
                      icon={<PlayArrow />} 
                      label=" Backend Disconnected - Please start server" 
                      size="medium"
                      sx={{ 
                        bgcolor: 'rgba(244,67,54,0.9)', 
                        color: 'white',
                        fontWeight: 600,
                        boxShadow: '0 4px 15px rgba(244,67,54,0.4)',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(255,255,255,0.2)',
                        animation: 'shake 0.5s ease-in-out infinite'
                      }}
                    />
                  )}
                </Box>
              </Box>

              {/* Main Content */}
              <Paper elevation={24} sx={{ 
                p: 4, 
                mb: 4,
                position: 'relative',
                overflow: 'hidden',
                background: 'rgba(255, 255, 255, 0.98)',
                backdropFilter: 'blur(20px)',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: '4px',
                  background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
                  borderRadius: '16px 16px 0 0'
                }
              }}>
                {/* Progress Stepper */}
                <Stepper 
                  activeStep={activeStep} 
                  sx={{ 
                    mb: 4,
                    '& .MuiStepConnector-root': {
                      '& .MuiStepConnector-line': {
                        borderColor: 'rgba(102, 126, 234, 0.3)',
                        borderWidth: 2,
                        transition: 'all 0.3s ease'
                      }
                    },
                    '& .MuiStepConnector-root.Mui-active, & .MuiStepConnector-root.Mui-completed': {
                      '& .MuiStepConnector-line': {
                        borderColor: '#667eea',
                        boxShadow: '0 0 8px rgba(102, 126, 234, 0.3)'
                      }
                    }
                  }}
                  orientation={isMobile ? 'vertical' : 'horizontal'}
                >
                  {steps.map((label, index) => {
                    return (
                      <Step key={label}>
                        <StepLabel 
                          icon={stepIcons[index]}
                          sx={{
                            cursor: 'default',
                            '& .MuiStepIcon-root': {
                              fontSize: '2.5rem',
                              color: activeStep === index ? 'primary.main' : 'grey.400',
                              transition: 'all 0.3s ease',
                              filter: activeStep === index ? 'drop-shadow(0 0 8px rgba(102, 126, 234, 0.4))' : 'none'
                            },
                            '& .MuiStepIcon-root.Mui-active': {
                              color: 'primary.main',
                              animation: 'pulse 2s ease-in-out infinite',
                              transform: 'scale(1.1)'
                            },
                            '& .MuiStepIcon-root.Mui-completed': {
                              color: 'secondary.main',
                              transform: 'scale(1.05)'
                            },
                            '& .MuiStepLabel-label': {
                              fontWeight: activeStep === index ? 700 : 500,
                              fontSize: activeStep === index ? '1.1rem' : '1rem',
                              transition: 'all 0.3s ease'
                            }
                          }}
                        >
                          <Typography variant="subtitle1" fontWeight={activeStep === index ? 700 : 600}>
                            {label}
                          </Typography>
                        </StepLabel>
                      </Step>
                    );
                  })}
                </Stepper>

                {/* Step Content */}
                <Box sx={{ minHeight: '400px' }}>
                  {renderStepContent(activeStep)}
                </Box>

                {/* Navigation Buttons */}
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  mt: 4,
                  position: 'relative',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: -20,
                    left: 0,
                    right: 0,
                    height: 1,
                    background: 'linear-gradient(90deg, transparent 0%, rgba(102, 126, 234, 0.3) 50%, transparent 100%)'
                  }
                }}>
                  <Button
                    onClick={handleBack}
                    disabled={activeStep === 0}
                    variant="outlined"
                    size="large"
                    className="interactive-button"
                    sx={{ 
                      minWidth: 120,
                      borderRadius: 3,
                      borderWidth: 2,
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        borderWidth: 2,
                        transform: 'translateY(-2px)',
                        boxShadow: '0 8px 25px rgba(102, 126, 234, 0.3)'
                      },
                      '&:disabled': {
                        opacity: 0.5
                      }
                    }}
                  >
                    Back
                  </Button>
                  <Box>
                    {activeStep === steps.length - 1 ? (
                      <Button
                        onClick={handleReset}
                        variant="contained"
                        size="large"
                        startIcon={<PlayArrow />}
                        className="interactive-button"
                        sx={{ 
                          minWidth: 120,
                          borderRadius: 3,
                          background: 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)',
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            background: 'linear-gradient(45deg, #5a6fd8 30%, #6a4190 90%)',
                            transform: 'translateY(-2px)',
                            boxShadow: '0 8px 25px rgba(102, 126, 234, 0.4)'
                          }
                        }}
                      >
                        Start Over
                      </Button>
                    ) : activeStep === 2 ? (
                      // For Generate step, don't show Next button as it's handled by the Generate component
                      null
                    ) : (
                      <Button
                        onClick={handleNext}
                        variant="contained"
                        size="large"
                        className="interactive-button"
                        sx={{ 
                          minWidth: 120,
                          borderRadius: 3,
                          background: 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)',
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            background: 'linear-gradient(45deg, #5a6fd8 30%, #6a4190 90%)',
                            transform: 'translateY(-2px)',
                            boxShadow: '0 8px 25px rgba(102, 126, 234, 0.4)'
                          },
                          '&:disabled': {
                            background: 'rgba(0, 0, 0, 0.12)',
                            color: 'rgba(0, 0, 0, 0.26)'
                          }
                        }}
                        disabled={
                          (activeStep === 0 && dataSource === 'testrail' && 
                           (testrailConnectionStatus !== 'success' || !testrailConfig.username || !testrailConfig.apikey || !testrailConfig.testCaseId)) ||
                          (activeStep === 1 && !useDefaultFiles && Object.keys(files).length === 0)
                        }
                      >
                        Next
                      </Button>
                    )}
                  </Box>
                </Box>
              </Paper>
            </>
          )}

          {/* Enhanced Loading Overlay */}
          {loading && (
            <Box
              sx={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(0, 0, 0, 0.7)',
                backdropFilter: 'blur(10px)',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                zIndex: 9999,
                animation: 'fadeInUp 0.3s ease-out'
              }}
            >
              <Paper sx={{ 
                p: 6, 
                textAlign: 'center',
                borderRadius: 4,
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
                maxWidth: 400,
                position: 'relative',
                overflow: 'hidden',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: '-100%',
                  width: '100%',
                  height: '2px',
                  background: 'linear-gradient(90deg, transparent, #667eea, transparent)',
                  animation: 'slideInLeft 2s ease-in-out infinite'
                }
              }}>
                <Box sx={{ position: 'relative', display: 'inline-block', mb: 3 }}>
                  <CircularProgress 
                    size={80} 
                    thickness={4}
                    sx={{ 
                      color: '#667eea',
                      filter: 'drop-shadow(0 0 10px rgba(102, 126, 234, 0.3))'
                    }} 
                  />
                  <Box sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    fontSize: '2rem'
                  }}>
                    🤖
                  </Box>
                </Box>
                <Typography variant="h5" sx={{ 
                  mb: 2, 
                  fontWeight: 700,
                  background: 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}>
                  AI is Working Magic ✨
                </Typography>
                <Typography variant="body1" color="textSecondary" sx={{ mb: 1, fontWeight: 500 }}>
                  Generating intelligent test scripts...
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  This may take a few moments while our AI analyzes your data
                </Typography>
              </Paper>
            </Box>
          )}

          {/* Enhanced Notification Snackbar */}
          <Snackbar
            open={notification.open}
            autoHideDuration={6000}
            onClose={() => setNotification({ ...notification, open: false })}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            sx={{
              '& .MuiSnackbarContent-root': {
                borderRadius: 3,
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)'
              }
            }}
          >
            <Alert
              onClose={() => setNotification({ ...notification, open: false })}
              severity={notification.severity}
              sx={{ 
                width: '100%',
                borderRadius: 3,
                fontWeight: 500,
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                '& .MuiAlert-icon': {
                  fontSize: '1.5rem'
                },
                '& .MuiAlert-action': {
                  '& .MuiIconButton-root': {
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      transform: 'scale(1.1)'
                    }
                  }
                }
              }}
              variant="filled"
            >
              {notification.message}
            </Alert>
          </Snackbar>
        </Container>
      </ThemeProvider>
    </div>
  );
}

// Main App Component with Authentication
const AppWithAuth = () => {
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'info' });

  const showNotification = (message, severity = 'info') => {
    setNotification({ open: true, message, severity });
  };

  return (
    <AuthProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <App />
        
        {/* Global Notification Snackbar for Auth */}
        <Snackbar
          open={notification.open}
          autoHideDuration={4000}
          onClose={() => setNotification({ ...notification, open: false })}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        >
          <Alert
            severity={notification.severity}
            onClose={() => setNotification({ ...notification, open: false })}
            sx={{ borderRadius: 3 }}
          >
            {notification.message}
          </Alert>
        </Snackbar>
      </ThemeProvider>
    </AuthProvider>
  );
};

export default AppWithAuth;
