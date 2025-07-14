@echo off
echo Starting RestAssured Script Generator Web Application...
echo.

echo Starting Backend Server...
cd backend
start "Backend Server" cmd /k "npm install && npm run dev"

echo Waiting for backend to start...
timeout /t 5

echo Starting Frontend Application...
cd ..\frontend
start "Frontend App" cmd /k "npm install && npm start"

echo.
echo Application is starting...
echo Backend: http://localhost:3001
echo Frontend: http://localhost:3000
echo.
echo Press any key to exit...
pause
