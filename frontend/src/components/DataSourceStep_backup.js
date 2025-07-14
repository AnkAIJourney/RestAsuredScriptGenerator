import React from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  RadioGroup,
  FormControlLabel,
  Radio,
  TextField,
  Button,
  Grid,
  Divider,
  Chip,
  Alert,
} from '@mui/material';
import {
  TableChart,
  BugReport,
  CheckCircle,
  Error,
  Visibility,
} from '@mui/icons-material';
import { testTestrailConnection, previewTestrailData } from '../api';
import PreviewDialog from './PreviewDialog';

const DataSourceStep = ({ 
  dataSource, 
  setDataSource, 
  testrailConfig, 
  setTestrailConfig, 
  connectionStatus,
  setConnectionStatus,
  showNotification 
}) => {
  const [testing, setTesting] = React.useState(false);
  const [previewOpen, setPreviewOpen] = React.useState(false);
  const [previewData, setPreviewData] = React.useState(null);
  const [previewLoading, setPreviewLoading] = React.useState(false);
  const [previewError, setPreviewError] = React.useState(null);

  // Set default TestRail URL if not provided
  React.useEffect(() => {
    if (dataSource === 'testrail' && !testrailConfig.testrailBaseUrl) {
      setTestrailConfig({
        ...testrailConfig,
        testrailBaseUrl: 'https://morningstar.testrail.net'
      });
    }
  }, [dataSource, testrailConfig, setTestrailConfig]);

  const handleTestrailConfigChange = (field) => (event) => {
    setTestrailConfig({
      ...testrailConfig,
      [field]: event.target.value,
    });
  };

  const testTestrailConnectionHandler = async () => {
    const baseUrl = testrailConfig.testrailBaseUrl || 'https://morningstar.testrail.net';
    
    if (!testrailConfig.username || !testrailConfig.apikey || !testrailConfig.testCaseId) {
      showNotification('Please fill in all TestRail fields', 'warning');
      return;
    }

    // Validate URL format
    try {
      new URL(baseUrl);
    } catch (error) {
      showNotification('Please enter a valid TestRail URL (e.g., https://company.testrail.net)', 'error');
      return;
    }

    setTesting(true);
    try {
      const response = await testTestrailConnection({
        username: testrailConfig.username,
        apikey: testrailConfig.apikey,
        testCaseId: testrailConfig.testCaseId,
        testrailBaseUrl: baseUrl,
      });

      if (response.success) {
        setConnectionStatus('success');
        showNotification('TestRail connection successful!', 'success');
      } else {
        setConnectionStatus('error');
        showNotification(response.message, 'error');
      }
    } catch (error) {
      setConnectionStatus('error');
      showNotification('TestRail connection failed: ' + error.message, 'error');
    } finally {
      setTesting(false);
    }
  };

  const handlePreviewTestrailData = async () => {
    const baseUrl = testrailConfig.testrailBaseUrl || 'https://morningstar.testrail.net';
    
    if (!testrailConfig.username || !testrailConfig.apikey || !testrailConfig.testCaseId) {
      showNotification('Please fill in all TestRail fields before previewing', 'warning');
      return;
    }

    setPreviewLoading(true);
    setPreviewError(null);
    setPreviewOpen(true);

    try {
      console.log('Fetching TestRail preview data...');
      const response = await previewTestrailData({
        username: testrailConfig.username,
        apikey: testrailConfig.apikey,
        testCaseId: testrailConfig.testCaseId,
        testrailBaseUrl: baseUrl,
      });

      console.log('TestRail preview response:', response);

      if (response.success) {
        console.log('TestRail preview data received:', response);
        setPreviewData(response);
        showNotification('TestRail data loaded successfully!', 'success');
      } else {
        console.error('TestRail preview failed:', response);
        setPreviewError(response.message || 'Failed to fetch TestRail data');
      }
    } catch (error) {
      console.error('TestRail preview error:', error);
      setPreviewError('Failed to preview TestRail data: ' + error.message);
    } finally {
      setPreviewLoading(false);
    }
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom textAlign="center" sx={{ 
        mb: 4,
        fontWeight: 700,
        background: 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        textShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        🎯 Choose Your Data Source
      </Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card 
            className="floating-card"
            sx={{ 
              height: '100%',
              cursor: 'pointer',
              border: dataSource === 'excel' ? '3px solid' : '2px solid',
              borderColor: dataSource === 'excel' ? 'primary.main' : 'rgba(0,0,0,0.12)',
              background: dataSource === 'excel' 
                ? 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.05) 100%)'
                : 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(10px)',
              position: 'relative',
              overflow: 'hidden',
              '&::before': dataSource === 'excel' ? {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '4px',
                background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
              } : {},
              '&:hover': {
                borderColor: 'primary.main',
                transform: 'translateY(-4px)',
                boxShadow: '0 12px 35px rgba(102, 126, 234, 0.2)'
              }
            }}
            onClick={() => setDataSource('excel')}
          >
            <CardContent sx={{ textAlign: 'center', p: 4 }}>
              <TableChart sx={{ fontSize: 64, color: 'primary.main', mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                📊 Excel File
              </Typography>
              <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                Upload an Excel file containing API details and test scenarios
              </Typography>
              <RadioGroup value={dataSource} onChange={(e) => setDataSource(e.target.value)}>
                <FormControlLabel 
                  value="excel" 
                  control={<Radio />} 
                  label="Use Excel as data source" 
                />
              </RadioGroup>
              {dataSource === 'excel' && (
                <Box sx={{ mt: 2 }}>
                  <Chip 
                    label="✓ Selected" 
                    color="primary" 
                    icon={<CheckCircle />}
                  />
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card 
            className="floating-card"
            sx={{ 
              height: '100%',
              cursor: 'pointer',
              border: dataSource === 'testrail' ? '3px solid' : '2px solid',
              borderColor: dataSource === 'testrail' ? 'secondary.main' : 'rgba(0,0,0,0.12)',
              background: dataSource === 'testrail' 
                ? 'linear-gradient(135deg, rgba(118, 75, 162, 0.1) 0%, rgba(102, 126, 234, 0.05) 100%)'
                : 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(10px)',
              position: 'relative',
              overflow: 'hidden',
              '&::before': dataSource === 'testrail' ? {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '4px',
                background: 'linear-gradient(90deg, #764ba2 0%, #667eea 100%)',
              } : {},
              '&:hover': {
                borderColor: 'secondary.main',
                transform: 'translateY(-4px)',
                boxShadow: '0 12px 35px rgba(118, 75, 162, 0.2)'
              }
            }}
            onClick={() => setDataSource('testrail')}
          >
            <CardContent sx={{ textAlign: 'center', p: 4 }}>
              <BugReport sx={{ fontSize: 64, color: 'secondary.main', mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                🐛 TestRail
              </Typography>
              <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                Connect to TestRail to fetch test cases and generate scripts
              </Typography>
              <RadioGroup value={dataSource} onChange={(e) => setDataSource(e.target.value)}>
                <FormControlLabel 
                  value="testrail" 
                  control={<Radio />} 
                  label="Use TestRail as data source" 
                />
              </RadioGroup>
              {dataSource === 'testrail' && (
                <Box sx={{ mt: 2 }}>
                  <Chip 
                    label="✓ Selected" 
                    color="secondary" 
                    icon={<CheckCircle />}
                  />
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {dataSource === 'testrail' && (
        <Box sx={{ mt: 4 }}>
          <Divider sx={{ mb: 3 }} />
          <Typography variant="h6" gutterBottom sx={{ 
            fontWeight: 600,
            color: 'secondary.main',
            mb: 3
          }}>
            🔧 TestRail Configuration
          </Typography>
          
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="TestRail Base URL"
                placeholder="https://yourcompany.testrail.net"
                value={testrailConfig.testrailBaseUrl || ''}
                onChange={handleTestrailConfigChange('testrailBaseUrl')}
                variant="outlined"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '&:hover fieldset': {
                      borderColor: 'secondary.main',
                    },
                  },
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Username"
                placeholder="your-email@company.com"
                value={testrailConfig.username || ''}
                onChange={handleTestrailConfigChange('username')}
                variant="outlined"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '&:hover fieldset': {
                      borderColor: 'secondary.main',
                    },
                  },
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="API Key"
                type="password"
                placeholder="Your TestRail API Key"
                value={testrailConfig.apikey || ''}
                onChange={handleTestrailConfigChange('apikey')}
                variant="outlined"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '&:hover fieldset': {
                      borderColor: 'secondary.main',
                    },
                  },
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Test Case ID"
                placeholder="e.g., C123"
                value={testrailConfig.testCaseId || ''}
                onChange={handleTestrailConfigChange('testCaseId')}
                variant="outlined"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '&:hover fieldset': {
                      borderColor: 'secondary.main',
                    },
                  },
                }}
              />
            </Grid>
          </Grid>

          <Box sx={{ mt: 3, display: 'flex', gap: 2, justifyContent: 'center' }}>
            <Button
              variant="contained"
              color="secondary"
              onClick={testTestrailConnectionHandler}
              disabled={testing}
              sx={{
                minWidth: 160,
                borderRadius: 3,
                fontWeight: 600,
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: '0 8px 25px rgba(118, 75, 162, 0.4)'
                }
              }}
            >
              {testing ? 'Testing...' : '🔗 Test Connection'}
            </Button>
            
            <Button
              variant="outlined"
              color="secondary"
              onClick={handlePreviewTestrailData}
              disabled={connectionStatus !== 'success'}
              startIcon={<Visibility />}
              sx={{
                minWidth: 140,
                borderRadius: 3,
                fontWeight: 600,
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: '0 8px 25px rgba(118, 75, 162, 0.3)'
                }
              }}
            >
              👁️ Preview Data
            </Button>
          </Box>

          {connectionStatus && (
            <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}>
              <Alert 
                severity={connectionStatus === 'success' ? 'success' : 'error'}
                icon={connectionStatus === 'success' ? <CheckCircle /> : <Error />}
                sx={{
                  borderRadius: 3,
                  fontWeight: 500,
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.2)'
                }}
              >
                {connectionStatus === 'success' 
                  ? '✅ TestRail connection successful!' 
                  : '❌ TestRail connection failed. Please check your credentials.'}
              </Alert>
            </Box>
          )}
        </Box>
      )}

      <PreviewDialog
        open={previewOpen}
        onClose={() => setPreviewOpen(false)}
        data={previewData}
        loading={previewLoading}
        error={previewError}
        title="TestRail Data Preview"
      />
    </Box>
  );
};

export default DataSourceStep;
