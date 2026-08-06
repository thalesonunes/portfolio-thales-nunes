# Fase 05 — Revisão completa do layout mobile e responsividade

**Branch:** `feature/fase-05-revisao-mobile`
**Status:** 📋 Planejada

---

## Visão Geral

Auditoria e correção do comportamento responsivo do portfolio em **6 viewports** (320px, 375px, 768px, 1024px, 1280px, 1440px), cobrindo **todas as seções** (Hero, Sobre, Competências, Projetos, Experiência, Contato, sidebar/toggle mobile). Além dos critérios do backlog (sem scroll horizontal, sem conteúdo cortado, touch targets ≥ 24px AA, alinhamento consistente), a fase inclui **refinamento tipográfico** em telas pequenas (decisão do desenvolvedor).

**Fluxo especial definido pelo desenvolvedor:** auditoria → **review do plano antes da implementação** → implementação → QA → revisão final.

---

## Contexto Técnico Atual

### Breakpoints atuais (convenção do projeto)
- Mobile-first, breakpoints em **768px** e **1024px** (AGENTS.md)
- Viewports de teste: 320 (iPhone SE antigo), 375 (iPhone padrão), 768 (tablet portrait), 1024 (tablet landscape/laptop pequeno), 1280 e 1440 (desktop)

### Seções a auditar
| Seção | Elementos sensíveis |
|---|---|
| Sidebar/toggle | Nav lateral, `inert` (Fase 04), toggles `.sidebar-toggle`/`.menu-toggle`, ícones sociais |
| Hero | Título, descrição, botões CTA |
| Sobre | 2 colunas → 1 coluna, textos longos |
| Competências | Grid de cards, ícones |
| Projetos | Cards, overlay com links (focus-within), imagens |
| Experiência | Timeline (odd/even, datas absolutas), cards |
| Contato | Ítens de contato (mailto, WhatsApp, LinkedIn) |

### Ferramentas
- **Playwright MCP** disponível (browser_navigate + browser_take_screenshot + resize)
- Chrome DevTools MCP também disponível (emulate viewport, lighthouse)

### Convenções
- Lints zerados (Fase 03), a11y 100/100 (Fase 04 — **não regredir**), budgets 500kB
- Mobile-first, breakpoints 768/1024
- Não alterar funcionalidades (navegação, scroll, toggle)

### Riscos conhecidos (do review do plano — TASK 0)

- 🔴 **`body { overflow-x: hidden }` em `styles.scss:50` mascara scroll horizontal** — a auditoria precisará comentar essa linha temporariamente para detectar overflow real
- 🔴 **Grid de projetos `minmax(380px, 1fr)` em `app.scss:472`** — 380px > viewport 320px, overflow garantido em 320px; corrigir com `minmax(min(100%, 380px), 1fr)` ou media query
- 🟠 **Timeline `position: absolute` com `left/right: calc(50% + 30px)` + `margin: calc(50% + 30px)` (app.scss:685-721)** — em 320px sobram ~130px para `.timeline-content`; verificar sobreposição/overflow de datas
- 🟠 **`menu-toggle.active` com `left: calc(180px + var(--spacing-lg))`** (app.scss:219) — em 320px fica ~212px da esquerda, sobrando ~108px; verificar colisão com conteúdo
- 🟡 **`scrollToSection` tem `window.innerWidth <= 768` hardcoded** (app.ts:31) — se breakpoints mudarem, atualizar

---

## Tasks

### TASK 0 — Revisão do plano (fluxo especial)

**Objetivo:** Review do documento da fase ANTES de qualquer implementação (decisão do desenvolvedor).
**Escopo:** Documento.

#### Subtask 0.1 — Revisar o plano
- Acionar `review-portfolio` para revisar este documento: escopo, critérios de aceitação, riscos, sequência
- Incorporar ajustes apontados ao documento

#### Subtask 0.2 — Validação
- [ ] Plano revisado e aprovado antes da TASK 1
- [ ] **Como confirmar que está correto?** ata de revisão registrada no documento (seção "Revisão do plano")

---

### TASK 1 — Auditoria responsiva (baseline)

**Objetivo:** Inventariar todos os problemas responsivos nos 6 viewports com evidência visual.
**Escopo:** Auditoria — sem alteração de código.

