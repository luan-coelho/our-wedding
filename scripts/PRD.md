# PRD - Site de Casamento Luan & Ester

## Overview

O site de casamento é uma plataforma digital completa que centraliza todas as informações e interações relacionadas ao casamento de Luan & Ester. A solução substitui métodos tradicionais como convites físicos, listas de presentes em lojas físicas e comunicação fragmentada, oferecendo uma experiência moderna, elegante e funcional tanto para os convidados quanto para os noivos.

O produto resolve problemas críticos de gestão de eventos, proporcionando controle total sobre confirmações de presença, lista de presentes digital com PIX, comunicação centralizada e administração eficiente através de um painel administrativo completo.

## Core Features

### 1. Sistema de Convites Personalizados

- **O que faz**: Gera links únicos para cada convidado acessar o site
- **Por que é importante**: Elimina convites físicos e permite rastreamento individual de confirmações
- **Como funciona**: Cada convidado recebe um token único que identifica sua sessão e permite confirmação personalizada

### 2. Confirmação de Presença (RSVP)

- **O que faz**: Sistema simples de confirmação de presença via link personalizado
- **Por que é importante**: Facilita o controle de confirmações e planejamento do evento
- **Como funciona**: Interface intuitiva onde o convidado confirma presença em poucos cliques

### 3. Lista de Presentes Digital com PIX

- **O que faz**: Apresenta sugestões de presentes com opção de contribuição via PIX
- **Por que é importante**: Moderniza o processo de presentes e facilita contribuições
- **Como funciona**: Lista visual de presentes com valores sugeridos e chaves PIX para pagamento

### 4. Galeria de Fotos

- **O que faz**: Exibe fotos do casal e permite upload de fotos pelos convidados
- **Por que é importante**: Cria engajamento e memórias compartilhadas
- **Como funciona**: Galeria responsiva com moderação de conteúdo pelos administradores

### 5. Sistema de Mensagens

- **O que faz**: Permite que convidados deixem mensagens para os noivos
- **Por que é importante**: Cria conexão emocional e registro de felicitações
- **Como funciona**: Formulário simples com moderação antes da publicação

### 6. Informações do Evento

- **O que faz**: Centraliza data, horário, localização e detalhes do casamento
- **Por que é importante**: Garante que todos tenham acesso às informações corretas
- **Como funciona**: Páginas dedicadas com mapas, endereços e instruções

### 7. Painel Administrativo

- **O que faz**: Interface completa para gestão de convidados, presentes e conteúdo
- **Por que é importante**: Permite controle total do evento pelos noivos e colaboradores
- **Como funciona**: Dashboard com estatísticas, CRUD de convidados, moderação de conteúdo

## User Experience

### User Personas

#### Convidado Típico

- **Perfil**: Familiar ou amigo do casal, idade variada, diferentes níveis de familiaridade com tecnologia
- **Objetivos**: Confirmar presença facilmente, ver informações do evento, contribuir com presente
- **Necessidades**: Interface simples, informações claras, processo rápido

#### Administrador (Noivos)

- **Perfil**: Luan & Ester, organizadores do evento
- **Objetivos**: Controlar todos os aspectos do site, acompanhar confirmações, gerenciar conteúdo
- **Necessidades**: Dashboard completo, relatórios, controle total

#### Colaborador Administrativo

- **Perfil**: Familiares ou amigos ajudando na organização
- **Objetivos**: Auxiliar na gestão de convidados e moderação de conteúdo
- **Necessidades**: Acesso limitado às funcionalidades administrativas

### Key User Flows

#### Fluxo do Convidado

1. Recebe link personalizado via WhatsApp/Email
2. Acessa página inicial com foto do casal e countdown
3. Navega pelas seções (localização, presentes, galeria)
4. Confirma presença via formulário simples
5. Opcionalmente deixa mensagem ou contribui com presente
6. Pode retornar ao site para atualizações

#### Fluxo do Administrador

1. Acessa área de login
2. Visualiza dashboard com estatísticas de confirmações
3. Gerencia lista de convidados (adicionar, editar, remover)
4. Atualiza lista de presentes e chaves PIX
5. Modera mensagens e fotos enviadas
6. Acompanha métricas em tempo real

### UI/UX Considerations

- **Design Elegante**: Interface que transmite a alegria e sofisticação do evento
- **Responsividade**: Funciona perfeitamente em mobile, tablet e desktop
- **Acessibilidade**: Navegação clara para usuários de todas as idades
- **Performance**: Carregamento rápido mesmo com muitas imagens
- **Intuitividade**: Navegação sem necessidade de tutoriais

## Technical Architecture

### System Components

- **Frontend**: Next.js 15 com React 19, TypeScript, TailwindCSS
- **Backend**: API Routes do Next.js com autenticação NextAuth
- **Database**: PostgreSQL com Drizzle ORM
- **Storage**: Cloudinary para imagens ou similar
- **Deployment**: Vercel ou similar

### APIs and Integrations

