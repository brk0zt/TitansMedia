Write-Host "=== FBTool Development Servers ===" -ForegroundColor Cyan
Write-Host ""

# Start Mock API server
$env:PORT = "8001"
$apiJob = Start-Job -Name "MockAPI" -ScriptBlock {
  $env:PORT = "8001"
  Set-Location $using:PWD
  node backend/server.mjs
}

Start-Sleep -Seconds 2

# Start Vite frontend
$viteJob = Start-Job -Name "Vite" -ScriptBlock {
  Set-Location $using:PWD\frontend
  npx vite --host
}

Start-Sleep -Seconds 3

Write-Host "  Frontend : http://localhost:5173" -ForegroundColor Green
Write-Host "  Backend  : http://localhost:8001" -ForegroundColor Green
Write-Host "  Login    : michael@titans.media / password123" -ForegroundColor Yellow
Write-Host ""
Write-Host "Press Ctrl+C to stop all servers" -ForegroundColor Cyan

# Keep running
while ($true) {
  Start-Sleep -Seconds 10
  Receive-Job $apiJob -ErrorAction SilentlyContinue
}
