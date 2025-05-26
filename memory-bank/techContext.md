# Tech Context - Tecnologias e Configurações

## Stack Tecnológico

### Frontend
- **Next.js 15.3.1**: Framework React com App Router
- **React 19.1.0**: Biblioteca para interfaces de usuário
- **TypeScript 5.8.3**: Tipagem estática
- **TailwindCSS 4.1.5**: Framework CSS utilitário
- **Shadcn/UI**: Componentes base com Radix UI

### Backend
- **Next.js API Routes**: Endpoints RESTful
- **NextAuth 5.0.0-beta.27**: Sistema de autenticação
- **Drizzle ORM 0.43.1**: ORM para PostgreSQL
- **PostgreSQL**: Banco de dados relacional

### State Management & Data Fetching
- **TanStack Query 5.75.4**: Cache e sincronização de dados
- **React Hook Form 7.56.2**: Gerenciamento de formulários
- **Zod 3.24.4**: Validação de schemas

### UI & Styling
- **Lucide React**: Ícones principais
- **Tabler Icons**: Ícones complementares
- **React Icons**: Ícones diversos
- **Class Variance Authority**: Variantes de componentes
- **Tailwind Merge**: Merge de classes CSS

### Utilities & Tools
- **Date-fns 3.6.0**: Manipulação de datas
- **Bcryptjs 2.4.3**: Criptografia de senhas
- **UUID 11.1.0**: Geração de identificadores únicos
- **Sonner 2.0.3**: Sistema de notificações

## Configurações de Desenvolvimento

### Package Manager
- **PNPM**: Gerenciador de pacotes principal
- **NPM**: Fallback (package-lock.json presente)

### Scripts Disponíveis
```json
{
  "dev": "next dev --turbopack",      // Desenvolvimento com Turbopack
  "build": "next build",              // Build de produção
  "start": "next start",              // Servidor de produção
  "lint": "next lint",                // Linting
  "fix": "prettier --write . && eslint --fix .",  // Auto-fix
  "db:generate": "drizzle-kit generate",  // Gerar migrações
  "db:migrate": "tsx src/db/migrate.ts", // Executar migrações
  "db:studio": "drizzle-kit studio",     // Interface visual do DB
  "db:push": "drizzle-kit push"          // Push schema para DB
}
```

### Configurações de Build
- **ESLint**: Linting com configuração Next.js
- **Prettier**: Formatação de código
- **TypeScript**: Configuração strict
- **PostCSS**: Processamento CSS com TailwindCSS

## Configurações de Banco de Dados

### Drizzle Configuration
```typescript
// drizzle.config.ts
export default {
  schema: "./src/db/schema/*",
  out: "./drizzle",
  driver: "pg",
  dbCredentials: {
    connectionString: process.env.DATABASE_URL
  }
}
```

### Schema Structure
```
src/db/schema/
├── index.ts          # Exportações centralizadas
├── users.ts          # Usuários administrativos
├── guests.ts         # Convidados com tokens
├── gifts.ts          # Lista de presentes
├── messages.ts       # Mensagens dos convidados
└── pix-keys.ts       # Chaves PIX para pagamentos
```

## Autenticação e Segurança

### NextAuth Configuration
- **Provider**: Credentials (email/senha)
- **Adapter**: Drizzle Adapter para PostgreSQL
- **Session Strategy**: JWT
- **Pages**: Login customizado em `/auth/login`

### Environment Variables
```bash
# Database
DATABASE_URL="postgresql://user:pass@localhost:5432/db"

# Authentication
AUTH_SECRET="random-secret-key"
AUTH_URL="http://localhost:3000"

# Admin Credentials
ADMIN_EMAIL="admin@example.com"
ADMIN_PASSWORD="Admin123!"
```

## Estrutura de Componentes

### Shadcn/UI Components
```
src/components/ui/
├── button.tsx        # Botões com variantes
├── input.tsx         # Campos de entrada
├── label.tsx         # Labels de formulário
├── dialog.tsx        # Modais e diálogos
├── dropdown-menu.tsx # Menus dropdown
├── select.tsx        # Seletores
├── checkbox.tsx      # Checkboxes
├── radio-group.tsx   # Radio buttons
├── tabs.tsx          # Navegação em abas
├── tooltip.tsx       # Tooltips
├── avatar.tsx        # Avatares de usuário
├── separator.tsx     # Separadores visuais
└── alert-dialog.tsx  # Diálogos de confirmação
```

### Custom Components
```
src/components/
├── countdown-timer.tsx    # Timer para o casamento
├── navigation.tsx         # Navegação principal
├── footer.tsx            # Rodapé do site
└── roles/                # Componentes específicos
    ├── admin/            # Componentes administrativos
    └── guest/            # Componentes para convidados
```

## Configurações de Styling

### TailwindCSS Custom Classes
```css
/* globals.css */
.wedding-container { /* Container responsivo */ }
.wedding-button { /* Botão principal */ }
.wedding-card { /* Cards de conteúdo */ }
.wedding-info-box { /* Boxes informativos */ }
```

### Color Palette
```javascript
// Cores personalizadas do casamento
colors: {
  'wedding-primary': '#...',    // Cor principal
  'wedding-secondary': '#...',  // Cor secundária
  'wedding-accent': '#...',     // Cor de destaque
  'wedding-light': '#...',      // Cor clara
  'wedding-dark': '#...'        // Cor escura
}
```

## Performance e Otimizações

### Next.js Features
- **App Router**: Roteamento moderno
- **Server Components**: Renderização no servidor
- **Image Optimization**: Otimização automática de imagens
- **Code Splitting**: Divisão automática de código
- **Turbopack**: Bundler rápido para desenvolvimento

### Database Optimizations
- **Connection Pooling**: Pool de conexões PostgreSQL
- **Prepared Statements**: Queries otimizadas
- **Indexes**: Campos de busca indexados

### Environment Setup
- **Development**: `.env` local
- **Production**: `.env.production`
- **Docker**: Variáveis via docker-compose

### Health Checks
- **Database**: Verificação de conectividade
- **Application**: Endpoint de health check
- **Dependencies**: Verificação de serviços externos

## Constraints e Limitações

### Technical Constraints
- **Node.js 22**: Versão mínima requerida
- **PostgreSQL**: Banco de dados obrigatório
- **Memory**: Mínimo 512MB RAM para desenvolvimento

### Development Constraints
- **TypeScript Strict**: Tipagem obrigatória
- **ESLint Rules**: Regras de código obrigatórias
- **Prettier**: Formatação automática
- **Git Hooks**: Pre-commit hooks (se configurados)

### Production Constraints
- **HTTPS**: Obrigatório para NextAuth
- **Environment Variables**: Configuração segura
- **Database Backups**: Backup regular obrigatório
- **Monitoring**: Logs e métricas de performance 