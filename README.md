# Site de Casamento - Ester & Luan

Este é um site para casamento desenvolvido com Next.js, React, TailwindCSS, Drizzle ORM e PostgreSQL. O site inclui várias páginas essenciais para um site de casamento, como: página inicial, confirmação de presença, lista de presentes, localização, galeria de fotos, mensagens para os noivos e a história do casal.

## Tecnologias Utilizadas

- **Next.js**: Framework React com renderização do lado do servidor
- **React**: Biblioteca JavaScript para construir interfaces de usuário
- **TailwindCSS**: Framework CSS utilitário
- **Drizzle ORM**: ORM (Object-Relational Mapping) para banco de dados
- **PostgreSQL**: Banco de dados relacional
- **NextAuth**: Sistema de autenticação para Next.js

## Funcionalidades

- **Página Inicial**: Informações do casamento (data, horário, local) e contagem regressiva
- **Confirmação de Presença (RSVP)**: Formulário para confirmação de presença
- **Lista de Presentes**: Lista de presentes sugeridos com opção de PIX
- **Localização**: Mapa com local da cerimônia e recepção
- **Galeria de Fotos**: Exibição de fotos em grid com visualização detalhada
- **Mensagens para os Noivos**: Formulário para envio de mensagens
- **História do Casal**: Timeline com a história de amor do casal
- **Área de Administração**: Gerenciamento de presentes, mensagens e fotos (protegido por autenticação)
- **Funcionalidade de Convite com Link**: Permite enviar um link único para cada convidado, que pode ser usado para confirmar presença no casamento sem necessidade de login ou cadastro

## Pré-requisitos

- Node.js (versão 18 ou superior)
- PostgreSQL

## Configuração

1. Clone o repositório:

```bash
git clone https://github.com/seu-usuario/our-wedding.git
cd our-wedding
```

2. Instale as dependências:

```bash
npm install
```

3. Configure o banco de dados:

   - Crie um banco de dados PostgreSQL
   - Ajuste o arquivo `.env` com a URL de conexão:

   ```
   DATABASE_URL="postgresql://usuario:senha@localhost:5432/our_wedding?schema=public"
   ```

4. Configure a autenticação:

   - Defina as variáveis de ambiente para NextAuth:

   ```
   AUTH_SECRET="chave-secreta-gerada"
   ADMIN_EMAIL="admin@example.com"
   ADMIN_PASSWORD="senha-forte"
   ```

5. Execute as migrações do banco de dados:

```bash
pnpm prisma migrate dev
```

6. Crie o usuário administrador:

```bash
pnpm create-admin
```

## Execução

Para iniciar o servidor de desenvolvimento:

```bash
pnpm dev
```

O site estará disponível em: `http://localhost:3000`

## Build para Produção

Para gerar uma versão otimizada para produção:

```bash
pnpm build
```

Para iniciar o servidor em modo de produção:

```bash
pnpm start
```

## Área de Administração

A área de administração está disponível em:

- `/admin/presentes`: Gerenciamento de presentes
- `/admin/convidados`: Gerenciamento de convidados

Para acessar, use o email e senha definidos nas variáveis de ambiente `ADMIN_EMAIL` e `ADMIN_PASSWORD` ou os valores padrão:

- Email: `admin@example.com`
- Senha: `Admin123!`

## Personalização

- **Cores e Estilos**: Edite o arquivo `tailwind.config.js` para personalizar as cores
- **Informações do Casamento**: Atualize os detalhes no arquivo `src/app/page.tsx`
- **Presentes**: Edite a lista de presentes em `src/data/gifts.ts`
- **Fotos**: Adicione ou remova fotos em `src/data/photos.ts`
- **História do Casal**: Personalize a timeline em `src/app/nossa-historia/page.tsx`

## Estrutura do Projeto

- `src/app/`: Páginas da aplicação
- `src/components/`: Componentes reutilizáveis
- `src/data/`: Dados estáticos (presentes, fotos)
- `src/lib/`: Utilitários (conexão com o banco de dados, autenticação)
- `src/db/`: Esquema e migrações do banco de dados
- `public/`: Arquivos estáticos (imagens)

