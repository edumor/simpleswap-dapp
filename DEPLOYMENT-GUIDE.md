# 🚀 Guía Completa de Deployment - SimpleSwap con Scaffold ETH

## 📋 Tabla de Contenidos

1. [Configuración Inicial](#configuración-inicial)
2. [Deploy Local](#deploy-local)
3. [Deploy en Vercel](#deploy-en-vercel)
4. [Configuración de Redes](#configuración-de-redes)
5. [Variables de Entorno](#variables-de-entorno)
6. [Troubleshooting](#troubleshooting)

---

## 🛠 Configuración Inicial

### 1. Estructura del Proyecto

Tu proyecto ahora tiene la siguiente estructura:

```
SSwap/
├── contracts/              # Contratos de Hardhat
├── packages/
│   └── nextjs/            # Frontend Scaffold ETH
├── scripts/               # Scripts de Hardhat
├── setup-frontend.bat     # Script de configuración (Windows)
└── setup-frontend.sh      # Script de configuración (Unix)
```

### 2. Configuración Rápida

**Windows:**
```bash
setup-frontend.bat
```

**Mac/Linux:**
```bash
chmod +x setup-frontend.sh
./setup-frontend.sh
```

## 🏠 Deploy Local

### 1. Iniciar Hardhat Node

```bash
# Terminal 1 - Iniciar nodo local
yarn node
```

### 2. Deploy de Contratos

```bash
# Terminal 2 - Deploy contratos
yarn deploy
```

### 3. Iniciar Frontend

```bash
# Terminal 3 - Frontend
yarn frontend:dev
```

**URLs:**
- Frontend: http://localhost:3000
- Hardhat Node: http://localhost:8545

## ☁️ Deploy en Vercel

### Método 1: GitHub + Vercel Dashboard

1. **Push a GitHub:**
   ```bash
   git add .
   git commit -m "Add Scaffold ETH frontend"
   git push origin main
   ```

2. **Configurar en Vercel:**
   - Ve a [vercel.com](https://vercel.com)
   - Import tu repositorio
   - Configuración:
     - **Framework Preset**: Next.js
     - **Root Directory**: `packages/nextjs`
     - **Build Command**: `yarn build`
     - **Output Directory**: `.next`

### Método 2: Vercel CLI

```bash
# Instalar Vercel CLI globalmente
npm i -g vercel

# Deploy desde packages/nextjs
cd packages/nextjs
vercel --prod
```

### Método 3: Script Automatizado

```bash
# Desde la raíz del proyecto
yarn vercel:deploy
```

## 🌐 Configuración de Redes

### Para Testnet (Sepolia)

1. **Actualizar scaffold.config.ts:**
   ```typescript
   import { sepolia } from "viem/chains";
   
   const scaffoldConfig = {
     targetNetworks: [sepolia],
     // ...
   };
   ```

2. **Deploy contratos en Sepolia:**
   ```bash
   yarn deploy:sepolia
   ```

3. **Redeploy frontend:**
   ```bash
   yarn frontend:build
   yarn vercel:deploy
   ```

### Para Mainnet

⚠️ **PRECAUCIÓN**: Solo para producción real

```typescript
import { mainnet } from "viem/chains";

const scaffoldConfig = {
  targetNetworks: [mainnet],
  // ...
};
```

## 🔐 Variables de Entorno

### Variables Requeridas

Crea `.env.local` en `packages/nextjs/`:

```env
# Alchemy API Key (OPCIONAL pero recomendado)
NEXT_PUBLIC_ALCHEMY_API_KEY=tu_alchemy_key

# WalletConnect Project ID (OPCIONAL)
NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=tu_walletconnect_id
```

### En Vercel Dashboard

Ve a **Settings > Environment Variables** y agrega:

| Variable | Valor | Entorno |
|----------|-------|---------|
| `NEXT_PUBLIC_ALCHEMY_API_KEY` | Tu Alchemy API key | Production, Preview |
| `NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID` | Tu WalletConnect ID | Production, Preview |

### Obtener API Keys

**Alchemy (Gratis):**
1. Ve a [alchemy.com](https://www.alchemy.com/)
2. Crea cuenta → New App
3. Selecciona red (Sepolia/Mainnet)
4. Copia el API Key

**WalletConnect (Gratis):**
1. Ve a [cloud.walletconnect.com](https://cloud.walletconnect.com/)
2. Crea proyecto
3. Copia el Project ID

## 🐛 Troubleshooting

### Error: "Module not found"

```bash
# Reinstalar dependencias
cd packages/nextjs
rm -rf node_modules .next
yarn install
yarn build
```

### Error: Build failed en Vercel

1. **Verificar configuración:**
   - Root Directory: `packages/nextjs`
   - Build Command: `yarn build`

2. **Ignorar errores temporalmente:**
   ```bash
   # En Vercel, agregar variable:
   NEXT_PUBLIC_IGNORE_BUILD_ERROR=true
   ```

### Error: Wallet no conecta

1. **Verificar red:**
   - Metamask debe estar en la misma red que el contrato
   
2. **Hardhat local:**
   ```bash
   # Asegurar que Hardhat está corriendo en puerto 8545
   yarn node
   ```

### Error: Contratos no aparecen

1. **Verificar deployment:**
   ```bash
   # Re-deploy contratos
   yarn deploy
   ```

2. **Check artifacts:**
   ```bash
   ls -la artifacts/contracts/
   ```

## 📱 Verificación Post-Deploy

### Checklist de Funcionalidad

- [ ] ✅ Frontend carga correctamente
- [ ] ✅ Wallet conecta (MetaMask)
- [ ] ✅ Red correcta seleccionada
- [ ] ✅ Contratos detectados
- [ ] ✅ Transacciones funcionan
- [ ] ✅ Responsive design (móvil)

### URLs de Verificación

**Desarrollo:**
- Frontend: http://localhost:3000
- Network: Hardhat Local (Chain ID: 31337)

**Producción:**
- Frontend: https://tu-app.vercel.app
- Network: Sepolia (Chain ID: 11155111)

## 🚀 Próximos Pasos

1. **Personalizar UI:**
   - Editar colores en `tailwind.config.js`
   - Modificar componentes en `components/`

2. **Agregar funcionalidades:**
   - Nuevas páginas en `app/`
   - Hooks personalizados en `hooks/`

3. **Analytics:**
   - Agregar Vercel Analytics
   - Google Analytics

4. **SEO:**
   - Actualizar metadatos en `layout.tsx`
   - Agregar sitemap

## 📞 Soporte

Si encuentras problemas:

1. **Revisa logs:**
   ```bash
   vercel logs https://tu-app.vercel.app
   ```

2. **Community:**
   - [Scaffold ETH Discord](https://discord.gg/scaffold-eth)
   - [Vercel Discord](https://discord.gg/vercel)

3. **Documentación:**
   - [Scaffold ETH Docs](https://docs.scaffoldeth.io/)
   - [Vercel Docs](https://vercel.com/docs)

---

¡Tu SimpleSwap con Scaffold ETH está listo para conquistar el mundo DeFi! 🌟
