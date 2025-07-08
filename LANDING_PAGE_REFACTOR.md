# Refatoração para Landing Page

## Resumo das Mudanças

A aplicação foi refatorada de múltiplas páginas para uma **única landing page** integrada, oferecendo uma experiência mais fluida e moderna para os convidados do casamento.

## Estrutura Anterior vs Nova

### Antes

- `/` - Página inicial
- `/confirmacao/[token]` - Confirmação de presença
- `/localizacao` - Informações do local
- `/mensagens` - Mensagens para os noivos
- `/presentes` - Lista de presentes

### Agora

- `/` - **Landing page única** com todas as seções
- Navegação por **scroll suave** entre seções
- **Navbar fixa** com navegação por âncoras

## Seções da Landing Page

### 1. **Hero** (`#hero`)

- Nomes dos noivos com design romântico
- Data do casamento em destaque
- Animações de elementos flutuantes
- Call-to-action para scroll

### 2. **Contagem Regressiva** (`#countdown`)

- Timer dinâmico até a data do casamento
- Design elegante com efeitos visuais

### 3. **O Casal** (`#couple`)

- História romântica dos noivos
- Cards individuais com características
- Seção "Nossa História" com timeline

### 4. **Cerimônia** (`#ceremony`)

- Informações de data, horário e local
- Mapa integrado do Google Maps
- Botões para copiar endereço e direções
- Observações importantes

### 5. **Lista de Presentes** (`#gifts`)

- Grid de presentes com imagens
- Integração PIX com QR codes
- Sistema de cópia de chave PIX
- Seção de agradecimento

### 6. **Confirmação de Presença** (`#confirmation`)

- Formulário de inserção de token
- Interface para confirmar múltiplas pessoas
- Sistema de status para cada convidado
- Suporte a URL com token (ex: `/?token=ABC123#confirmation`)

### 7. **Footer**

- Informações resumidas do casamento
- Citação romântica
- Copyright e créditos

## Navegação

### Navbar Responsiva

- **Desktop**: Menu horizontal com ícones
- **Mobile**: Menu hambúrguer expansível
- **Scroll suave** para cada seção
- **Indicador de seção ativa**
- **Efeito glass** quando em scroll

### Links Diretos

- Páginas antigas redirecionam automaticamente:
  - `/localizacao` → `/#ceremony`
  - `/presentes` → `/#gifts`
  - `/mensagens` → `/` (removida da landing)
  - `/confirmacao/[token]` → `/?token=[token]#confirmation`

## Funcionalidades Preservadas

✅ **Confirmação por token** - Funciona via URL params  
✅ **Lista de presentes** - Com PIX e QR codes  
✅ **Mapa de localização** - Google Maps integrado  
✅ **Sistema administrativo** - Inalterado  
✅ **APIs existentes** - Todas funcionando  
✅ **Responsividade** - Mobile-first

## Melhorias Visuais

### Animações Customizadas

- **Float**: Elementos flutuantes suaves
- **Fade-in**: Entradas elegantes
- **Hover effects**: Interações refinadas
- **Scroll smooth**: Navegação fluida

### Design System

- **Paleta wedding**: Cores românticas consistentes
- **Tipografia serif**: Elegância nos títulos
- **Glass effects**: Modernidade sutil
- **Gradientes**: Transições suaves

### Responsividade

- **Mobile-first**: Otimizado para dispositivos móveis
- **Breakpoints consistentes**: sm, md, lg, xl
- **Grid flexível**: Adaptação automática
- **Touch-friendly**: Botões e links adequados

## Como Usar

### Para Convidados

1. **Acesse** a URL principal
2. **Navegue** usando o menu ou scroll
3. **Confirme presença** com o token recebido
4. **Veja presentes** e faça PIX se desejar
5. **Consulte localização** e rotas

### Para Administradores

- Sistema admin continua em `/admin`
- Todas as funcionalidades preservadas
- URLs antigas redirecionam automaticamente

## Tecnologias

- **Next.js 15** com App Router
- **TypeScript** para type safety
- **Tailwind CSS** para estilização
- **Lucide React** para ícones
- **Sonner** para notificações
- **React Query** para estado
- **Framer Motion** conceitos via CSS

## Estrutura de Arquivos

```
src/
├── components/sections/          # Seções da landing page
│   ├── navbar.tsx               # Navegação principal
│   ├── hero.tsx                 # Seção inicial
│   ├── countdown.tsx            # Contagem regressiva
│   ├── couple.tsx               # História do casal
│   ├── ceremony.tsx             # Informações da cerimônia
│   ├── gifts.tsx                # Lista de presentes
│   ├── confirmation.tsx         # Confirmação de presença
│   └── footer.tsx               # Rodapé
├── app/(features)/
│   ├── page.tsx                 # Landing page principal
│   ├── layout.tsx               # Layout simplificado
│   ├── localizacao/page.tsx     # Redirect para #ceremony
│   ├── presentes/page.tsx       # Redirect para #gifts
│   ├── mensagens/page.tsx       # Redirect para /
│   └── confirmacao/[token]/page.tsx # Redirect com token
└── globals.css                  # Animações e estilos
```

## Performance

- **Componentes lazy**: Carregamento otimizado
- **Imagens otimizadas**: Next.js Image
- **CSS mínimo**: Tailwind purge
- **Bundle splitting**: Automático
- **Prefetch**: Links internos