## Licença

Este projeto está licenciado sob a licença MIT.

## Funcionalidade de Convite com Link

### Visão Geral

A funcionalidade de convite com link permite enviar um link único para cada convidado, que pode ser usado para confirmar presença no casamento sem necessidade de login ou cadastro.

### Como Usar

1. Acesse a página administrativa de convidados em `/admin/convidados`
2. Adicione um novo convidado ou visualize a lista de convidados existentes
3. Para cada convidado, um link único é gerado automaticamente
4. Copie o link e envie para o convidado via e-mail, WhatsApp ou outro meio
5. Quando o convidado acessa o link, ele pode confirmar ou recusar o convite
6. O convidado pode mudar sua resposta a qualquer momento acessando o mesmo link

### Estrutura da Funcionalidade

- O modelo `Guest` no banco de dados foi atualizado para incluir um campo `token` único
- Uma página em `/confirmacao/[token]` permite ao convidado confirmar presença
- Uma API em `/api/guests/[token]/confirm` processa a confirmação
- A página de administração em `/admin/convidados` permite gerenciar convidados e ver o status de confirmação

## Executando com Docker

Este projeto pode ser executado com Docker e Docker Compose, o que facilita a configuração do ambiente de desenvolvimento ou produção.

### Pré-requisitos

- Docker
- Docker Compose

### Executando a aplicação

1. Clone o repositório:

   ```bash
   git clone [URL_DO_REPOSITORIO]
   cd our-wedding
   ```

2. Crie um arquivo `.env.prod` na raiz do projeto com as seguintes variáveis:

   ```
   NODE_ENV=production
   DATABASE_URL="postgresql://postgres:postgres@postgres_db:5432/postgres?schema=public"
   AUTH_URL=http://localhost:3000
   AUTH_SECRET=meusegredomuitoseguro
   ```

   Certifique-se de substituir `meusegredomuitoseguro` por uma string segura aleatória em ambiente de produção.

3. Execute a aplicação com Docker Compose:

   ```bash
   docker compose up --build -d
   ```

4. A aplicação estará disponível nos seguintes endereços:
   - Aplicação web: http://localhost:3000
   - Prisma Studio (gerenciamento de banco de dados): http://localhost:5555

### Notas Técnicas

- A aplicação usa pnpm como gerenciador de pacotes dentro dos containers Docker

### Parando a aplicação

Para parar a aplicação:

```bash
docker compose down
```

Para parar a aplicação e remover os volumes (isso excluirá os dados do banco):

```bash
docker compose down -v
```

## Executando Manualmente

Se preferir executar a aplicação manualmente sem Docker:

### Pré-requisitos

- Node.js 20 ou superior
- pnpm instalado globalmente
- PostgreSQL

### Instalação

1. Clone este repositório
2. Instale as dependências:

```bash
pnpm install
```

3. Crie um arquivo `.env` com base no exemplo e configure as variáveis:

```bash
cp .env.example .env
```

4. Execute as migrações do banco de dados:

```bash
npx prisma migrate deploy
```

5. Crie um usuário administrador:

```bash
pnpm create-admin
```

6. Inicie a aplicação:

```bash
pnpm dev
```

## Estrutura do Projeto

- `/src/app` - Rotas e páginas da aplicação
- `/src/components` - Componentes React reutilizáveis
- `/src/lib` - Utilitários e configurações
- `/prisma` - Schema e migrações do banco de dados

# Our Wedding

Aplicação para gerenciamento de casamento, incluindo confirmação de presença, lista de presentes, galeria de fotos e mais.

## Implantação em Produção

### Pré-requisitos

- Docker e Docker Compose instalados
- Git para clonar o repositório

### Configuração do Ambiente

1. Clone o repositório:

```bash
git clone <url-do-repositorio>
cd our-wedding
```

2. Crie o arquivo `.env` baseado no `.env.example`:

```bash
cp .env.example .env
```

