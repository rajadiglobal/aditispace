$ErrorActionPreference = "Stop"

$root = $PSScriptRoot
$backend = Join-Path $root "backend"
$frontend = Join-Path $root "frontend"

function Resolve-Python {
    param(
        [Parameter(Mandatory = $true)]
        [string]$BackendPath
    )

    $venvCandidates = @(
        (Join-Path $BackendPath ".venv"),
        (Join-Path $BackendPath "venv")
    )

    foreach ($venvPath in $venvCandidates) {
        $pythonPath = Join-Path $venvPath "Scripts\python.exe"
        if (Test-Path $pythonPath) {
            return $pythonPath
        }
    }

    $venvPath = Join-Path $BackendPath ".venv"
    Write-Host "Backend virtual environment not found. Creating $venvPath..."
    & python -m venv $venvPath
    if ($LASTEXITCODE -ne 0) {
        throw "Could not create the backend virtual environment. Ensure Python is installed and available on PATH."
    }

    return (Join-Path $venvPath "Scripts\python.exe")
}

if (-not (Test-Path (Join-Path $backend "requirements.txt"))) {
    throw "Backend requirements file not found: $backend\requirements.txt"
}

if (-not (Test-Path (Join-Path $frontend "package.json"))) {
    throw "Frontend package manifest not found: $frontend\package.json"
}

$python = Resolve-Python -BackendPath $backend

Write-Host "Checking backend dependencies..."
& $python -m pip install --disable-pip-version-check -r (Join-Path $backend "requirements.txt")
if ($LASTEXITCODE -ne 0) {
    throw "Backend dependency installation failed."
}

Write-Host "Checking frontend dependencies..."
Push-Location $frontend
try {
    $dependenciesReady = $false
    if (Test-Path "node_modules") {
        & npm ls --depth=0 --silent
        $dependenciesReady = ($LASTEXITCODE -eq 0)
    }

    if (-not $dependenciesReady -and (Test-Path "package-lock.json")) {
        & npm ci
    }
    elseif (-not $dependenciesReady) {
        & npm install
    }

    if (-not $dependenciesReady -and $LASTEXITCODE -ne 0) {
        throw "Frontend dependency installation failed."
    }
}
finally {
    Pop-Location
}

$backendCommand = "Set-Location '$backend'; & '$python' run.py"
Write-Host "Starting backend at http://localhost:8000..."
Start-Process powershell -ArgumentList "-NoExit", "-ExecutionPolicy", "Bypass", "-Command", $backendCommand | Out-Null

Write-Host "Starting frontend at http://localhost:3000..."
Push-Location $frontend
try {
    & npm run dev
}
finally {
    Pop-Location
}
