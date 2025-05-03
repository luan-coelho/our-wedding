# Site de Casamento - Ester & Luan

Este é um site para casamento desenvolvido com Next.js, React, TailwindCSS, Prisma e PostgreSQL. O site inclui várias páginas essenciais para um site de casamento, como: página inicial, confirmação de presença, lista de presentes, localização, galeria de fotos, mensagens para os noivos e a história do casal.

## Tecnologias Utilizadas

- **Next.js**: Framework React com renderização do lado do servidor
- **React**: Biblioteca JavaScript para construir interfaces de usuário
- **TailwindCSS**: Framework CSS utilitário
- **Prisma**: ORM (Object-Relational Mapping) para banco de dados
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
   NEXTAUTH_SECRET="chave-secreta-gerada"
   ADMIN_EMAIL="admin@example.com"
   ADMIN_PASSWORD="senha-forte"
   ```

5. Execute as migrações do banco de dados:

```bash
npx prisma migrate dev
```

6. Crie o usuário administrador:

```bash
npm run create-admin
```

## Execução

Para iniciar o servidor de desenvolvimento:

```bash
npm run dev
```

O site estará disponível em: `http://localhost:3000`

## Build para Produção

Para gerar uma versão otimizada para produção:

```bash
npm run build
```

Para iniciar o servidor em modo de produção:

```bash
npm start
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
- `prisma/`: Esquema e migrações do banco de dados
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

## Executando com Docker (Recomendado)

A maneira mais fácil de executar a aplicação é usando Docker e Docker Compose:

1. Certifique-se de ter o Docker e o Docker Compose instalados no seu sistema
2. Clone este repositório e navegue até o diretório do projeto
3. Execute o script de inicialização:

```bash
./docker-init.sh
```

Este script irá:
- Criar um arquivo .env se não existir
- Construir e iniciar os containers Docker
- Executar as migrações do banco de dados
- Popular o banco de dados com dados iniciais
- Criar um usuário administrador

Após a execução, a aplicação estará disponível em: http://localhost:3000

Para acessar a área administrativa, use:
- URL: http://localhost:3000/admin
- Email: admin@example.com (ou o que você definiu em .env)
- Senha: senha_admin_segura (ou a que você definiu em .env)

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

Aplicação de site de casamento com recursos para gerenciamento de convidados, presentes, confirmações e galeria.

## Executando em Produção com Docker

### Pré-requisitos

- Docker
- Docker Compose

### Passos para execução

1. Clone o repositório:

```bash
git clone [URL_DO_REPOSITÓRIO]
cd our-wedding
```

2. Configure as variáveis de ambiente:

Edite o arquivo `docker-compose.yml` e ajuste as variáveis de ambiente conforme necessário, especialmente:
- `NEXTAUTH_SECRET`: Defina um valor secreto forte
- `NEXTAUTH_URL`: Configure para a URL onde sua aplicação será acessada

3. Construa e inicie os containers:

```bash
docker-compose up -d
```

4. Acesse a aplicação:

A aplicação estará disponível em `http://localhost:3000`

### Conta de Administrador

Um usuário administrador será criado automaticamente durante a inicialização através de um script Node.js:

- Email: admin@gmail.com
- Senha: admin

**Importante**: Altere esta senha imediatamente após o primeiro login!

Para criar manualmente o usuário administrador em ambiente de desenvolvimento, execute:

```bash
pnpm create-admin
```

### Interrompendo a aplicação

```bash
docker compose down
```

Para remover os volumes de dados (banco de dados):

```bash
docker compose down -v
```

## Desenvolvimento

Para executar o projeto em ambiente de desenvolvimento:

```bash
pnpm install
pnpm prisma generate
pnpm prisma migrate dev
pnpm dev
```

## Tecnologias

- Next.js 15
- React 19
- Prisma
- PostgreSQL
- TailwindCSS 4
- Shadcn UI
