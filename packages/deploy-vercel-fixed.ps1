# Vercel Deployment Script for SimpleSwap DApp
# Fixed version without special characters

param(
    [switch]$Production,
    [switch]$Preview,
    [string]$Branch = "main"
)

Write-Host "SimpleSwap DApp - Vercel Deployment Script" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan

# Check if Vercel CLI is installed
try {
    $vercelVersion = vercel --version
    Write-Host "Vercel CLI found: $vercelVersion" -ForegroundColor Green
} catch {
    Write-Host "Vercel CLI not found. Installing..." -ForegroundColor Red
    npm install -g vercel
    Write-Host "Vercel CLI installed successfully" -ForegroundColor Green
}

# Navigate to the Next.js project directory
$ProjectRoot = Split-Path -Parent $MyInvocation.MyCommand.Definition
$NextJsPath = Join-Path $ProjectRoot "nextjs"

if (-not (Test-Path $NextJsPath)) {
    Write-Host "Next.js project not found at: $NextJsPath" -ForegroundColor Red
    exit 1
}

Set-Location $NextJsPath
Write-Host "Working directory: $NextJsPath" -ForegroundColor Yellow

# Check if package.json exists
if (-not (Test-Path "package.json")) {
    Write-Host "package.json not found in Next.js directory" -ForegroundColor Red
    exit 1
}

# Install dependencies if node_modules doesn't exist
if (-not (Test-Path "node_modules")) {
    Write-Host "Installing dependencies..." -ForegroundColor Yellow
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Failed to install dependencies" -ForegroundColor Red
        exit 1
    }
    Write-Host "Dependencies installed successfully" -ForegroundColor Green
}

# Build the project to check for errors
Write-Host "Building project..." -ForegroundColor Yellow
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Host "Build failed. Please fix the errors before deploying." -ForegroundColor Red
    exit 1
}
Write-Host "Build successful" -ForegroundColor Green

# Check if user is logged in to Vercel
Write-Host "Checking Vercel authentication..." -ForegroundColor Yellow
try {
    $vercelUser = vercel whoami 2>$null
    if ($LASTEXITCODE -eq 0) {
        Write-Host "Logged in as: $vercelUser" -ForegroundColor Green
    } else {
        throw "Not logged in"
    }
} catch {
    Write-Host "Please log in to Vercel..." -ForegroundColor Yellow
    vercel login
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Vercel login failed" -ForegroundColor Red
        exit 1
    }
}

# Determine deployment type
$DeploymentFlags = @()

if ($Production) {
    Write-Host "Deploying to PRODUCTION..." -ForegroundColor Magenta
    $DeploymentFlags += "--prod"
} elseif ($Preview) {
    Write-Host "Deploying PREVIEW..." -ForegroundColor Yellow
    $DeploymentFlags += "--target", "preview"
} else {
    Write-Host "Deploying to DEVELOPMENT..." -ForegroundColor Cyan
}

# Add confirmation for production deployments
if ($Production) {
    $confirmation = Read-Host "Are you sure you want to deploy to PRODUCTION? (y/N)"
    if ($confirmation -ne "y" -and $confirmation -ne "Y") {
        Write-Host "Deployment cancelled" -ForegroundColor Red
        exit 0
    }
}

# Execute deployment
Write-Host "Starting deployment..." -ForegroundColor Green
Write-Host "Command: vercel deploy $($DeploymentFlags -join ' ')" -ForegroundColor Gray

if ($DeploymentFlags.Count -gt 0) {
    $result = vercel deploy @DeploymentFlags
} else {
    $result = vercel deploy
}

if ($LASTEXITCODE -eq 0) {
    Write-Host "Deployment successful!" -ForegroundColor Green
    Write-Host "Deployment Details:" -ForegroundColor Cyan
    Write-Host "URL: $result" -ForegroundColor White
    
    Write-Host ""
    Write-Host "Useful Commands:" -ForegroundColor Yellow
    Write-Host "View deployments: vercel ls" -ForegroundColor Gray
    Write-Host "View logs: vercel logs" -ForegroundColor Gray
    Write-Host "Open in browser: vercel open" -ForegroundColor Gray
} else {
    Write-Host "Deployment failed" -ForegroundColor Red
    Write-Host "Common solutions:" -ForegroundColor Yellow
    Write-Host "1. Check your environment variables" -ForegroundColor Gray
    Write-Host "2. Ensure all dependencies are installed" -ForegroundColor Gray
    Write-Host "3. Verify your build passes locally" -ForegroundColor Gray
    Write-Host "4. Check Vercel project settings" -ForegroundColor Gray
    exit 1
}

Write-Host ""
Write-Host "Post-Deployment Checklist:" -ForegroundColor Cyan
Write-Host "Test wallet connection" -ForegroundColor Gray
Write-Host "Verify contract interactions" -ForegroundColor Gray
Write-Host "Check responsive design" -ForegroundColor Gray
Write-Host "Validate token approval flow" -ForegroundColor Gray
Write-Host "Test SimpleSwap functionality" -ForegroundColor Gray
