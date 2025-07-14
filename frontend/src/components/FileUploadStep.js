import React, { useCallback } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Switch,
  FormControlLabel,
  Grid,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip,
  Alert,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import {
  CloudUpload,
  InsertDriveFile,
  CheckCircle,
  Folder,
  Description,
  CodeRounded,
  Visibility,
  Close,
  ExpandMore,
} from '@mui/icons-material';
import { useDropzone } from 'react-dropzone';
import { uploadFiles } from '../api';

const FileUploadStep = ({ 
  files, 
  setFiles, 
  dataSource, 
  useDefaultFiles, 
  setUseDefaultFiles,
  showNotification 
}) => {
  const [uploading, setUploading] = React.useState(false);
  const [uploadedFiles, setUploadedFiles] = React.useState({});
  const [fileContents, setFileContents] = React.useState({});
  const [previewDialog, setPreviewDialog] = React.useState({
    open: false,
    title: '',
    content: '',
    fileType: ''
  });
  const [dragStates, setDragStates] = React.useState({
    excel: false,
    method: false,
    test: false
  });

  // Helper function to handle file upload
  const handleFileUpload = useCallback(async (acceptedFiles, rejectedFiles, fileType) => {
    if (rejectedFiles.length > 0) {
      showNotification(`Invalid file type for ${fileType}. Please upload the correct file format.`, 'error');
      return;
    }

    setUploading(true);
    const formData = new FormData();
    
    // Map file type to form field name
    const fieldName = fileType === 'Excel' ? 'excelFile' : 
                     fileType === 'Method' ? 'methodFile' : 'testFile';
    
    // Read file content for Java files (Method and Test)
    if (fileType === 'Method' || fileType === 'Test') {
      const file = acceptedFiles[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        setFileContents(prev => ({
          ...prev,
          [fieldName]: e.target.result
        }));
      };
      reader.readAsText(file);
    }
    
    acceptedFiles.forEach((file) => {
      formData.append(fieldName, file);
    });

    try {
      const response = await uploadFiles(formData);

      if (response.success) {
        setUploadedFiles({ ...uploadedFiles, ...response.files });
        setFiles({ ...files, ...response.files });
        showNotification(`${fileType} file uploaded successfully!`, 'success');
      }
    } catch (error) {
      showNotification(`${fileType} file upload failed: ` + error.message, 'error');
    } finally {
      setUploading(false);
    }
  }, [files, uploadedFiles, setFiles, showNotification]);

  // Create separate dropzones for each file type
  const excelDropzone = useDropzone({
    onDrop: (acceptedFiles, rejectedFiles) => handleFileUpload(acceptedFiles, rejectedFiles, 'Excel'),
    accept: {
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-excel': ['.xls']
    },
    multiple: false,
    onDragEnter: () => setDragStates(prev => ({ ...prev, excel: true })),
    onDragLeave: () => setDragStates(prev => ({ ...prev, excel: false })),
    onDropAccepted: () => setDragStates(prev => ({ ...prev, excel: false })),
    onDropRejected: () => setDragStates(prev => ({ ...prev, excel: false }))
  });

  const methodDropzone = useDropzone({
    onDrop: (acceptedFiles, rejectedFiles) => handleFileUpload(acceptedFiles, rejectedFiles, 'Method'),
    accept: {
      'text/plain': ['.java']
    },
    multiple: false,
    onDragEnter: () => setDragStates(prev => ({ ...prev, method: true })),
    onDragLeave: () => setDragStates(prev => ({ ...prev, method: false })),
    onDropAccepted: () => setDragStates(prev => ({ ...prev, method: false })),
    onDropRejected: () => setDragStates(prev => ({ ...prev, method: false }))
  });

  const testDropzone = useDropzone({
    onDrop: (acceptedFiles, rejectedFiles) => handleFileUpload(acceptedFiles, rejectedFiles, 'Test'),
    accept: {
      'text/plain': ['.java']
    },
    multiple: false,
    onDragEnter: () => setDragStates(prev => ({ ...prev, test: true })),
    onDragLeave: () => setDragStates(prev => ({ ...prev, test: false })),
    onDropAccepted: () => setDragStates(prev => ({ ...prev, test: false })),
    onDropRejected: () => setDragStates(prev => ({ ...prev, test: false }))
  });

  const getFileTypeFromName = (filename) => {
    if (filename.endsWith('.xlsx') || filename.endsWith('.xls')) {
      return 'Excel File';
    } else if (filename.includes('method') || filename.includes('Method')) {
      return 'Method File';
    } else if (filename.includes('test') || filename.includes('Test')) {
      return 'Test File';
    }
    return 'Java File';
  };

  const requiredFiles = useDefaultFiles 
    ? (dataSource === 'excel' ? ['Excel File'] : [])
    : (dataSource === 'excel' ? ['Excel File', 'Method File', 'Test File'] : ['Method File', 'Test File']);

  const getUploadedFileCount = () => {
    const fileTypes = Object.keys(uploadedFiles).map(key => {
      if (key === 'excelFile') return 'Excel File';
      if (key === 'methodFile') return 'Method File';
      if (key === 'testFile') return 'Test File';
      return 'Unknown';
    });
    return requiredFiles.filter(type => fileTypes.includes(type)).length;
  };

  const handlePreview = (fileKey, fileName) => {
    const content = fileContents[fileKey];
    if (content) {
      setPreviewDialog({
        open: true,
        title: fileName,
        content: content,
        fileType: fileKey
      });
    }
  };

  const closePreview = () => {
    setPreviewDialog({
      open: false,
      title: '',
      content: '',
      fileType: ''
    });
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
        {useDefaultFiles ? '📁 File Upload (Optional)' : '📋 Upload Required Files'}
      </Typography>

      {/* Enhanced Default Files Toggle */}
      <Card className="floating-card" sx={{ 
        mb: 4, 
        background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.08) 0%, rgba(118, 75, 162, 0.05) 100%)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(102, 126, 234, 0.2)',
        borderRadius: 3
      }}>
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Folder sx={{ 
                mr: 2, 
                color: 'primary.main',
                fontSize: '2rem',
                filter: 'drop-shadow(0 2px 4px rgba(102, 126, 234, 0.3))'
              }} />
              <Box>
                <Typography variant="h6" sx={{ 
                  fontWeight: 600,
                  color: 'primary.main'
                }}>
                  ⚡ Use Default Files
                </Typography>
                <Typography variant="body2" color="textSecondary" sx={{ fontWeight: 500 }}>
                  Use pre-configured files from the default location for quick testing
                </Typography>
              </Box>
            </Box>
            <FormControlLabel
              control={
                <Switch
                  checked={useDefaultFiles}
                  onChange={(e) => setUseDefaultFiles(e.target.checked)}
                  color="primary"
                  size="medium"
                />
              }
              label=""
            />
          </Box>
        </CardContent>
      </Card>

      {!useDefaultFiles ? (
        <Grid container spacing={3}>
          {/* Enhanced File Requirements Info */}
          <Grid item xs={12}>
            <Alert severity="info" sx={{ 
              mb: 3,
              borderRadius: 3,
              border: '1px solid rgba(102, 126, 234, 0.2)',
              background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.03) 100%)',
              backdropFilter: 'blur(10px)',
              '& .MuiAlert-icon': {
                fontSize: '1.5rem'
              }
            }}>
              <Typography variant="subtitle2" gutterBottom sx={{ 
                fontWeight: 700,
                color: 'primary.main',
                display: 'flex',
                alignItems: 'center',
                gap: 1
              }}>
                📁 File Upload Requirements:
              </Typography>
              <Typography variant="body2" component="div" sx={{ fontWeight: 500, lineHeight: 1.6 }}>
                • <strong>Method File (.java):</strong> Contains REST API method definitions, HTTP calls, and utility functions
                <br />
                • <strong>Test File (.java):</strong> Contains test case implementations, assertions, and test data validation
                <br />
                {dataSource === 'excel' && (
                  <>
                    • <strong>Excel File (.xlsx/.xls):</strong> Contains test data, scenarios, and expected results
                  </>
                )}
                {dataSource === 'testrail' && (
                  <>
                    • <strong>TestRail:</strong> Test scenarios and API details will be fetched from your configured TestRail test case
                  </>
                )}
              </Typography>
            </Alert>
          </Grid>

          {/* Upload Areas */}
          <Grid item xs={12}>
            <Grid container spacing={2}>
              {/* Excel File Upload */}
              {dataSource === 'excel' && (
                <Grid item xs={12} md={4}>
                  <Card
                    {...excelDropzone.getRootProps()}
                    sx={{
                      p: 3,
                      textAlign: 'center',
                      cursor: 'pointer',
                      border: '2px dashed',
                      borderColor: dragStates.excel ? 'primary.main' : 'grey.300',
                      bgcolor: dragStates.excel ? 'rgba(102, 126, 234, 0.1)' : 'transparent',
                      transition: 'all 0.3s ease',
                      minHeight: 200,
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                      '&:hover': {
                        borderColor: 'primary.main',
                        bgcolor: 'rgba(102, 126, 234, 0.05)',
                        transform: 'translateY(-2px)',
                      },
                    }}
                  >
                    <input {...excelDropzone.getInputProps()} />
                    <CloudUpload sx={{ fontSize: 48, color: 'primary.main', mb: 1 }} />
                    <Typography variant="h6" gutterBottom color="primary">
                      Excel File
                    </Typography>
                    <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                      {dragStates.excel ? 'Drop Excel file here' : 'Drag & drop Excel file'}
                    </Typography>
                    <Button variant="outlined" size="small" disabled={uploading}>
                      {uploading ? 'Uploading...' : 'Choose Excel'}
                    </Button>
                    <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                      (.xlsx, .xls)
                    </Typography>
                    {uploadedFiles.excelFile && (
                      <Chip 
                        label="Uploaded" 
                        color="success" 
                        size="small"
                        icon={<CheckCircle />}
                        sx={{ mt: 1 }}
                      />
                    )}
                  </Card>
                </Grid>
              )}

              {/* Method File Upload */}
              <Grid item xs={12} md={dataSource === 'excel' ? 4 : 6}>
                <Card
                  {...methodDropzone.getRootProps()}
                  sx={{
                    p: 3,
                    textAlign: 'center',
                    cursor: 'pointer',
                    border: '2px dashed',
                    borderColor: dragStates.method ? 'secondary.main' : 'grey.300',
                    bgcolor: dragStates.method ? 'rgba(102, 187, 106, 0.1)' : 'transparent',
                    transition: 'all 0.3s ease',
                    minHeight: 200,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    '&:hover': {
                      borderColor: 'secondary.main',
                      bgcolor: 'rgba(102, 187, 106, 0.05)',
                      transform: 'translateY(-2px)',
                    },
                  }}
                >
                  <input {...methodDropzone.getInputProps()} />
                  <CodeRounded sx={{ fontSize: 48, color: 'secondary.main', mb: 1 }} />
                  <Typography variant="h6" gutterBottom color="secondary">
                    Method File
                  </Typography>
                  <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
                    {dragStates.method ? 'Drop method file here' : 'Upload Java method file'}
                  </Typography>
                  <Typography variant="caption" display="block" sx={{ mb: 2, fontStyle: 'italic' }}>
                    Contains REST API method definitions and utilities
                  </Typography>
                  <Button variant="outlined" color="secondary" size="small" disabled={uploading}>
                    {uploading ? 'Uploading...' : 'Choose Method'}
                  </Button>
                  <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                    (.java)
                  </Typography>
                  {uploadedFiles.methodFile && (
                    <Box sx={{ mt: 1, display: 'flex', gap: 1, flexWrap: 'wrap', justifyContent: 'center' }}>
                      <Chip 
                        label="Uploaded" 
                        color="success" 
                        size="small"
                        icon={<CheckCircle />}
                      />
                      <Chip 
                        label="Preview" 
                        color="secondary" 
                        size="small"
                        icon={<Visibility />}
                        onClick={() => handlePreview('methodFile', uploadedFiles.methodFile)}
                        clickable
                      />
                    </Box>
                  )}
                </Card>
              </Grid>

              {/* Test File Upload */}
              <Grid item xs={12} md={dataSource === 'excel' ? 4 : 6}>
                <Card
                  {...testDropzone.getRootProps()}
                  sx={{
                    p: 3,
                    textAlign: 'center',
                    cursor: 'pointer',
                    border: '2px dashed',
                    borderColor: dragStates.test ? 'warning.main' : 'grey.300',
                    bgcolor: dragStates.test ? 'rgba(255, 152, 0, 0.1)' : 'transparent',
                    transition: 'all 0.3s ease',
                    minHeight: 200,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    '&:hover': {
                      borderColor: 'warning.main',
                      bgcolor: 'rgba(255, 152, 0, 0.05)',
                      transform: 'translateY(-2px)',
                    },
                  }}
                >
                  <input {...testDropzone.getInputProps()} />
                  <InsertDriveFile sx={{ fontSize: 48, color: 'warning.main', mb: 1 }} />
                  <Typography variant="h6" gutterBottom color="warning.main">
                    Test File
                  </Typography>
                  <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
                    {dragStates.test ? 'Drop test file here' : 'Upload Java test file'}
                  </Typography>
                  <Typography variant="caption" display="block" sx={{ mb: 2, fontStyle: 'italic' }}>
                    Contains test case implementations and assertions
                  </Typography>
                  <Button variant="outlined" color="warning" size="small" disabled={uploading}>
                    {uploading ? 'Uploading...' : 'Choose Test'}
                  </Button>
                  <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                    (.java)
                  </Typography>
                  {uploadedFiles.testFile && (
                    <Box sx={{ mt: 1, display: 'flex', gap: 1, flexWrap: 'wrap', justifyContent: 'center' }}>
                      <Chip 
                        label="Uploaded" 
                        color="success" 
                        size="small"
                        icon={<CheckCircle />}
                      />
                      <Chip 
                        label="Preview" 
                        color="warning" 
                        size="small"
                        icon={<Visibility />}
                        onClick={() => handlePreview('testFile', uploadedFiles.testFile)}
                        clickable
                      />
                    </Box>
                  )}
                </Card>
              </Grid>
            </Grid>

            {/* Progress */}
            {requiredFiles.length > 0 && (
              <Box sx={{ mt: 3, textAlign: 'center' }}>
                <Typography variant="body2" color="textSecondary">
                  Progress: {getUploadedFileCount()} of {requiredFiles.length} files uploaded
                </Typography>
              </Box>
            )}
          </Grid>

          {/* File Requirements */}
          {requiredFiles.length > 0 && (
            <Grid item xs={12}>
              <Card>
                <CardContent>
                <Typography variant="h6" gutterBottom>
                  Upload Status
                </Typography>
                <List dense>
                  {requiredFiles.map((fileType) => (
                    <ListItem key={fileType}>
                      <ListItemIcon>
                        <CheckCircle 
                          color={
                            Object.keys(uploadedFiles).some(key => 
                              (key === 'excelFile' && fileType === 'Excel File') ||
                              (key === 'methodFile' && fileType === 'Method File') ||
                              (key === 'testFile' && fileType === 'Test File')
                            ) ? 'success' : 'disabled'
                          }
                        />
                      </ListItemIcon>
                      <ListItemText 
                        primary={fileType}
                        secondary={
                          Object.keys(uploadedFiles).some(key => 
                            (key === 'excelFile' && fileType === 'Excel File') ||
                            (key === 'methodFile' && fileType === 'Method File') ||
                            (key === 'testFile' && fileType === 'Test File')
                          ) ? 'Uploaded successfully' : 'Waiting for upload'
                        }
                      />
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Grid>
          )}
        </Grid>
      ) : (
        <Grid container spacing={3}>
          {/* When using default files, only show Excel upload if dataSource is excel */}
          {dataSource === 'excel' && (
            <Grid item xs={12}>
              <Grid container justifyContent="center">
                <Grid item xs={12} md={6}>
                  <Card
                    {...excelDropzone.getRootProps()}
                    sx={{
                      p: 3,
                      textAlign: 'center',
                      cursor: 'pointer',
                      border: '2px dashed',
                      borderColor: dragStates.excel ? 'primary.main' : 'grey.300',
                      bgcolor: dragStates.excel ? 'rgba(102, 126, 234, 0.1)' : 'transparent',
                      transition: 'all 0.3s ease',
                      minHeight: 200,
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                      '&:hover': {
                        borderColor: 'primary.main',
                        bgcolor: 'rgba(102, 126, 234, 0.05)',
                        transform: 'translateY(-2px)',
                      },
                    }}
                  >
                    <input {...excelDropzone.getInputProps()} />
                    <CloudUpload sx={{ fontSize: 48, color: 'primary.main', mb: 1 }} />
                    <Typography variant="h6" gutterBottom color="primary">
                      Excel File
                    </Typography>
                    <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                      {dragStates.excel ? 'Drop Excel file here' : 'Upload your Excel file (optional)'}
                    </Typography>
                    <Button variant="outlined" size="small" disabled={uploading}>
                      {uploading ? 'Uploading...' : 'Choose Excel'}
                    </Button>
                    <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                      (.xlsx, .xls)
                    </Typography>
                    {uploadedFiles.excelFile && (
                      <Chip 
                        label="Uploaded" 
                        color="success" 
                        size="small"
                        icon={<CheckCircle />}
                        sx={{ mt: 1 }}
                      />
                    )}
                    {!uploadedFiles.excelFile && (
                      <Chip 
                        label="Using default file" 
                        color="primary" 
                        variant="outlined"
                        size="small"
                        sx={{ mt: 1 }}
                      />
                    )}
                  </Card>
                </Grid>
              </Grid>
              
              <Alert severity="info" sx={{ mt: 3 }}>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  <strong>Default Files Mode:</strong>
                </Typography>
                <Typography variant="body2" component="div">
                  • Method and Test files will use default configurations
                  <br />
                  • Excel file: Upload your own file above, or leave empty to use the default Excel file from the configured location
                  <br />
                  • You can proceed to the next step with or without uploading an Excel file
                </Typography>
              </Alert>
            </Grid>
          )}
          
          {/* If dataSource is not excel, show message that all files use defaults */}
          {dataSource !== 'excel' && (
            <Grid item xs={12}>
              <Alert severity="success">
                <Typography variant="body2" sx={{ mb: 1 }}>
                  <strong>All Default Files Mode:</strong>
                </Typography>
                <Typography variant="body2">
                  Using default Method and Test files from the configured location. No file uploads are required - you can proceed to the next step.
                </Typography>
              </Alert>
            </Grid>
          )}
        </Grid>
      )}

      {/* Uploaded Files List */}
      {Object.keys(uploadedFiles).length > 0 && (
        <Card sx={{ mt: 4 }}>
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">
                Uploaded Files
              </Typography>
              <Chip 
                label={`${Object.keys(uploadedFiles).length} file(s)`}
                color="primary"
                size="small"
              />
            </Box>
            
            {/* File Structure Overview */}
            <Accordion sx={{ mb: 2 }}>
              <AccordionSummary expandIcon={<ExpandMore />}>
                <Typography variant="subtitle2">
                  📁 File Structure Overview
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Box sx={{ bgcolor: 'grey.50', p: 2, borderRadius: 1 }}>
                  <Typography variant="body2" component="pre" sx={{ fontFamily: 'monospace' }}>
{`project/
├── src/
│   ├── main/java/
│   │   └── ${uploadedFiles.methodFile ? `📄 ${uploadedFiles.methodFile}` : '⚠️  Method file not uploaded'}
│   └── test/java/
│       └── ${uploadedFiles.testFile ? `📄 ${uploadedFiles.testFile}` : '⚠️  Test file not uploaded'}
└── data/
    └── ${uploadedFiles.excelFile ? `📊 ${uploadedFiles.excelFile}` : '⚠️  Excel file not uploaded'}`}
                  </Typography>
                </Box>
              </AccordionDetails>
            </Accordion>

            <List>
              {Object.entries(uploadedFiles).map(([key, filename]) => (
                <ListItem key={key}>
                  <ListItemIcon>
                    <Description color="primary" />
                  </ListItemIcon>
                  <ListItemText 
                    primary={filename}
                    secondary={getFileTypeFromName(filename)}
                  />
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Chip 
                      label="Uploaded" 
                      color="success" 
                      size="small"
                      icon={<CheckCircle />}
                    />
                    {(key === 'methodFile' || key === 'testFile') && fileContents[key] && (
                      <Chip 
                        label="Preview" 
                        color="primary" 
                        variant="outlined"
                        size="small"
                        icon={<Visibility />}
                        onClick={() => handlePreview(key, filename)}
                        clickable
                      />
                    )}
                  </Box>
                </ListItem>
              ))}
            </List>
          </CardContent>
        </Card>
      )}

      {/* Java Code Preview Dialog */}
      <Dialog 
        open={previewDialog.open} 
        onClose={closePreview}
        maxWidth="lg"
        fullWidth
        PaperProps={{
          sx: { minHeight: '70vh' }
        }}
      >
        <DialogTitle sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          borderBottom: 1,
          borderColor: 'divider'
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <CodeRounded color="primary" />
            <Typography variant="h6">
              {previewDialog.title}
            </Typography>
            <Chip 
              label={previewDialog.fileType === 'methodFile' ? 'Method File' : 'Test File'}
              color={previewDialog.fileType === 'methodFile' ? 'secondary' : 'warning'}
              size="small"
            />
          </Box>
          <IconButton onClick={closePreview} size="small">
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ p: 0 }}>
          <Box sx={{ 
            bgcolor: '#1e1e1e', 
            color: '#d4d4d4',
            fontFamily: 'Consolas, Monaco, "Courier New", monospace',
            fontSize: '14px',
            lineHeight: 1.5,
            overflow: 'auto',
            height: '100%',
            minHeight: '50vh'
          }}>
            <pre style={{ 
              margin: 0, 
              padding: '20px',
              whiteSpace: 'pre-wrap',
              wordWrap: 'break-word'
            }}>
              {previewDialog.content}
            </pre>
          </Box>
        </DialogContent>
        <DialogActions sx={{ borderTop: 1, borderColor: 'divider', p: 2 }}>
          <Typography variant="body2" color="textSecondary" sx={{ flex: 1 }}>
            File size: {previewDialog.content.length} characters
          </Typography>
          <Button onClick={closePreview} variant="contained">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default FileUploadStep;
