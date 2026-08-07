# Backlog — Portfolio Thales Nunes

Itens futuros, ideias e pendências conhecidas. Ordenado por prioridade aproximada.

---

## 💡 Ideias / Melhorias Futuras

### Visual & UX
- [x] ~~Tema escuro (dark mode) com toggle persistido~~ — ❌ **cancelado (decisão 06/08/2026)**: o site já é dark por design (identidade visual, `--bg-primary: #020008`); dark mode só faria sentido com um modo claro para alternar, e a auditoria WCAG da Fase 04 validou o contraste com Lighthouse a11y 100/100 — sem déficit de acessibilidade
- [ ] Animações de entrada mais suaves (IntersectionObserver)
- [ ] Micro-interações nos cards de projetos (hover/tap)
- [x] **Otimização de imagens (WebP, srcset, lazy loading nativo)** — ✅ entregue na Fase 06: 12 WebPs (480/960/1280w) + hero WebP, `<picture>` com fallback jpg, lazy loading, órfãos removidos (eu.png 1.25MB). LCP 271ms, CLS 0.00
- [x] **Revisão completa do layout mobile** — ✅ entregue na Fase 05: auditoria em 6 viewports (320-1440px), 0 overflow horizontal (medição objetiva), timeline corrigida (mobile + 1024px), skip-link sem colisão, tipografia refinada em ≤768px. Lighthouse a11y mantido 100/100, 28 testes

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
- [x] CI com lint + typecheck + test + build — ✅ completo e **validado em produção (07/08/2026)**: após o retorno do GitHub Actions, o workflow rodou lint → lint:styles → typecheck → build → deploy com sucesso (Fases 03 + 13)
- [ ] Performance budgets monitoring (Lighthouse CI)

### Acessibilidade
- [x] Auditoria completa WCAG 2.1 AA — ✅ entregue na Fase 04: Lighthouse a11y 100/100 (antes 90), checklist documentado
- [x] Skip links — ✅ entregue na Fase 04 (sempre visível, alvo `#main-content`)
- [x] Focus visible states consistentes — ✅ entregue na Fase 04 (outline accent global)

---

## 🐛 Debts / Pendências Conhecidas

- [ ] **Preview das PRs no Vercel falhando (`ng: command not found`)** — a integração Vercel for GitHub roda o build na **raiz** do repo (sem `angular.json`/`ng`); só o GitHub Actions (`working-directory: ./portfolio`) deploya com sucesso. ⚠️ **Aprendizado (06/08/2026):** `rootDirectory` NÃO é campo válido do `vercel.json` (schema rejeita — tentativa na PR #8 revertida na #9). Correção real: configurar **Root Directory = `portfolio`** no dashboard do projeto Vercel (Settings → General) ou via API `PATCH /v9/projects`. Produção não é afetada (deploy via CI funciona).
- [ ] `app.scss` crescer demais → considerar split por seção
- [ ] Verificar budgets de produção no CI
- [ ] Hero: texto `#ccc` sobre foto panorâmica — contraste não garantido (pré-existente, requer avaliação visual humana)
- [ ] Foco automático no drawer ao abrir (APG) — deferido na Fase 04; controles alcançáveis via Shift+Tab
- [ ] `:focus`/`:focus-visible` redundantes (regras idênticas) — simplificar (cosmético)
- [ ] Aviso `baseline-browser-mapping` desatualizado no build/test (corrigir com `npm i baseline-browser-mapping@latest -D`)
- [ ] `sizes` das imagens de projeto: mobile `100vw` ignora padding (usar `calc(100vw - 4rem)`) — identificado na revisão da Fase 06 (P2, ~15KB)
- [ ] WebPs 1280w parcialmente redundantes em desktop — avaliar redução em fase futura (P3, Fase 06)
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