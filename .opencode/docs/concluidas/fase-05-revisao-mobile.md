# Fase 05 — Revisão completa do layout mobile e responsividade

**Branch:** `feature/fase-05-revisao-mobile`
**Status:** ✅ Concluída

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

- [x] **Review do plano realizado antes da implementação** (TASK 0) — ata registrada
- [x] Auditoria baseline documentada com screenshots (6 viewports × todas as seções)
- [x] 0 scroll horizontal nos 6 viewports — **medição objetiva**: `document.documentElement.scrollWidth <= document.documentElement.clientWidth` (false para overflow)
- [x] 0 conteúdo cortado/sobreposto nos 6 viewports
- [x] Touch targets ≥ 24px (AA) em todos os controles — medidos via `getBoundingClientRect()`
- [x] Alinhamento consistente entre viewports
- [x] Tipografia refinada e legível em ≤ 768px
- [x] Lighthouse a11y mantido em 100/100
- [x] Testes: 21 existentes + 7 novos = 28/28 passando
- [x] Lints zerados, typecheck OK, build OK (budgets)
- [x] **Para cada task: "Como confirmar que está correto?" respondido** (obrigatório)
- [x] Revisão final (`review-portfolio`) aprovada

---

## Resultado da Auditoria Responsiva (baseline)

**Executada em:** 06/08/2026 (TASK 1 — `frontend-portfolio`)
**Método:** Playwright MCP (`browser_run_code_unsafe`) — viewport via `setViewportSize`, medições via `evaluate` (getBoundingClientRect/scrollWidth/clientWidth), overflow exposto via `document.body.style.overflowX = 'visible'` (JS, **sem editar arquivos**). Servidor dev na porta 4201 (Angular 20/Vite).
**Nota de transparência:** o modelo de auditoria não suporta leitura de imagens; a classificação dos achados baseia-se nas **medições objetivas via evaluate**, e os screenshots servem como evidência visual para inspeção humana na TASK 5 (comparação antes/depois).

### 1. Medições objetivas de overflow (overflow-x hidden removido via JS)

| Viewport | `docScrollW` | `docClientW` | Overflow real (px) | Seções com `scrollWidth > clientWidth` |
|---|---|---|---|---|
| 320×568 | **485** | 308 | **177** | `experience` (485 > 444) |
| 375×667 | **486** | 363 | **123** | `experience` (486 > 444) |
| 768×1024 | 756 | 756 | 0 | nenhuma |
| 1024×768 | 1012 | 1012 | 0 | nenhuma |
| 1280×800 | 1268 | 1268 | 0 | nenhuma |
| 1440×900 | 1428 | 1428 | 0 | nenhuma |

> `docClientW` < viewport em 320/375 por causa do scrollbar vertical (~12px), esperado.

**Estado real do usuário (com `overflow-x: hidden` ativo no body, styles.scss:50):**
- 320: `scrollWidth` 481 > `clientWidth` 308 → overflow **mascarado**; ~165px de conteúdo cortado/invisível à direita
- 375: `scrollWidth` 487 > `clientWidth` 363 → overflow mascarado; ~111px cortados

### 2. Causa raiz do overflow em 320/375 (confirmada por medição)

1. **`.timeline` em ≤768px usa o layout desktop** (`position: absolute` + `calc(50% + 30px)`, app.scss:685-721) — não há media query mobile para a timeline (o tablet 769-1024 não cobre 768):
   - Em 320: container da timeline = 380px → `calc(50% + 30px)` = **220px** → `.timeline-content` (229px, `margin-left: 220px`) atinge **right 486px** (166px além do viewport)
   - `.main-content` (flex `min-width: auto`) estoura para **444px**, arrastando todas as seções (hero/about/skills/projects/contact com scrollWidth 444)
2. **Grid de projetos `minmax(380px, 1fr)`** (app.scss:475): coluna fixa de **380px** em 320 (card 32→412, além do viewport) e 375 (card até 412). Em 768 coluna 692px (ok). Ao corrigir a timeline (item 1), o container em 320 encolhe para ~256px e o grid 380px passará a estourar sozinho — corrigir junto.

### 3. Tabela viewport × seção × problema

