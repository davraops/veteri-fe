# Receta: Configuración de Entorno Frontend

Esta receta te guiará paso a paso para configurar un proyecto frontend completo con todas las herramientas y configuraciones necesarias según las mejores prácticas.

> **Nota**: Esta receta está diseñada para un **repositorio independiente** de frontend. El backend debe estar en un repositorio separado.

## 📋 Prerrequisitos

- Node.js >= 20.x LTS instalado
- npm, yarn o pnpm instalado
- Git configurado
- Cuenta de GitHub (para CI/CD)
- Repositorio de GitHub creado para el proyecto frontend

## 🚀 Pasos de Configuración

### 1. Inicializar el Proyecto

```bash
# Inicializar proyecto npm
npm init -y

# Crear proyecto con Vite + React + TypeScript
npm create vite@latest . -- --template react-ts

# O si prefieres JavaScript
npm create vite@latest . -- --template react
```

### 2. Instalar Dependencias Core

```bash
# Instalar dependencias del proyecto
npm install

# Instalar dependencias de UI
npm install @mui/material @emotion/react @emotion/styled
npm install @mui/icons-material

# Instalar TanStack Router (alternativa sólida a React Router)
npm install @tanstack/react-router
npm install -D @tanstack/router-vite-plugin

# Instalar TanStack Query (gestión de estado del servidor)
npm install @tanstack/react-query @tanstack/react-query-devtools

# Instalar TanStack Form (formularios type-safe)
npm install @tanstack/react-form

# Instalar TanStack Virtual (opcional, para listas grandes)
npm install @tanstack/react-virtual
```

### 3. Instalar Dependencias de Calidad de Código

```bash
# ESLint y plugins
npm install -D eslint @typescript-eslint/eslint-plugin @typescript-eslint/parser
npm install -D eslint-plugin-react eslint-plugin-react-hooks eslint-plugin-react-refresh

# Prettier
npm install -D prettier eslint-config-prettier eslint-plugin-prettier

# Husky y lint-staged
npm install -D husky lint-staged

# Inicializar Husky
npx husky init
```

### 4. Instalar Dependencias de Testing

```bash
# Vitest y React Testing Library
npm install -D vitest @testing-library/react @testing-library/jest-dom @testing-library/user-event
npm install -D jsdom @vitest/coverage-v8
```

### 5. Configurar ESLint

Crear/actualizar `.eslintrc.cjs`:

```javascript
module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react-hooks/recommended',
    'plugin:react/recommended',
    'plugin:react/jsx-runtime',
    'prettier',
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs'],
  parser: '@typescript-eslint/parser',
  plugins: ['react-refresh', 'prettier'],
  rules: {
    'react-refresh/only-export-components': [
      'warn',
      { allowConstantExport: true },
    ],
    'prettier/prettier': 'error',
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
};
```

### 6. Configurar Prettier

Crear `.prettierrc`:

```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 80,
  "tabWidth": 2,
  "useTabs": false,
  "arrowParens": "always",
  "endOfLine": "lf"
}
```

Crear `.prettierignore`:

```
node_modules
dist
build
coverage
*.lock
.env*
```

### 7. Configurar lint-staged

Crear/actualizar `.lintstagedrc.json`:

```json
{
  "*.{ts,tsx,js,jsx}": ["eslint --fix", "prettier --write"],
  "*.{json,css,md}": ["prettier --write"]
}
```

### 8. Configurar Husky Pre-commit Hook

Actualizar `.husky/pre-commit`:

```bash
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

npx lint-staged
npm run lint
npm run test
```

Hacer el archivo ejecutable:

```bash
chmod +x .husky/pre-commit
```

### 9. Configurar Vitest

Crear `vitest.config.ts`:

```typescript
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'src/test/',
        '**/*.d.ts',
        '**/*.config.*',
        '**/mockData',
      ],
    },
  },
});
```

Crear `src/test/setup.ts`:

```typescript
import '@testing-library/jest-dom';
import { expect, afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';

// Limpiar después de cada test
afterEach(() => {
  cleanup();
});
```

### 10. Crear Estructura de Carpetas

```bash
mkdir -p src/{assets,components/{common,layout},routes,pages,hooks,services,store,utils,types,constants,styles,test}
```

**Nota**: La carpeta `routes/` es para las definiciones de rutas de TanStack Router.

### 11. Configurar Variables de Entorno

Crear archivos `.env`:

`.env.local`:

