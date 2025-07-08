# Paleta de Cores e Fontes Atualizada 🎨

## Visão Geral

A paleta de cores e tipografia do site foi completamente redesenhada para refletir a elegância e romantismo do convite de casamento de **Luan & Ester**. As mudanças foram inspiradas nos tons delicados de lavanda, roxo e lilás presentes no convite, criando uma identidade visual coesa e sofisticada.

## 🎯 Inspiração

O design foi baseado no convite de casamento que apresenta:

- **Flores delicadas** em tons de roxo e lilás
- **Tipografia elegante** com fontes script e serif
- **Paleta suave** com tons pastéis
- **Estilo aquarela** romântico e delicado

## 🎨 Nova Paleta de Cores

### Cores Principais

| Cor               | Hex       | Classe CSS          | Uso                                    |
| ----------------- | --------- | ------------------- | -------------------------------------- |
| **Roxo Profundo** | `#6b4d8a` | `wedding-primary`   | Cor principal, botões, destaques       |
| **Lilás**         | `#d8c7e8` | `wedding-secondary` | Cor secundária, fundos suaves          |
| **Roxo Claro**    | `#b8a6cc` | `wedding-accent`    | Cor de destaque, elementos interativos |
| **Lavanda Suave** | `#e8d8f5` | `wedding-light`     | Fundos claros, elementos sutis         |
| **Carvão Escuro** | `#3d2757` | `wedding-dark`      | Textos, contrastes                     |

### Paleta Completa

| Nome           | Hex       | Classe CSS             | Descrição                    |
| -------------- | --------- | ---------------------- | ---------------------------- |
| Lavanda        | `#e8d8f5` | `wedding-lavender`     | Lavanda suave do convite     |
| Roxo Claro     | `#b8a6cc` | `wedding-purple-light` | Roxo claro das flores        |
| Verde Sálvia   | `#a8b5a0` | `wedding-sage`         | Verde sálvia das folhas      |
| Roxo Profundo  | `#6b4d8a` | `wedding-purple-deep`  | Roxo profundo do texto       |
| Carvão         | `#3d2757` | `wedding-charcoal`     | Carvão escuro para contraste |
| Lilás          | `#d8c7e8` | `wedding-lilac`        | Lilás delicado               |
| Verde Floresta | `#7a8f73` | `wedding-forest`       | Verde floresta               |
| Verde Menta    | `#b5c7a8` | `wedding-mint`         | Verde menta                  |
| Azul Céu       | `#9bb0d1` | `wedding-sky`          | Azul céu suave               |
| Verde Oliva    | `#a0b59b` | `wedding-olive`        | Verde oliva                  |
| Ametista       | `#9b7db8` | `wedding-amethyst`     | Ametista                     |
| Verde Azulado  | `#8fa5a0` | `wedding-teal`         | Verde azulado                |

## 🖋️ Nova Tipografia

### Fontes Implementadas

1. **Dancing Script** (`font-script`, `wedding-script`)

   - **Uso**: Nomes dos noivos, títulos especiais
   - **Características**: Elegante, fluida, romântica
   - **Exemplo**: "Luan & Ester"

2. **Playfair Display** (`font-serif`, `wedding-heading`)

   - **Uso**: Cabeçalhos, títulos de seção
   - **Características**: Serif sofisticada, alta legibilidade
   - **Exemplo**: "Contagem Regressiva"

3. **Lora** (`font-body`, `font-sans`)
   - **Uso**: Textos corridos, parágrafos, corpo do texto
   - **Características**: Serif legível, elegante, moderna
   - **Exemplo**: Textos descritivos e informativos

## 🛠️ Implementação Técnica

### Tailwind CSS 4.0

A implementação utiliza o novo sistema de configuração do Tailwind CSS 4.0 com `@theme`:

```css
@theme {
  /* Paleta de cores inspirada no convite */
  --color-wedding-lavender: #e8d8f5;
  --color-wedding-purple-light: #b8a6cc;
  --color-wedding-sage: #a8b5a0;
  /* ... demais cores */

  /* Fontes personalizadas */
  --font-script: var(--font-dancing-script), 'Dancing Script', cursive;
  --font-serif: var(--font-playfair-display), 'Playfair Display', serif;
  --font-body: var(--font-lora), 'Lora', serif;
}
```

### Google Fonts