| Viewport | Seção | Problema | Prio | Evidência (screenshot) |
|---|---|---|---|---|
| 320×568 | Experiência | Timeline desktop: `.timeline-content` até 486px (166px além); overflow global 177px | **P0** | `vp-320-overflow-exposed.png`, `vp-320x568-full.png` |
| 320×568 | Projetos | Coluna do grid fixa em 380px (card 32→412); 92px além do viewport | **P0** | `vp-320-projects-grid.png` |
| 320×568 | Todas | Overflow mascarado por `overflow-x: hidden` → conteúdo cortado invisível (~165px) | **P0** | `vp-320x568-full.png` (borda direita cortada) |
| 320×568 | Sidebar/toggle | `skip-link` (z 2000) cobre `.menu-toggle.active` (z 1001): overlap 19px; **clique físico falhou** (Playwright timeout) → não fecha a sidebar clicando no toggle | **P1** | `vp-320-hero-sidebar-toggle-collision.png` |
| 375×667 | Experiência | Timeline desktop: overflow global 123px; `.timeline-content` até 486px | **P0** | `vp-375-overflow-exposed.png`, `vp-375x667-full.png` |
| 375×667 | Projetos | Coluna 380px (card até 412 > 375) | **P0** | `vp-375x667-full.png` |
| 375×667 | Todas | Overflow mascarado (~111px cortados) | **P0** | `vp-375x667-full.png` |
| 768×1024 | Experiência | Timeline ainda no layout absoluto (sem media query ≤768) — sem overflow global, mas layout desktop inapropriado em tablet portrait | **P2** | `vp-768x1024-full.png` |
| 1024×768 | Experiência | **Datas `position: absolute` sobrepõem o conteúdo** — overlap horizontal 148–156px nos 3 itens (media query tablet não reseta `position`) | **P1** | `vp-1024x768-timeline-overlap.png` |
| 1280/1440 | — | Sem problemas (0 overflow, timeline desktop correta) | — | `vp-1280x800-full.png`, `vp-1440x900-full.png` |

### 4. Touch targets (getBoundingClientRect)

| Controle | 320 | 375 | 768 | 1024+ |
|---|---|---|---|---|
| `.menu-toggle` | 40×40 ✓ | 40×40 ✓ | 40×40 ✓ | 40×40 ✓ |
| `.sidebar-toggle` | 40×40 ✓ | 40×40 ✓ | 40×40 ✓ | 0×0 (display:none — correto) |
| `.project-link` (6×) | 50×50 ✓ | 50×50 ✓ | 50×50 ✓ | 50×50 ✓ |
| `.contact-item` (3×) | 200–220×92 ✓ | ✓ | ✓ | ✓ |
| `.social-links a` (3×) | 40×40 ✓ | 40×40 ✓ | 40×40 ✓ | 40×40 ✓ |

**Nenhum touch target abaixo de 24px** (AA ✓). Nenhuma correção necessária na TASK 2.3.

### 5. Timeline — sobreposição `.timeline-date` × `.timeline-content`

| Viewport | Sobreposição? | Medição |
|---|---|---|
| 320×568 | Não (datas em `left/right: calc(50% + 30px)` do lado oposto) | date 180–188px nowrap; mas causa o overflow da seção (P0) |
| 375×667 | Não | idem |
| 1024×768 | **Sim — 148/152/156px de overlap horizontal** nos 3 itens | `datePos: absolute`; date 547–703 × content 123–975 (P1) |
| 1280×800 | Não | layout desktop ok |
| 1440×900 | Não | layout desktop ok |

### 6. `.menu-toggle.active` em 320px (left `calc(180px + var(--spacing-lg))` = 212px)

- Rect ativo: **212–252 × 32–72**. Não sobrepõe texto do hero (hero `.name` começa em top 89; overlaps: false).
- **Porém** colide com o `skip-link` (77–231 × 8–73, z-index 2000 > 1001) → hit-area parcialmente bloqueada e clique bloqueado (P1, ver item 3).
- A posição deriva da largura fixa da sidebar (280px) — frágil se a sidebar mudar na TASK 2 (P2).

### 7. Tipografia (320/375, `scrollWidth` vs `clientWidth` do próprio elemento)

- **Nenhum título/parágrafo estoura o próprio container** (ex.: hero `.name` 342px = scrollW; section-title 380px = scrollW) — os "cortes" medidos são consequência do container estourado (main-content 444px), não de texto.
- Após corrigir o container (~256px em 320): hero `.name` 32px (clamp min) tende a quebrar em 2 linhas; section-title 32px é folgado para 320 — **refinamento na TASK 3** (P2).
- Computed styles em 320: hero name 32px/1.1, title 20.8px, desc 16px; section-title 32px; skill h3 20.8px. Line-heights ok.

