# Active Context - Estado Atual do Projeto

## Foco Atual
**Inicialização do Memory Bank** - Documentando completamente o projeto existente para estabelecer uma base sólida de conhecimento para futuras iterações.

## Estado Atual do Projeto

### Funcionalidades Implementadas ✅
1. **Estrutura Base**
   - Next.js 15 com App Router configurado
   - TailwindCSS 4 com tema personalizado
   - Shadcn/UI components integrados
   - TypeScript configurado

2. **Autenticação**
   - NextAuth 5.0 configurado
   - Sistema de login para administradores
   - Middleware de proteção de rotas

3. **Database Schema**
   - Drizzle ORM configurado
   - Schema completo para todas as entidades
   - Migrações configuradas

4. **Páginas Públicas**
   - Homepage com countdown timer
   - Layout responsivo implementado
   - Navegação entre seções

5. **Área Administrativa**
   - Estrutura de rotas protegidas
   - Layout administrativo

### Funcionalidades em Desenvolvimento 🚧
- Implementação completa das páginas de funcionalidades
- Sistema de confirmação via token
- CRUD completo para todas as entidades
- Upload e gerenciamento de fotos
- Sistema de notificações

### Próximas Prioridades 📋
1. **Confirmação de Presença**
   - Implementar página `/confirmacao/[token]`
   - API para processar confirmações
   - Geração de tokens únicos para convidados

2. **Lista de Presentes**
   - Página de exibição de presentes
   - Integração com chaves PIX
   - Sistema de "marcar como comprado"

4. **Área Administrativa**
   - Dashboard com estatísticas
   - CRUD de convidados
   - CRUD de presentes
   - Moderação de conteúdo

## Decisões Técnicas Recentes

### Arquitetura
- **App Router**: Escolhido para aproveitar as funcionalidades mais recentes do Next.js
- **Server Components**: Utilizados para páginas estáticas e dados iniciais
- **Client Components**: Para interatividade e formulários

### Estado e Data Fetching
- **TanStack Query**: Para gerenciamento de estado do servidor
- **React Hook Form + Zod**: Para formulários e validação
- **NextAuth Sessions**: Para gerenciamento de autenticação

### Styling
- **TailwindCSS 4**: Para styling utilitário
- **Custom CSS Classes**: Para componentes específicos do casamento
- **Shadcn/UI**: Para componentes base consistentes

## Considerações Ativas

### Performance
- Otimização de imagens com Next/Image
- Cache estratégico com TanStack Query

### Segurança
- Validação de dados em todas as APIs
- Proteção de rotas administrativas
- Sanitização de uploads de imagem

### UX/UI
- Design responsivo para mobile-first
- Acessibilidade com ARIA labels
- Loading states para melhor feedback

## Próximos Passos Imediatos

### 1. Implementar Sistema de Tokens (Alta Prioridade)
```typescript
// Gerar tokens únicos para convidados
const generateGuestToken = () => uuid()

// Página de confirmação
/confirmacao/[token] -> verificar token e permitir RSVP
```

### 2. Completar APIs CRUD (Alta Prioridade)
- `/api/guests` - Gerenciamento de convidados
- `/api/gifts` - Gerenciamento de presentes
- `/api/messages` - Mensagens dos convidados

### 3. Dashboard Administrativo (Média Prioridade)
- Estatísticas de confirmações
- Lista de convidados com status
- Moderação de conteúdo

### 4. Funcionalidades Avançadas (Baixa Prioridade)
- Notificações por email
- Exportação de dados
- Backup automático

## Bloqueadores e Dependências

### Bloqueadores Atuais
- Nenhum bloqueador crítico identificado

### Dependências Externas
- **PostgreSQL**: Banco de dados deve estar configurado
- **Environment Variables**: Configuração completa necessária
- **Imagens**: Assets do casal e local do casamento

### Dependências Internas
- Schema do banco deve estar finalizado antes das APIs
- Autenticação deve estar funcionando antes das áreas protegidas
- Componentes UI base antes das páginas específicas

## Métricas e Objetivos

### Objetivos de Performance
- **First Contentful Paint**: < 1.5s
- **Largest Contentful Paint**: < 2.5s
- **Cumulative Layout Shift**: < 0.1

### Objetivos de Funcionalidade
- **Taxa de Confirmação**: > 80% dos convidados
- **Tempo de Carregamento**: < 3s em 3G
- **Compatibilidade**: Suporte a navegadores modernos

### Objetivos de Qualidade
- **TypeScript Coverage**: 100%
- **Test Coverage**: > 80% (quando implementado)
- **Accessibility Score**: > 95%

## Notas de Desenvolvimento

### Convenções Estabelecidas
- **Naming**: kebab-case para arquivos, camelCase para variáveis
- **Components**: PascalCase com sufixos descritivos
- **API Routes**: RESTful com verbos HTTP apropriados
- **Database**: snake_case para colunas, camelCase no código

### Padrões de Código
- Early returns para melhor legibilidade
- Custom hooks para lógica reutilizável
- Zod schemas em arquivos separados
- Error boundaries para componentes críticos

### Ferramentas de Desenvolvimento
- **Drizzle Studio**: Para visualização do banco
- **Next.js DevTools**: Para debugging
- **TanStack Query DevTools**: Para estado do servidor
- **Prettier + ESLint**: Para consistência de código 