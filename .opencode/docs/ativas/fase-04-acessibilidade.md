# Fase 04 — Acessibilidade: Auditoria WCAG 2.1 AA + Correções

**Branch:** `feature/fase-04-acessibilidade`
**Status:** 📋 Planejada

---

## Visão Geral

Eleva o portfolio à conformidade **WCAG 2.1 nível AA**. A auditoria inicial (ferramenta Lighthouse do Chrome DevTools MCP + checklist manual) revelou que o projeto **não tem nenhum tratamento de acessibilidade** além de alt texts em imagens: sem skip link, sem estilos de focus visíveis, sem aria-labels em ícones/toggles/navegação, e com problemas de ordem de headings.

A fase executa: **auditoria completa → correções (percebível, operável, compreensível, robusto) → re-auditoria** com meta de Lighthouse a11y ≥ 90 e checklist WCAG 2.1 AA atendido nos pontos aplicáveis.

Resolve os itens de backlog: "Auditoria completa WCAG 2.1 AA", "Skip links", "Focus visible states consistentes" e a pendência da Fase 02 (8 links SVG sem nome acessível).

---

## Contexto Técnico Atual

### Auditoria inicial (achados conhecidos)

| # | Achado | Princípio WCAG | Local |
|---|---|---|---|
| 1 | Sem skip link | Operável (2.4.1 Bypass Blocks) | `app.html` topo |
| 2 | **Zero** estilos `:focus`/`focus-visible` no CSS | Operável (2.4.7 Focus Visible) | `app.scss`/`styles.scss` |
| 3 | 8 links SVG de projetos sem `aria-label`/texto (leitores anunciam "link vazio") | Percebível (1.1.1) + Nome/Valor (4.1.2) | linhas 153-242 |
| 4 | Ícones sociais (sidebar) com `title` mas sem `aria-label`/`role="img"` | 1.1.1 / 4.1.2 | linhas 26, 31 |
| 5 | Toggle mobile sem `aria-label`, `aria-expanded`, `aria-controls` | 4.1.2 | linhas 9, 46 |
| 6 | `<nav>` sem `aria-label` (navegação principal não identificável) | 1.3.1 | linha 3 |
| 7 | Ordem de headings quebrada: `h3` (logo sidebar, linha 6) antes do `h1` (hero, linha 59) | 1.3.1 Info & Relationships | linhas 6, 59 |
| 8 | Contraste/outros: verificar via Lighthouse (ex: accent #ff6b35 sobre fundos, texto sobre imagens) | 1.4.3 | — |
| 9 | Target size de botões/toggles (ex: toggle mobile 40px?) | 2.5.8 (AA em 2024) / 2.5.5 | — |
| 10 | HTML/semântica: validar (ex: `<i class="material-icons">` sem `aria-hidden`) | 4.1.1 Parsing / 1.1.1 | — |

### Estrutura relevante

```
portfolio/src/app/
├── app.html      ← template (321+ linhas): nav sidebar, header mobile, hero, 6 seções
├── app.scss      ← estilos (~1000 linhas) — SEM :focus
├── app.spec.ts   ← 15 testes existentes
└── styles.scss   ← tokens globais (--accent-primary: #ff6b35, --bg-primary: #020008)
```

### Ferramentas disponíveis

- Lighthouse via Chrome DevTools MCP (`lighthouse_audit` com categories accessibility) — rodar em `npm start`
- Checklist manual WCAG 2.1 AA (princípios: Percebível, Operável, Compreensível, Robusto)

### Convenções

- Budgets: 500kB initial / 1MB max; 25kB/30kB style
- Lint configurado na Fase 03: `npm run lint` (inclui regras `@angular-eslint/template` de acessibilidade — o template já passa em 0 problemas, mas aria-labels novos devem continuar passando)
- Links externos com `rel="noopener noreferrer"` (Fase 02)

---

## Tasks

### TASK 1 — Auditoria WCAG 2.1 AA (baseline)

**Objetivo:** Inventariar todos os problemas de acessibilidade do estado atual e gerar a lista de correções.
**Escopo:** Auditoria — nenhuma alteração de código.

#### Subtask 1.1 — Lighthouse a11y
- `npm start` + `lighthouse_audit` (categories: accessibility, device desktop) → registrar score e todos os failures/notices

#### Subtask 1.2 — Checklist manual WCAG 2.1 AA
Percorrer as 4 categorias no template atual (navegação por teclado Tab/Enter/Escape no toggle, ordem de leitura, headings, contraste, target size, alt texts, labels, HTML válido) e registrar achados com referência ao critério WCAG (ex: 2.4.1, 1.4.3, 4.1.2)

#### Subtask 1.3 — Documentar baseline
- Registrar score Lighthouse inicial e lista completa de achados no documento da fase (seção "Resultado da auditoria")

#### Subtask 1.4 — Validação
- [ ] **Como confirmar que está correto?** Relatório com score Lighthouse inicial + checklist de achados por critério WCAG

---

### TASK 2 — Skip link (sempre visível)

**Objetivo:** Bypass de blocos repetitivos (WCAG 2.4.1).
**Escopo:** `app.html` + `app.scss`.

#### Subtask 2.1 — Link "Pular para conteúdo"
- Adicionar logo após `<body>`/`<div class="app-container">`: `<a class="skip-link" href="#main-content">Pular para conteúdo</a>`
- **Sempre visível** (decisão do desenvolvedor) — estilo com accent, posicionado no topo; garantir que não sobreponha o layout (posicionar como primeiro item em flow ou fixed com z-index)

#### Subtask 2.2 — Âncora de conteúdo
- Adicionar `id="main-content"` ao elemento principal de conteúdo (a seção hero ou um `<main>` — avaliar semântica: se houver `<main>`, usar `id` nele; senão, adicionar `id` na primeira seção de conteúdo)

#### Subtask 2.3 — Validação
- [ ] Link visível no topo, clicável, rola/foca o conteúdo
- [ ] `npm run lint` 0 problems; `npm run build` OK
- [ ] **Como confirmar que está correto?** Tab no teclado → link visível → Enter → foco vai para o conteúdo principal

---

### TASK 3 — Focus visible consistente (customizado com accent)

**Objetivo:** Indicador de foco visível e consistente (WCAG 2.4.7).
**Escopo:** `app.scss`/`styles.scss`.

#### Subtask 3.1 — Estilos globais de focus
- `:focus-visible` → `outline: 2px solid var(--accent-primary)` + `outline-offset: 2px` (valores a validar com o design)
- Aplicar a todos os interativos: `a`, `button`, `[tabindex]`
- `:focus` (fallback para browsers sem suporte a :focus-visible) com o mesmo outline

#### Subtask 3.2 — Verificar que nenhum interativo remove outline
- `grep` por `outline: none`/`outline: 0` no SCSS — se houver, remover ou substituir por estilo próprio

#### Subtask 3.3 — Validação
- [ ] Tab percorre todos os elementos interativos com indicador visível em cada um
- [ ] `npm run lint:styles` 0 problems
- [ ] **Como confirmar que está correto?** navegação por teclado mostra outline accent em todos os focáveis (visual + screenshot)

---

### TASK 4 — ARIA: labels completos (projetos, sociais, toggle, nav)

**Objetivo:** Nomes acessíveis para todos os controles/links sem texto (4.1.2, 1.1.1).
**Escopo:** `app.html` apenas.

#### Subtask 4.1 — Links de projetos (8)
- Adicionar `aria-label` descritivo em cada um: ex `aria-label="Código do projeto Minha Guita no GitHub"` (GitHub) e `aria-label="Deploy do projeto Minha Guita"` (deploy)
- Manter `target="_blank" rel="noopener noreferrer"`

#### Subtask 4.2 — Ícones sociais (sidebar)
- Substituir/`complementar` `title` por `aria-label` (ex: `aria-label="GitHub de Thales Nunes"`)
- SVGs decorativos: `aria-hidden="true"` + `focusable="false"` nos `<svg>` que são apenas ilustração (quando o link já tem aria-label)

#### Subtask 4.3 — Toggle mobile (linhas 9 e 46)
- `aria-label="Abrir menu"` / alternar para "Fechar menu" conforme estado? (se simples: `aria-label="Menu"`)
- `aria-expanded="false|true"` vinculado a `sidebarOpen` (binding Angular: `[attr.aria-expanded]="sidebarOpen"`)
- `aria-controls="sidebar"` (id no `<nav>`)

#### Subtask 4.4 — Navegação
- `<nav aria-label="Navegação principal">` (ou `aria-labelledby`)
- Botões do menu com `aria-current` quando ativo? (opcional — avaliar custo/benefício)
- Ícones `material-icons` decorativos → `aria-hidden="true"`

#### Subtask 4.5 — Validação
- [ ] `npm run lint` 0 problems (regras template/accessibility do angular-eslint)
- [ ] **Como confirmar que está correto?** Lighthouse a11y: ausência dos failures de "nomes acessíveis"; inspeção via DevTools (acessibility tree) mostra labels corretos
- [ ] Testes existentes 15/15 continuam passando

---

### TASK 5 — Correções da auditoria (conforme achados da TASK 1)

**Objetivo:** Endereçar os demais achados WCAG (headings, contraste, target size, semântica, HTML).
**Escopo:** Conforme achados — esperado: `app.html`, `app.scss`, `styles.scss`.

#### Subtask 5.1 — Ordem de headings (1.3.1)
- Resolver `h3` (logo sidebar) antes de `h1` (hero): transformar o logo da sidebar em elemento não-heading (ex: `<p>`/`<span>` com estilos mantidos) OU reestruturar — manter aparência idêntica

#### Subtask 5.2 — Demais achados da auditoria
- Contraste (1.4.3): ajustar cores se algum par falhar (mantendo o design — ex: escurecer/clarear apenas o necessário)
- Target size (2.5.8): aumentar hit-area de controles < 24px (ex: toggle mobile, ícones sociais) via padding/min-size sem mudar o visual
- Ícones decorativos `aria-hidden` (ver TASK 4.4)
- HTML inválido/semântica (4.1.1): corrigir conforme achados
- Qualquer outro achado da TASK 1

#### Subtask 5.3 — Validação
- [ ] Checklist WCAG 2.1 AA (aplicável) marcado no documento da fase
- [ ] `npm run lint` 0 problems; `npm run lint:styles` 0 problems; `npm run build` OK
- [ ] **Como confirmar que está correto?** re-auditoria: Lighthouse a11y ≥ 90 e nenhum failure; testes 15/15

---

### TASK 6 — Testes de acessibilidade + re-auditoria final

**Objetivo:** Prevenir regressão e comprovar a conformidade.
**Escopo:** `app.spec.ts` + relatório final.

#### Subtask 6.1 — Specs novos (qa)
- Skip link presente no DOM (primeiro elemento focável)
- Todos os `a[target="_blank"]` com `aria-label` ou texto acessível
- Toggle tem `aria-expanded` que alterna com `sidebarOpen` (chamar `toggleSidebar()` e verificar binding)
- Navegação `<nav>` tem `aria-label`

#### Subtask 6.2 — Re-auditoria Lighthouse
- Rodar Lighthouse a11y de novo: registrar score final (meta ≥ 90) e confirmar 0 failures

#### Subtask 6.3 — Validação
- [ ] `npm test` — todos passando (15 existentes + novos)
- [ ] **Como confirmar que está correto?** `npm test` verde + relatório Lighthouse final anexado ao delta da fase

---

## Ordem de Execução

```
TASK 1 → TASK 2 → TASK 3 → TASK 4 → TASK 5 → TASK 6
```

- TASK 1: `review-portfolio` ou `frontend-portfolio` (auditoria com Lighthouse MCP)
- TASKs 2-5: `frontend-portfolio` (implementação, com re-auditoria da TASK 5)
- TASK 6: `qa-frontend-portfolio` (testes) + Lighthouse final
- Revisão final: `review-portfolio`

Cada task deve:
1. Deixar build validado (`npm run build`) e lints zerados
2. Responder "Como confirmar que está correto?" com evidência
3. Ser commitada antes de avançar

---

## Arquivos Principais Afetados

| Task | Arquivos |
|------|----------|
| 1 | — (relatório) |
| 2 | `portfolio/src/app/app.html`, `portfolio/src/app/app.scss` |
| 3 | `portfolio/src/app/app.scss`, `portfolio/src/styles.scss` |
| 4 | `portfolio/src/app/app.html` |
| 5 | `portfolio/src/app/app.html`, `app.scss`, `styles.scss` (conforme achados) |
| 6 | `portfolio/src/app/app.spec.ts` |

---

## Restrições e Regras de Escopo

- **Manter o design visual**: correções de contraste/target size/headings não podem mudar a aparência geral (ajustes mínimos)
- **Não alterar** funcionalidades (navegação, scroll, toggle)
- Lints zerados após cada task (`npm run lint`, `npm run lint:styles`)
- Budgets respeitados (não adicionar deps novas — tudo é HTML/CSS/TS local)
- ARIA: usar apenas onde necessário (não poluir com roles desnecessários)

---

## Critérios de Aceitação

- [ ] Skip link sempre visível, funcional (WCAG 2.4.1)
- [ ] Focus visible consistente em todos os interativos (WCAG 2.4.7)
- [ ] Nomes acessíveis: 8 links projetos, ícones sociais, toggle (aria-expanded), nav (4.1.2/1.1.1)
- [ ] Ordem de headings corrigida (1.3.1)
- [ ] Checklist WCAG 2.1 AA (aplicável) documentado e atendido
- [ ] Lighthouse a11y **≥ 90** (registrar antes/depois)
- [ ] Testes novos + 15 existentes passando
- [ ] Lints zerados, build OK, budgets OK
- [ ] **Para cada task: "Como confirmar que está correto?" respondido** (obrigatório)
- [ ] Revisão final (`review-portfolio`) aprovada
