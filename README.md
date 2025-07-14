# RestAssured Script Generator - Web Application

A modern web application for generating RestAssured test scripts with a beautiful React.js frontend and Node.js backend.

## Features

- **Beautiful Modern UI**: Built with React.js and Material-UI
- **Multiple Data Sources**: Support for Excel files and TestRail API
- **File Upload**: Drag-and-drop file upload with progress tracking
- **Real-time Generation**: AI-powered test script generation using Azure OpenAI
- **Code Preview**: Syntax-highlighted code preview with copy/download functionality
- **Responsive Design**: Mobile-friendly interface with glassmorphism design

## Architecture

```
web-app/
├── frontend/          # React.js frontend
│   ├── src/
│   │   ├── components/   # React components
│   │   ├── App.js       # Main application
│   │   └── index.js     # Entry point
│   └── package.json
├── backend/           # Node.js backend
│   ├── server.js      # Express server
│   ├── uploads/       # File upload directory
│   ├── output/        # Generated scripts
│   └── package.json
└── README.md
```

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Azure OpenAI API access

## Installation

### Backend Setup

1. Navigate to the backend directory:
   ```cmd
   cd web-app\backend
   ```

2. Install dependencies:
   ```cmd
   npm install
   ```

3. Configure environment variables in `.env`:
   ```
   OPENAI_MODEL=your-model-name
   OPENAI_API_KEY=your-api-key
   AZURE_OPENAI_ENDPOINT=your-endpoint
   OPENAI_API_VERSION=2024-02-01
   PORT=3001
   ```

4. Start the backend server:
   ```cmd
   npm run dev
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```cmd
   cd web-app\frontend
   ```

2. Install dependencies:
   ```cmd
   npm install
   ```

3. Start the development server:
   ```cmd
   npm start
   ```

The application will be available at `http://localhost:3000`

## Usage

1. **Choose Data Source**: Select between Excel file or TestRail API
2. **Upload Files**: Upload your Excel file and Java template files, or use default files
3. **Generate Script**: Click generate to create your RestAssured test script
4. **Download Results**: Copy the generated code or download as a Java file

## API Endpoints

- `GET /api/health` - Health check
- `POST /api/test-testrail-connection` - Test TestRail connection
- `POST /api/upload-files` - Upload files
- `POST /api/generate-script` - Generate test script
- `GET /api/download/:filename` - Download generated script

## Technologies Used

### Frontend
- React.js 18
- Material-UI (MUI) 5
- React Dropzone
- React Syntax Highlighter
- Axios

### Backend
- Node.js
- Express.js
- Multer (file uploads)
- XLSX (Excel parsing)
- Azure OpenAI API
- Axios

## Development

### Frontend Development
```cmd
cd web-app\frontend
npm start
```

### Backend Development
```cmd
cd web-app\backend
npm run dev
```

### Building for Production

Frontend:
```cmd
cd web-app\frontend
npm run build
```

Backend:
```cmd
cd web-app\backend
npm start
```

## File Structure

### Required Files
- **Excel File**: Must contain 'API_detail' and 'Test_scenarios' sheets
- **Method File**: Java file with existing method implementations
- **Test File**: Java file with existing test implementations

### Generated Output
- RestAssured test scripts in Java
- Timestamped filenames
- Production-ready code

## Troubleshooting

1. **Port conflicts**: Change the PORT in backend `.env` file
2. **File upload issues**: Check file permissions in uploads directory
3. **API errors**: Verify Azure OpenAI credentials and endpoints
4. **CORS issues**: Backend includes CORS middleware for development

## License

This project is licensed under the ISC License.