```env
VITE_API_URL=http://localhost:3000/api
VITE_APP_NAME=My App
VITE_ENVIRONMENT=local
```

`.env.development`:

```env
VITE_API_URL=https://dev-api.example.com
VITE_APP_NAME=My App
VITE_ENVIRONMENT=development
```

`.env.test`:

```env
VITE_API_URL=https://test-api.example.com
VITE_APP_NAME=My App
VITE_ENVIRONMENT=test
```

`.env.production`:

```env
VITE_API_URL=https://api.example.com
VITE_APP_NAME=My App
VITE_ENVIRONMENT=production
```

Crear `.env.example`:

```env
VITE_API_URL=
VITE_APP_NAME=
VITE_ENVIRONMENT=
```

### 12. Actualizar package.json con Scripts

Actualizar la sección `scripts` en `package.json`:

```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "lint": "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0",
    "lint:fix": "eslint . --ext ts,tsx --fix",
    "format": "prettier --write \"src/**/*.{ts,tsx,json,css}\"",
    "format:check": "prettier --check \"src/**/*.{ts,tsx,json,css}\"",
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest --coverage",
    "test:run": "vitest run",
    "type-check": "tsc --noEmit",
    "prepare": "husky install"
  }
}
```

### 13. Configurar TypeScript

Actualizar `tsconfig.json`:

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

Actualizar `vite.config.ts` para soportar path aliases y TanStack Router:

```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { TanStackRouterVite } from '@tanstack/router-vite-plugin';
import path from 'path';

export default defineConfig({
  plugins: [
    react(),
    TanStackRouterVite(), // Plugin para generar rutas automáticamente
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
```

### 14. Configurar Git

> **Importante**: Este proyecto frontend debe estar en su propio repositorio separado del backend.

```bash
# Si el repositorio ya existe en GitHub, clonarlo:
# git clone https://github.com/tu-org/my-app-frontend.git
# cd my-app-frontend

# O inicializar nuevo repositorio local
git init

# Configurar usuario de Git
git config user.name "rafael avella"
git config user.email "davraops@gmail.com"

# Agregar remote (reemplaza con tu URL)
git remote add origin https://github.com/tu-org/my-app-frontend.git

# Crear rama development
git checkout -b development

# Crear .gitignore si no existe
```

Asegurar que `.gitignore` incluya:

```
# Dependencies
node_modules
.pnp
.pnp.js

# Testing
coverage

# Production
dist
build

# Misc
.DS_Store
.env.local
.env.development.local
.env.test.local
.env.production.local

# Logs
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*
lerna-debug.log*

# Editor
.vscode
.idea
*.swp
*.swo
*~

# OS
Thumbs.db
```

### 15. Configurar GitHub Actions (CI/CD)

Crear estructura de workflows:

```bash
mkdir -p .github/workflows
```

#### `.github/workflows/pr-deploy.yml`

```yaml
name: PR Deploy

on:
  pull_request:
    branches:
      - development

jobs:
  checks:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - run: npm ci
      - run: npm run lint
      - run: npm run type-check
      - run: npm run test:run
      - run: npm run build

  deploy:
    needs: checks
    runs-on: ubuntu-latest
    if: github.event.pull_request.head.repo.full_name == github.repository
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - run: npm ci
      - run: npm run build
      # Agregar aquí los pasos de despliegue a tu PR environment
      # Ejemplo: Vercel, Netlify, etc.
```

#### `.github/workflows/dev-deploy.yml`

```yaml
name: Dev Deploy

on:
  push:
    branches:
      - development

jobs:
  checks:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - run: npm ci
      - run: npm run lint
      - run: npm run type-check
      - run: npm run test:run
      - run: npm run build

  deploy:
    needs: checks
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - run: npm ci
      - run: npm run build
      # Agregar aquí los pasos de despliegue a Dev environment
```

#### `.github/workflows/release.yml`

```yaml
name: Create Release

on:
  workflow_dispatch:
    inputs:
      version:
        description: 'Version (e.g., 1.0.0)'
        required: true
        type: string

jobs:
  release:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - run: npm ci
      - run: npm run lint
      - run: npm run type-check
      - run: npm run test:run
      - run: npm run build

      - name: Create Release
        uses: actions/create-release@v1
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        with:
          tag_name: v${{ github.event.inputs.version }}
          release_name: Release v${{ github.event.inputs.version }}
          draft: false
          prerelease: false
```

#### `.github/workflows/promote-test.yml`

