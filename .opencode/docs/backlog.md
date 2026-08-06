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
- [ ] Lint (ESLint + angular-eslint + stylelint)
- [ ] CI com lint + typecheck + test + build
- [ ] Performance budgets monitoring (Lighthouse CI)

### Acessibilidade
- [ ] Auditoria completa WCAG 2.1 AA
- [ ] Skip links
- [ ] Focus visible states consistentes

---

## 🐛 Debts / Pendências Conhecidas

- [ ] **Preview das PRs no Vercel falhando (`ng: command not found`)** — a integração Vercel for GitHub roda o build na **raiz** do repo (sem `angular.json`/`ng`); só o GitHub Actions (`working-directory: ./portfolio`) deploya com sucesso. Correção: criar `vercel.json` na raiz com `{"rootDirectory": "portfolio"}` OU configurar Root Directory = `portfolio` no dashboard do projeto Vercel. Produção não é afetada (deploy via CI funciona). Identificado na revisão da Fase 01.
- [ ] `app.scss` crescer demais → considerar split por seção
- [ ] Verificar budgets de produção no CI
- [ ] Favicon set completo (apple-touch-icon, manifest, etc.)
- [ ] Links externos sem `rel="noopener noreferrer"` (10 links: sidebar, projetos, contato) — risco `window.opener` (identificado na revisão da Fase 01)
- [ ] Aviso `baseline-browser-mapping` desatualizado no build/test (corrigir com `npm i baseline-browser-mapping@latest -D`)
- [ ] SVGs dos ícones GitHub com typo nos paths (`1.30` vs `1.23`) — renderização ok, texto divergente do original
- [ ] `AppComponent` sem `ChangeDetection.OnPush` (melhoria de performance)

---

## ✅ Concluídos

- [x] Harness opencode inicial (instructions, commands, skills)
- [x] Angular 20 single-component architecture
- [x] Deploy automático Vercel + GitHub Actions
- [x] SCSS com design tokens básicos
- [x] Responsivo mobile-first
- [x] Cálculo automático de experiência (Fase 01)

---

## Como usar

- Itens em `💡` são candidatos para futuras fases
- Itens em `🐛` são debts técnicos a endereçar
- Mover para `✅` quando entregue em uma fase finalizada
- Referenciar no documento da fase ao planejar