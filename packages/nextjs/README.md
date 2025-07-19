# SimpleSwap Frontend - Scaffold ETH

Este es el frontend de SimpleSwap construido con Scaffold ETH 2, Next.js 14, y configurado para despliegue en Vercel.

## 🚀 Características

- **Next.js 14** con App Router
- **TypeScript** para type safety
- **Tailwind CSS** + **DaisyUI** para styling
- **Wagmi v2** + **Viem v2** para interacciones Web3
- **RainbowKit** para conectores de wallet
- **React Query** para manejo de estado de servidor
- Configuración lista para **Vercel**

## 🛠 Desarrollo Local

### Prerrequisitos

- Node.js 18+ 
- Yarn o npm
- Hardhat node corriendo (puerto 8545)

### Instalación

```bash
# Desde la raíz del proyecto
cd packages/nextjs

# Instalar dependencias
yarn install

# Ejecutar en modo desarrollo
yarn dev
```

La aplicación estará disponible en `http://localhost:3000`

## 📦 Scripts Disponibles

```bash
# Desarrollo
yarn dev

# Build de producción
yarn build

# Iniciar servidor de producción
yarn start

# Linting
yarn lint

# Type checking
yarn type-check

# Deploy a Vercel
yarn vercel

# Deploy a Vercel (ignorando errores de build)
yarn vercel:yolo
```

## 🚀 Deploy en Vercel

### 1. Configuración en Vercel

1. **Conecta tu repositorio** en [vercel.com](https://vercel.com)
2. **Configura las variables de entorno** (opcional):
   ```
   NEXT_PUBLIC_ALCHEMY_API_KEY=tu_alchemy_api_key
   NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=tu_wallet_connect_project_id
   ```

### 2. Configuración del Proyecto

- **Framework Preset**: Next.js
- **Root Directory**: `packages/nextjs`
- **Build Command**: `yarn build`
- **Output Directory**: `.next`
- **Install Command**: `yarn install`

### 3. Deploy Automático

```bash
# Opción 1: Push a main/master branch (auto-deploy)
git add .
git commit -m "Deploy to Vercel"
git push origin main

# Opción 2: Deploy manual con Vercel CLI
cd packages/nextjs
yarn vercel --prod
```

### 4. Variables de Entorno en Vercel

En el dashboard de Vercel, ve a **Settings > Environment Variables** y agrega:

```
NEXT_PUBLIC_ALCHEMY_API_KEY=your_alchemy_key
NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=your_walletconnect_id
```

## 🔧 Configuración

### Chains Soportadas

Edita `scaffold.config.ts` para configurar las redes:

```typescript
const scaffoldConfig = {
  targetNetworks: [mainnet, sepolia, hardhat],
  // ... otras configuraciones
};
```

### Contratos

Los contratos se cargan automáticamente desde:
- `contracts/deployments/` (generated)
- Hardhat artifacts

### Theming

Los temas se configuran en `tailwind.config.js`:
- Light theme
- Dark theme
- Colores personalizables

## 📁 Estructura del Proyecto

```
packages/nextjs/
├── app/                    # App Router (Next.js 14)
│   ├── layout.tsx         # Layout principal
│   ├── page.tsx           # Página home
│   └── globals.css        # Estilos globales
├── components/            # Componentes React
│   ├── Header.tsx
│   ├── Footer.tsx
│   └── scaffold-eth/      # Componentes de Scaffold ETH
├── hooks/                 # Custom hooks
├── services/              # Servicios (Web3, store)
├── utils/                 # Utilidades
├── scaffold.config.ts     # Configuración principal
├── next.config.js         # Configuración de Next.js
└── vercel.json           # Configuración de Vercel
```

## 🌐 Configuración de Redes

### Para Production (Mainnet/Sepolia):
```typescript
// En scaffold.config.ts
targetNetworks: [mainnet, sepolia]
```

### Para Development (Local):
```typescript
// En scaffold.config.ts  
targetNetworks: [hardhat]
```

## 🔍 Debug

### 1. Vercel Logs
```bash
vercel logs [deployment-url]
```

### 2. Local Build Test
```bash
yarn build
yarn start
```

### 3. Type Checking
```bash
yarn type-check
```

## 📱 Responsive Design

- Mobile-first approach
- Tailwind CSS responsive utilities
- DaisyUI components
- Touch-friendly interfaces

## 🔐 Seguridad

- Variables de entorno para APIs
- Validación de redes
- Sanitización de inputs
- HTTPS enforced en production

## 📄 Licencia

MIT License - ver [LICENSE](../../LICENSE) para detalles.
