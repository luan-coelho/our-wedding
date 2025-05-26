# System Patterns - Arquitetura e Padrões

## Arquitetura Geral
O projeto segue uma arquitetura **Full-Stack Next.js** com App Router, combinando frontend e backend em uma aplicação monolítica bem estruturada.

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   API Routes    │    │   Database      │
│   (React/Next)  │◄──►│   (Next.js)     │◄──►│   (PostgreSQL)  │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## Estrutura de Diretórios

### App Router Structure
```
src/app/
├── (features)/          # Páginas públicas agrupadas
│   ├── page.tsx         # Homepage
│   ├── confirmacao/     # RSVP com token
│   ├── localizacao/     # Mapas e endereços
│   ├── mensagens/       # Mensagens para noivos
│   └── presentes/       # Lista de presentes
├── admin/               # Área administrativa protegida
│   ├── convidados/      # Gestão de convidados
│   ├── presentes/       # Gestão de presentes
│   ├── chaves-pix/      # Gestão de Chaves PIX
│   └── usuarios/        # Gestão de usuários
├── api/                 # API Routes
│   ├── auth/            # NextAuth endpoints
│   ├── guests/          # CRUD convidados
│   ├── gifts/           # CRUD presentes
│   ├── messages/        # CRUD mensagens
│   └── pixkeys/         # CRUD chaves PIX
└── auth/                # Páginas de autenticação
```

### Componentes e Utilitários
```
src/
├── components/          # Componentes reutilizáveis
│   ├── ui/             # Componentes base (Shadcn)
│   └── roles/          # Componentes específicos
├── lib/                # Utilitários e configurações
├── hooks/              # Custom hooks
├── types/              # Definições TypeScript
├── db/                 # Schema e configuração DB
└── data/               # Dados estáticos
```

## Padrões de Design

### 1. Component Patterns
- **Atomic Design**: Componentes organizados por complexidade
- **Compound Components**: Para componentes complexos como formulários
- **Render Props**: Para lógica reutilizável
- **Custom Hooks**: Para estado e efeitos compartilhados

### 2. Data Fetching Patterns
- **TanStack Query**: Para cache e sincronização de dados
- **Server Components**: Para dados estáticos
- **Client Components**: Para interatividade
- **API Routes**: Para operações CRUD

### 3. Authentication Patterns
- **NextAuth v5**: Sistema de autenticação
- **Role-based Access**: Admin vs. convidados
- **Token-based RSVP**: Links únicos para convidados
- **Middleware Protection**: Rotas protegidas

## Database Schema Patterns

### Entidades Principais
```typescript
// Usuários administrativos
users: {
  id, email, password, name, role, createdAt, updatedAt
}

// Convidados com tokens únicos
guests: {
  id, name, email, phone, token, confirmed, createdAt, updatedAt
}

// Presentes com status
gifts: {
  id, name, description, price, pixKey, purchased, createdAt, updatedAt
}

// Mensagens dos convidados
messages: {
  id, name, message, approved, createdAt, updatedAt
}

// Chaves PIX para presentes
pixKeys: {
  id, key, type, description, active, createdAt, updatedAt
}
```

### Relacionamentos
- **One-to-Many**: User → Gifts (criador)
- **One-to-Many**: PixKey → Gifts (pagamento)
- **Independent**: Guests, Messages

## State Management Patterns

### 1. Server State (TanStack Query)
```typescript
// Queries para leitura
useQuery(['guests'], fetchGuests)
useQuery(['gifts'], fetchGifts)

// Mutations para escrita
useMutation(createGuest, {
  onSuccess: () => queryClient.invalidateQueries(['guests'])
})
```

### 2. Client State (React State)
```typescript
// Estado local para formulários
const [formData, setFormData] = useState(initialState)

// Estado global via Context (quando necessário)
const { user, isAuthenticated } = useAuth()
```

## Security Patterns

### 1. Authentication
- **NextAuth Sessions**: Gerenciamento de sessões
- **Bcrypt Hashing**: Senhas criptografadas
- **CSRF Protection**: Tokens CSRF automáticos

### 2. Authorization
```typescript
// Middleware para rotas protegidas
export function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith('/admin')) {
    // Verificar autenticação
  }
}

// API Routes com verificação
export async function POST(request: Request) {
  const session = await getServerSession()
  if (!session) return NextResponse.json({}, { status: 401 })
}
```

### 3. Data Validation
```typescript
// Zod schemas para validação
const guestSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional()
})

// Validação em API routes
const validatedData = guestSchema.parse(requestData)
```

## Performance Patterns

### 1. Next.js Optimizations
- **Image Optimization**: Next/Image com lazy loading
- **Code Splitting**: Componentes dinâmicos
- **Static Generation**: Páginas estáticas quando possível
- **Edge Runtime**: Para APIs simples

### 2. Database Optimizations
- **Connection Pooling**: Drizzle com pool de conexões
- **Prepared Statements**: Queries otimizadas
- **Indexes**: Em campos de busca frequente

### 3. Caching Strategies
- **TanStack Query**: Cache de dados no cliente
- **Next.js Cache**: Cache de páginas e API routes
- **Database Cache**: Queries frequentes

## Error Handling Patterns

### 1. API Error Handling
```typescript
try {
  const result = await db.query()
  return NextResponse.json(result)
} catch (error) {
  console.error('Database error:', error)
  return NextResponse.json(
    { error: 'Internal server error' },
    { status: 500 }
  )
}
```

### 2. Client Error Handling
```typescript
// TanStack Query error handling
const { data, error, isError } = useQuery(['data'], fetchData, {
  retry: 3,
  onError: (error) => toast.error(error.message)
})

// Form error handling
const { errors } = useForm({
  resolver: zodResolver(schema)
})
```

## Deployment Patterns

### Docker Configuration
- **Multi-stage Build**: Otimização de imagem
- **Environment Variables**: Configuração flexível
- **Health Checks**: Monitoramento de saúde
- **Volume Mounts**: Persistência de dados 