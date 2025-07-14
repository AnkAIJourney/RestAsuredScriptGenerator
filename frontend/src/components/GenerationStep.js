import React from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Grid,
  Alert,
  Chip,
  List,
  ListItem,
  ListItemText,
  Divider,
  CircularProgress,
} from '@mui/material';
import {
  PlayArrow,
  Code,
  Api,
  CheckCircle,
} from '@mui/icons-material';
import { generateScript } from '../api';

const GenerationStep = ({
  dataSource,
  files,
  testrailConfig,
  useDefaultFiles,
  setGeneratedFiles,
  setApiDetails,
  setScenarios,
  showNotification,
  loading,
  setLoading,
  onNext,
}) => {
  const [previewData, setPreviewData] = React.useState(null);

  const isReady = () => {
    if (useDefaultFiles) return true;
    
    if (dataSource === 'excel') {
      return files.excelFile && files.methodFile && files.testFile;
    } else {
      return files.methodFile && files.testFile && testrailConfig.username;
    }
  };

  const generateScriptHandler = async () => {
    if (!isReady()) {
      showNotification('Please ensure all required files and configurations are provided.', 'warning');
      return;
    }

    setLoading(true);
    try {
      // Ensure TestRail config has a base URL
      const finalTestrailConfig = {
        ...testrailConfig,
        testrailBaseUrl: testrailConfig.testrailBaseUrl || 'https://morningstar.testrail.net'
      };

      const requestData = {
        dataSource,
        files,
        testrailConfig: finalTestrailConfig,
        useDefaultFiles,
      };

      console.log('Sending request to generate script:', requestData);
      const response = await generateScript(requestData);

      if (response.success) {
        setGeneratedFiles({
          methodFile: response.methodFile || '',
          testFile: response.testFile || '',
          methodFilename: response.methodFilename || 'Methods.java',
          testFilename: response.testFilename || 'Tests.java'
        });
        setApiDetails(response.apiDetails);
        setScenarios(response.scenarios);
        setPreviewData({
          apiDetails: response.apiDetails,
          scenarios: response.scenarios,
        });
        showNotification('Method and Test files generated successfully!', 'success');
        onNext();
      } else {
        showNotification('Failed to generate script: ' + response.message, 'error');
      }
    } catch (error) {
      console.error('Generation error:', error);
      showNotification('Generation failed: ' + error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom textAlign="center" sx={{ mb: 4 }}>
        Generate Test Script
      </Typography>

      <Grid container spacing={3}>
        {/* Configuration Summary */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                <Api sx={{ mr: 1, verticalAlign: 'middle' }} />
                Configuration Summary
              </Typography>
              <List dense>
                <ListItem>
                  <ListItemText 
                    primary="Data Source" 
                    secondary={
                      <Chip 
                        label={dataSource === 'excel' ? 'Excel File' : 'TestRail'} 
                        color="primary" 
                        size="small"
                      />
                    }
                  />
                </ListItem>
                <ListItem>
                  <ListItemText 
                    primary="File Source" 
                    secondary={
                      <Chip 
                        label={useDefaultFiles ? 'Default Files' : 'Uploaded Files'} 
                        color="secondary" 
                        size="small"
                      />
                    }
                  />
                </ListItem>
                {dataSource === 'testrail' && (
                  <ListItem>
                    <ListItemText 
                      primary="TestRail Case ID" 
                      secondary={testrailConfig.testCaseId}
                    />
                  </ListItem>
                )}
                {!useDefaultFiles && (
                  <>
                    <ListItem>
                      <ListItemText 
                        primary="Files Uploaded" 
                        secondary={`${Object.keys(files).length} files`}
                      />
                    </ListItem>
                  </>
                )}
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Generation Controls */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Code sx={{ fontSize: 64, color: 'primary.main', mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                Ready to Generate
              </Typography>
              <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
                Click the button below to generate your RestAssured method and test files
              </Typography>
              
              {isReady() ? (
                <Alert severity="success" sx={{ mb: 2 }}>
                  <Typography variant="body2">
                    All requirements satisfied. Ready to generate!
                  </Typography>
                </Alert>
              ) : (
                <Alert severity="warning" sx={{ mb: 2 }}>
                  <Typography variant="body2">
                    Please complete the previous steps before generating.
                  </Typography>
                </Alert>
              )}

              {/* Navigation Buttons */}
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button
                  variant="contained"
                  size="large"
                  startIcon={loading ? <CircularProgress size={20} /> : <PlayArrow />}
                  onClick={generateScriptHandler}
                  disabled={!isReady() || loading}
                  sx={{ 
                    flex: 1,
                    py: 2,
                    fontSize: '1.1rem',
                    fontWeight: 600,
                  }}
                >
                  {loading ? 'Generating...' : 'Generate Method & Test Files'}
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Generation Process Info */}
      <Card sx={{ mt: 4, bgcolor: 'rgba(102, 126, 234, 0.05)' }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            <CheckCircle sx={{ mr: 1, verticalAlign: 'middle', color: 'success.main' }} />
            What happens during generation?
          </Typography>
          <Divider sx={{ my: 2 }} />
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="subtitle2" gutterBottom>
                  1. Parse Data
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Extract API details and test scenarios from your {dataSource === 'excel' ? 'Excel file' : 'TestRail test case'}
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="subtitle2" gutterBottom>
                  2. Analyze Templates
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Study your existing method and test files for patterns
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="subtitle2" gutterBottom>
                  3. Generate Files
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Create separate Method and Test files with RestAssured implementation
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Preview Data (if available) */}
      {previewData && (
        <Card sx={{ mt: 4 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Preview: API Details & Scenarios
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" gutterBottom>
                  API Details:
                </Typography>
                <Box sx={{ bgcolor: 'grey.100', p: 2, borderRadius: 1 }}>
                  <Typography variant="body2" component="pre">
                    {JSON.stringify(previewData.apiDetails, null, 2)}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" gutterBottom>
                  Test Scenarios ({previewData.scenarios.length}):
                </Typography>
                <List dense>
                  {previewData.scenarios.map((scenario, index) => (
                    <ListItem key={index}>
                      <ListItemText 
                        primary={scenario['Test Name']}
                        secondary={scenario['Expected Result']}
                      />
                    </ListItem>
                  ))}
                </List>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      )}
    </Box>
  );
};

export default GenerationStep;
