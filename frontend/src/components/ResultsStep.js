import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Grid,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemText,
  Chip,
  Alert,
  IconButton,
  Tooltip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import {
  Download,
  ContentCopy,
  Code,
  Api,
  CheckCircle,
  ExpandMore,
  Visibility,
  CodeRounded,
} from '@mui/icons-material';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism';

const ResultsStep = ({
  generatedFiles,
  apiDetails,
  scenarios,
  showNotification,
}) => {
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const copyToClipboard = (fileType = 'method') => {
    const content = fileType === 'method' ? generatedFiles.methodFile : generatedFiles.testFile;
    navigator.clipboard.writeText(content);
    showNotification(`${fileType === 'method' ? 'Method' : 'Test'} file copied to clipboard!`, 'success');
  };

  const downloadFileHandler = (fileType = 'method') => {
    const content = fileType === 'method' ? generatedFiles.methodFile : generatedFiles.testFile;
    const filename = fileType === 'method' ? generatedFiles.methodFilename : generatedFiles.testFilename;
    
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showNotification(`${fileType === 'method' ? 'Method' : 'Test'} file downloaded!`, 'success');
  };

  const downloadAllFiles = () => {
    downloadFileHandler('method');
    setTimeout(() => downloadFileHandler('test'), 100);
    showNotification('Both files downloaded!', 'success');
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom textAlign="center" sx={{ mb: 4 }}>
        <CheckCircle sx={{ mr: 2, color: 'success.main', verticalAlign: 'middle' }} />
        Method & Test Files Generated Successfully!
      </Typography>

      {/* Success Alert */}
      <Alert severity="success" sx={{ mb: 4 }}>
        <Typography variant="body1">
          Your RestAssured method and test files have been generated and are ready for use. 
          You can copy the code or download the files separately.
        </Typography>
      </Alert>

      {/* Action Buttons */}
      <Box sx={{ mb: 4, textAlign: 'center' }}>
        <Button
          variant="contained"
          startIcon={<Download />}
          onClick={downloadAllFiles}
          sx={{ mr: 2, minWidth: 150 }}
          size="large"
        >
          Download All
        </Button>
        <Button
          variant="outlined"
          startIcon={<Download />}
          onClick={() => downloadFileHandler('method')}
          sx={{ mr: 1 }}
        >
          Method File
        </Button>
        <Button
          variant="outlined"
          startIcon={<Download />}
          onClick={() => downloadFileHandler('test')}
        >
          Test File
        </Button>
      </Box>

      {/* Tabs for different views */}
      <Card>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tabValue} onChange={handleTabChange} centered>
            <Tab 
              icon={<CodeRounded />} 
              label="Method File" 
              iconPosition="start"
            />
            <Tab 
              icon={<Code />} 
              label="Test File" 
              iconPosition="start"
            />
            <Tab 
              icon={<Api />} 
              label="API Details" 
              iconPosition="start"
            />
            <Tab 
              icon={<Visibility />} 
              label="Test Scenarios" 
              iconPosition="start"
            />
          </Tabs>
        </Box>

        {/* Method File Tab */}
        {tabValue === 0 && (
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">
                Generated Method File ({generatedFiles.methodFilename})
              </Typography>
              <Box>
                <Tooltip title="Copy to clipboard">
                  <IconButton onClick={() => copyToClipboard('method')} color="secondary">
                    <ContentCopy />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Download file">
                  <IconButton onClick={() => downloadFileHandler('method')} color="secondary">
                    <Download />
                  </IconButton>
                </Tooltip>
              </Box>
            </Box>
            
            <Box sx={{ 
              border: '1px solid #e0e0e0', 
              borderRadius: 2, 
              overflow: 'auto',
              maxHeight: '600px'
            }}>
              <SyntaxHighlighter
                language="java"
                style={tomorrow}
                customStyle={{
                  margin: 0,
                  padding: '16px',
                  fontSize: '14px',
                  lineHeight: '1.5',
                }}
                showLineNumbers
              >
                {generatedFiles.methodFile || '// Method file content will appear here'}
              </SyntaxHighlighter>
            </Box>
          </CardContent>
        )}

        {/* Test File Tab */}
        {tabValue === 1 && (
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">
                Generated Test File ({generatedFiles.testFilename})
              </Typography>
              <Box>
                <Tooltip title="Copy to clipboard">
                  <IconButton onClick={() => copyToClipboard('test')} color="warning">
                    <ContentCopy />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Download file">
                  <IconButton onClick={() => downloadFileHandler('test')} color="warning">
                    <Download />
                  </IconButton>
                </Tooltip>
              </Box>
            </Box>
            
            <Box sx={{ 
              border: '1px solid #e0e0e0', 
              borderRadius: 2, 
              overflow: 'auto',
              maxHeight: '600px'
            }}>
              <SyntaxHighlighter
                language="java"
                style={tomorrow}
                customStyle={{
                  margin: 0,
                  padding: '16px',
                  fontSize: '14px',
                  lineHeight: '1.5',
                }}
                showLineNumbers
              >
                {generatedFiles.testFile || '// Test file content will appear here'}
              </SyntaxHighlighter>
            </Box>
          </CardContent>
        )}

        {/* API Details Tab */}
        {tabValue === 2 && (
          <CardContent>
            <Typography variant="h6" gutterBottom>
              API Configuration Details
            </Typography>
            
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="subtitle1" gutterBottom color="primary">
                      Request Information
                    </Typography>
                    <List dense>
                      <ListItem>
                        <ListItemText 
                          primary="Method" 
                          secondary={
                            <Chip 
                              label={apiDetails['Request Type'] || 'GET'} 
                              color="primary" 
                              size="small"
                            />
                          }
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemText 
                          primary="URL" 
                          secondary={apiDetails['Request Url'] || apiDetails['Request zUrl'] || 'Not specified'}
                        />
                      </ListItem>
                    </List>
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="subtitle1" gutterBottom color="secondary">
                      Headers & Body
                    </Typography>
                    
                    <Accordion>
                      <AccordionSummary expandIcon={<ExpandMore />}>
                        <Typography variant="body2">
                          Headers ({Object.keys(apiDetails.Headers || {}).length})
                        </Typography>
                      </AccordionSummary>
                      <AccordionDetails>
                        <Box sx={{ bgcolor: 'grey.50', p: 2, borderRadius: 1 }}>
                          <pre style={{ margin: 0, fontSize: '12px' }}>
                            {JSON.stringify(apiDetails.Headers || {}, null, 2)}
                          </pre>
                        </Box>
                      </AccordionDetails>
                    </Accordion>
                    
                    {apiDetails.Body && (
                      <Accordion sx={{ mt: 1 }}>
                        <AccordionSummary expandIcon={<ExpandMore />}>
                          <Typography variant="body2">Request Body</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                          <Box sx={{ bgcolor: 'grey.50', p: 2, borderRadius: 1 }}>
                            <pre style={{ margin: 0, fontSize: '12px' }}>
                              {typeof apiDetails.Body === 'string' 
                                ? apiDetails.Body 
                                : JSON.stringify(apiDetails.Body, null, 2)
                              }
                            </pre>
                          </Box>
                        </AccordionDetails>
                      </Accordion>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </CardContent>
        )}

        {/* Test Scenarios Tab */}
        {tabValue === 3 && (
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Test Scenarios ({scenarios.length})
            </Typography>
            
            <Grid container spacing={2}>
              {scenarios.map((scenario, index) => (
                <Grid item xs={12} key={index}>
                  <Card variant="outlined">
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Chip 
                          label={`Test ${index + 1}`} 
                          color="primary" 
                          size="small" 
                          sx={{ mr: 2 }}
                        />
                        <Typography variant="h6" component="div">
                          {scenario['Test Name']}
                        </Typography>
                      </Box>
                      
                      <Grid container spacing={2}>
                        <Grid item xs={12} md={6}>
                          <Typography variant="subtitle2" gutterBottom color="text.secondary">
                            Test Steps:
                          </Typography>
                          <Typography variant="body2">
                            {scenario.Steps}
                          </Typography>
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <Typography variant="subtitle2" gutterBottom color="text.secondary">
                            Expected Result:
                          </Typography>
                          <Typography variant="body2">
                            {scenario['Expected Result']}
                          </Typography>
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </CardContent>
        )}
      </Card>

      {/* Statistics */}
      <Grid container spacing={2} sx={{ mt: 4 }}>
        <Grid item xs={12} md={4}>
          <Card sx={{ textAlign: 'center', bgcolor: 'primary.50' }}>
            <CardContent>
              <Typography variant="h4" color="primary.main">
                {scenarios.length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Test Scenarios
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card sx={{ textAlign: 'center', bgcolor: 'secondary.50' }}>
            <CardContent>
              <Typography variant="h4" color="secondary.main">
                {(generatedFiles.methodFile?.split('\n').length || 0) + (generatedFiles.testFile?.split('\n').length || 0)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Lines of Code
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card sx={{ textAlign: 'center', bgcolor: 'success.50' }}>
            <CardContent>
              <Typography variant="h4" color="success.main">
                {Object.keys(apiDetails.Headers || {}).length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                API Headers
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ResultsStep;