- **Authentication**: NextAuth.js para login administrativo
- **Maps**: Google Maps para localização

### Infrastructure Requirements

- **Hosting**: Vercel (recomendado para Next.js)
- **Database**: PostgreSQL (Supabase ou Neon)
- **CDN**: Para otimização de imagens
- **SSL**: Certificado para segurança
- **Domain**: Domínio personalizado

## Development Roadmap

### Fase 1: MVP Core (Foundation)

**Objetivo**: Site funcional básico com confirmação de presença

**Features**:

- Página inicial com informações básicas do casamento
- Sistema de confirmação via token único
- Página de localização com mapa
- Estrutura básica do banco de dados
- Deploy inicial

**Entregáveis**:

- Site responsivo funcionando
- Sistema de tokens para convidados
- Confirmação de presença operacional
- Informações básicas do evento

### Fase 2: Lista de Presentes e PIX

**Objetivo**: Monetização e engajamento através de presentes

**Features**:

- CRUD completo de presentes no admin
- CRUD completo de chaves PIX no admin
- CRUD completo de usuários administrativos no admin
- Página de presentes para convidados

**Entregáveis**:

- Lista de presentes funcional
- Sistema PIX operacional
- Painel admin para presentes

### Fase 3: Interação e Conteúdo

**Objetivo**: Engajamento através de mensagens e galeria

**Features**:

- Sistema de mensagens dos convidados
- Galeria de fotos do casal
- Upload de fotos pelos convidados
- Sistema de moderação de conteúdo
- Notificações para administradores

**Entregáveis**:

- Sistema de mensagens completo
- Galeria funcional com upload
- Moderação de conteúdo operacional

### Fase 4: Administração Avançada

**Objetivo**: Ferramentas completas de gestão

**Features**:

- Dashboard com estatísticas detalhadas
- Gestão completa de convidados
- Sistema de usuários administrativos
- Relatórios e exportação de dados
- Notificações por email

**Entregáveis**:

- Dashboard administrativo completo
- Sistema de relatórios
- Gestão de usuários

### Fase 5: Otimizações e Melhorias

**Objetivo**: Performance e experiência aprimorada

**Features**:

- Otimização de performance
- SEO e meta tags
- Analytics e métricas
- Backup automático
- Melhorias de UX baseadas em feedback

**Entregáveis**:

- Site otimizado
- Analytics implementado
- Sistema de backup

## Logical Dependency Chain

### Ordem de Desenvolvimento

1. **Infraestrutura Base** (Primeiro)

   - Setup do projeto Next.js
   - Configuração do banco de dados
   - Sistema de autenticação básico
   - Deploy pipeline

2. **Core do Produto** (Segundo)

   - Modelo de dados Guest
   - Sistema de tokens únicos
   - Páginas públicas básicas
   - Confirmação de presença

3. **Interface Pública** (Terceiro)

   - Design system e componentes
   - Página inicial elegante
   - Página de localização
   - Responsividade

4. **Funcionalidades de Engajamento** (Quarto)

   - Sistema de presentes
   - Crud de Chaves PIX
   - Sistema de mensagens

5. **Administração** (Quinto)
   - Painel administrativo
   - CRUD de convidados
   - Moderação de conteúdo
   - Relatórios

### Pacing e Scope

- **Cada fase deve ser completamente funcional** antes de avançar
- **MVP deve estar utilizável** após Fase 1
- **Cada feature deve ser atômica** mas extensível
- **Testes devem acompanhar** cada implementação

## Risks and Mitigations

### Technical Challenges

**Risco**: Complexidade do sistema de tokens únicos
**Mitigação**: Usar UUIDs simples e validação robusta

**Risco**: Performance com muitas imagens
**Mitigação**: Implementar CDN e otimização de imagens desde o início

**Risco**: Segurança dos dados dos convidados
**Mitigação**: Implementar HTTPS, validação de entrada e sanitização

### MVP Scope

**Risco**: Over-engineering do MVP
**Mitigação**: Focar apenas em confirmação de presença e informações básicas

**Risco**: Subestimar complexidade do sistema PIX
**Mitigação**: Começar com chaves estáticas simples, evoluir depois

### Resource Constraints

**Risco**: Tempo limitado para desenvolvimento
**Mitigação**: Priorizar MVP funcional, adicionar features incrementalmente

**Risco**: Custos de infraestrutura
**Mitigação**: Usar tier gratuito inicial, escalar conforme necessário

## Appendix

### Technical Specifications

- **Node.js**: 22+
- **React**: 19
- **Next.js**: 15
- **TypeScript**: 5
- **Database**: PostgreSQL
- **ORM**: Drizzle
- **Styling**: TailwindCSS 4
- **UI Components**: Shadcn/ui
- **Authentication**: NextAuth.js
- **Deployment**: Vercel

### Research Findings

- **Usuários preferem** interfaces simples e diretas
- **Mobile-first** é essencial (70%+ dos acessos esperados via mobile)