### 8. Alinhamento / outros

- Respiro horizontal consistente: seções `44.8px 32px`, hero-container `0 32px` → 32px em todas. `.container` app.scss sobrescreve padding horizontal do styles.scss (`50px 0`) — ok, o respiro vem das seções.
- Inert da sidebar: correto (não-inerte quando aberta; main nunca inerte — por design da Fase 04).
- Navegação smooth/toggle: funcionam (medição de estado), exceto o bloqueio de clique do skip-link em 320 (P1).
- `scrollToSection` com `window.innerWidth <= 768` hardcoded (app.ts:31) — atualizar se breakpoint da sidebar mudar (P2, risco conhecido do plano).

### 9. Lista priorizada de correções para TASKs 2-3

**P0 (quebra de layout — TASK 2):**
1. **Timeline em ≤768px**: criar media query mobile (bloco, linha à esquerda, datacima do conteúdo) — reaproveitar o padrão do tablet 769-1024 (que não cobre 768). Elimina o overflow de 320/375 e o estouro do `.main-content` (444px).
2. **Grid de projetos**: `minmax(380px, 1fr)` → `minmax(min(100%, 380px), 1fr)` (ou 1 coluna em ≤768). Validar em 320 após corrigir a timeline.
3. **`overflow-x: hidden` no body**: manter apenas como salvaguarda residual APÓS eliminar as fontes reais de overflow; nunca como máscara de bug. (Verificar se ainda é necessário; preferir remover com as fontes corrigidas.)

**P1 (sobreposto/interação — TASK 2):**
4. **Timeline em 1024×768**: adicionar `position: static !important` (ou reset adequado) ao `.timeline-date` no media query 769-1024 — hoje as datas absolutas sobrepõem o conteúdo em 148–156px.
5. **skip-link × menu-toggle em 320**: o skip-link sempre visível (WCAG 2.4.1) bloqueia o clique no toggle ativo. Corrigir com padrão off-screen/focus-only (skip-link oculto até `:focus`) ou reposicionar o toggle ativo. Não regredir a11y (Lighthouse 100).

**P2 (refinamento — TASK 3):**
6. Hero name/title em 320: ajustar clamp para quebrar bem em ~256px de container (evitar 2 linhas desequilibradas).
7. Section-title 32px em 320: reduzir via clamp (ex.: `clamp(1.75rem, 7vw, 2.5rem)`).
8. Contact items em 320: padding `32px 48px` + `min-width 200px` é folgado para 320 — revisar espaçamento pós-correção do container.
9. `scrollToSection` (app.ts:31): parametrizar o breakpoint de fechamento da sidebar (hoje 768 hardcoded).

### 10. Screenshots salvos (evidência visual — `/tmp/opencode/fase05/`)

```
vp-320x568-full.png                    vp-320x568-sidebar-open.png
vp-375x667-full.png                    vp-375x667-sidebar-open.png
vp-768x1024-full.png                   vp-768x1024-sidebar-open.png
vp-1024x768-full.png                   vp-1280x800-full.png
vp-1440x900-full.png
vp-320-overflow-exposed.png            vp-375-overflow-exposed.png
vp-1024x768-timeline-overlap.png       vp-320-hero-sidebar-toggle-collision.png
vp-320-projects-grid.png
```

**Working tree:** limpo ao final da auditoria (nenhum arquivo de código editado; `overflow-x: hidden` NÃO foi alterado em `styles.scss` — exposto apenas via `document.body.style.overflowX = 'visible'` no runtime, revertido ao final). Única mudança: este documento.

---

## TASKs 2-3 — Correções aplicadas (resultado)

**Executada em:** 06/08/2026 (`frontend-portfolio`)
**Escopo:** `portfolio/src/app/app.scss`, `portfolio/src/styles.scss` (nenhuma mudança em `app.ts`/`app.html`)

### 11.1 Status dos achados da auditoria

