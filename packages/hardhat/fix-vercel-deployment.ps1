# PowerShell script to fix Vercel deployment issues

Write-Host "🔧 Fixing dependency issues for Vercel deployment..." -ForegroundColor Yellow

try {
    Write-Host "📦 Removing node_modules..." -ForegroundColor Cyan
    if (Test-Path "node_modules") {
        Remove-Item -Recurse -Force "node_modules"
    }
    
    Write-Host "🗑️ Removing yarn.lock..." -ForegroundColor Cyan
    if (Test-Path "yarn.lock") {
        Remove-Item "yarn.lock"
    }
    
    Write-Host "🔄 Installing dependencies with fresh lockfile..." -ForegroundColor Cyan
    yarn install
    
    Write-Host "✅ Dependencies fixed successfully!" -ForegroundColor Green
    Write-Host "🚀 Now you can commit the new yarn.lock file to fix Vercel deployment" -ForegroundColor Green
    
    Write-Host "`n📋 Next steps:" -ForegroundColor Yellow
    Write-Host "1. git add ." -ForegroundColor White
    Write-Host "2. git commit -m `"fix: resolve dependency conflicts and add Sepolia deployment config`"" -ForegroundColor White
    Write-Host "3. Run yarn install" -ForegroundColor White
    Write-Host "4. git push origin master" -ForegroundColor White
    
} catch {
    Write-Host "❌ Error fixing dependencies: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "`n💡 Manual fix steps:" -ForegroundColor Yellow
    Write-Host "1. Delete node_modules folder" -ForegroundColor White
    Write-Host "2. Delete yarn.lock file" -ForegroundColor White
    Write-Host "3. Run yarn install" -ForegroundColor White
    Write-Host "4. Commit the new yarn.lock file" -ForegroundColor White
    exit 1
}
