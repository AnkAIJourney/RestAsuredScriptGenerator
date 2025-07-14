@echo off
echo Starting RestAssured Script Generator Backend...
echo.

cd /d "%~dp0backend"

echo Checking if node_modules exists...
if not exist "node_modules" (
    echo Installing dependencies...
    call npm install
    if errorlevel 1 (
        echo Failed to install dependencies!
        pause
        exit /b 1
    )
)

echo.
echo Starting backend server...
echo Backend will be available at: http://localhost:3001
echo.

call npm run dev

pause
