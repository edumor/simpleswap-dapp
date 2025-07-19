# 🚀 Guía de Despliegue en Vercel - SimpleSwap DApp

## ✅ Proyecto ya está en GitHub!

Tu proyecto se ha subido exitosamente a: **https://github.com/edumor/simpleswap-dapp.git**

## 📋 Pasos para Desplegar en Vercel

### 1. **Acceder a Vercel**
   - Ve a [vercel.com](https://vercel.com)
   - Inicia sesión con tu cuenta de GitHub

### 2. **Importar el Proyecto**
   - Haz clic en "New Project"
   - Selecciona "Import Git Repository"
   - Busca `edumor/simpleswap-dapp`
   - Haz clic en "Import"

### 3. **Configurar el Proyecto**
   - **Framework Preset**: Next.js (se detecta automáticamente)
   - **Root Directory**: `packages/nextjs`
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next` (por defecto)
   - **Install Command**: `npm install`

### 4. **Variables de Entorno (Opcional)**
   Si quieres configurar proveedores adicionales, agrega estas variables en Vercel:
   ```
   NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=tu_project_id
   NEXT_PUBLIC_ALCHEMY_API_KEY=tu_alchemy_key
   ```

### 5. **Deploy**
   - Haz clic en "Deploy"
   - Espera unos 2-3 minutos para que termine el build
   - ¡Tu DApp estará lista!

## 🎯 Lo que tendrás después del deploy:

- ✅ **URL pública** para acceder a tu DApp
- ✅ **Integración con Sepolia** lista para usar
- ✅ **Conexión de wallets** funcionando
- ✅ **Panel de admin** para testing
- ✅ **Auto-deploy** en futuros commits

## 🔧 Configuración Automática Incluida

El proyecto ya tiene toda la configuración necesaria:
- ✅ `vercel.json` configurado
- ✅ Scripts de build optimizados
- ✅ Rutas configuradas correctamente
- ✅ Variables de entorno template

## 📱 Páginas que estarán disponibles:

1. **Página Principal**: `/` - Información del proyecto
2. **Swap Interface**: `/swap` - Intercambio de tokens
3. **Admin Panel**: `/admin` - Para testing y información

## 🌐 Contratos ya integrados en Sepolia:

- **SimpleSwap**: `0x02534A7E22D24F57f53ADe63D932C560a3Cf23f4`
- **TokenA**: `0x4efc5e7af7851efB65871c0d54adaC154250126f`
- **TokenB**: `0x36ae80FDa8f67605aac4Dd723c70ce70513AB909`

## 🎓 Para el Profesor:

Una vez desplegado, el profesor podrá:
1. **Conectar cualquier wallet** (MetaMask, Coinbase, etc.)
2. **Aprobar tokens** sin restricciones
3. **Realizar swaps** usando los contratos reales
4. **Ver información** en el panel de admin

## 📝 Siguientes Pasos:

1. **Desplegar en Vercel** siguiendo los pasos arriba
2. **Compartir la URL** con el profesor
3. **Documentar la URL** en tu entrega

¡El proyecto está 100% listo para producción! 🚀
