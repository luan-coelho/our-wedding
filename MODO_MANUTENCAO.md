# Modo de Manutenção

Este projeto possui um sistema de modo de manutenção integrado que permite redirecionar todas as rotas para uma página de manutenção quando necessário.

## Como Ativar o Modo de Manutenção

### 1. Configuração da Variável de Ambiente

Adicione a seguinte variável de ambiente ao seu arquivo `.env`:

```bash
MAINTENANCE_MODE=true
```

### 2. Ativação

Quando `MAINTENANCE_MODE=true`, todas as rotas da aplicação serão automaticamente redirecionadas para `/manutencao`, exceto:

- Rotas de API de autenticação (`/api/auth/*`)
- Arquivos estáticos (`/_next/*`)
- Favicon (`/favicon.ico`)
- A própria página de manutenção (`/manutencao`)

### 3. Desativação

Para desativar o modo de manutenção, altere a variável para:

```bash
MAINTENANCE_MODE=false
```

Ou remova a variável completamente do arquivo `.env`.

## Funcionalidades da Página de Manutenção

A página de manutenção (`/src/app/manutencao/page.tsx`) inclui:

- ✨ Design responsivo e moderno
- 🎨 Tema consistente com a paleta de cores do casamento
- ⏰ Informações sobre tempo estimado de manutenção
- 📞 Informações de contato para emergências
- 💝 Elementos visuais temáticos (ícones de coração, cores rosa)

## Comportamento do Sistema

### Quando o Modo de Manutenção está ATIVO:
- Todas as rotas redirecionam para `/manutencao`
- Usuários não conseguem acessar nenhuma funcionalidade da aplicação
- APIs de autenticação continuam funcionando (para não quebrar sessões)

### Quando o Modo de Manutenção está INATIVO:
- Aplicação funciona normalmente
- Tentativas de acessar `/manutencao` redirecionam para a home (`/`)

## Implementação Técnica

O sistema utiliza:

- **Middleware Next.js** (`src/middleware.ts`) para interceptar todas as requisições
- **Variável de ambiente** (`MAINTENANCE_MODE`) para controle
- **Página React dedicada** (`src/app/manutencao/page.tsx`) para a interface

## Casos de Uso

- Atualizações do banco de dados
- Deploy de novas funcionalidades críticas
- Manutenção de servidor
- Resolução de problemas técnicos
- Períodos de baixa atividade planejados

## Exemplo de Uso

```bash
# Ativar modo de manutenção
echo "MAINTENANCE_MODE=true" >> .env

# Reiniciar a aplicação
npm run dev

# Desativar modo de manutenção
sed -i '/MAINTENANCE_MODE/d' .env
# ou editar manualmente o .env para MAINTENANCE_MODE=false
```

## Personalização

Para personalizar a página de manutenção:

1. Edite o arquivo `src/app/manutencao/page.tsx`
2. Modifique textos, cores, ícones ou layout conforme necessário
3. Adicione informações específicas sobre a manutenção em curso 