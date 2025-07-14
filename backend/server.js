const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs-extra');
const axios = require('axios');
const XLSX = require('xlsx');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

const _dirname = path.resolve ();

// Database connection
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/scriptgen-ra', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
};

// Connect to database
connectDB();

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Authentication routes
app.use('/api/auth', require('./routes/auth'));

// Import authentication middleware
const { auth, optionalAuth } = require('./middleware/auth');
app.use (express.static (path.join (_dirname, '/frontend/build')));
app.get ('*', (req, res) => {
  res.sendFile (path.join (_dirname, 'frontend', 'build', 'index.html'));
});

// Create uploads and output directories
const uploadsDir = path.join(__dirname, 'uploads');
const outputDir = path.join(__dirname, 'output');
fs.ensureDirSync(uploadsDir);
fs.ensureDirSync(outputDir);

// Multer configuration for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const timestamp = new Date().toISOString().replace(/:/g, '-');
    cb(null, `${timestamp}-${file.originalname}`);
  }
});

const upload = multer({ 
  storage: storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = /\.(xlsx|xls|java)$/i;
    if (allowedTypes.test(file.originalname)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only Excel and Java files are allowed.'));
    }
  }
});

// Enhanced logging utility (inspired by Streamlit version)
const logger = {
  info: (message, data = null) => {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] INFO: ${message}`);
    if (data) console.log('Data:', JSON.stringify(data, null, 2));
  },
  error: (message, error = null) => {
    const timestamp = new Date().toISOString();
    console.error(`[${timestamp}] ERROR: ${message}`);
    if (error) {
      console.error('Error details:', error.message);
      if (error.stack) console.error('Stack:', error.stack);
    }
  },
  warn: (message, data = null) => {
    const timestamp = new Date().toISOString();
    console.warn(`[${timestamp}] WARN: ${message}`);
    if (data) console.warn('Data:', JSON.stringify(data, null, 2));
  }
};

// Validation utility for environment variables
const validateEnvironmentConfig = () => {
  const requiredVars = [
    'AZURE_OPENAI_ENDPOINT',
    'OPENAI_MODEL',
    'OPENAI_API_VERSION',
    'OPENAI_API_KEY'
  ];
  
  const missingVars = requiredVars.filter(varName => !process.env[varName]);
  
  if (missingVars.length > 0) {
    logger.error(`Missing required environment variables: ${missingVars.join(', ')}`);
    return { valid: false, missingVars };
  }
  
  logger.info('Environment configuration validation passed');
  return { valid: true, missingVars: [] };
};

// Utility functions
const testTestrailConnection = async (username, apikey, testCaseId, testrailBaseUrl) => {
  try {
    // Validate and normalize the URL
    if (!testrailBaseUrl) {
      throw new Error('TestRail base URL is required');
    }
    
    // Ensure the URL doesn't end with a slash
    const normalizedUrl = testrailBaseUrl.replace(/\/+$/, '');
    
    // Validate URL format
    try {
      new URL(normalizedUrl);
    } catch (urlError) {
      throw new Error(`Invalid TestRail URL format: ${normalizedUrl}`);
    }

    console.log('Testing TestRail connection:', {
      url: normalizedUrl,
      username,
      testCaseId
    });

    const response = await axios.get(
      `${normalizedUrl}/index.php?/api/v2/get_case/${testCaseId}`,
      {
        auth: { username, password: apikey },
        headers: { 'Content-Type': 'application/json' },
        timeout: 10000
      }
    );
    return { success: true, message: 'TestRail connection successful' };
  } catch (error) {
    console.error('TestRail connection error:', error);
    if (error.response) {
      const status = error.response.status;
      if (status === 401) {
        return { success: false, message: 'TestRail authentication failed: Invalid username or API key' };
      } else if (status === 404) {
        return { success: false, message: `TestRail case ID ${testCaseId} not found` };
      } else {
        return { success: false, message: `TestRail HTTP error: ${status} - ${error.message}` };
      }
    }
    return { success: false, message: `TestRail connection failed: ${error.message}` };
  }
};

const fetchTestrailCases = async (testCaseId, username, apikey, testrailBaseUrl) => {
  try {
    // Validate and normalize the URL
    if (!testrailBaseUrl) {
      throw new Error('TestRail base URL is required');
    }
    
    // Ensure the URL doesn't end with a slash
    const normalizedUrl = testrailBaseUrl.replace(/\/+$/, '');
    
    // Validate URL format
    try {
      new URL(normalizedUrl);
    } catch (urlError) {
      throw new Error(`Invalid TestRail URL format: ${normalizedUrl}`);
    }

    console.log('Fetching TestRail case:', {
      url: normalizedUrl,
      username,
      testCaseId
    });

    const response = await axios.get(
      `${normalizedUrl}/index.php?/api/v2/get_case/${testCaseId}`,
      {
        auth: { username, password: apikey },
        headers: { 'Content-Type': 'application/json' },
        timeout: 10000
      }
    );

    const data = response.data;
    const customPreconds = data.custom_preconds || {};
    const customStepsSeparated = data.custom_steps_separated || [];
    const apiDetails = {
      "Request Type": data.custom_case_api_request_type || "GET",
      "Request Url": data.custom_case_request_url || "",
      "Headers": data.custom_case_api_headers || {},
      "Body": data.custom_case_api_request_body || ""
    };

    return { customPreconds, customStepsSeparated, apiDetails };
  } catch (error) {
    throw new Error(`Failed to fetch TestRail case: ${error.message}`);
  }
};

const parseTestrailData = (customPreconds, customStepsSeparated, apiDetails) => {
  let preconds = customPreconds;
  let steps = customStepsSeparated;

  if (typeof preconds === 'string') {
    try {
      preconds = JSON.parse(preconds) || {};
    } catch (e) {
      preconds = {};
    }
  }

  if (typeof steps === 'string') {
    try {
      steps = JSON.parse(steps) || [];
    } catch (e) {
      steps = [];
    }
  }

  if (typeof apiDetails.Headers === 'string') {
    try {
      apiDetails.Headers = JSON.parse(apiDetails.Headers) || {};
    } catch (e) {
      apiDetails.Headers = { "Content-Type": "application/json" };
    }
  }

  const scenarios = steps.map((step, i) => ({
    "Test Name": step.title || `Test_${i + 1}`,
    "Steps": step.content || "No steps provided",
    "Expected Result": step.expected || "No expected result"
  }));

  if (scenarios.length === 0) {
    scenarios.push({
      "Test Name": "Default Test",
      "Steps": "Send request",
      "Expected Result": "200 OK"
    });
  }

  return { apiDetails, scenarios };
};

const parseExcel = (filePath) => {
  try {
    const workbook = XLSX.readFile(filePath);
    
    if (!workbook.SheetNames.includes('API_detail') || !workbook.SheetNames.includes('Test_scenarios')) {
      throw new Error("Excel file missing required sheets: 'API_detail' and 'Test_scenarios'");
    }

    const apiSheet = workbook.Sheets['API_detail'];
    const apiData = XLSX.utils.sheet_to_json(apiSheet, { header: 1 });
    
    console.log('DEBUG: Raw Excel data from API_detail sheet:');
    apiData.forEach((row, index) => {
      if (index < 20) { // Log first 20 rows for debugging
        console.log(`Row ${index}:`, row);
      }
    });
    
    const apiDetails = {
      'Request Type': 'GET',
      'Request Url': 'https://api.example.com',
      'Headers': {},
      'Body': null
    };

    // More flexible parsing logic
    for (let i = 0; i < apiData.length; i++) {
      const row = apiData[i];
      if (!row || row.length === 0) continue;
      
      const label = row[0] ? row[0].toString().toLowerCase().trim() : '';
      const value = row[1];
      
      console.log(`Processing row ${i}: label="${label}", value="${value}"`);
      
      // Parse different fields based on row labels
      if (label.includes('request type') || label.includes('method') || label.includes('http method')) {
        apiDetails['Request Type'] = value || 'GET';
        console.log('Set Request Type:', apiDetails['Request Type']);
      }
      else if (label.includes('request url') || label.includes('url') || label.includes('endpoint')) {
        apiDetails['Request Url'] = value || 'https://api.example.com';
        console.log('Set Request Url:', apiDetails['Request Url']);
      }
      else if (label.includes('header') && value) {
        // Header row format: "Header" | "HeaderName" | "HeaderValue"
        const headerName = value;
        const headerValue = row[2];
        if (headerName && headerValue) {
          apiDetails.Headers[headerName] = headerValue;
          console.log(`Added header: ${headerName} = ${headerValue}`);
        }
      }
      else if (label.includes('body') || label.includes('request body') || label.includes('payload')) {
        apiDetails.Body = value || null;
        console.log('Set Body:', apiDetails.Body);
      }
      // Also try to parse JSON body from multiple formats
      else if (label.includes('json') || label.includes('data')) {
        if (value && !apiDetails.Body) {
          apiDetails.Body = value;
          console.log('Set Body from JSON/data field:', apiDetails.Body);
        }
      }
    }
    
    // Fallback parsing for older Excel format
    if (!apiDetails.Body && apiData.length >= 3) {
      // Try the old parsing logic as fallback
      let headerRow = 2;
      while (headerRow < apiData.length && apiData[headerRow] && apiData[headerRow][1]) {
        const headerName = apiData[headerRow][1];
        const headerValue = apiData[headerRow][2];
        if (headerName && headerValue && !apiDetails.Headers[headerName]) {
          apiDetails.Headers[headerName] = headerValue;
        }
        headerRow++;
      }
      
      // Try to find body after headers
      if (headerRow < apiData.length && apiData[headerRow] && apiData[headerRow][1]) {
        apiDetails.Body = apiData[headerRow][1];
        console.log('Set Body from fallback logic:', apiDetails.Body);
      }
    }

    console.log('DEBUG: Final API Details:', JSON.stringify(apiDetails, null, 2));
    
    // Add a sample body if none was found for testing
    if (!apiDetails.Body) {
      apiDetails.Body = '{"message": "Sample request body", "timestamp": "2025-01-01T00:00:00Z"}';
      console.log('DEBUG: Added sample body since none was found');
    }

    const scenarioSheet = workbook.Sheets['Test_scenarios'];
    const scenarioData = XLSX.utils.sheet_to_json(scenarioSheet, { header: 1 });
    
    const scenarios = scenarioData.slice(1).filter(row => row[0]).map(row => ({
      'Test Name': row[0],
      'Steps': row[1] || 'No steps provided',
      'Expected Result': row[2] || 'No expected result'
    }));

    if (scenarios.length === 0) {
      scenarios.push({
        "Test Name": "Default Test",
        "Steps": "Send GET request",
        "Expected Result": "200 OK"
      });
    }

    return { apiDetails, scenarios };
  } catch (error) {
    throw new Error(`Failed to parse Excel file: ${error.message}`);
  }
};

const generateRestAssuredTest = async (apiDetails, scenarios, methodFileContent, testFileContent) => {
  try {
    console.log('Starting test script generation...');
    console.log('API Details:', JSON.stringify(apiDetails, null, 2));
    console.log('Scenarios count:', scenarios.length);

    // Use axios for Azure OpenAI API calls (more reliable than OpenAI SDK for Azure)
    const azureEndpoint = process.env.AZURE_OPENAI_ENDPOINT;
    const deploymentName = process.env.OPENAI_MODEL;
    const apiVersion = process.env.OPENAI_API_VERSION;
    const apiKey = process.env.OPENAI_API_KEY;

    if (!azureEndpoint || !deploymentName || !apiVersion || !apiKey) {
      throw new Error('Missing required Azure OpenAI configuration');
    }

    const url = `${azureEndpoint}/openai/deployments/${deploymentName}/chat/completions?api-version=${apiVersion}`;

    // Enhanced prompt engineering based on Streamlit version
    console.log('Generating comprehensive Rest Assured test script...');
    
    // Build context messages with improved prompt structure
    const contextMessages = [
      {
        role: 'system',
        content: `You are a Java and Rest Assured expert. Generate valid and concise Rest Assured test scripts strictly following the conventions and patterns outlined in these files:
1. Methods: ${methodFileContent}
2. Tests: ${testFileContent}

Use the following API details and scenarios to create the script:
- API Details: ${JSON.stringify(apiDetails)}
- Scenarios: ${JSON.stringify(scenarios)}

Ensure the generated code should have separate test and method files that align with the structure, naming conventions, and style of the provided framework. Do not add explanations, comments, or additional context. The output should be production-ready and directly integrable into the project.

Structure the response as:
=== METHOD FILE ===
[Complete method file content here]

=== TEST FILE ===
[Complete test file content here]

Generate REST Assured methods and tests separately. Include all scenarios in one test class with separate methods. Optimize with loops where appropriate. Group tests by test name and functionality.`
      }
    ];

    // Add each scenario as a separate message for better context
    scenarios.forEach(scenario => {
      contextMessages.push({
        role: 'user',
        content: `Scenario: ${scenario['Test Name']}\nSteps: ${scenario['Steps']}\nExpected: ${scenario['Expected Result']}`
      });
    });

    // Add final instruction
    contextMessages.push({
      role: 'user',
      content: `Generate complete Rest Assured test script with methods and tests based on the provided API details and scenarios. Follow the exact patterns from the template files.
      - Method name should have some meaning related to the test scenario.`
    });

    const response = await axios.post(url, {
      messages: contextMessages,
      temperature: 0,
      max_tokens: 4000, // Increased for comprehensive output
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0
    }, {
      headers: {
        'Content-Type': 'application/json',
        'api-key': apiKey
      },
      timeout: 60000
    });

    if (!response.data || !response.data.choices || !response.data.choices[0]) {
      throw new Error('Invalid response from Azure OpenAI API');
    }

    const generatedContent = response.data.choices[0].message.content;

    if (!generatedContent) {
      throw new Error('Empty or invalid response from Azure OpenAI');
    }

    // Parse the response to separate method and test files
    let generatedMethodFile = '';
    let generatedTestFile = '';

    // Look for the structured format markers
    const methodMarker = '=== METHOD FILE ===';
    const testMarker = '=== TEST FILE ===';

    if (generatedContent.includes(methodMarker) && generatedContent.includes(testMarker)) {
      // Parse structured response
      const methodStart = generatedContent.indexOf(methodMarker) + methodMarker.length;
      const testStart = generatedContent.indexOf(testMarker);
      const testContentStart = testStart + testMarker.length;

      generatedMethodFile = generatedContent.substring(methodStart, testStart).trim();
      generatedTestFile = generatedContent.substring(testContentStart).trim();
    } else {
      // Fallback: try to split by common Java patterns
      const lines = generatedContent.split('\n');
      let currentSection = 'method';
      let methodLines = [];
      let testLines = [];

      for (const line of lines) {
        if (line.includes('@Test') || line.includes('public class') && line.includes('Test')) {
          currentSection = 'test';
        }
        
        if (currentSection === 'method') {
          methodLines.push(line);
        } else {
          testLines.push(line);
        }
      }

      generatedMethodFile = methodLines.join('\n').trim();
      generatedTestFile = testLines.join('\n').trim();

      // If we couldn't split properly, use the original approach
      if (!generatedMethodFile || !generatedTestFile) {
        console.warn('Could not parse structured response, using single file approach');
        generatedMethodFile = generatedContent;
        generatedTestFile = generatedContent;
      }
    }

    // Validate generated content
    if (!generatedMethodFile.trim() || !generatedTestFile.trim()) {
      throw new Error('Generated method or test file is empty');
    }

    console.log('Method and Test files generated successfully');
    console.log('Method file length:', generatedMethodFile.length);
    console.log('Test file length:', generatedTestFile.length);

    return {
      methodFile: generatedMethodFile,
      testFile: generatedTestFile
    };
  } catch (error) {
    console.error('Error in generateRestAssuredTest:', error.message);
    if (error.response) {
      console.error('API Response Status:', error.response.status);
      console.error('API Response Data:', JSON.stringify(error.response.data, null, 2));
    }
    throw new Error(`Failed to generate test script: ${error.message}`);
  }
};

// Utility function to get timestamped filename (from Streamlit version)
const getTimestampedFilename = (prefix = 'Generated', suffix = '.java') => {
  const timestamp = new Date().toISOString().replace(/:/g, '-').replace(/\./g, '-');
  return `${prefix}_${timestamp}${suffix}`;
};

// Enhanced utility function to save generated files with better organization
const saveGeneratedFiles = async (methodFile, testFile, outputDir) => {
  try {
    const timestamp = new Date().toISOString().replace(/:/g, '-').replace(/\./g, '-');
    const methodFilename = `GeneratedMethods_${timestamp}.java`;
    const testFilename = `GeneratedTests_${timestamp}.java`;
    const combinedFilename = `GeneratedCombined_${timestamp}.java`;
    
    const methodOutputPath = path.join(outputDir, methodFilename);
    const testOutputPath = path.join(outputDir, testFilename);
    const combinedOutputPath = path.join(outputDir, combinedFilename);
    
    // Save individual files
    await fs.writeFile(methodOutputPath, methodFile, 'utf8');
    await fs.writeFile(testOutputPath, testFile, 'utf8');
    
    // Save combined file for convenience
    const combinedContent = `// ======= METHOD FILE =======\n${methodFile}\n\n// ======= TEST FILE =======\n${testFile}`;
    await fs.writeFile(combinedOutputPath, combinedContent, 'utf8');
    
    console.log('Files saved successfully:');
    console.log('- Method file:', methodOutputPath);
    console.log('- Test file:', testOutputPath);
    console.log('- Combined file:', combinedOutputPath);
    
    return {
      methodFilename,
      testFilename,
      combinedFilename,
      methodOutputPath,
      testOutputPath,
      combinedOutputPath
    };
  } catch (error) {
    console.error('Error saving files:', error.message);
    throw new Error(`Failed to save generated files: ${error.message}`);
  }
};

