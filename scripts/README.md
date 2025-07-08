# Scripts do Projeto

Este diretório contém scripts utilitários para o projeto de casamento.

## create-admin-user.ts

Script para criar ou atualizar um usuário administrador no sistema.

### Funcionalidades

- ✅ Cria um novo usuário administrador se não existir
- ✅ Atualiza um usuário existente para administrador se já existir
- ✅ Define o email como `lumyth.br@gmail.com`
- ✅ Permite personalizar o nome do usuário
- ✅ Ativa automaticamente a conta do usuário
- ✅ Usa as configurações de banco existentes do projeto

### Como usar

#### Opção 1: Usando npm script (recomendado)

```bash
npm run create-admin
```

#### Opção 2: Com nome personalizado

```bash
npm run create-admin "Luan Administrador"
```

#### Opção 3: Executando diretamente

```bash
npx tsx scripts/create-admin-user.ts
```

#### Opção 4: Com nome personalizado (execução direta)

```bash
npx tsx scripts/create-admin-user.ts "Nome Personalizado"
```

### Pré-requisitos

1. **Variáveis de ambiente configuradas**: O arquivo `.env` deve conter a variável `DATABASE_URL`
2. **Banco de dados criado**: As tabelas devem estar criadas (execute `npm run db:migrate` se necessário)
3. **Dependências instaladas**: Execute `npm install` se ainda não foi feito

### O que o script faz

1. **Conecta ao banco de dados** usando as configurações existentes
2. **Verifica se o usuário já existe** pelo email `lumyth.br@gmail.com`
3. **Se o usuário não existir**:
   - Cria um novo usuário com role `admin`
   - Define como ativo (`active: true`)
   - Usa o nome fornecido ou "Administrador" como padrão
4. **Se o usuário já existir**:
   - Atualiza a role para `admin`
   - Ativa a conta se estiver inativa
   - Atualiza o nome se fornecido
5. **Exibe informações** do usuário criado/atualizado
6. **Encerra a conexão** com o banco de dados

### Exemplo de saída

```
🔍 Verificando se o usuário já existe...
➕ Criando novo usuário administrador...
✅ Usuário criado com sucesso!
📋 Dados do usuário:
   ID: 123e4567-e89b-12d3-a456-426614174000
   Nome: Administrador
   Email: lumyth.br@gmail.com
   Role: admin
   Ativo: true

🎉 Operação concluída com sucesso!
💡 O usuário agora pode fazer login com Google usando este email.
```

### Autenticação

Após executar o script, o usuário poderá fazer login no sistema usando:

- **Email**: `lumyth.br@gmail.com`
- **Método**: Login com Google (NextAuth)
- **Permissões**: Acesso total como administrador

### Troubleshooting

#### Erro de conexão com banco

```
❌ Erro ao criar/atualizar usuário administrador:
Error: connect ECONNREFUSED
```

**Solução**: Verifique se a variável `DATABASE_URL` está correta no arquivo `.env`

#### Tabela não existe

```
❌ Erro ao criar/atualizar usuário administrador:
Error: relation "user" does not exist
```

**Solução**: Execute as migrações do banco: `npm run db:migrate`

#### Variável de ambiente não encontrada

```
❌ Erro ao criar/atualizar usuário administrador:
Error: DATABASE_URL is not defined
```

**Solução**: Crie o arquivo `.env` com a variável `DATABASE_URL` configurada
