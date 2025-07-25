#!/usr/bin/env pwsh
# SimpleSwap DApp - Local Development Setup Script
# This script sets up the complete development environment for the SimpleSwap DApp

param(
    [switch]$InstallDeps,
    [switch]$RunFrontend,
    [switch]$RunHardhat,
    [switch]$RunTests,
    [switch]$GenerateTypes,
    [switch]$All
)

Write-Host "🚀 SimpleSwap DApp - Local Development Setup" -ForegroundColor Cyan
Write-Host "=============================================" -ForegroundColor Cyan

$ProjectRoot = Split-Path -Parent $MyInvocation.MyCommand.Definition

function Install-Dependencies {
    Write-Host "📦 Installing dependencies..." -ForegroundColor Yellow
    
    # Install root dependencies
    Write-Host "Installing root dependencies..." -ForegroundColor Gray
    Set-Location $ProjectRoot
    if (Test-Path "package.json") {
        npm install
        if ($LASTEXITCODE -ne 0) {
            Write-Host "❌ Failed to install root dependencies" -ForegroundColor Red
            return $false
        }
    }
    
    # Install Hardhat dependencies
    $HardhatPath = Join-Path $ProjectRoot "hardhat"
    if (Test-Path $HardhatPath) {
        Write-Host "Installing Hardhat dependencies..." -ForegroundColor Gray
        Set-Location $HardhatPath
        npm install
        if ($LASTEXITCODE -ne 0) {
            Write-Host "❌ Failed to install Hardhat dependencies" -ForegroundColor Red
            return $false
        }
    }
    
    # Install Next.js dependencies
    $NextJsPath = Join-Path $ProjectRoot "nextjs"
    if (Test-Path $NextJsPath) {
        Write-Host "Installing Next.js dependencies..." -ForegroundColor Gray
        Set-Location $NextJsPath
        npm install
        if ($LASTEXITCODE -ne 0) {
            Write-Host "❌ Failed to install Next.js dependencies" -ForegroundColor Red
            return $false
        }
    }
    
    Write-Host "✅ All dependencies installed successfully" -ForegroundColor Green
    return $true
}

function Start-Frontend {
    $NextJsPath = Join-Path $ProjectRoot "nextjs"
    if (-not (Test-Path $NextJsPath)) {
        Write-Host "❌ Next.js project not found" -ForegroundColor Red
        return
    }
    
    Write-Host "🌐 Starting Next.js frontend..." -ForegroundColor Yellow
    Set-Location $NextJsPath
    
    # Check if dependencies are installed
    if (-not (Test-Path "node_modules")) {
        Write-Host "📦 Installing Next.js dependencies first..." -ForegroundColor Yellow
        npm install
    }
    
    Write-Host "🚀 Starting development server on http://localhost:3000" -ForegroundColor Green
    npm run dev
}

function Start-Hardhat {
    $HardhatPath = Join-Path $ProjectRoot "hardhat"
    if (-not (Test-Path $HardhatPath)) {
        Write-Host "❌ Hardhat project not found" -ForegroundColor Red
        return
    }
    
    Write-Host "⛏️  Starting Hardhat local network..." -ForegroundColor Yellow
    Set-Location $HardhatPath
    
    # Check if dependencies are installed
    if (-not (Test-Path "node_modules")) {
        Write-Host "📦 Installing Hardhat dependencies first..." -ForegroundColor Yellow
        npm install
    }
    
    Write-Host "🔗 Starting local blockchain on http://localhost:8545" -ForegroundColor Green
    npx hardhat node
}

function Run-Tests {
    $HardhatPath = Join-Path $ProjectRoot "hardhat"
    if (-not (Test-Path $HardhatPath)) {
        Write-Host "❌ Hardhat project not found" -ForegroundColor Red
        return
    }
    
    Write-Host "🧪 Running smart contract tests..." -ForegroundColor Yellow
    Set-Location $HardhatPath
    
    # Run tests with coverage
    Write-Host "Running tests with coverage report..." -ForegroundColor Gray
    npx hardhat test
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ All tests passed!" -ForegroundColor Green
        
        # Generate coverage report
        Write-Host "📊 Generating coverage report..." -ForegroundColor Yellow
        npx hardhat coverage
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host "✅ Coverage report generated in coverage/ directory" -ForegroundColor Green
        }
    } else {
        Write-Host "❌ Some tests failed" -ForegroundColor Red
    }
}

function Generate-Types {
    $HardhatPath = Join-Path $ProjectRoot "hardhat"
    if (-not (Test-Path $HardhatPath)) {
        Write-Host "❌ Hardhat project not found" -ForegroundColor Red
        return
    }
    
    Write-Host "🔧 Generating TypeScript types..." -ForegroundColor Yellow
    Set-Location $HardhatPath
    
    # Compile contracts
    Write-Host "Compiling contracts..." -ForegroundColor Gray
    npx hardhat compile
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Contracts compiled successfully" -ForegroundColor Green
        Write-Host "✅ TypeScript types generated in typechain-types/" -ForegroundColor Green
    } else {
        Write-Host "❌ Failed to compile contracts" -ForegroundColor Red
    }
}

function Show-Help {
    Write-Host ""
    Write-Host "📋 Available Commands:" -ForegroundColor Cyan
    Write-Host "  -InstallDeps    Install all project dependencies" -ForegroundColor White
    Write-Host "  -RunFrontend    Start the Next.js development server" -ForegroundColor White
    Write-Host "  -RunHardhat     Start the local Hardhat blockchain" -ForegroundColor White
    Write-Host "  -RunTests       Run smart contract tests with coverage" -ForegroundColor White
    Write-Host "  -GenerateTypes  Generate TypeScript types from contracts" -ForegroundColor White
    Write-Host "  -All            Install deps, generate types, and show instructions" -ForegroundColor White
    Write-Host ""
    Write-Host "💡 Examples:" -ForegroundColor Yellow
    Write-Host "  .\dev-setup.ps1 -InstallDeps" -ForegroundColor Gray
    Write-Host "  .\dev-setup.ps1 -RunFrontend" -ForegroundColor Gray
    Write-Host "  .\dev-setup.ps1 -All" -ForegroundColor Gray
    Write-Host ""
}

# Main execution logic
if ($All) {
    if (Install-Dependencies) {
        Generate-Types
        Write-Host ""
        Write-Host "🎉 Setup complete! Here's what to do next:" -ForegroundColor Green
        Write-Host ""
        Write-Host "1️⃣  Start local blockchain:" -ForegroundColor Cyan
        Write-Host "   .\dev-setup.ps1 -RunHardhat" -ForegroundColor White
        Write-Host ""
        Write-Host "2️⃣  In another terminal, start frontend:" -ForegroundColor Cyan
        Write-Host "   .\dev-setup.ps1 -RunFrontend" -ForegroundColor White
        Write-Host ""
        Write-Host "3️⃣  Open http://localhost:3000 in your browser" -ForegroundColor Cyan
        Write-Host ""
        Write-Host "🔍 Optional - Run tests:" -ForegroundColor Yellow
        Write-Host "   .\dev-setup.ps1 -RunTests" -ForegroundColor White
    }
} elseif ($InstallDeps) {
    Install-Dependencies
} elseif ($RunFrontend) {
    Start-Frontend
} elseif ($RunHardhat) {
    Start-Hardhat
} elseif ($RunTests) {
    Run-Tests
} elseif ($GenerateTypes) {
    Generate-Types
} else {
    Show-Help
}

Write-Host ""
Write-Host "🎓 Academic Note: This setup script facilitates Module 4 development requirements" -ForegroundColor Magenta