| # | Prio | Achado | Status | Correção |
|---|---|---|---|---|
| 1 | P0 | Timeline desktop ativa em ≤768px → overflow 177/123px | ✅ **Corrigido** | Media query ≤768 com timeline empilhada (mixin `timeline-stacked`, reutilizado do padrão tablet; o padrão tablet 769-1024 não cobria 768px) |
| 2 | P0 | Grid de projetos `minmax(380px, 1fr)` → coluna 380px em 320/375 | ✅ **Corrigido** | `minmax(min(100%, 380px), 1fr)` |
| 3 | P0 | `overflow-x: hidden` no body mascara overflow | ✅ **Resolvido** | Mantido apenas como salvaguarda final com justificativa em código — re-medição com overflow exposto via JS: **0 overflow nos 6 viewports** |
| 4 | P1 | Timeline 1024×768: datas `absolute` sobrepõem conteúdo (148–156px) | ✅ **Corrigido** | `position: static !important` no `.timeline-date` dentro do mixin (usado no tablet 769-1024) |
| 5 | P1 | Skip-link cobre `.menu-toggle.active` em 320px (overlap 19px, clique falhava) | ✅ **Corrigido** | Skip-link off-screen (`translateY(-400%)`) até `:focus` (ver 11.3 — mudança de decisão) |
| 6 | P2 | `menu-toggle.active` left 212px frágil | ✅ **Validado** | Posição mantida (212–252px): não sobrepõe conteúdo do hero; a colisão era do skip-link (corrigido na origem). Comentário de justificativa adicionado |
| 7 | P2 | Tipografia 320px (hero name, section-title, espaçamentos) | ✅ **Refinado** | Hero name `clamp(1.9rem, 7vw, 3.5rem)`; section-title `clamp(1.75rem, 4vw, 2.5rem)`; h3 da timeline 1.25rem em mobile; contact items com padding/min-width reduzidos |
| 8 | P2 | `scrollToSection` `<= 768` hardcoded | ✅ **Mantido (sem mudança)** | Breakpoint real da sidebar é `@media (width <= 768px)` — o valor 768 continua correto; nenhuma alteração de comportamento |
| — | P0 (novo, descoberto na execução) | `#skills` min-content 327px e `#experience` min-content 313px (grid/flex items com `min-width: auto`) estouravam o doc em 320 mesmo após os fixes principais | ✅ **Corrigido** | `min-width: 0` no `.skill-item` e no `.timeline-item` (fix padrão de min-content) |

### 11.2 Re-medição objetiva (overflow exposto via JS)

| Viewport | `docScrollW` | `docClientW` | Overflow real (px) | `scrollWidth <= clientWidth` |
|---|---|---|---|---|
| 320×568 | 308 | 308 | **0** | ✅ |
| 375×667 | 363 | 363 | **0** | ✅ |
| 768×1024 | 756 | 756 | **0** | ✅ |
| 1024×768 | 1012 | 1012 | **0** | ✅ |
| 1280×800 | 1268 | 1268 | **0** | ✅ |
| 1440×900 | 1428 | 1428 | **0** | ✅ |

**Timeline (sem sobreposição em nenhum viewport):**
- 320/375/768/1024: layout empilhado — `.timeline-date` `position: static`, `overlapY = 0` nos 3 itens
- 1280/1440: layout desktop preservado — `overlapX = 0` (datas no lado oposto da linha)

**Interações (320px):**
- Clique físico no `.menu-toggle` com sidebar aberta: **fecha a sidebar** (antes falhava — timeout do Playwright)
- Skip-link off-screen quando sem foco (`top: -250px`); ao pressionar Tab: **foca e entra na viewport** (8–73px, pill centralizado)

### 11.3 Mudança de decisão — skip-link (documentada)

- **Fase 04:** skip-link "sempre visível" (fixo no topo, z-index 2000)
- **Fase 05 (auditoria):** o skip-link fixo cobre o `.menu-toggle.active` (z-index 1001) em 320px — overlap 19px, clique físico falhou (Playwright timeout)
- **Decisão:** padrão **hidden-until-focus** (técnica WCAG 2.4.1 C37): `transform: translateX(-50%) translateY(-400%)` por padrão; `:focus` restaura `translateX(-50%)` e o link entra na viewport. O elemento permanece no DOM e no tab order (testes de a11y preservados)
- **Justificativa técnica:** o padrão é aceito pelo WCAG 2.4.1 (G1 + C37) e pelo Lighthouse; **a11y mantido em 100/100** (re-auditoria abaixo). Resolve o bloqueio mobile sem perder o bypass de navegação

### 11.4 Validação

