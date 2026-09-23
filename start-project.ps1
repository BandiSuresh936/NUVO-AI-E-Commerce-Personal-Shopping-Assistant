$projectRoot = Split-Path -Parent $MyInvocation.MyCommand.Path

Start-Process powershell -ArgumentList @(
    "-NoExit",
    "-Command",
    "Set-Location '$projectRoot\frontend'; npm run dev"
)

Start-Process powershell -ArgumentList @(
    "-NoExit",
    "-Command",
    "Set-Location '$projectRoot'; backend/.venv/Scripts/python.exe backend/manage.py runserver 8001"
)

Write-Host "Frontend: http://localhost:8000/index.html"
Write-Host "Backend:  http://127.0.0.1:8001/api/health/"
