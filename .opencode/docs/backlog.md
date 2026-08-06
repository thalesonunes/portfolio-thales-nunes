# Backlog — Portfolio Thales Nunes

Itens futuros, ideias e pendências conhecidas. Ordenado por prioridade aproximada.

---

## 💡 Ideias / Melhorias Futuras

### Visual & UX
- [ ] Tema escuro (dark mode) com toggle persistido
- [ ] Animações de entrada mais suaves (IntersectionObserver)
- [ ] Micro-interações nos cards de projetos (hover/tap)
- [ ] Otimização de imagens (WebP, srcset, lazy loading nativo)
- [ ] **Revisão completa do layout mobile** — auditar todas as seções (Hero, Sobre, Competências, Projetos, Experiência, Contato) em diversos tamanhos de tela (ex: 320px, 375px, 768px, 1024px) usando o Playwright MCP (browser_navigate + browser_take_screenshot). Verificar: overflow horizontal, sidebar/toggle mobile, timeline da experiência, grid de competências, cards de projetos, hierarquia tipográfica e touch targets. Critérios: sem scroll horizontal, sem conteúdo cortado, alinhamento consistente.

### Funcionalidades
- [ ] Formulário de contato funcional (Supabase/emailjs)
- [ ] Blog/artigos section (MDX ou CMS headless)
- [ ] Internacionalização (pt/en)
- [ ] Analytics privativo (Plausible/Umami)
- [x] **Cálculo automático de experiência** — ✅ entregue na Fase 01: texto fixo "3 anos" substituído por valor dinâmico no `AppComponent` (TS, data de início jan/2022), exibindo "X anos e Y meses" com singular/plural e casos de borda. Testado (13 testes) e revisado.

### Técnico
- [ ] E2E tests com Playwright/Cypress
- [ ] Storybook para componentes
- [x] **Lint (ESLint + angular-eslint + stylelint)** — ✅ entregue na Fase 03: ESLint 9 flat config (recommended + type-checked) + stylelint standard-scss, 0 problemas no código, scripts npm (lint, lint:styles, typecheck)
- [ ] CI com lint + typecheck + test + build — ⚠️ parcialmente entregue na Fase 03 (steps no workflow de deploy); test e build já rodam no CI
- [ ] Performance budgets monitoring (Lighthouse CI)

### Acessibilidade
- [x] Auditoria completa WCAG 2.1 AA — ✅ entregue na Fase 04: Lighthouse a11y 100/100 (antes 90), checklist documentado
- [x] Skip links — ✅ entregue na Fase 04 (sempre visível, alvo `#main-content`)
- [x] Focus visible states consistentes — ✅ entregue na Fase 04 (outline accent global)

---

## 🐛 Debts / Pendências Conhecidas

- [ ] **Preview das PRs no Vercel falhando (`ng: command not found`)** — a integração Vercel for GitHub roda o build na **raiz** do repo (sem `angular.json`/`ng`); só o GitHub Actions (`working-directory: ./portfolio`) deploya com sucesso. Correção: criar `vercel.json` na raiz com `{"rootDirectory": "portfolio"}` OU configurar Root Directory = `portfolio` no dashboard do projeto Vercel. Produção não é afetada (deploy via CI funciona). Identificado na revisão da Fase 01.
- [ ] `app.scss` crescer demais → considerar split por seção
- [ ] Verificar budgets de produção no CI
- [ ] Hero: texto `#ccc` sobre foto panorâmica — contraste não garantido (pré-existente, requer avaliação visual humana)
- [ ] Foco automático no drawer ao abrir (APG) — deferido na Fase 04; controles alcançáveis via Shift+Tab
- [ ] `:focus`/`:focus-visible` redundantes (regras idênticas) — simplificar (cosmético)
- [ ] Aviso `baseline-browser-mapping` desatualizado no build/test (corrigir com `npm i baseline-browser-mapping@latest -D`)
- [ ] Duplicata leve de `.animate-fade-up` (styles.scss 0.6s vs app.scss 0.8s) — unificar em refatoração futura
- [ ] `AppComponent` sem `ChangeDetection.OnPush` (melhoria de performance)

---

## ✅ Concluídos

- [x] Harness opencode inicial (instructions, commands, skills)
- [x] Angular 20 single-component architecture
- [x] Deploy automático Vercel + GitHub Actions
- [x] SCSS com design tokens básicos
- [x] Responsivo mobile-first
- [x] Cálculo automático de experiência (Fase 01)
- [x] Links externos com `rel="noopener noreferrer"` + teste de regressão (Fase 02)
- [x] Favicon set completo: apple-touch-icon, manifest.webmanifest, theme-color (Fase 02)
- [x] Typo corrigido nos SVGs do ícone GitHub (`1.30` → `1.23`) (Fase 02)
- [x] Auditoria WCAG 2.1 AA: Lighthouse a11y 100/100, skip link, focus visible, ARIA labels (Fase 04)

---

## Como usar

- Itens em `💡` são candidatos para futuras fases
- Itens em `🐛` são debts técnicos a endereçar
- Mover para `✅` quando entregue em uma fase finalizada
- Referenciar no documento da fase ao planejar