```typescript
import { Dancing_Script, Playfair_Display, Lora } from 'next/font/google'

const dancingScript = Dancing_Script({
  variable: '--font-dancing-script',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
})

const playfairDisplay = Playfair_Display({
  variable: '--font-playfair-display',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800', '900'],
  display: 'swap',
})

const lora = Lora({
  variable: '--font-lora',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
})
```

## 🎨 Gradientes Personalizados

### Gradientes Temáticos

```css
.gradient-lavender-sage {
  background: linear-gradient(135deg, #e8d8f5 0%, #a8b5a0 100%);
}

.gradient-purple-lilac {
  background: linear-gradient(135deg, #6b4d8a 0%, #d8c7e8 100%);
}

.gradient-invitation {
  background: linear-gradient(135deg, #e8d8f5 0%, #d8c7e8 50%, #b8a6cc 100%);
}
```

## 🧩 Classes Utilitárias

### Componentes Personalizados

```css
.wedding-button {
  @apply bg-gradient-to-r from-wedding-purple-deep to-wedding-amethyst
         text-white px-6 py-3 rounded-full font-medium
         transition-all duration-300 shadow-lg hover:shadow-xl;
}

.wedding-card {
  @apply bg-white rounded-xl shadow-lg p-6 hover:shadow-xl
         transition-all duration-300 border border-gray-100;
}

.wedding-script {
  font-family: var(--font-script);
  font-weight: 600;
}

.wedding-heading {
  font-family: var(--font-serif);
  font-weight: 700;
}
```

## 📱 Modo Escuro

O sistema inclui suporte ao modo escuro com adaptação automática das cores:

```css
@media (prefers-color-scheme: dark) {
  @theme {
    --color-background: #2a1f3d;
    --color-foreground: #f7f4fa;
    --color-primary: #b8a6cc;
    /* ... demais cores adaptadas */
  }
}
```

## 🎯 Exemplos de Uso

### Botões

```html
<!-- Botão Principal -->
<button class="wedding-button">
  <Heart class="w-5 h-5 mr-2" />
  Celebre Conosco
</button>

<!-- Botão Secundário -->
<button class="bg-wedding-secondary hover:bg-wedding-secondary/80 text-wedding-dark px-6 py-3 rounded-full">
  Saiba Mais
</button>
```

### Tipografia

```html
<!-- Nomes dos Noivos -->
<h1 class="wedding-script text-wedding-primary text-6xl">Luan & Ester</h1>

<!-- Títulos de Seção -->
<h2 class="wedding-heading text-wedding-dark text-4xl">Contagem Regressiva</h2>

<!-- Textos Corridos -->
<p class="text-wedding-charcoal/80 text-lg">Celebrando o amor que nos une para sempre</p>
```

### Gradientes

```html
<!-- Fundo com Gradiente -->
<div class="bg-gradient-to-r from-wedding-lavender/80 via-white to-wedding-lilac/80">
  <!-- Conteúdo -->
</div>

<!-- Gradiente Personalizado -->
<div class="gradient-invitation p-8 rounded-xl">
  <!-- Conteúdo -->
</div>
```

## 🔗 Demonstração

Para visualizar todas as mudanças, acesse a página de demonstração:

```
/demo
```

Esta página apresenta:

- Paleta de cores completa
- Exemplos de tipografia
- Gradientes personalizados
- Componentes estilizados
- Casos de uso práticos

## 📋 Checklist de Implementação

- [x] Configuração do Tailwind CSS 4.0
- [x] Importação das fontes Google Fonts
- [x] Definição da paleta de cores
- [x] Criação de classes utilitárias
- [x] Implementação de gradientes
- [x] Suporte ao modo escuro
- [x] Atualização dos componentes principais
- [x] Página de demonstração
- [x] Documentação completa

## 🚀 Próximos Passos

1. **Aplicar em todos os componentes**: Gradualmente aplicar a nova paleta em todos os componentes do site
2. **Testes de acessibilidade**: Verificar contraste e legibilidade
3. **Otimização de performance**: Garantir que as fontes sejam carregadas de forma eficiente
4. **Feedback dos usuários**: Coletar feedback sobre a nova identidade visual

## 📞 Contato

Para dúvidas ou sugestões sobre a implementação, entre em contato com a equipe de desenvolvimento.

---

_Atualizado em: 27 de Janeiro de 2025_
_Versão: 1.0_
