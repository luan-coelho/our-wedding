# Site de Casamento - João & Maria

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

6. Popule o banco de dados com dados iniciais:

```bash
npm run seed
```

7. Crie o usuário administrador:

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