```yaml
name: Promote to Test

on:
  workflow_dispatch:
    inputs:
      release_tag:
        description: 'Release tag to promote'
        required: true
        type: string

jobs:
  promote:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          ref: ${{ github.event.inputs.release_tag }}

      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - run: npm ci
      - run: npm run build
      # Agregar aquí los pasos de despliegue a Test environment
```

#### `.github/workflows/promote-prod.yml`

```yaml
name: Promote to Prod

on:
  workflow_dispatch:
    inputs:
      release_tag:
        description: 'Release tag to promote'
        required: true
        type: string

jobs:
  promote:
    runs-on: ubuntu-latest
    environment:
      name: production
      # Requiere aprobación manual si está configurado en GitHub
    steps:
      - uses: actions/checkout@v4
        with:
          ref: ${{ github.event.inputs.release_tag }}

      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - run: npm ci
      - run: npm run build
      # Agregar aquí los pasos de despliegue a Prod environment
```

#### `.github/workflows/rollback.yml`

```yaml
name: Rollback

on:
  workflow_dispatch:
    inputs:
      environment:
        description: 'Environment to rollback'
        required: true
        type: choice
        options:
          - test
          - production
      release_tag:
        description: 'Release tag to rollback to'
        required: true
        type: string

jobs:
  rollback:
    runs-on: ubuntu-latest
    environment:
      name: ${{ github.event.inputs.environment }}
    steps:
      - uses: actions/checkout@v4
        with:
          ref: ${{ github.event.inputs.release_tag }}

      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - run: npm ci
      - run: npm run build
      # Agregar aquí los pasos de rollback
```

### 16. Crear Archivos Base

#### `src/types/index.ts`

```typescript
// Tipos globales de la aplicación
export interface ApiResponse<T> {
  data: T;
  message?: string;
  error?: string;
}
```

#### `src/constants/index.ts`

```typescript
export const APP_NAME = import.meta.env.VITE_APP_NAME || 'My App';
export const API_URL = import.meta.env.VITE_API_URL || '';
export const ENVIRONMENT = import.meta.env.VITE_ENVIRONMENT || 'local';
```

#### `src/utils/api.ts`

```typescript
import { API_URL } from '@/constants';

export const fetchApi = async <T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> => {
  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.statusText}`);
  }

  return response.json();
};
```

#### `src/routes/__root.tsx` (Root Route de TanStack Router)

```typescript
import { createRootRoute, Outlet } from '@tanstack/react-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutos
      refetchOnWindowFocus: false,
    },
  },
});

const theme = createTheme();

export const Route = createRootRoute({
  component: () => (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Outlet />
        <ReactQueryDevtools initialIsOpen={false} />
      </ThemeProvider>
    </QueryClientProvider>
  ),
});
```

#### `src/routes/index.tsx` (Ruta Home)

```typescript
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/')({
  component: Home,
});

function Home() {
  return (
    <div>
      <h1>Home</h1>
    </div>
  );
}
```

#### `src/App.tsx` (Componente principal)

```typescript
import { RouterProvider, createRouter } from '@tanstack/react-router';
import { routeTree } from './routeTree.gen';

// Crear el router con las rutas generadas
const router = createRouter({ routeTree });

// Registrar el router para type-safety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

function App() {
  return <RouterProvider router={router} />;
}

export default App;
```

#### `src/main.tsx` (Punto de entrada)

```typescript
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

#### `src/hooks/useFormExample.tsx` (Ejemplo de TanStack Form)

```typescript
import { useForm } from '@tanstack/react-form';
import { TextField, Button, Box } from '@mui/material';

interface FormValues {
  email: string;
  password: string;
}

export function LoginForm() {
  const form = useForm<FormValues>({
    defaultValues: {
      email: '',
      password: '',
    },
    onSubmit: async ({ value }) => {
      // Lógica de submit
      console.log('Form submitted:', value);
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <form.Field
          name="email"
          validators={{
            onChange: ({ value }) =>
              !value ? 'Email es requerido' : undefined,
            onChangeAsyncDebounceMs: 500,
            onChangeAsync: async ({ value }) => {
              // Validación async opcional
              if (value.includes('test')) {
                return 'Email no puede contener "test"';
              }
            },
          }}
        >
          {(field) => (
            <TextField
              label="Email"
              type="email"
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
              onBlur={field.handleBlur}
              error={!!field.state.meta.errors.length}
              helperText={field.state.meta.errors[0]}
            />
          )}
        </form.Field>

        <form.Field
          name="password"
          validators={{
            onChange: ({ value }) =>
              value.length < 6 ? 'Password debe tener al menos 6 caracteres' : undefined,
          }}
        >
          {(field) => (
            <TextField
              label="Password"
              type="password"
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
              onBlur={field.handleBlur}
              error={!!field.state.meta.errors.length}
              helperText={field.state.meta.errors[0]}
            />
          )}
        </form.Field>

        <Button type="submit" variant="contained" disabled={form.state.isSubmitting}>
          {form.state.isSubmitting ? 'Enviando...' : 'Iniciar Sesión'}
        </Button>
      </Box>
    </form>
  );
}
```

