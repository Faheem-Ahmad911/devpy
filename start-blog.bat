@echo off
echo Starting DevPy Blog Server...
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Node.js is not installed!
    echo Please download and install Node.js from: https://nodejs.org/
    echo Then run this script again.
    pause
    exit /b 1
)

REM Check if dependencies are installed
if not exist "node_modules" (
    echo Installing dependencies...
    npm install
    if %errorlevel% neq 0 (
        echo ERROR: Failed to install dependencies!
        pause
        exit /b 1
    )
)

echo Starting server...
echo Blog will be available at: http://localhost:3000/blogs
echo Admin panel at: http://localhost:3000/blogs/admin
echo.
echo Press Ctrl+C to stop the server
echo.

node server.js
