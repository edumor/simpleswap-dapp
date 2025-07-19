#!/bin/bash

echo "🚀 Configurando Scaffold ETH para SimpleSwap..."

# Verificar que estamos en la carpeta correcta
if [ ! -f "package.json" ]; then
    echo "❌ Error: Este script debe ejecutarse desde la raíz del proyecto (donde está package.json)"
    exit 1
fi

# Instalar dependencias del proyecto principal si no están instaladas
if [ ! -d "node_modules" ]; then
    echo "📦 Instalando dependencias del proyecto principal..."
    yarn install
fi

# Cambiar al directorio del frontend
cd packages/nextjs

echo "📦 Instalando dependencias del frontend..."
yarn install

echo "🔧 Copiando archivo de entorno..."
if [ ! -f ".env.local" ]; then
    cp .env.example .env.local
    echo "✅ Archivo .env.local creado. Edítalo con tus APIs keys."
else
    echo "⚠️  .env.local ya existe, no se sobrescribirá."
fi

echo "🏗️  Construyendo el proyecto..."
yarn build

echo "✅ ¡Configuración completada!"
echo ""
echo "📋 Próximos pasos:"
echo "1. Edita packages/nextjs/.env.local con tus API keys"
echo "2. Ejecuta 'cd packages/nextjs && yarn dev' para desarrollo local"
echo "3. Para deploy en Vercel, sigue las instrucciones en README.md"
echo ""
echo "🌐 URLs útiles:"
echo "- Desarrollo local: http://localhost:3000"
echo "- Alchemy (API keys): https://www.alchemy.com/"
echo "- WalletConnect: https://cloud.walletconnect.com/"
echo "- Vercel: https://vercel.com/"