// Enhanced request validation middleware
const validateGenerateScriptRequest = (req, res, next) => {
  const { dataSource, files, testrailConfig, useDefaultFiles } = req.body;
  
  // Validate data source
  if (!dataSource || !['excel', 'testrail'].includes(dataSource)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid data source. Must be either "excel" or "testrail"'
    });
  }
  
  // Validate file requirements based on source
  if (!useDefaultFiles) {
    if (!files || !files.methodFile || !files.testFile) {
      return res.status(400).json({
        success: false,
        message: 'Method file and test file are required when not using default files'
      });
    }
    
    if (dataSource === 'excel' && !files.excelFile) {
      return res.status(400).json({
        success: false,
        message: 'Excel file is required when using Excel data source'
      });
    }
  }
  
  // Validate TestRail configuration
  if (dataSource === 'testrail') {
    if (!testrailConfig || !testrailConfig.username || !testrailConfig.apikey || !testrailConfig.testCaseId) {
      return res.status(400).json({
        success: false,
        message: 'TestRail configuration (username, apikey, testCaseId) is required when using TestRail data source'
      });
    }
  }
  
  logger.info('Request validation passed', { dataSource, useDefaultFiles });
  next();
};

// Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

app.post('/api/test-testrail-connection', async (req, res) => {
  try {
    const { username, apikey, testCaseId, testrailBaseUrl } = req.body;
    const result = await testTestrailConnection(username, apikey, testCaseId, testrailBaseUrl);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.post('/api/test-azure-openai', async (req, res) => {
  try {
    const endpoint = process.env.AZURE_OPENAI_ENDPOINT;
    const apiKey = process.env.OPENAI_API_KEY;
    const deployment = process.env.OPENAI_MODEL;
    const apiVersion = process.env.OPENAI_API_VERSION;

    if (!endpoint || !apiKey || !deployment || !apiVersion) {
      return res.status(500).json({ 
        success: false, 
        message: 'Azure OpenAI configuration is missing. Please check environment variables.',
        missingVars: {
          endpoint: !endpoint,
          apiKey: !apiKey,
          deployment: !deployment,
          apiVersion: !apiVersion
        }
      });
    }

    // Enhanced test with the same structure as the Streamlit version
    const testPrompt = {
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant."
        },
        {
          role: "user",
          content: "Hello, can you respond with 'Azure OpenAI connection test successful!'?"
        }
      ],
      temperature: 0,
      max_tokens: 100,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0
    };

    const response = await axios.post(
      `${endpoint}/openai/deployments/${deployment}/chat/completions?api-version=${apiVersion}`,
      testPrompt,
      {
        headers: {
          'Content-Type': 'application/json',
          'api-key': apiKey
        },
        timeout: 30000 // 30 seconds timeout
      }
    );

    const aiResponse = response.data.choices[0].message.content.trim();
    
    res.json({ 
      success: true, 
      message: 'Azure OpenAI connection test successful!',
      response: aiResponse,
      config: {
        endpoint: endpoint.replace(/https?:\/\//, '').split('.')[0] + '.***', // Partially hide endpoint for security
        deployment: deployment,
        apiVersion: apiVersion,
        timestamp: new Date().toISOString()
      },
      usage: response.data.usage || {}
    });
  } catch (error) {
    console.error('Azure OpenAI enhanced test error:', error.response?.data || error.message);
    
    let errorMessage = 'Azure OpenAI connection test failed';
    let statusCode = 500;
    
    if (error.response?.status === 401) {
      errorMessage = 'Azure OpenAI authentication failed - check API key';
      statusCode = 401;
    } else if (error.response?.status === 404) {
      errorMessage = 'Azure OpenAI deployment not found - check deployment name';
      statusCode = 404;
    } else if (error.response?.status === 429) {
      errorMessage = 'Azure OpenAI rate limit exceeded - try again later';
      statusCode = 429;
    } else if (error.code === 'ENOTFOUND' || error.code === 'ECONNREFUSED') {
      errorMessage = 'Cannot reach Azure OpenAI endpoint - check endpoint URL';
      statusCode = 503;
    } else if (error.code === 'ETIMEDOUT') {
      errorMessage = 'Azure OpenAI request timeout - service may be slow';
      statusCode = 408;
    } else if (error.response?.data?.error?.message) {
      errorMessage = `Azure OpenAI error: ${error.response.data.error.message}`;
    }
    
    res.status(statusCode).json({ 
      success: false, 
      message: errorMessage,
      details: error.response?.data || error.message,
      errorCode: error.code,
      timestamp: new Date().toISOString()
    });
  }
});

app.post('/api/upload-files', auth, upload.fields([
  { name: 'excelFile', maxCount: 1 },
  { name: 'methodFile', maxCount: 1 },
  { name: 'testFile', maxCount: 1 }
]), (req, res) => {
  try {
    const files = req.files;
    const uploadedFiles = {};

    Object.keys(files).forEach(fieldname => {
      uploadedFiles[fieldname] = files[fieldname][0].filename;
    });

    res.json({ success: true, files: uploadedFiles });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.post('/api/preview-excel', upload.single('excelFile'), (req, res) => {
  try {
    let filePath;
    let fileName;
    let shouldCleanup = false;

    if (req.file) {
      // New file uploaded
      filePath = req.file.path;
      fileName = req.file.originalname;
      shouldCleanup = true;
    } else if (req.body.filename) {
      // Use existing uploaded file
      filePath = path.join(uploadsDir, req.body.filename);
      fileName = req.body.filename;
      
      if (!fs.existsSync(filePath)) {
        return res.status(404).json({ success: false, message: 'Uploaded Excel file not found' });
      }
    } else if (req.body.useDefault) {
      // Use default Excel file
      const defaultExcelPath = process.env.DEFAULT_EXCEL_PATH;
      if (!defaultExcelPath) {
        return res.status(500).json({ success: false, message: 'Default Excel path not configured' });
      }
      
      // Convert relative path to absolute path
      // The file is in the backend directory
      filePath = path.resolve(__dirname, defaultExcelPath.replace(/^\//, ''));
      fileName = path.basename(filePath);
      
      if (!fs.existsSync(filePath)) {
        return res.status(404).json({ success: false, message: 'Default Excel file not found at: ' + filePath });
      }
    } else {
      return res.status(400).json({ success: false, message: 'No Excel file provided' });
    }

    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const jsonData = XLSX.utils.sheet_to_json(worksheet);
    
    // Get all available column headers for debugging
    const availableHeaders = jsonData.length > 0 ? Object.keys(jsonData[0]) : [];
    console.log('Available Excel columns:', availableHeaders);
    console.log('Sample row data:', jsonData[0]);
    
    // Process test cases for preview with more flexible column mapping
    const testCases = jsonData.map((row, index) => {
      const testCase = {
        testCaseName: row['Test Case'] || row['TestCase'] || row['test_case'] || row['Test_Case'] || 
                     row['TestCaseName'] || row['Test Case Name'] || `Test Case ${index + 1}`,
        method: row['Method'] || row['HTTP Method'] || row['method'] || row['REQUEST_METHOD'] || 
               row['Http Method'] || row['Request Method'] || 'GET',
        url: row['URL'] || row['Endpoint'] || row['url'] || row['endpoint'] || 
            row['REQUEST_URL'] || row['Request URL'] || row['API_URL'] || 'N/A',
        expectedStatusCode: row['Expected Status'] || row['Status Code'] || row['expected_status'] || 
                           row['Expected_Status'] || row['EXPECTED_STATUS'] || row['Response Code'] || '200',
        description: row['Description'] || row['Test Description'] || row['description'] || 
                    row['TEST_DESCRIPTION'] || row['Test_Description'] || 'No description',
        // Include all original fields for debugging
        originalData: row
      };
      
      console.log(`Test case ${index + 1}:`, testCase);
      return testCase;
    });
    
    // Clean up the temporary file if it was newly uploaded
    if (shouldCleanup && req.file) {
      fs.unlink(req.file.path, (err) => {
        if (err) console.error('Error deleting temporary file:', err);
      });
    }
    
    res.json({
      success: true,
      testCases: testCases.slice(0, 50), // Limit to first 50 for preview
      summary: {
        totalRows: jsonData.length,
        sheets: workbook.SheetNames.length,
        fileName: fileName,
        availableHeaders: availableHeaders,
        sheetName: sheetName
      },
      debug: {
        sampleRow: jsonData[0] || {},
        columnHeaders: availableHeaders
      }
    });
  } catch (error) {
    console.error('Excel preview error:', error);
    res.status(500).json({ success: false, message: 'Failed to preview Excel file: ' + error.message });
  }
});

app.post('/api/preview-testrail', async (req, res) => {
  try {
    const { username, apikey, testCaseId, testrailBaseUrl } = req.body;
    
    if (!username || !apikey || !testCaseId || !testrailBaseUrl) {
      return res.status(400).json({ 
        success: false, 
        message: 'Missing required TestRail configuration' 
      });
    }

    // Test connection first
    const connectionResult = await testTestrailConnection(username, apikey, testCaseId, testrailBaseUrl);
    
    if (!connectionResult.success) {
      return res.status(400).json(connectionResult);
    }

    // If connection successful, fetch test case details for preview
    const normalizedUrl = testrailBaseUrl.replace(/\/$/, '');
    const auth = Buffer.from(`${username}:${apikey}`).toString('base64');
    
    const testCaseResponse = await axios.get(
      `${normalizedUrl}/index.php?/api/v2/get_case/${testCaseId}`,
      {
        headers: {
          'Authorization': `Basic ${auth}`,
          'Content-Type': 'application/json'
        },
        timeout: 10000
      }
    );

    const testCase = testCaseResponse.data;
    
    // Helper functions to get text values
    const getPriorityText = (priorityId) => {
      const priorities = {
        1: 'Low',
        2: 'Medium', 
        3: 'High',
        4: 'Critical'
      };
      return priorities[priorityId] || `Priority ${priorityId}`;
    };

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
    
    // Helper function to parse and structure test steps
    const parseTestSteps = (steps) => {
      if (!steps) return [];
      
      try {
        let parsedSteps = [];
        
        if (typeof steps === 'string') {
          try {
            // Try to parse as JSON first
            parsedSteps = JSON.parse(steps);
          } catch (e) {
            // If not JSON, treat as plain text and split by lines
            const stepLines = steps.split(/\n|\r\n|\r/).filter(line => line.trim());
            parsedSteps = stepLines.map((step, index) => ({
              content: step.trim(),
              expected: null
            }));
          }
        } else if (Array.isArray(steps)) {
          parsedSteps = steps;
        } else {
          parsedSteps = [steps];
        }
        
        // Ensure each step has proper structure
        return parsedSteps.map((step, index) => ({
          stepNumber: index + 1,
          content: typeof step === 'string' ? step : step.content || step.step || 'No content',
          expected: step.expected || step.result || null,
          type: detectStepType(typeof step === 'string' ? step : step.content || step.step || '')
        }));
      } catch (e) {
        console.error('Error parsing test steps:', e);
        return [];
      }
    };
    
    // Helper function to detect step type
    const detectStepType = (stepText) => {
      const text = stepText.toLowerCase();
      if (text.includes('api') || text.includes('request') || text.includes('post') || 
          text.includes('get') || text.includes('put') || text.includes('delete') || 
          text.includes('endpoint')) {
        return 'api';
      } else if (text.includes('verify') || text.includes('validate') || text.includes('check')) {
        return 'verification';
      } else if (text.includes('setup') || text.includes('prepare') || text.includes('initialize')) {
        return 'setup';
      }
      return 'action';
    };
    
    res.json({
      success: true,
      testCase: {
        id: testCase.id,
        title: testCase.title,
        suite_id: testCase.suite_id,
        type_id: testCase.type_id,
        priority_id: testCase.priority_id,
        priority: testCase.priority_id,
        type: testCase.type_id,
        priority_text: getPriorityText(testCase.priority_id),
        type_text: getTypeText(testCase.type_id),
        custom_steps_separated: parseTestSteps(testCase.custom_steps_separated),
        custom_expected: testCase.custom_expected,
        custom_preconds: testCase.custom_preconds,
        refs: testCase.refs,
        created_on: new Date(testCase.created_on * 1000).toLocaleString(),
        updated_on: new Date(testCase.updated_on * 1000).toLocaleString()
      },
      summary: {
        retrieved: true,
        timestamp: new Date().toLocaleTimeString()
      }
    });
  } catch (error) {
    console.error('TestRail preview error:', error);
    
    let errorMessage = 'Failed to preview TestRail data';
    if (error.response?.status === 401) {
      errorMessage = 'TestRail authentication failed - check credentials';
    } else if (error.response?.status === 404) {
      errorMessage = 'Test case not found - check test case ID';
    } else if (error.code === 'ENOTFOUND') {
      errorMessage = 'Cannot reach TestRail server - check URL';
    }
    
    res.status(500).json({ 
      success: false, 
      message: errorMessage,
      details: error.message
    });
  }
});

app.post('/api/generate-script', auth, validateGenerateScriptRequest, async (req, res) => {
  try {
    logger.info('Generate script request received');
    const { 
      dataSource, 
      files, 
      testrailConfig,
      useDefaultFiles 
    } = req.body;

    logger.info('Request data processed', { dataSource, useDefaultFiles, filesCount: Object.keys(files || {}).length });

    let apiDetails, scenarios;
    let methodFileContent, testFileContent;

    // Validate required environment variables
    const envValidation = validateEnvironmentConfig();
    if (!envValidation.valid) {
      throw new Error(`Missing Azure OpenAI configuration: ${envValidation.missingVars.join(', ')}`);
    }

    if (useDefaultFiles) {
      if (!process.env.DEFAULT_METHOD_PATH || !process.env.DEFAULT_TEST_PATH) {
        throw new Error('Default file paths not configured in environment variables');
      }
      
      if (dataSource === 'excel' && !process.env.DEFAULT_EXCEL_PATH) {
        throw new Error('Default Excel path not configured in environment variables');
      }
    }

    // Read method and test files
    try {
      if (useDefaultFiles) {
        logger.info('Reading default files');
        const methodPath = path.resolve(__dirname, process.env.DEFAULT_METHOD_PATH);
        const testPath = path.resolve(__dirname, process.env.DEFAULT_TEST_PATH);
        
        if (!fs.existsSync(methodPath)) {
          throw new Error(`Default method file not found: ${methodPath}`);
        }
        if (!fs.existsSync(testPath)) {
          throw new Error(`Default test file not found: ${testPath}`);
        }
        
        methodFileContent = fs.readFileSync(methodPath, 'utf8');
        testFileContent = fs.readFileSync(testPath, 'utf8');
      } else {
        logger.info('Reading uploaded files');
        if (!files.methodFile || !files.testFile) {
          throw new Error('Method file and test file are required');
        }
        
        const methodPath = path.join(uploadsDir, files.methodFile);
        const testPath = path.join(uploadsDir, files.testFile);
        
        if (!fs.existsSync(methodPath)) {
          throw new Error(`Uploaded method file not found: ${methodPath}`);
        }
        if (!fs.existsSync(testPath)) {
          throw new Error(`Uploaded test file not found: ${testPath}`);
        }
        
        methodFileContent = fs.readFileSync(methodPath, 'utf8');
        testFileContent = fs.readFileSync(testPath, 'utf8');
      }
      
      logger.info('Files read successfully', {
        methodFileLength: methodFileContent.length,
        testFileLength: testFileContent.length
      });
    } catch (fileError) {
      logger.error('File reading error', fileError);
      throw new Error(`Failed to read template files: ${fileError.message}`);
    }

    // Parse data based on source
    try {
      if (dataSource === 'excel') {
        logger.info('Parsing Excel data');
        const excelPath = useDefaultFiles ? 
          path.resolve(__dirname, process.env.DEFAULT_EXCEL_PATH) : 
          path.join(uploadsDir, files.excelFile);
          
        if (!fs.existsSync(excelPath)) {
          throw new Error(`Excel file not found: ${excelPath}`);
        }
        
        const result = parseExcel(excelPath);
        apiDetails = result.apiDetails;
        scenarios = result.scenarios;
      } else if (dataSource === 'testrail') {
        logger.info('Fetching TestRail data');
        let { username, apikey, testCaseId, testrailBaseUrl } = testrailConfig;
        
        if (!username || !apikey || !testCaseId) {
          throw new Error('TestRail configuration is incomplete');
        }
        
        // Set default TestRail base URL if not provided
        if (!testrailBaseUrl) {
          testrailBaseUrl = process.env.TESTRAIL_URL || 'https://morningstar.testrail.net';
          logger.info('Using default TestRail URL', { testrailBaseUrl });
        }
        
        const testrailData = await fetchTestrailCases(testCaseId, username, apikey, testrailBaseUrl);
        const parsedData = parseTestrailData(
          testrailData.customPreconds, 
          testrailData.customStepsSeparated, 
          testrailData.apiDetails
        );
        apiDetails = parsedData.apiDetails;
        scenarios = parsedData.scenarios;
      } else {
        throw new Error('Invalid data source specified');
      }
      
      logger.info('Data parsed successfully', {
        apiDetails: Object.keys(apiDetails),
        scenariosCount: scenarios.length
      });
    } catch (parseError) {
      logger.error('Data parsing error', parseError);
      throw new Error(`Failed to parse data: ${parseError.message}`);
    }

    // Generate test script
    logger.info('Generating test script');
    const generatedFiles = await generateRestAssuredTest(apiDetails, scenarios, methodFileContent, testFileContent);

    if (!generatedFiles || !generatedFiles.methodFile || !generatedFiles.testFile) {
      throw new Error('Generated files are empty or invalid');
    }

    // Save generated files using enhanced utility function
    const savedFiles = await saveGeneratedFiles(generatedFiles.methodFile, generatedFiles.testFile, outputDir);

    logger.info('Test script generation completed successfully', {
      methodFileLength: generatedFiles.methodFile.length,
      testFileLength: generatedFiles.testFile.length,
      filesSaved: Object.keys(savedFiles)
    });

    res.json({
      success: true,
      methodFile: generatedFiles.methodFile,
      testFile: generatedFiles.testFile,
      methodFilename: savedFiles.methodFilename,
      testFilename: savedFiles.testFilename,
      combinedFilename: savedFiles.combinedFilename,
      apiDetails,
      scenarios,
      timestamp: new Date().toISOString(),
      filesSaved: {
        methodPath: savedFiles.methodOutputPath,
        testPath: savedFiles.testOutputPath,
        combinedPath: savedFiles.combinedOutputPath
      }
    });
  } catch (error) {
    logger.error('Generate script error', error);
    res.status(500).json({ 
      success: false, 
      message: error.message,
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined,
      timestamp: new Date().toISOString()
    });
  }
});

app.get('/api/download/:filename', (req, res) => {
  try {
    const filename = req.params.filename;
    const filePath = path.join(outputDir, filename);
    
    if (fs.existsSync(filePath)) {
      res.download(filePath);
    } else {
      res.status(404).json({ success: false, message: 'File not found' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.get('/api/download-combined/:filename', (req, res) => {
  try {
    const filename = req.params.filename;
    
    // Support both timestamped and direct filenames
    let filePath;
    if (filename.includes('GeneratedCombined_')) {
      filePath = path.join(outputDir, filename);
    } else {
      // If no specific combined file, look for the most recent one
      const files = fs.readdirSync(outputDir).filter(f => f.startsWith('GeneratedCombined_') && f.endsWith('.java'));
      if (files.length === 0) {
        return res.status(404).json({ success: false, message: 'No combined files found' });
      }
      
      // Sort by creation time (newest first)
      files.sort((a, b) => {
        const statA = fs.statSync(path.join(outputDir, a));
        const statB = fs.statSync(path.join(outputDir, b));
        return statB.mtime - statA.mtime;
      });
      
      filePath = path.join(outputDir, files[0]);
    }
    
    if (fs.existsSync(filePath)) {
      res.setHeader('Content-Type', 'text/plain');
      res.setHeader('Content-Disposition', `attachment; filename="${path.basename(filePath)}"`);
      res.download(filePath);
    } else {
      res.status(404).json({ success: false, message: 'Combined file not found' });
    }
  } catch (error) {
    console.error('Download combined file error:', error.message);
    res.status(500).json({ success: false, message: error.message });
  }
});

app.get('/api/list-generated-files', (req, res) => {
  try {
    const files = fs.readdirSync(outputDir)
      .filter(file => file.endsWith('.java'))
      .map(file => {
        const filePath = path.join(outputDir, file);
        const stats = fs.statSync(filePath);
        return {
          filename: file,
          size: stats.size,
          created: stats.birthtime,
          modified: stats.mtime,
          type: file.includes('Methods') ? 'method' : 
                file.includes('Tests') ? 'test' : 
                file.includes('Combined') ? 'combined' : 'unknown'
        };
      })
      .sort((a, b) => b.modified - a.modified); // Sort by modified date, newest first

    res.json({
      success: true,
      files: files,
      totalFiles: files.length,
      outputDirectory: outputDir
    });
  } catch (error) {
    console.error('List files error:', error.message);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Validate environment configuration on startup
const envValidationResult = validateEnvironmentConfig();
if (!envValidationResult.valid) {
  console.error('Invalid environment configuration. Missing variables:', envValidationResult.missingVars);
  process.exit(1);
}

app.listen(PORT, () => {
  logger.info(`Server is running on port ${PORT}`);
  
  // Validate environment configuration on startup
  const envValidation = validateEnvironmentConfig();
  if (!envValidation.valid) {
    logger.error('Server started with missing environment variables', { missingVars: envValidation.missingVars });
    logger.warn('Some features may not work properly without proper configuration');
  } else {
    logger.info('All required environment variables are configured');
  }
  
  // Check if default files exist
  if (process.env.DEFAULT_METHOD_PATH && process.env.DEFAULT_TEST_PATH) {
    const methodPath = path.resolve(__dirname, process.env.DEFAULT_METHOD_PATH);
    const testPath = path.resolve(__dirname, process.env.DEFAULT_TEST_PATH);
    
    if (fs.existsSync(methodPath) && fs.existsSync(testPath)) {
      logger.info('Default template files found and accessible');
    } else {
      logger.warn('Default template files not found - users will need to upload files manually');
    }
  }
  
  // Check output directory
  if (fs.existsSync(outputDir)) {
    logger.info('Output directory is ready', { outputDir });
  } else {
    logger.error('Output directory not found', { outputDir });
  }
});