| Comando | Resultado |
|---|---|
| `npm run lint` | ✅ 0 problems |
| `npm run lint:styles` | ✅ 0 problems |
| `npm run typecheck` | ✅ exit 0 |
| `npm test` | ✅ 21/21 SUCCESS (executado com `--watch=false --browsers=ChromeHeadless`; `npm test` puro fica em watch mode) |
| `npm run build` | ✅ OK — Initial total 286.03 kB (budget 500 kB), styles 14.28 kB (budget 25 kB) |
| Lighthouse a11y (desktop) | ✅ **100/100** (Best Practices 100, SEO 100) |

**Screenshots pós-correção** (evidência visual — `/tmp/opencode/fase05/pos/`):

```
vp-320x568-full.png   vp-375x667-full.png   vp-768x1024-full.png
vp-1024x768-full.png  vp-1280x800-full.png  vp-1440x900-full.png
vp-320-timeline.png   vp-1024-timeline.png  vp-1440-timeline.png
vp-320-sidebar-open.png
```

**Nota:** o servidor dev da auditoria (porta 4201, Vite) foi encerrado durante a execução; a re-medição usou servidor próprio em `127.0.0.1:4205` com HMR ativo.

---

## TASK 5 — Pós-correção: Re-auditoria e validação final

**Executada em:** 06/08/2026 (`review-portfolio` — revisão final)
**Método:** Playwright MCP (`browser_run_code_unsafe`) + Chrome DevTools MCP (Lighthouse). Servidor dev na porta 4205.

### 12.1 Qualidade — comandos obrigatórios

| Comando | Resultado |
|---|---|
| `npm run lint` | ✅ 0 problems |
| `npm run lint:styles` | ✅ 0 problems |
| `npm run typecheck` | ✅ exit 0 |
| `npm test -- --no-watch --browsers=ChromeHeadless` | ✅ **28/28 SUCCESS** |
| `npm run build` | ✅ OK — Initial 286.03 kB (budget 500 kB), styles 14.28 kB (budget 25 kB) |

### 12.2 Re-medição overflow (overflow-x exposto via JS — `document.body.style.overflowX = 'visible'`)

| Viewport | `docScrollW` | `docClientW` | Overflow (px) | Seções com overflow |
|---|---|---|---|---|
| 320×568 | 308 | 308 | **0** | 0 |
| 375×667 | 363 | 363 | **0** | 0 |
| 768×1024 | 756 | 756 | **0** | 0 |
| 1024×768 | 1012 | 1012 | **0** | 0 |
| 1280×800 | 1268 | 1268 | **0** | 0 |
| 1440×900 | 1428 | 1428 | **0** | 0 |

### 12.3 Verificações específicas

**Timeline 320px (layout empilhado):**
- `.timeline` width: 256px, scrollWidth: 256px (sem overflow interno) ✅
- `.timeline-date` em todos os itens: `position: static` ✅
- `.timeline-content` width: 202px, scrollWidth: 202px (conteúdo dentro dos limites) ✅
- h3 timeline: 1.25rem (hierarquia adequada) ✅

**Timeline 1024px (layout empilhado tablet):**
- `.timeline-date` em todos os itens: `position: static` ✅
- Datas e conteúdo empilhados verticalmente (sem overlap horizontal — as datas no layout desktop absoluto sobrepunham 148–156px; resolvido) ✅

**Skip-link (320px):**
- Primeiro elemento na tab order (índice 0 de 23) ✅
- Tab na página limpa foca o skip-link corretamente ✅
- `:focus` aplica `transform: translateX(-50%)` (remove `translateY(-400%)`), elemento entra na viewport ✅
- Elemento SEMPRE renderizado (`display: flex`, `visibility: visible`, `offsetWidth > 0`) — nunca `display: none` ✅
- Lighthouse a11y 100/100 confirma conformidade WCAG 2.4.1 ✅

**Toggle sidebar (320px):**
- Abre sidebar (clique físico via Playwright) ✅
- Fecha sidebar (clique no toggle na posição ativa, `left: 212px`) ✅
- Sem colisão com skip-link (skip-link off-screen quando toggle ativo) ✅

**Contact items (320px):**
- `min-width: 0` aplicado (não estoura o container) ✅
- Rect widths: 148–188px (dentro do container de ~256px) ✅

