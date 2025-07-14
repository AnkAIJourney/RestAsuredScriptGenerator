import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip,
  IconButton,
  CircularProgress,
  Alert,
  Divider,
} from '@mui/material';
import {
  ExpandMore,
  Close,
  Visibility,
  TableChart,
  BugReport,
  Info,
  CheckCircle,
  Api,
  Settings,
  Description,
  PlayArrow,
  Code,
  Security,
  Http,
} from '@mui/icons-material';

const PreviewDialog = ({ 
  open, 
  onClose, 
  data, 
  loading, 
  error, 
  dataSource 
}) => {
  const renderExcelPreview = () => {
    if (!data || !data.testCases) {
      return (
        <Alert severity="info">
          No test cases found in the uploaded Excel file.
        </Alert>
      );
    }

    return (
      <Box>
        <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
          <TableChart color="primary" />
          <Typography variant="h6">
            Excel Test Cases Preview
          </Typography>
          <Chip 
            label={`${data.testCases.length} test cases found`} 
            color="primary" 
            size="small"
          />
        </Box>

        <TableContainer component={Paper} sx={{ maxHeight: 400 }}>
          <Table stickyHeader size="small">
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold' }}>Test Case</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Method</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>URL</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Expected Status</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Description</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.testCases.slice(0, 10).map((testCase, index) => (
                <TableRow key={index} hover>
                  <TableCell>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      {testCase.testCaseName || testCase.testCase || `Test Case ${index + 1}`}
                    </Typography>
                    {testCase.originalData && (
                      <Typography variant="caption" color="textSecondary" sx={{ display: 'block', mt: 0.5 }}>
                        Raw: {Object.keys(testCase.originalData).slice(0, 3).map(key => 
                          `${key}: ${testCase.originalData[key]}`
                        ).join(', ')}
                        {Object.keys(testCase.originalData).length > 3 && '...'}
                      </Typography>
                    )}
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={testCase.method || 'GET'} 
                      size="small" 
                      variant="outlined"
                      color={testCase.method === 'POST' ? 'success' : 
                             testCase.method === 'PUT' ? 'warning' :
                             testCase.method === 'DELETE' ? 'error' : 'primary'}
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ 
                      maxWidth: 200, 
                      overflow: 'hidden', 
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap'
                    }}>
                      {testCase.url || testCase.endpoint || 'N/A'}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={testCase.expectedStatusCode || testCase.statusCode || '200'} 
                      size="small"
                      color={
                        (testCase.expectedStatusCode || testCase.statusCode || '200').toString().startsWith('2') 
                          ? 'success' : 'warning'
                      }
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ 
                      maxWidth: 150, 
                      overflow: 'hidden', 
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap'
                    }}>
                      {testCase.description || testCase.testDescription || 'No description'}
                    </Typography>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {data.testCases.length > 10 && (
          <Alert severity="info" sx={{ mt: 2 }}>
            Showing first 10 test cases. Total: {data.testCases.length} test cases will be processed.
          </Alert>
        )}

        {data.summary && (
          <Box sx={{ mt: 3 }}>
            <Divider sx={{ mb: 2 }} />
            <Typography variant="h6" gutterBottom>
              File Summary
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 2 }}>
              <Chip icon={<Info />} label={`Sheets: ${data.summary.sheets || 1}`} />
              <Chip icon={<TableChart />} label={`Rows: ${data.summary.totalRows || data.testCases.length}`} />
              <Chip icon={<Visibility />} label={`Valid Cases: ${data.testCases.length}`} />
              {data.summary.sheetName && (
                <Chip icon={<Description />} label={`Sheet: ${data.summary.sheetName}`} variant="outlined" />
              )}
            </Box>
            
            {data.debug && data.debug.columnHeaders && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle2" color="primary" gutterBottom>
                  Available Excel Columns:
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  {data.debug.columnHeaders.map((header, index) => (
                    <Chip 
                      key={index}
                      label={header} 
                      size="small" 
                      variant="outlined" 
                      color="secondary"
                    />
                  ))}
                </Box>
              </Box>
            )}
          </Box>
        )}
      </Box>
    );
  };

  const renderTestRailPreview = () => {
    if (!data || !data.testCase) {
      return (
        <Alert severity="info">
          No test case data available from TestRail.
        </Alert>
      );
    }

    const testCase = data.testCase;

    // Helper function to get priority text
    const getPriorityText = (priorityId) => {
      const priorities = {
        1: 'Low',
        2: 'Medium', 
        3: 'High',
        4: 'Critical'
      };
      return priorities[priorityId] || `Priority ${priorityId}`;
    };

    // Helper function to get type text
    const getTypeText = (typeId) => {
      const types = {
        1: 'Automated',
        2: 'Functionality',
        3: 'Regression',
        4: 'Security',
        5: 'Usability',
        6: 'Performance',
        7: 'Acceptance',
        8: 'Compatibility',
        9: 'Integration',
        10: 'Exploratory'
      };
      return types[typeId] || `Type ${typeId}`;
    };

    // Helper function to parse test steps
    const parseTestSteps = (steps) => {
      if (!steps) return [];
      
      // If backend already parsed and structured the data
      if (Array.isArray(steps) && steps.length > 0 && steps[0].stepNumber) {
        return steps;
      }
      
      try {
        if (typeof steps === 'string') {
          // Try to parse as JSON first
          try {
            const parsed = JSON.parse(steps);
            if (Array.isArray(parsed)) {
              return parsed.map((step, index) => ({
                stepNumber: index + 1,
                content: typeof step === 'string' ? step : step.content || step.step || 'No content',
                expected: step.expected || step.result,
                type: detectStepType(typeof step === 'string' ? step : step.content || step.step || '')
              }));
            }
          } catch (e) {
            // If not JSON, split by common delimiters and format
            const stepLines = steps.split(/\n|\r\n|\r/).filter(line => line.trim());
            return stepLines.map((step, index) => ({
              stepNumber: index + 1,
              content: step.trim(),
              expected: null,
              type: detectStepType(step.trim())
            }));
          }
        }
        
        if (Array.isArray(steps)) {
          return steps.map((step, index) => ({
            stepNumber: index + 1,
            content: typeof step === 'string' ? step : step.content || step.step || 'No content',
            expected: step.expected || step.result,
            type: detectStepType(typeof step === 'string' ? step : step.content || step.step || '')
          }));
        }
      } catch (e) {
        console.error('Error parsing test steps:', e);
        return [{ 
          stepNumber: 1,
          content: typeof steps === 'string' ? steps : 'Unable to parse test steps',
          expected: null,
          type: 'info'
        }];
      }
      
      return [];
    };

    const detectStepType = (stepText) => {
      const text = stepText.toLowerCase();
      if (text.includes('api') || text.includes('request') || text.includes('post') || text.includes('get') || text.includes('put') || text.includes('delete')) {
        return 'api';
      }
      if (text.includes('verify') || text.includes('check') || text.includes('assert') || text.includes('expect')) {
        return 'verification';
      }
      if (text.includes('setup') || text.includes('prepare') || text.includes('initialize')) {
        return 'setup';
      }
      return 'action';
    };

    const getStepIcon = (type) => {
      switch (type) {
        case 'api': return <Api />;
        case 'verification': return <CheckCircle />;
        case 'setup': return <Settings />;
        default: return <PlayArrow />;
      }
    };

    const getStepColor = (type) => {
      switch (type) {
        case 'api': return 'primary';
        case 'verification': return 'success';
        case 'setup': return 'warning';
        default: return 'default';
      }
    };

    const extractApiDetails = (testCase) => {
      const apiDetails = {};
      
      // Extract API details from test case fields
      if (testCase.custom_api_endpoint || testCase.endpoint) {
        apiDetails.endpoint = testCase.custom_api_endpoint || testCase.endpoint;
      }
      
      if (testCase.custom_http_method || testCase.method) {
        apiDetails.method = testCase.custom_http_method || testCase.method;
      }
      
      if (testCase.custom_headers || testCase.headers) {
        try {
          apiDetails.headers = typeof testCase.custom_headers === 'string' 
            ? JSON.parse(testCase.custom_headers) 
            : testCase.custom_headers || testCase.headers;
        } catch (e) {
          apiDetails.headers = { 'Raw-Headers': testCase.custom_headers || testCase.headers };
        }
      }
      
      if (testCase.custom_request_body || testCase.body || testCase.payload) {
        apiDetails.requestBody = testCase.custom_request_body || testCase.body || testCase.payload;
      }
      
      if (testCase.custom_status_code || testCase.expectedStatusCode) {
        apiDetails.expectedStatusCode = testCase.custom_status_code || testCase.expectedStatusCode;
      }
      
      // Extract from test steps
      const steps = parseTestSteps(testCase.custom_steps_separated);
      const apiSteps = steps.filter(step => step.type === 'api');
      
      if (apiSteps.length > 0) {
        apiDetails.apiSteps = apiSteps;
      }
      
      return apiDetails;
    };

    const parsedSteps = parseTestSteps(testCase.custom_steps_separated);
    const apiDetails = extractApiDetails(testCase);

    return (
      <Box>
        <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
          <BugReport color="secondary" />
          <Typography variant="h6">
            TestRail Test Case Preview
          </Typography>
          <Chip 
            label={`ID: ${testCase.id || 'N/A'}`} 
            color="secondary" 
            size="small"
          />
        </Box>

        {/* API Details Section */}
        {(apiDetails.endpoint || apiDetails.method || apiDetails.headers || apiDetails.requestBody) && (
          <Accordion sx={{ mb: 2 }}>
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Api color="primary" />
                <Typography variant="h6">
                  API Details
                </Typography>
                <Chip 
                  label="REST API" 
                  size="small" 
                  color="primary" 
                  variant="outlined"
                />
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {apiDetails.endpoint && (
                  <Box>
                    <Typography variant="subtitle2" color="primary" gutterBottom>
                      <Http sx={{ mr: 1, fontSize: '1rem' }} />
                      Endpoint:
                    </Typography>
                    <Paper variant="outlined" sx={{ p: 2, bgcolor: 'grey.50' }}>
                      <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                        {apiDetails.endpoint}
                      </Typography>
                    </Paper>
                  </Box>
                )}

                {apiDetails.method && (
                  <Box>
                    <Typography variant="subtitle2" color="primary" gutterBottom>
                      HTTP Method:
                    </Typography>
                    <Chip 
                      label={apiDetails.method.toUpperCase()} 
                      color={
                        apiDetails.method === 'POST' ? 'success' :
                        apiDetails.method === 'PUT' ? 'warning' :
                        apiDetails.method === 'DELETE' ? 'error' : 'primary'
                      }
                      icon={<Code />}
                    />
                  </Box>
                )}

                {apiDetails.headers && (
                  <Box>
                    <Typography variant="subtitle2" color="primary" gutterBottom>
                      <Security sx={{ mr: 1, fontSize: '1rem' }} />
                      Headers:
                    </Typography>
                    <Paper variant="outlined" sx={{ p: 2, bgcolor: 'grey.50' }}>
                      {typeof apiDetails.headers === 'object' ? (
                        Object.entries(apiDetails.headers).map(([key, value]) => (
                          <Box key={key} sx={{ mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Chip 
                              label={key} 
                              size="small" 
                              color="secondary" 
                              variant="outlined"
                            />
                            <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                              {value}
                            </Typography>
                          </Box>
                        ))
                      ) : (
                        <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                          {apiDetails.headers}
                        </Typography>
                      )}
                    </Paper>
                  </Box>
                )}

                {apiDetails.requestBody && (
                  <Box>
                    <Typography variant="subtitle2" color="primary" gutterBottom>
                      Request Body:
                    </Typography>
                    <Paper variant="outlined" sx={{ p: 2, bgcolor: 'grey.50' }}>
                      <Typography variant="body2" sx={{ fontFamily: 'monospace', whiteSpace: 'pre-wrap' }}>
                        {typeof apiDetails.requestBody === 'object' 
                          ? JSON.stringify(apiDetails.requestBody, null, 2)
                          : apiDetails.requestBody}
                      </Typography>
                    </Paper>
                  </Box>
                )}

                {apiDetails.expectedStatusCode && (
                  <Box>
                    <Typography variant="subtitle2" color="primary" gutterBottom>
                      Expected Status Code:
                    </Typography>
                    <Chip 
                      label={apiDetails.expectedStatusCode} 
                      color={
                        apiDetails.expectedStatusCode.toString().startsWith('2') 
                          ? 'success' : 'warning'
                      }
                      icon={<CheckCircle />}
                    />
                  </Box>
                )}
              </Box>
            </AccordionDetails>
          </Accordion>
        )}

        <Accordion defaultExpanded>
          <AccordionSummary expandIcon={<ExpandMore />}>
            <Typography variant="h6">
              {testCase.title || 'Test Case Details'}
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <Box>
                <Typography variant="subtitle2" color="primary" gutterBottom>
                  Test Case ID:
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                  {testCase.id || 'N/A'}
                </Typography>
              </Box>

              <Box>
                <Typography variant="subtitle2" color="primary" gutterBottom>
                  Title:
                </Typography>
                <Typography variant="body1">
                  {testCase.title || 'No title available'}
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
                <Box>
                  <Typography variant="subtitle2" color="primary" gutterBottom>
                    Priority:
                  </Typography>
                  <Chip 
                    label={getPriorityText(testCase.priority_id || testCase.priority)} 
                    size="small"
                    color={
                      (testCase.priority_id || testCase.priority) === 4 ? 'error' :
                      (testCase.priority_id || testCase.priority) === 3 ? 'warning' :
                      (testCase.priority_id || testCase.priority) === 2 ? 'success' : 'default'
                    }
                  />
                </Box>

                <Box>
                  <Typography variant="subtitle2" color="primary" gutterBottom>
                    Type:
                  </Typography>
                  <Chip 
                    label={getTypeText(testCase.type_id || testCase.type)} 
                    size="small"
                    variant="outlined"
                  />
                </Box>

                {testCase.suite_id && (
                  <Box>
                    <Typography variant="subtitle2" color="primary" gutterBottom>
                      Suite ID:
                    </Typography>
                    <Chip 
                      label={`Suite ${testCase.suite_id}`} 
                      size="small"
                      variant="outlined"
                      color="info"
                    />
                  </Box>
                )}
              </Box>

              {parsedSteps && parsedSteps.length > 0 ? (
                <Box>
                  <Typography variant="subtitle2" color="primary" gutterBottom>
                    Test Steps & Expected Results:
                  </Typography>
                  <TableContainer component={Paper} variant="outlined">
                    <Table>
                      <TableHead>
                        <TableRow sx={{ bgcolor: 'primary.main' }}>
                          <TableCell sx={{ color: 'white', fontWeight: 'bold', width: '10%' }}>
                            Step #
                          </TableCell>
                          <TableCell sx={{ color: 'white', fontWeight: 'bold', width: '45%' }}>
                            Test Step
                          </TableCell>
                          <TableCell sx={{ color: 'white', fontWeight: 'bold', width: '45%' }}>
                            Expected Result
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {parsedSteps.map((step, index) => (
                          <TableRow key={index} sx={{ 
                            '&:nth-of-type(odd)': { bgcolor: 'grey.50' },
                            '&:hover': { bgcolor: 'action.hover' }
                          }}>
                            <TableCell sx={{ verticalAlign: 'top', p: 2 }}>
                              <Chip 
                                label={step.stepNumber || index + 1} 
                                size="small" 
                                color={getStepColor(step.type)} 
                                icon={getStepIcon(step.type)}
                                sx={{ minWidth: 50 }}
                              />
                            </TableCell>
                            <TableCell sx={{ verticalAlign: 'top', p: 2 }}>
                              <Paper variant="outlined" sx={{ p: 2, bgcolor: 'grey.50' }}>
                                <Typography variant="body2" sx={{ fontWeight: 500, mb: 1 }}>
                                  {step.content || step.step || step}
                                </Typography>
                                {step.type === 'api' && (
                                  <Chip 
                                    label="API Call" 
                                    size="small" 
                                    color="primary" 
                                    variant="outlined"
                                    sx={{ mt: 1 }}
                                  />
                                )}
                              </Paper>
                            </TableCell>
                            <TableCell sx={{ verticalAlign: 'top', p: 2 }}>
                              {step.expected ? (
                                <Paper variant="outlined" sx={{ p: 2, bgcolor: 'grey.50' }}>
                                  <Typography variant="body2">
                                    {step.expected}
                                  </Typography>
                                </Paper>
                              ) : (
                                <Typography variant="body2" color="textSecondary" sx={{ fontStyle: 'italic' }}>
                                  No expected result specified
                                </Typography>
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Box>
              ) : (
                <Box>
                  <Typography variant="subtitle2" color="primary" gutterBottom>
                    Test Steps:
                  </Typography>
                  <Alert severity="info" sx={{ bgcolor: 'grey.50' }}>
                    No test steps available for this test case
                  </Alert>
                </Box>
              )}

              {/* API Details Section */}
              {parsedSteps.some(step => step.type === 'api') && (
                <Box>
                  <Typography variant="subtitle2" color="primary" gutterBottom>
                    API Details:
                  </Typography>
                  <Paper variant="outlined" sx={{ p: 2, bgcolor: 'primary.light', color: 'primary.dark' }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        Common API Headers:
                      </Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                        <Chip label="Content-Type: application/json" size="small" variant="outlined" />
                        <Chip label="Accept: application/json" size="small" variant="outlined" />
                        <Chip label="Authorization: Bearer token" size="small" variant="outlined" />
                        <Chip label="Cache-Control: no-cache" size="small" variant="outlined" />
                      </Box>
                      <Typography variant="body2" sx={{ fontWeight: 500, mt: 1 }}>
                        Response Status Codes:
                      </Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                        <Chip label="200 - Success" size="small" color="success" />
                        <Chip label="201 - Created" size="small" color="success" />
                        <Chip label="400 - Bad Request" size="small" color="error" />
                        <Chip label="401 - Unauthorized" size="small" color="error" />
                        <Chip label="404 - Not Found" size="small" color="error" />
                        <Chip label="500 - Server Error" size="small" color="error" />
                      </Box>
                    </Box>
                  </Paper>
                </Box>
              )}

              {testCase.custom_preconds ? (
                <Box>
                  <Typography variant="subtitle2" color="primary" gutterBottom>
                    Preconditions:
                  </Typography>
                  <Paper variant="outlined" sx={{ p: 2, bgcolor: 'info.light', color: 'info.dark' }}>
                    <Typography variant="body2">
                      {testCase.custom_preconds}
                    </Typography>
                  </Paper>
                </Box>
              ) : (
                <Box>
                  <Typography variant="subtitle2" color="primary" gutterBottom>
                    Preconditions:
                  </Typography>
                  <Alert severity="info" sx={{ bgcolor: 'grey.50' }}>
                    No preconditions specified
                  </Alert>
                </Box>
              )}

              {testCase.custom_expected ? (
                <Box>
                  <Typography variant="subtitle2" color="primary" gutterBottom>
                    Expected Result:
                  </Typography>
                  <Paper variant="outlined" sx={{ p: 2, bgcolor: 'grey.50' }}>
                    <Typography variant="body2">
                      {testCase.custom_expected}
                    </Typography>
                  </Paper>
                </Box>
              ) : (
                <Box>
                  <Typography variant="subtitle2" color="primary" gutterBottom>
                    Expected Result:
                  </Typography>
                  <Alert severity="info" sx={{ bgcolor: 'grey.50' }}>
                    No expected result specified
                  </Alert>
                </Box>
              )}

              {testCase.refs && (
                <Box>
                  <Typography variant="subtitle2" color="primary" gutterBottom>
                    References:
                  </Typography>
                  <Typography variant="body2" sx={{ 
                    fontFamily: 'monospace', 
                    bgcolor: 'grey.100', 
                    p: 1, 
                    borderRadius: 1 
                  }}>
                    {testCase.refs}
                  </Typography>
                </Box>
              )}

              {(testCase.created_on || testCase.updated_on) && (
                <Box>
                  <Typography variant="subtitle2" color="primary" gutterBottom>
                    Timestamps:
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                    {testCase.created_on && (
                      <Chip 
                        label={`Created: ${testCase.created_on}`} 
                        size="small" 
                        variant="outlined"
                        color="info"
                      />
                    )}
                    {testCase.updated_on && (
                      <Chip 
                        label={`Updated: ${testCase.updated_on}`} 
                        size="small" 
                        variant="outlined"
                        color="secondary"
                      />
                    )}
                  </Box>
                </Box>
              )}
            </Box>
          </AccordionDetails>
        </Accordion>

        {data.summary && (
          <Box sx={{ mt: 3 }}>
            <Divider sx={{ mb: 2 }} />
            <Typography variant="h6" gutterBottom>
              Connection Summary
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <Chip icon={<BugReport />} label="TestRail Connected" color="success" />
              <Chip icon={<Info />} label={`Retrieved: ${data.summary.timestamp || new Date().toLocaleTimeString()}`} />
              <Chip icon={<Visibility />} label="Data Preview Active" color="primary" />
            </Box>
          </Box>
        )}
      </Box>
    );
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="lg" 
      fullWidth
      PaperProps={{
        sx: { height: '80vh' }
      }}
    >
      <DialogTitle sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        pb: 1
      }}>
        <Typography variant="h5">
          {dataSource === 'excel' ? 'Excel Data Preview' : 'TestRail Data Preview'}
        </Typography>
        <IconButton onClick={onClose} size="small">
          <Close />
        </IconButton>
      </DialogTitle>
      
      <DialogContent dividers sx={{ p: 3 }}>
        {loading && (
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            minHeight: 200 
          }}>
            <CircularProgress size={48} />
            <Typography variant="body1" sx={{ ml: 2 }}>
              Loading preview data...
            </Typography>
          </Box>
        )}

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            <Typography variant="body1">
              {error}
            </Typography>
          </Alert>
        )}

        {!loading && !error && data && (
          dataSource === 'excel' ? renderExcelPreview() : renderTestRailPreview()
        )}

        {!loading && !error && !data && (
          <Alert severity="info">
            No preview data available. Please check your configuration and try again.
          </Alert>
        )}
      </DialogContent>
      
      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose} variant="contained">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PreviewDialog;