#### Subtask 1.1 — Screenshots por viewport
- Playwright MCP: para cada viewport (320, 375, 768, 1024, 1280, 1440), navegar e capturar **todas** as seções (fullPage) + sidebar aberta
- Salvar evidências (ex: `/tmp/opencode/fase05/`)
- **Antes dos screenshots: comentar temporariamente `overflow-x: hidden` no `body`** (styles.scss:50) para expor overflow real; restaurar ao final da TASK 2

#### Subtask 1.2 — Checklist de problemas
Para cada viewport/seção, verificar e registrar:
- Scroll horizontal: **medição objetiva** via evaluate: `document.documentElement.scrollWidth > document.documentElement.clientWidth` → deve ser `false`; por seção: `element.scrollWidth > element.clientWidth`
- Conteúdo cortado/sobreposto (textos, cards, timeline)
- Touch targets: para cada controle (`menu-toggle`, `sidebar-toggle`, `project-link`, `contact-item`, sociais) medir via `getBoundingClientRect()`: `width >= 24 && height >= 24`
- Alinhamento consistente (grids, margens, paddings)
- Hierarquia tipográfica (títulos/parágrafos legíveis, sem overflow de linha)
- Sidebar/toggle: comportamento correto (abre/fecha, não bloqueia, inert ok)
- **Timeline**: verificar que datas (`position: absolute`) não sobrepõem conteúdo nem causam overflow em 320px (margem `calc(50% + 30px)` deixa ~130px para `.timeline-content`)
- **`menu-toggle.active`**: verificar que não colide com o conteúdo principal em 320px (left ~212px)

#### Subtask 1.3 — Documentar baseline
- Seção "Resultado da Auditoria Responsiva" no documento da fase: tabela viewport × seção × problema (com screenshot referenciado)

#### Subtask 1.4 — Validação
- [ ] **Como confirmar que está correto?** relatório completo com screenshots e lista priorizada de problemas (P0 = quebra layout, P1 = cortado/overflow, P2 = refinamento)

---

### TASK 2 — Correções de layout responsivo (critérios do backlog)

**Objetivo:** Eliminar P0/P1: scroll horizontal, conteúdo cortado, touch targets, alinhamento.
**Escopo:** `app.scss` (+ `styles.scss` se necessário).

#### Subtask 2.1 — Scroll horizontal e overflow
- Identificar fontes de overflow (elementos com largura fixa > viewport, grid com min-width, timeline com margens absolutas) e corrigir com unidades fluidas (min(%, px), clamp), `overflow-x` apenas se necessário e justificado
- **Grid de projetos**: corrigir `minmax(380px, 1fr)` → `minmax(min(100%, 380px), 1fr)` ou media query para 1 coluna
- Verificar em 320px (caso mais restrito)

#### Subtask 2.2 — Conteúdo cortado/sobreposto
- Cards, grids, timeline (dates absolutas), overlay de projetos: garantir visibilidade total em todos os viewports

#### Subtask 2.3 — Touch targets ≥ 24px
- Toggles, ícones sociais (40px hoje — ok), links de projeto: hit-area mínima 24×24 (manter visual, ajustar padding/min-size)

#### Subtask 2.4 — Alinhamento consistente
- Grids/margens uniformes entre viewports (não necessariamente idênticos — consistentes)

#### Subtask 2.5 — Validação
- [ ] Re-screenshot nos 6 viewports: 0 scroll horizontal, nada cortado
- [ ] Lints zerados, testes 21/21, build OK
- [ ] **Como confirmar que está correto?** comparação visual antes/depois nos screenshots + checklist de critérios do backlog

---

### TASK 3 — Refinamento tipográfico em telas pequenas

**Objetivo:** Hierarquia tipográfica ajustada para mobile (decisão do desenvolvedor).
**Escopo:** `app.scss`/`styles.scss`.

#### Subtask 3.1 — Escala tipográfica
- Revisar tamanhos de títulos (h1-hero, h2 seções, h3 cards) e parágrafos em ≤ 768px: legibilidade, quebras de linha naturais (sem `word-break` forçado desnecessário), line-height
- Ajustar com `clamp()` onde fizer sentido (mantendo identidade)

#### Subtask 3.2 — Espaçamentos
- Paddings/margens de seção e cards em mobile: respiro adequado (ex: 320px sem conteúdo colado nas bordas)

#### Subtask 3.3 — Validação
- [ ] Screenshots 320/375/768 com tipografia legível e espaçamento consistente
- [ ] Lints zerados, testes 21/21, build OK
- [ ] **Como confirmar que está correto?** comparação visual + checklist tipográfico

---

### TASK 4 — Testes de responsividade