**Touch targets:**
- `.menu-toggle`: 40×40px ✅
- `.project-link` (6×): 50×50px ✅
- Todos ≥ 24px (WCAG 2.5.8 AA) ✅

### 12.4 Lighthouse

| Categoria | Score |
|---|---|
| Accessibility | **100/100** |
| Best Practices | **100/100** |
| SEO | **100/100** |

49 auditorias passaram, 0 falharam. Nenhuma regressão da Fase 04.

### 12.5 Testes — integridade

- **21 testes originais:** preservados, sem alterações ✅
- **7 novos testes:** overflow (320px + fallback estrutural), grid column definition, project cards fit, skip-link focusable/rendered, menu-toggle hit area, project-link hit area, timeline items bounds ✅
- **Total:** 28/28 SUCCESS ✅

### 12.6 Screenshots da re-auditoria

Evidência visual salva em `.playwright-mcp/fase05/`:

```
vp-320x568-full.png       vp-320x568-timeline.png
vp-1024x768-timeline.png
```

### 12.7 Veredito da revisão final

**APROVADO** ✅

Todos os critérios do backlog foram atendidos:
- 0 scroll horizontal nos 6 viewports (medição objetiva)
- 0 conteúdo cortado/sobreposto
- Touch targets ≥ 24px em todos os controles
- Lighthouse a11y 100/100 (sem regressão)
- 28/28 testes passando
- Lint, lint:styles, typecheck, build: todos OK
- Orçamentos respeitados (286 kB de 500 kB)
- Skip-link: padrão hidden-until-focus (WCAG C37), documentado, funcional e a11y-compliant
- Regra do Escoteiro aplicada: `overflow-x` documentado como salvaguarda, mixin `timeline-stacked` DRY, comentários de justificativa em todas as mudanças

---

## Delta (Plano vs. Entrega)

| Aspecto | Plano | Entrega |
|---------|-------|---------|
| Auditoria | Playwright MCP, 6 viewports | ✅ Igual — Playwright (browser_run_code_unsafe) + medições objetivas via evaluate; overflow exposto via JS sem tocar o arquivo |
| Correções P0 | Timeline mobile, grid 380px, overflow-x | ✅ Todas — mixin `timeline-stacked` (≤768), `minmax(min(100%, 380px), 1fr)`, `overflow-x` justificado como salvaguarda |
| Correções P1 | Timeline 1024, skip-link | ✅ Ambas — `position: static` 769-1024; skip-link hidden-until-focus (mudança de decisão vs Fase 04, documentada, técnica C37) |
| Tipografia | Refinamento ≤768 | ✅ clamps (section-title, hero name), h3 timeline, contact items |
| Testes | Specs responsivos | ✅ 7 novos — window.resizeTo(320) real funcionou no Karma (não fallback) — 28/28 |
| Review do plano (TASK 0) | Antes da implementação | ✅ Realizado — 6 ajustes incorporados (riscos P0: overflow-x mask, minmax 380px; técnicas de medição) |

### Entregas não previstas

- `min-width: 0` em `.skill-item` e `.timeline-item` (achado novo: min-content das grids estourava o doc)
- Mixin `timeline-stacked` unifica mobile+tablet (DRY, cobre o gap do 768px)
- Skip-link: mudança de decisão "sempre visível" → "hidden-until-focus" (colisão z-index com menu-toggle em 320px)

### Pendências

- **P2 estético**: skip-link `:focus` fica ~11px acima do topo (54px visíveis, funcional) — ajuste opcional de `top` → backlog (cosmético)
- **`scrollToSection` hardcoded `<= 768`** (app.ts:31) — verificado e mantido (breakpoint real coincide)
- Execução real do CI pendente do incidente do GitHub Actions

---

## Commits principais

| Commit | Descrição |
|--------|-----------|
| `9871efd` | docs(fase-05): create planning for mobile layout audit and fixes |
| `dab0337` | docs(fase-05): incorporate plan review findings (overflow mask, minmax 380px, timeline, measurement techniques) |
| `3e98323` | docs(fase-05): register responsive audit baseline (3 P0, 2 P1 findings) |
| `267245e` | fix(responsive): eliminate horizontal overflow, timeline overlap and skip-link collision (0 overflow in 6 viewports) |
| `d9b31e7` | test(responsive): cover overflow prevention, grid, skip-link, touch targets and timeline |
| `8008798` | docs(fase-05): register post-fix re-audit (0 overflow, Lighthouse 100) |
