# Teacher Lupi — Premium Landing Page & PWA

Este repositório contém a nova versão da landing page oficial da **Teacher Lupi**, reconstruída para oferecer uma experiência de produção premium, modular e de alta performance.

## 🚀 Tecnologias e Conceitos

- **Design System:** Baseado em **Neo-Brutalismo** moderno, com alto contraste, bordas espessas e sombras marcadas.
- **Arquitetura Modular:** CSS e JS divididos em módulos lógicos para fácil manutenção.
- **PWA (Progressive Web App):** Totalmente instalável, com suporte offline e carregamento instantâneo via Service Worker.
- **Acessibilidade:** Seguindo padrões WCAG, com navegação por teclado e semântica HTML5.
- **Performance:** Otimizado para Core Web Vitals, sem dependências externas pesadas (como Lucide CDN), utilizando SVGs inlines.
- **Responsividade:** Design mobile-first adaptável a qualquer tamanho de tela.
- **Dark Mode:** Suporte nativo a temas claro e escuro com persistência de preferência.

## 📂 Estrutura de Arquivos

```text
teacherlupi.github.io/
├── index.html              # Ponto de entrada principal (HTML5 Semântico)
├── sw.js                   # Service Worker para suporte PWA/Offline
├── site.webmanifest        # Configurações de instalação do PWA
├── mascot.jpg              # Mascote oficial da Teacher Lupi
├── favicon.ico             # Favicon clássico
├── apple-touch-icon.png    # Ícone para dispositivos Apple
├── android-chrome-512x512.png
├── android-chrome-192x192.png
├── css/                    # Módulos de Estilo (Vanilla CSS)
│   ├── tokens.css          # Design tokens (cores, fontes, espaçamentos)
│   ├── base.css            # Resets e estilos globais
│   ├── layout.css          # Containers, Header, Footer e Grids
│   ├── components.css      # Biblioteca de componentes Neo-Brutalistas
│   ├── sections.css        # Estilos específicos de cada seção
│   └── animations.css      # Keyframes e efeitos de scroll reveal
└── js/                     # Módulos de Lógica (Vanilla JS)
    ├── app.js              # Controlador principal (tema, scroll, SW)
    └── components.js       # Lógica de componentes (FAQ, Typing effect)
```

## 🛠️ Principais Arquivos e Funções

### `index.html`
Estrutura semântica completa contendo Hero, Bento Cards, Metodologias, Planos, Depoimentos, FAQ e Footer. Inclui metadados SEO, Open Graph e JSON-LD.

### `css/tokens.css`
A "fonte da verdade" do design. Define todas as variáveis CSS (CSS Variables) para cores, sombras e espaçamentos, permitindo trocar o tema de todo o site alterando apenas este arquivo.

### `js/app.js`
Gerencia as interações de alto nível do site:
- **Theme Toggle:** Alternância entre modo claro e escuro.
- **Scroll Observer:** Ativa as animações de "reveal" conforme o usuário rola a página.
- **Toast Notifications:** Pequenos avisos para o usuário.
- **Modal System:** Gerencia os pop-ups de redirecionamento.

### `sw.js`
Implementa uma estratégia de cache inteligente (Network-first para HTML e Cache-first para assets estáticos), garantindo que o site funcione mesmo sem conexão à internet após a primeira visita.

## 🐺 Identidade Visual

O projeto mantém a essência original da Teacher Lupi:
- **Cores:** Paleta vibrante com destaque para o Vermelho Vinho (#8b2828).
- **Ícones Flutuantes:** Elementos decorativos (emojis educativos e gamers) que flutuam sutilmente pelo fundo da página.
- **Tipografia:** Uso de fontes `Space Mono` e `VT323` para uma estética retro-tech/pixel.

---
Desenvolvido com foco em qualidade técnica e experiência do aluno.