**Objetivo:** Proteger os critérios contra regressão.
**Escopo:** `app.spec.ts` + validação.

#### Subtask 4.1 — Specs novos (qa)
- Teste de **ausência de overflow horizontal** no container principal: **decidir abordagem agora** — o Karma roda em Chrome real; verificar se `window.innerWidth` pode ser emulado (`window.resizeTo` / dispatch de resize). Se viável, medir `document.documentElement.scrollWidth <= clientWidth` em 320px; se não, fallback estrutural: verificar computed style de `.projects-grid` (`minmax` não exceder viewport) e ausência de larguras fixas > 320px
- Teste de touch targets: toggles e links de projeto com hit-area ≥ 24px (getBoundingClientRect no Chrome real do Karma)
- Testes existentes (21) preservados

#### Subtask 4.2 — Validação
- [ ] `npm test` — todos passando (21 + novos)
- [ ] **Como confirmar que está correto?** `npm test` verde + evidência dos testes de dimensão

---

### TASK 5 — Re-auditoria e validação final

**Objetivo:** Comprovar os critérios do backlog nos 6 viewports após as correções.
**Escopo:** Auditoria final.

#### Subtask 5.1 — Re-auditoria
- Repetir screenshots dos 6 viewports (TASK 1.1) e conferir checklist: 0 scroll horizontal, 0 conteúdo cortado, touch ≥ 24px, alinhamento consistente, tipografia ok
- Lighthouse a11y: confirmar que **não regrediu** (100/100)

#### Subtask 5.2 — Relatório final
- Tabela antes/depois no documento da fase

#### Subtask 5.3 — Validação
- [ ] **Como confirmar que está correto?** relatório antes/depois + Lighthouse a11y 100 + todos os comandos de qualidade verdes

---

## Ordem de Execução

```
TASK 0 (review do plano) → TASK 1 (auditoria) → TASK 2 → TASK 3 → TASK 4 → TASK 5 (re-auditoria)
```

- TASK 0: `review-portfolio` (revisão do documento de planejamento)
- TASK 1: `frontend-portfolio` (auditoria com Playwright MCP)
- TASKs 2-3: `frontend-portfolio` (correções)
- TASK 4: `qa-frontend-portfolio` (testes)
- TASK 5: `frontend-portfolio` + `review-portfolio` (validação final)

Cada task deve:
1. Deixar build validado (`npm run build`), lints zerados, testes passando
2. Responder "Como confirmar que está correto?" com evidência
3. Ser commitada antes de avançar

---

## Arquivos Principais Afetados

| Task | Arquivos |
|------|----------|
| 0 | `.opencode/docs/ativas/fase-05-revisao-mobile.md` |
| 1 | — (relatório no doc) |
| 2 | `portfolio/src/app/app.scss`, `portfolio/src/styles.scss` |
| 3 | `portfolio/src/app/app.scss`, `portfolio/src/styles.scss` |
| 4 | `portfolio/src/app/app.spec.ts` |
| 5 | — (relatório no doc) |

---

## Restrições e Regras de Escopo

- **Não alterar** funcionalidades (navegação, scroll, toggle, inert da Fase 04)
- **Não regredir** a11y (Lighthouse 100/100) nem lints (0 problems)
- **Não alterar** HTML/template salvo se estritamente necessário (preferir CSS)
- Não adicionar deps novas
- Budgets respeitados
- Mudanças visuais: apenas correções de responsividade/legibilidade — identidade do design preservada

---

## Critérios de Aceitação

- [ ] **Review do plano realizado antes da implementação** (TASK 0) — ata registrada
- [ ] Auditoria baseline documentada com screenshots (6 viewports × todas as seções)
- [ ] 0 scroll horizontal nos 6 viewports — **medição objetiva**: `document.documentElement.scrollWidth <= document.documentElement.clientWidth` (false para overflow)
- [ ] 0 conteúdo cortado/sobreposto nos 6 viewports
- [ ] Touch targets ≥ 24px (AA) em todos os controles — medidos via `getBoundingClientRect()`
- [ ] Alinhamento consistente entre viewports
- [ ] Tipografia refinada e legível em ≤ 768px
- [ ] Lighthouse a11y mantido em 100/100
- [ ] Testes: 21 existentes + novos passando
- [ ] Lints zerados, typecheck OK, build OK (budgets)
- [ ] **Para cada task: "Como confirmar que está correto?" respondido** (obrigatório)
- [ ] Revisão final (`review-portfolio`) aprovada
