import axios from 'axios';

// Configure axios defaults
const api = axios.create({
  baseURL: process.env.NODE_ENV === 'production' ? '' : 'http://localhost:3001',
  timeout: 120000, // 2 minutes timeout for generation
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for better error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error);
    
    // Handle authentication errors
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      window.location.reload(); // This will trigger re-authentication
    }
    
    if (error.response) {
      // Server responded with error status
      console.error('Response Status:', error.response.status);
      console.error('Response Data:', error.response.data);
      
      const message = error.response.data?.message || `Server Error: ${error.response.status}`;
      throw new Error(message);
    } else if (error.request) {
      // Request made but no response received
      console.error('No response received:', error.request);
      throw new Error('Unable to connect to server. Please ensure the backend is running on port 3001.');
    } else {
      // Something else happened
      console.error('Request Error:', error.message);
      throw new Error(`Request failed: ${error.message}`);
    }
  }
);

// API functions
export const testTestrailConnection = async (config) => {
  const response = await api.post('/api/test-testrail-connection', config);
  return response.data;
};

export const uploadFiles = async (formData) => {
  const response = await api.post('/api/upload-files', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const generateScript = async (requestData) => {
  const response = await api.post('/api/generate-script', requestData);
  return response.data;
};

export const downloadScript = (filename) => {
  const url = process.env.NODE_ENV === 'production' 
    ? `/api/download/${filename}`
    : `http://localhost:3001/api/download/${filename}`;
  window.open(url, '_blank');
};

export const checkHealth = async () => {
  const response = await api.get('/api/health');
  return response.data;
};

export const testAzureOpenAI = async () => {
  const response = await api.post('/api/test-azure-openai');
  return response.data;
};

export const previewExcelData = async (data) => {
  const isFormData = data instanceof FormData;
  const response = await api.post('/api/preview-excel', data, {
    headers: isFormData ? {
      'Content-Type': 'multipart/form-data',
    } : {
      'Content-Type': 'application/json',
    },
  });
  return response.data;
};

export const previewTestrailData = async (config) => {
  const response = await api.post('/api/preview-testrail', config);
  return response.data;
};

export default api;