### 17. Generar Rutas de TanStack Router

TanStack Router genera automáticamente las rutas basándose en la estructura de archivos en `src/routes/`. Después de crear tus rutas, ejecuta:

```bash
# El plugin de Vite generará automáticamente routeTree.gen.ts
# Solo necesitas ejecutar el dev server o build
npm run dev
```

O si prefieres generar las rutas manualmente antes:

```bash
# Agregar script para generar rutas (opcional)
# En package.json agregar: "generate:routes": "tsr generate"
npm install -D @tanstack/router-cli
```

### 18. Verificar Instalación

```bash
# Verificar que todo funciona
npm run lint
npm run type-check
npm run test:run
npm run build
```

### 19. Primer Commit

```bash
# Agregar todos los archivos
git add .

# Hacer commit inicial
git commit -m "Initial setup: frontend project configuration"

# Push a repositorio remoto (si ya existe)
# git push -u origin development
```

## ✅ Checklist Final

- [ ] Proyecto inicializado con Vite + React
- [ ] Todas las dependencias instaladas (TanStack Router, Query, Form)
- [ ] ESLint y Prettier configurados
- [ ] Husky y lint-staged configurados
- [ ] Vitest configurado con setup
- [ ] Estructura de carpetas creada (incluyendo routes/)
- [ ] Variables de entorno configuradas
- [ ] Scripts en package.json actualizados
- [ ] TypeScript configurado con path aliases
- [ ] Vite configurado con TanStack Router plugin
- [ ] Rutas base creadas (\_\_root.tsx, index.tsx)
- [ ] App.tsx configurado con RouterProvider
- [ ] Git inicializado con rama development
- [ ] GitHub Actions workflows creados
- [ ] Archivos base creados
- [ ] Tests pasan correctamente
- [ ] Build funciona sin errores
- [ ] routeTree.gen.ts generado correctamente

## 📝 Notas Adicionales

### TanStack Router

1. **Rutas Type-Safe**: TanStack Router proporciona type-safety completo en las rutas, parámetros y búsquedas
2. **Generación Automática**: El plugin de Vite genera automáticamente `routeTree.gen.ts` basándose en la estructura de archivos
3. **Estructura de Rutas**: Las rutas se definen en `src/routes/` usando `createFileRoute`
4. **Navegación**: Usa `<Link>` y `useNavigate()` de `@tanstack/react-router` para navegación type-safe

### TanStack Form

1. **Type-Safe**: Formularios completamente tipados con TypeScript
2. **Validación**: Soporta validación síncrona y asíncrona con debounce
3. **Performance**: Optimizado para rendimiento con re-renders mínimos
4. **Flexible**: Funciona con cualquier librería de UI (MUI, Tailwind, etc.)

### TanStack Query

1. **DevTools**: Incluye React Query DevTools para debugging
2. **Configuración**: Ajusta `staleTime` y otras opciones según tus necesidades
3. **Cache**: Gestión automática de cache y sincronización

### Otras Consideraciones

1. **Variables de Entorno**: No olvides configurar las variables de entorno reales en tu plataforma de despliegue (Vercel, Netlify, etc.)

2. **GitHub Secrets**: Si necesitas secrets para los workflows, configúralos en Settings > Secrets and variables > Actions

3. **Cobertura de Tests**: El objetivo es >80% en rutas críticas, pero prioriza tests significativos

4. **Commits**: Usa mensajes claros y descriptivos (50-72 caracteres)

5. **Branches**: Usa prefijos como `feature/`, `fix/`, `hotfix/` para las ramas

6. **Code Review**: Requerido antes de merge a `development`

## 🎉 ¡Listo!

Tu entorno de frontend está configurado y listo para comenzar a desarrollar. Recuerda ejecutar `npm run lint` y `npm run test` antes de cada commit.
