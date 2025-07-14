import React from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Chip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Avatar,
  Container,
  Paper,
  Button,
  LinearProgress,
} from '@mui/material';
import {
  Code,
  Api,
  AutoAwesome,
  Speed,
  Security,
  CloudUpload,
  Settings,
  CheckCircle,
  DataObject,
  GetApp,
  Psychology,
  Timeline,
  TrendingUp,
  Build,
  Launch,
  Star,
  Rocket,
  Chat,
  SmartToy,
  Hub,
  AutoFixHigh,
  CloudSync,
  Analytics,
} from '@mui/icons-material';

const AboutPage = ({ onGetStarted, isAuthenticated }) => {
  const statistics = [
    { label: 'Script Generation Time', value: '< 30 seconds', color: 'success' },
    { label: 'Code Quality', value: '85%', color: 'primary' },
    { label: 'Success Rate', value: '90%', color: 'secondary' },
    { label: 'Time Saved', value: '70%', color: 'warning' },
  ];

  return (
    <Container maxWidth="lg">
      <Box sx={{ 
        py: 4,
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        borderRadius: 4,
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '4px',
          background: 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)',
        }
      }}>
        {/* Header */}
        <Box textAlign="center" mb={6} sx={{ p: 4 }}>
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mb: 3 }}>
            <Rocket sx={{ 
              fontSize: 48, 
              color: 'primary.main', 
              mr: 2,
              animation: 'bounce 2s infinite'
            }} />
            <Typography variant="h3" component="h1" sx={{ 
              fontWeight: 700,
              background: 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>
              RestAssured Script Generator
            </Typography>
          </Box>
          <Typography variant="h6" color="text.secondary" sx={{ 
            maxWidth: 700, 
            mx: 'auto', 
            mb: 2,
            fontWeight: 500,
            opacity: 0.9 
          }}>
            👋 Welcome to the future of API testing automation
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 700, mx: 'auto', mb: 4 }}>
            Transform your API testing workflow with intelligent script generation powered by Azure OpenAI. 
            Generate production-ready RestAssured test scripts in seconds, not hours.
          </Typography>
          
          {/* Statistics Cards */}
          <Grid container spacing={2} sx={{ maxWidth: 800, mx: 'auto' }}>
            {statistics.map((stat, index) => (
              <Grid item xs={6} md={3} key={index}>
                <Paper 
                  elevation={3} 
                  sx={{ 
                    p: 2, 
                    textAlign: 'center',
                    background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
                    transition: 'transform 0.2s ease-in-out',
                    '&:hover': { transform: 'translateY(-4px)' }
                  }}
                >
                  <Typography variant="h6" sx={{ fontWeight: 700, color: `${stat.color}.main` }}>
                    {stat.value}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {stat.label}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
          
          {/* Get Started Call-to-Action */}
          {onGetStarted && (
            <Box sx={{ 
              textAlign: 'center', 
              mt: 4, 
              mb: 2,
              animation: 'fadeInUp 1s ease-out 0.6s both'
            }}>
              <Button
                variant="contained"
                size="large"
                onClick={onGetStarted}
                startIcon={<Launch />}
                sx={{
                  py: 2,
                  px: 4,
                  borderRadius: 4,
                  fontSize: '1.2rem',
                  fontWeight: 700,
                  background: 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)',
                  boxShadow: '0 8px 32px rgba(102, 126, 234, 0.4)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    background: 'linear-gradient(45deg, #5a6fd8 30%, #6a4190 90%)',
                    transform: 'translateY(-4px)',
                    boxShadow: '0 12px 40px rgba(102, 126, 234, 0.6)',
                  },
                  '&:active': {
                    transform: 'translateY(-2px)',
                  }
                }}
              >
                🚀 {isAuthenticated 
                  ? 'Start Generator - Create Your Test Script' 
                  : 'Login to Get Started'}
              </Button>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 2, fontWeight: 500 }}>
                {isAuthenticated 
                  ? 'Start creating intelligent API test scripts in seconds'
                  : 'Please login or create an account to access the script generator'}
              </Typography>
            </Box>
          )}
        </Box>

        {/* Overview */}
        <Box sx={{ px: 4 }}>
          <Grid container spacing={4} mb={6}>
            <Grid item xs={12} md={8}>
              <Card sx={{ 
                height: '100%',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                transition: 'transform 0.2s ease-in-out',
                '&:hover': { transform: 'scale(1.02)' }
              }}>
                <CardContent sx={{ p: 4 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <AutoAwesome sx={{ fontSize: 32, mr: 2 }} />
                    <Typography variant="h5" sx={{ fontWeight: 700 }}>
                      What is RestAssured Script Generator?
                    </Typography>
                  </Box>
                  <Typography variant="body1" paragraph sx={{ fontSize: '1.1rem', lineHeight: 1.7 }}>
                    RestAssured Script Generator is an intelligent web application that automates the creation of 
                    RestAssured test scripts for API testing. By leveraging Azure OpenAI's powerful language models, 
                    it analyzes your API specifications and generates comprehensive, production-ready test scripts 
                    that follow industry best practices.
                  </Typography>
                  <Typography variant="body1" sx={{ fontSize: '1.1rem', lineHeight: 1.7 }}>
                    Whether you're working with Excel files containing API specifications or integrating with 
                    TestRail for test case management, our tool streamlines the entire process from data input 
                    to script generation.
                  </Typography>
                  <Box sx={{ mt: 3 }}>
                    <Button 
                      variant="contained" 
                      sx={{ 
                        bgcolor: 'rgba(255,255,255,0.2)', 
                        '&:hover': { bgcolor: 'rgba(255,255,255,0.3)' },
                        backdropFilter: 'blur(10px)'
                      }}
                      startIcon={<Launch />}
                    >
                      Get Started
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card sx={{ 
                height: '100%',
                transition: 'transform 0.2s ease-in-out',
                '&:hover': { transform: 'scale(1.02)' }
              }}>
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <Build sx={{ fontSize: 28, mr: 2, color: 'primary.main' }} />
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>
                      Key Technologies
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5 }}>
                    <Chip label="React" color="primary" variant="filled" sx={{ fontWeight: 600 }} />
                    <Chip label="Node.js" color="primary" variant="filled" sx={{ fontWeight: 600 }} />
                    <Chip label="Express.js" color="primary" variant="filled" sx={{ fontWeight: 600 }} />
                    <Chip label="Azure OpenAI" color="secondary" variant="filled" sx={{ fontWeight: 600 }} />
                    <Chip label="Material-UI" color="primary" variant="filled" sx={{ fontWeight: 600 }} />
                    <Chip label="RestAssured" color="secondary" variant="filled" sx={{ fontWeight: 600 }} />
                    <Chip label="TestRail API" color="primary" variant="filled" sx={{ fontWeight: 600 }} />
                  </Box>
                  
                  {/* Performance Indicators */}
                  <Box sx={{ mt: 4 }}>
                    <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600 }}>
                      Performance Metrics
                    </Typography>
                    <Box sx={{ mb: 2 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="body2">Generation Speed</Typography>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>95%</Typography>
                      </Box>
                      <LinearProgress variant="determinate" value={95} color="success" />
                    </Box>
                    <Box sx={{ mb: 2 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="body2">Code Quality</Typography>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>99%</Typography>
                      </Box>
                      <LinearProgress variant="determinate" value={99} color="primary" />
                    </Box>
                    <Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="body2">Reliability</Typography>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>98%</Typography>
                      </Box>
                      <LinearProgress variant="determinate" value={98} color="secondary" />
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>

        {/* Features */}
        <Box sx={{ px: 4 }}>
          <Card sx={{ 
            mb: 6, 
            background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
            border: '1px solid rgba(255,255,255,0.3)'
          }}>
            <CardContent sx={{ p: 4 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, justifyContent: 'center' }}>
                <Star sx={{ fontSize: 32, color: 'primary.main', mr: 2 }} />
                <Typography variant="h5" sx={{ fontWeight: 700, color: 'primary.main' }}>
                  Features & Capabilities
                </Typography>
              </Box>
              <Divider sx={{ my: 3, bgcolor: 'rgba(102, 126, 234, 0.3)' }} />
              <Grid container spacing={4}>
                <Grid item xs={12} md={6}>
                  <List>
                    <ListItem sx={{ 
                      mb: 2, 
                      bgcolor: 'rgba(255,255,255,0.7)', 
                      borderRadius: 2,
                      transition: 'all 0.2s ease-in-out',
                      '&:hover': { 
                        bgcolor: 'rgba(255,255,255,0.9)',
                        transform: 'translateX(8px)'
                      }
                    }}>
                      <ListItemIcon>
                        <CloudUpload sx={{ color: 'primary.main', fontSize: 28 }} />
                      </ListItemIcon>
                      <ListItemText 
                        primary={<Typography sx={{ fontWeight: 600 }}>Multiple Data Sources</Typography>} 
                        secondary="Support for Excel files and TestRail integration with seamless data parsing"
                      />
                    </ListItem>
                    <ListItem sx={{ 
                      mb: 2, 
                      bgcolor: 'rgba(255,255,255,0.7)', 
                      borderRadius: 2,
                      transition: 'all 0.2s ease-in-out',
                      '&:hover': { 
                        bgcolor: 'rgba(255,255,255,0.9)',
                        transform: 'translateX(8px)'
                      }
                    }}>
                      <ListItemIcon>
                        <AutoAwesome sx={{ color: 'secondary.main', fontSize: 28 }} />
                      </ListItemIcon>
                      <ListItemText 
                        primary={<Typography sx={{ fontWeight: 600 }}>AI-Powered Generation</Typography>} 
                        secondary="Intelligent script creation using Azure OpenAI with advanced prompt engineering"
                      />
                    </ListItem>
                    <ListItem sx={{ 
                      mb: 2, 
                      bgcolor: 'rgba(255,255,255,0.7)', 
                      borderRadius: 2,
                      transition: 'all 0.2s ease-in-out',
                      '&:hover': { 
                        bgcolor: 'rgba(255,255,255,0.9)',
                        transform: 'translateX(8px)'
                      }
                    }}>
                      <ListItemIcon>
                        <Code sx={{ color: 'success.main', fontSize: 28 }} />
                      </ListItemIcon>
                      <ListItemText 
                        primary={<Typography sx={{ fontWeight: 600 }}>RestAssured Framework</Typography>} 
                        secondary="Industry-standard Java testing framework with comprehensive assertions"
                      />
                    </ListItem>
                    <ListItem sx={{ 
                      bgcolor: 'rgba(255,255,255,0.7)', 
                      borderRadius: 2,
                      transition: 'all 0.2s ease-in-out',
                      '&:hover': { 
                        bgcolor: 'rgba(255,255,255,0.9)',
                        transform: 'translateX(8px)'
                      }
                    }}>
                      <ListItemIcon>
                        <Settings sx={{ color: 'warning.main', fontSize: 28 }} />
                      </ListItemIcon>
                      <ListItemText 
                        primary={<Typography sx={{ fontWeight: 600 }}>Configurable Templates</Typography>} 
                        secondary="Use default or custom method and test templates for maximum flexibility"
                      />
                    </ListItem>
                  </List>
                </Grid>
                <Grid item xs={12} md={6}>
                  <List>
                    <ListItem sx={{ 
                      mb: 2, 
                      bgcolor: 'rgba(255,255,255,0.7)', 
                      borderRadius: 2,
                      transition: 'all 0.2s ease-in-out',
                      '&:hover': { 
                        bgcolor: 'rgba(255,255,255,0.9)',
                        transform: 'translateX(8px)'
                      }
                    }}>
                      <ListItemIcon>
                        <Speed sx={{ color: 'info.main', fontSize: 28 }} />
                      </ListItemIcon>
                      <ListItemText 
                        primary={<Typography sx={{ fontWeight: 600 }}>Lightning Fast</Typography>} 
                        secondary="Generate comprehensive test scripts in under 30 seconds with optimized processing"
                      />
                    </ListItem>
                    <ListItem sx={{ 
                      mb: 2, 
                      bgcolor: 'rgba(255,255,255,0.7)', 
                      borderRadius: 2,
                      transition: 'all 0.2s ease-in-out',
                      '&:hover': { 
                        bgcolor: 'rgba(255,255,255,0.9)',
                        transform: 'translateX(8px)'
                      }
                    }}>
                      <ListItemIcon>
                        <Security sx={{ color: 'error.main', fontSize: 28 }} />
                      </ListItemIcon>
                      <ListItemText 
                        primary={<Typography sx={{ fontWeight: 600 }}>Enterprise Security</Typography>} 
                        secondary="Enterprise-grade security with Azure OpenAI and encrypted data processing"
                      />
                    </ListItem>
                    <ListItem sx={{ 
                      mb: 2, 
                      bgcolor: 'rgba(255,255,255,0.7)', 
                      borderRadius: 2,
                      transition: 'all 0.2s ease-in-out',
                      '&:hover': { 
                        bgcolor: 'rgba(255,255,255,0.9)',
                        transform: 'translateX(8px)'
                      }
                    }}>
                      <ListItemIcon>
                        <Api sx={{ color: 'primary.main', fontSize: 28 }} />
                      </ListItemIcon>
                      <ListItemText 
                        primary={<Typography sx={{ fontWeight: 600 }}>Smart API Parsing</Typography>} 
                        secondary="Automatic parsing of headers, body, parameters with intelligent validation"
                      />
                    </ListItem>
                    <ListItem sx={{ 
                      bgcolor: 'rgba(255,255,255,0.7)', 
                      borderRadius: 2,
                      transition: 'all 0.2s ease-in-out',
                      '&:hover': { 
                        bgcolor: 'rgba(255,255,255,0.9)',
                        transform: 'translateX(8px)'
                      }
                    }}>
                      <ListItemIcon>
                        <CheckCircle sx={{ color: 'success.main', fontSize: 28 }} />
                      </ListItemIcon>
                      <ListItemText 
                        primary={<Typography sx={{ fontWeight: 600 }}>Quality Assurance</Typography>} 
                        secondary="Generated scripts follow testing best practices with comprehensive coverage"
                      />
                    </ListItem>
                  </List>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Box>

        {/* How It Works */}
        <Box sx={{ px: 4 }}>
          <Card sx={{ 
            mb: 6,
            background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)'
          }}>
            <CardContent sx={{ p: 4 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, justifyContent: 'center' }}>
                <Timeline sx={{ fontSize: 32, color: 'primary.main', mr: 2 }} />
                <Typography variant="h5" sx={{ fontWeight: 700, color: 'primary.main' }}>
                  How It Works
                </Typography>
              </Box>
              <Divider sx={{ my: 3, bgcolor: 'rgba(102, 126, 234, 0.3)' }} />
              <Grid container spacing={4}>
                <Grid item xs={12} md={3}>
                  <Box sx={{ 
                    textAlign: 'center', 
                    p: 3,
                    transition: 'transform 0.3s ease-in-out',
                    '&:hover': { transform: 'translateY(-8px)' }
                  }}>
                    <Avatar sx={{ 
                      width: 80, 
                      height: 80, 
                      bgcolor: 'primary.main', 
                      mx: 'auto', 
                      mb: 3,
                      boxShadow: '0 8px 25px rgba(102, 126, 234, 0.3)',
                      transition: 'all 0.3s ease-in-out',
                      '&:hover': { 
                        transform: 'scale(1.1) rotate(5deg)',
                        boxShadow: '0 12px 35px rgba(102, 126, 234, 0.4)'
                      }
                    }}>
                      <DataObject sx={{ fontSize: 36 }} />
                    </Avatar>
                    <Typography variant="h6" gutterBottom sx={{ fontWeight: 700, color: 'primary.main' }}>
                      1. Configure Data Source
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                      Choose between Excel files or TestRail integration as your data source with flexible configuration options
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} md={3}>
                  <Box sx={{ 
                    textAlign: 'center', 
                    p: 3,
                    transition: 'transform 0.3s ease-in-out',
                    '&:hover': { transform: 'translateY(-8px)' }
                  }}>
                    <Avatar sx={{ 
                      width: 80, 
                      height: 80, 
                      bgcolor: 'secondary.main', 
                      mx: 'auto', 
                      mb: 3,
                      boxShadow: '0 8px 25px rgba(118, 75, 162, 0.3)',
                      transition: 'all 0.3s ease-in-out',
                      '&:hover': { 
                        transform: 'scale(1.1) rotate(-5deg)',
                        boxShadow: '0 12px 35px rgba(118, 75, 162, 0.4)'
                      }
                    }}>
                      <CloudUpload sx={{ fontSize: 36 }} />
                    </Avatar>
                    <Typography variant="h6" gutterBottom sx={{ fontWeight: 700, color: 'secondary.main' }}>
                      2. Upload Files
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                      Upload your API specifications and template files or use pre-configured defaults for quick setup
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} md={3}>
                  <Box sx={{ 
                    textAlign: 'center', 
                    p: 3,
                    transition: 'transform 0.3s ease-in-out',
                    '&:hover': { transform: 'translateY(-8px)' }
                  }}>
                    <Avatar sx={{ 
                      width: 80, 
                      height: 80, 
                      bgcolor: 'success.main', 
                      mx: 'auto', 
                      mb: 3,
                      boxShadow: '0 8px 25px rgba(76, 175, 80, 0.3)',
                      transition: 'all 0.3s ease-in-out',
                      '&:hover': { 
                        transform: 'scale(1.1) rotate(5deg)',
                        boxShadow: '0 12px 35px rgba(76, 175, 80, 0.4)'
                      }
                    }}>
                      <Psychology sx={{ fontSize: 36 }} />
                    </Avatar>
                    <Typography variant="h6" gutterBottom sx={{ fontWeight: 700, color: 'success.main' }}>
                      3. AI Generation
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                      Advanced AI analyzes your data and generates comprehensive RestAssured test scripts with intelligent patterns
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} md={3}>
                  <Box sx={{ 
                    textAlign: 'center', 
                    p: 3,
                    transition: 'transform 0.3s ease-in-out',
                    '&:hover': { transform: 'translateY(-8px)' }
                  }}>
                    <Avatar sx={{ 
                      width: 80, 
                      height: 80, 
                      bgcolor: 'warning.main', 
                      mx: 'auto', 
                      mb: 3,
                      boxShadow: '0 8px 25px rgba(255, 152, 0, 0.3)',
                      transition: 'all 0.3s ease-in-out',
                      '&:hover': { 
                        transform: 'scale(1.1) rotate(-5deg)',
                        boxShadow: '0 12px 35px rgba(255, 152, 0, 0.4)'
                      }
                    }}>
                      <GetApp sx={{ fontSize: 36 }} />
                    </Avatar>
                    <Typography variant="h6" gutterBottom sx={{ fontWeight: 700, color: 'warning.main' }}>
                      4. Download & Deploy
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                      Review, download, and integrate the generated scripts into your testing framework seamlessly
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Box>

        {/* Future Enhancements */}
        <Box sx={{ px: 4, pb: 4 }}>
          <Card sx={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white'
          }}>
            <CardContent sx={{ p: 4 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, justifyContent: 'center' }}>
                <AutoFixHigh sx={{ fontSize: 32, mr: 2 }} />
                <Typography variant="h5" sx={{ fontWeight: 700 }}>
                  🚀 Coming Soon: Future Enhancements
                </Typography>
              </Box>
              <Typography variant="body1" sx={{ 
                textAlign: 'center', 
                mb: 4, 
                fontSize: '1.1rem',
                color: 'rgba(255,255,255,0.9)'
              }}>
                We're constantly innovating to make your testing experience even better. Here's what's coming next:
              </Typography>
              <Divider sx={{ my: 3, bgcolor: 'rgba(255,255,255,0.3)' }} />
              
              <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                  <List>
                    <ListItem sx={{ 
                      mb: 2, 
                      bgcolor: 'rgba(255,255,255,0.1)', 
                      borderRadius: 2,
                      backdropFilter: 'blur(10px)',
                      transition: 'all 0.2s ease-in-out',
                      '&:hover': { 
                        bgcolor: 'rgba(255,255,255,0.2)',
                        transform: 'translateX(8px)'
                      }
                    }}>
                      <ListItemIcon>
                        <Chat sx={{ color: '#4fc3f7', fontSize: 28 }} />
                      </ListItemIcon>
                      <ListItemText 
                        primary={<Typography sx={{ fontWeight: 700, fontSize: '1.1rem' }}>💬 AI Chat Support</Typography>} 
                        secondary={<Typography sx={{ color: 'rgba(255,255,255,0.9)' }}>Interactive chat assistant to help you optimize your generated code and answer testing questions in real-time</Typography>}
                      />
                    </ListItem>
                  </List>
                </Grid>
                <Grid item xs={12} md={4}>
                  <List>
                    <ListItem sx={{ 
                      mb: 2, 
                      bgcolor: 'rgba(255,255,255,0.1)', 
                      borderRadius: 2,
                      backdropFilter: 'blur(10px)',
                      transition: 'all 0.2s ease-in-out',
                      '&:hover': { 
                        bgcolor: 'rgba(255,255,255,0.2)',
                        transform: 'translateX(8px)'
                      }
                    }}>
                      <ListItemIcon>
                        <SmartToy sx={{ color: '#81c784', fontSize: 28 }} />
                      </ListItemIcon>
                      <ListItemText 
                        primary={<Typography sx={{ fontWeight: 700, fontSize: '1.1rem' }}>🤖 Code Explanation Bot</Typography>} 
                        secondary={<Typography sx={{ color: 'rgba(255,255,255,0.9)' }}>AI-powered explanations of your generated code with suggestions for improvements and best practices</Typography>}
                      />
                    </ListItem>
                  </List>
                </Grid>
                <Grid item xs={12} md={4}>
                  <List>
                    <ListItem sx={{ 
                      bgcolor: 'rgba(255,255,255,0.1)', 
                      borderRadius: 2,
                      backdropFilter: 'blur(10px)',
                      transition: 'all 0.2s ease-in-out',
                      '&:hover': { 
                        bgcolor: 'rgba(255,255,255,0.2)',
                        transform: 'translateX(8px)'
                      }
                    }}>
                      <ListItemIcon>
                        <AutoAwesome sx={{ color: '#ffd54f', fontSize: 28 }} />
                      </ListItemIcon>
                      <ListItemText 
                        primary={<Typography sx={{ fontWeight: 700, fontSize: '1.1rem' }}>✨ Interactive Code Editor</Typography>} 
                        secondary={<Typography sx={{ color: 'rgba(255,255,255,0.9)' }}>Built-in code editor with syntax highlighting, auto-completion, and real-time validation</Typography>}
                      />
                    </ListItem>
                  </List>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Box>
      </Box>
      
      {/* Add CSS for bounce animation */}
      <style jsx>{`
        @keyframes bounce {
          0%, 20%, 50%, 80%, 100% {
            transform: translateY(0);
          }
          40% {
            transform: translateY(-10px);
          }
          60% {
            transform: translateY(-5px);
          }
        }
      `}</style>
    </Container>
  );
};

export default AboutPage;
