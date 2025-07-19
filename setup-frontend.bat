@echo off
echo 🚀 Configurando Scaffold ETH para SimpleSwap...

REM Verificar que estamos en la carpeta correcta
if not exist package.json (
    echo ❌ Error: Este script debe ejecutarse desde la raiz del proyecto ^(donde esta package.json^)
    pause
    exit /b 1
)

REM Instalar dependencias del proyecto principal si no están instaladas
if not exist node_modules (
    echo 📦 Instalando dependencias del proyecto principal...
    yarn install
)

REM Cambiar al directorio del frontend
cd packages\nextjs

echo 📦 Instalando dependencias del frontend...
yarn install

echo 🔧 Copiando archivo de entorno...
if not exist .env.local (
    copy .env.example .env.local
    echo ✅ Archivo .env.local creado. Editalo con tus APIs keys.
) else (
    echo ⚠️  .env.local ya existe, no se sobrescribira.
)

echo 🏗️  Construyendo el proyecto...
yarn build

echo ✅ ¡Configuracion completada!
echo.
echo 📋 Proximos pasos:
echo 1. Edita packages\nextjs\.env.local con tus API keys
echo 2. Ejecuta 'cd packages\nextjs ^&^& yarn dev' para desarrollo local
echo 3. Para deploy en Vercel, sigue las instrucciones en README.md
echo.
echo 🌐 URLs utiles:
echo - Desarrollo local: http://localhost:3000
echo - Alchemy ^(API keys^): https://www.alchemy.com/
echo - WalletConnect: https://cloud.walletconnect.com/
echo - Vercel: https://vercel.com/

pause
