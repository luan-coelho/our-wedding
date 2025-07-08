# Sistema de Confirmação de Presença

Este documento explica como funciona o sistema de confirmação de presença implementado no site do casamento.

## Visão Geral

O sistema permite que os convidados confirmem sua presença de duas formas:
1. **Código de 6 dígitos**: Digitando um código numérico na página inicial
2. **Link direto**: Clicando em um link que já preenche o código automaticamente

## Como Funciona

### 1. Cadastro do Convidado
- Quando um convidado é cadastrado no sistema, ele recebe automaticamente:
  - Um **token UUID** único (para URLs antigas)
  - Um **código de 6 dígitos** único (nova funcionalidade)

### 2. Opções de Confirmação

#### Opção 1: Código de 6 dígitos
- O convidado acessa a página inicial (`/`)
- Digita o código de 6 dígitos no campo "Código de Confirmação"
- Clica em "Confirmar Presença"

#### Opção 2: Link direto com query param
- O convidado clica em um link como: `https://seusite.com/?code=123456`
- O sistema automaticamente preenche e processa o código
- O convidado é direcionado para o formulário de confirmação

#### Opção 3: Link tradicional (mantido para compatibilidade)
- O convidado clica em um link como: `https://seusite.com/confirmacao/uuid-token`
- Funciona como antes, usando o token UUID

### 3. Processo de Confirmação

1. **Identificação**: O sistema identifica o convidado pelo código/token
2. **Validação**: Verifica se o código/token é válido
3. **Formulário**: Mostra todas as pessoas do grupo (principal, cônjuge, filhos, acompanhantes)
4. **Confirmação Individual**: Cada pessoa pode ser confirmada individualmente
5. **Salvamento**: As confirmações são salvas no banco de dados

## Implementação Técnica

### Estrutura do Banco de Dados

```sql
-- Tabela guest
ALTER TABLE guest ADD COLUMN confirmation_code TEXT NOT NULL UNIQUE;
```

### APIs

#### Buscar convidado por código
```
GET /api/confirmacao/code/[code]
```

#### Confirmar presença por código
```
PUT /api/confirmacao/code/[code]
```

### Componentes

#### `confirmation.tsx`
- Componente principal na página inicial
- Detecta automaticamente o tipo de entrada (código vs token vs URL)
- Processa automaticamente URLs coladas
- Suporta query params: `?code=123456` ou `?token=uuid`

### Detecção Automática

O sistema detecta automaticamente o tipo de entrada:

```typescript
// Código de 6 dígitos
/^\d{6}$/.test(value) // true para "123456"

// Token UUID
/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value)

// URL completa
extractTokenFromUrl(value) // extrai token/code da URL
```

## Interface do Administrador

### Página de Convidados
- Mostra o código de 6 dígitos de cada convidado
- Permite copiar o código diretamente
- Permite copiar o link direto (`/?code=123456`)
- Mantém o link tradicional para compatibilidade

### Funcionalidades
- **Copiar Código**: Copia apenas o código de 6 dígitos
- **Copiar Link**: Copia a URL completa com o código

## Exemplos de Uso

### Para o Administrador
1. Cadastrar convidado → Sistema gera código automaticamente
2. Copiar código: `123456`
3. Copiar link: `https://seusite.com/?code=123456`
4. Enviar por WhatsApp/Email para o convidado

### Para o Convidado
1. **Opção 1**: Digitar `123456` na página inicial
2. **Opção 2**: Clicar no link `https://seusite.com/?code=123456`
3. **Opção 3**: Clicar no link tradicional `https://seusite.com/confirmacao/uuid`

## Vantagens

1. **Simplicidade**: Códigos de 6 dígitos são fáceis de digitar
2. **Flexibilidade**: Múltiplas formas de acesso
3. **Compatibilidade**: Mantém funcionalidade anterior
4. **UX**: Detecção automática e processamento de URLs
5. **Administração**: Fácil de gerenciar e compartilhar

## Segurança

- Códigos de 6 dígitos são únicos e aleatórios
- Validação tanto no frontend quanto no backend
- Prevenção de códigos duplicados
- Logs de tentativas de acesso

## Casos de Uso Especiais

### Auto-detecção de URLs
- Quando o usuário cola uma URL completa, o sistema automaticamente extrai o código/token
- Funciona para URLs do tipo:
  - `https://seusite.com/confirmacao/uuid`
  - `https://seusite.com/?code=123456`
  - `https://seusite.com/?token=uuid`

### Confirmações Múltiplas
- Cada pessoa do grupo pode ser confirmada individualmente
- Suporte a: Principal, Cônjuge, Filhos, Acompanhantes
- Status visual para cada confirmação

## Monitoramento

O sistema permite monitorar:
- Quantos convidados confirmaram presença
- Quantas pessoas por grupo confirmaram
- Status de cada confirmação individual
- Histórico de confirmações