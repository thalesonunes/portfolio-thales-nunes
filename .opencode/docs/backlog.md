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
- [ ] **Cálculo automático de experiência** — hoje a Hero Section (app.html) tem o texto fixo "Engenheiro de Software com aproximadamente 3 anos de experiência...". O valor deve ser calculado automaticamente: transição de carreira para tecnologia em **janeiro de 2022**; exibir anos e meses dinâmicos (ex: "4 anos e 7 meses") com base na data atual, atualizando sozinho sem edição manual. Decisão pendente: calcular no `AppComponent` (TS, data do servidor) vs. estático no build.

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

- [ ] `app.scss` crescer demais → considerar split por seção
- [ ] Verificar budgets de produção no CI
- [ ] Favicon set completo (apple-touch-icon, manifest, etc.)

---

## ✅ Concluídos

- [x] Harness opencode inicial (instructions, commands, skills)
- [x] Angular 20 single-component architecture
- [x] Deploy automático Vercel + GitHub Actions
- [x] SCSS com design tokens básicos
- [x] Responsivo mobile-first

---

## Como usar

- Itens em `💡` são candidatos para futuras fases
- Itens em `🐛` são debts técnicos a endereçar
- Mover para `✅` quando entregue em uma fase finalizada
- Referenciar no documento da fase ao planejar