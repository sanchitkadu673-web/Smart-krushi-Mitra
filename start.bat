@echo off
echo Starting Backend Server...
start cmd /k "cd backend && npm run dev"

echo Starting Frontend Server...
start cmd /k "cd frontend && npm run dev"

echo Both servers are starting! Close the command windows when you want to stop the servers.