3. Edite o arquivo `.env` com suas configurações:

- Configure as credenciais do banco de dados
- Defina um segredo forte para `AUTH_SECRET`
- Atualize `AUTH_URL` com a URL pública da sua aplicação

### Implantação com Docker Compose

1. Construa e inicie os containers:

```bash
docker compose up -d
```

2. Verifique se os containers estão rodando:

```bash
docker compose ps
```

3. Verifique os logs da aplicação:

```bash
docker compose logs -f app
```

### Criação do Usuário Administrador

Para criar um usuário administrador após a implantação:

```bash
docker compose exec app pnpm run create-admin
```

### Manutenção

- **Reiniciar a aplicação**:

```bash
docker compose restart app
```

- **Atualizar a aplicação**:

```bash
git pull
docker compose build app
docker compose up -d app
```

- **Backup do banco de dados**:

```bash
docker compose exec postgres_db pg_dump -U ${POSTGRES_USER} ${POSTGRES_DB} > backup_$(date +'%Y%m%d').sql
```

## Desenvolvimento Local

Para desenvolvimento local, você pode executar:

```bash
# Iniciar o banco de dados
pnpm run db:up

# Executar migrações
pnpm run db:migrate

# Iniciar a aplicação em modo de desenvolvimento
pnpm run dev
```

## Tecnologias Utilizadas

- Next.js 15
- React 19
- TypeScript
- Drizzle ORM
- PostgreSQL
- Docker

## Banco de Dados

Este projeto utiliza o Drizzle ORM com PostgreSQL para gerenciar o banco de dados.

### Comandos do Banco de Dados

- Gerar migrações: `npm run db:generate`
- Aplicar migrações: `npm run db:migrate`
- Interface de gerenciamento: `npm run db:studio`

### Estrutura de Arquivos

- `/src/db/schema/`: Contém os schemas das tabelas
- `/src/db/index.ts`: Exporta o cliente Drizzle e utilitários
- `/src/db/migrate.ts`: Script para executar migrações
- `/drizzle/`: Contém os arquivos de migração gerados

## Migração do Banco de Dados - Atualização de Usuários

Foi adicionado um novo campo `forcePasswordChange` na tabela de usuários para implementar a funcionalidade de troca de senha no primeiro acesso. Para aplicar esta migração, execute os seguintes comandos:

```bash
# Aplicar a migração
npx drizzle-kit push:pg

# OU, se preferir aplicar manualmente:
psql -U seu_usuario -d seu_banco_de_dados -f drizzle/0001_black_malice.sql
```

## Novas Funcionalidades

### Usuários com perfis diferentes

- **Administrador**: Acesso total a todas as funcionalidades.
- **Cerimonialista**: Pode apenas visualizar a lista de convidados.

### Troca obrigatória de senha no primeiro acesso

Quando um novo usuário é criado, ele será forçado a trocar a senha no primeiro acesso.

### Gerenciamento de Usuários

Nova tela para criar e gerenciar usuários com diferentes níveis de acesso.

## Autenticação com Google

Para configurar a autenticação com Google, você precisa obter as credenciais OAuth no Google Cloud Platform:

1. Acesse o [Google Cloud Console](https://console.cloud.google.com/)
2. Crie um novo projeto ou selecione um existente
3. Vá para "APIs e Serviços" > "Credenciais"
4. Clique em "Criar credenciais" e selecione "ID de cliente OAuth"
5. Selecione "Aplicativo da Web" como tipo
6. Dê um nome para seu cliente OAuth
7. Adicione as URIs de redirecionamento autorizadas:
   - `http://localhost:8080/api/auth/callback/google` (para desenvolvimento)
   - `https://seu-dominio.com/api/auth/callback/google` (para produção)
8. Clique em "Criar"
9. Copie o ID do cliente e o segredo do cliente
10. Adicione-os ao arquivo .env:
    ```
    GOOGLE_CLIENT_ID="seu-id-do-cliente"
    GOOGLE_CLIENT_SECRET="seu-segredo-do-cliente"
    ```
