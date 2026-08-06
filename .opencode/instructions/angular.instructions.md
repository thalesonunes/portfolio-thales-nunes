---
name: "Angular"
description: "Convenções para componentes, estilos e estrutura no portfolio Angular 20."
applyTo: "portfolio/src/**/*.ts,portfolio/src/**/*.html,portfolio/src/**/*.scss"
---

# Angular — Portfolio Thales Nunes

## Estrutura
- Arquitetura **single-component**: `src/app/app.ts` + `app.html` + `app.scss`
- Sem roteamento — navegação suave via scroll entre seções
- SCSS para estilos (configurado em `angular.json`)
- Assets em `public/` e `src/assets/`

## Componentes
- Componente único (`AppComponent`) com todas as seções do portfolio
- Seletor: `app-root`
- ChangeDetection: `OnPush` (performance)
- Standalone (sem NgModules)

## Estilos
- SCSS modularizado no `app.scss`
- Variáveis CSS para cores, espaçamento, tipografia
- Responsivo: mobile-first, breakpoints em 768px e 1024px
- Sidebar responsiva com toggle mobile

## Lint / Build
- `npm run build` — produção (budgets: 500kB initial / 1MB max, 25kB/30kB component style)
- `npm run watch` — incremental watch mode
- Sem `ng lint` configurado — apenas build/test

## Acessibilidade & SEO
- Navegação por teclado
- Semântica HTML adequada
- Meta tags otimizadas no `index.html`