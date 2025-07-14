@echo off
echo Installing RestAssured Script Generator Web Application...
echo.

echo Installing Backend Dependencies...
cd backend
call npm install
if errorlevel 1 (
    echo Backend installation failed!
    pause
    exit /b 1
)

echo.
echo Installing Frontend Dependencies...
cd ..\frontend
call npm install
if errorlevel 1 (
    echo Frontend installation failed!
    pause
    exit /b 1
)

echo.
echo Installation completed successfully!
echo.
echo To start the application, run: start.bat
echo.
pause
