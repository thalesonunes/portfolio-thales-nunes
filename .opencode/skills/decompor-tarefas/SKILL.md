---
name: decompor-tarefas
description: Analisa o escopo de uma fase ou feature do portfolio (Angular 20 single-component) e decompõe em tasks detalhadas com subtasks, complexidade, dependências, arquivos afetados e critérios de validação. Use quando o desenvolvedor pedir para detalhar/planejar tasks de uma fase ou feature, após refinar-escopo e antes de implementar.
---

# Decompor tarefas — Portfolio Thales Nunes

Analisa o escopo de uma fase ou feature e decompõe em tasks detalhadas com subtasks, arquivos afetados, ordem de execução e critérios de validação, seguindo as convenções do portfolio (Angular 20 standalone, single-component, SCSS).

## Quando usar

- **Modo fase**: após criar um documento de fase com `criar-fase` (seção de Tasks vazia ou incompleta). Preenche o documento existente no formato completo de fase.
- **Modo feature avulsa**: para detalhar uma feature pequena que não justifica fase completa. Gera output simplificado — apenas a lista de tasks, sem template de fase.
- Para revisar e refinar tasks de uma fase já existente.

## Fluxo no harness do portfolio

```
refinar-escopo (perguntas clarificadoras)
    ↓
criar-fase (estrutura do documento)
    ↓
decompor-tarefas (preencher tasks) ← você está aqui
    ↓
[revisão humana / review do plano quando solicitado]
    ↓
implementar (frontend-portfolio → qa-frontend-portfolio → review-portfolio)
    ↓
finalizar-fase (arquivar, delta, PR)
```

Para features avulsas, pule `criar-fase` — use `decompor-tarefas` no modo feature avulsa.

## Pré-requisitos

- Para modo fase: documento em `.opencode/docs/ativas/fase-XX-nome.md` (com visão geral e contexto)
- Para modo feature avulsa: descrição clara do escopo
- Conhecimento da stack (ver `AGENTS.md`): Angular 20 standalone, single-component (`app.ts` + `app.html` + `app.scss`), SCSS, Jasmine/Karma, sem roteamento, budgets 500kB/1MB e 25kB/30kB style

## Workflow

### Passo 1 — Identificar o modo

- **Fase**: existe `.opencode/docs/ativas/fase-XX-nome.md` com visão geral e contexto → preencher a seção Tasks do documento
- **Feature avulsa**: apenas descrição textual → gerar bloco de tasks no chat (sem criar arquivo)

### Passo 2 — Ler o escopo

Extrair do documento da fase ou descrição:
- **Visão Geral** — objetivo macro
- **Contexto Técnico Atual** — arquivos envolvidos (`app.ts`, `app.html`, `app.scss`, `styles.scss`, `index.html`, `public/`, specs)
- **Restrições** — o que NÃO alterar (ex: não regredir a11y, não mudar layout, não adicionar deps)

### Passo 3 — Analisar dependências e decompor

1. **Identificar tasks independentes** — o que pode ser feito em paralelo? (marcar com `∥`)
2. **Identificar pré-requisitos** — task A antes da B? (ex: config antes de correções)
3. **Mapear arquivos afetados** — quais arquivos cada task toca?
4. **Estimar complexidade** — 🟢 (1-2 arquivos), 🟡 (3-5), 🔴 (5+)
5. **Definir critérios de validação** — como saber que a task está concluída?

### Passo 4 — Gerar as tasks

#### Modo fase: formato completo

```markdown
### TASK N — [Título da Task]

**Objetivo:** (1 frase — o que esta task entrega)
**Complexidade:** 🟢 Baixa / 🟡 Média / 🔴 Alta
**Dependências:** Task X, Task Y (ou "Nenhuma")
**Arquivos afetados:** `portfolio/src/app/app.html`, `portfolio/src/app/app.scss`

#### Subtask N.1 — [Descrição]
(Instruções detalhadas de implementação. O que modificar, qual abordagem,
cuidados específicos do projeto — ex: manter alts, não regredir lints.)

#### Subtask N.2 — [Descrição]

#### Subtask N.M — Validação
- [ ] Rodar build sem erros: `cd portfolio && npm run build`
- [ ] Lints zerados: `npm run lint` e `npm run lint:styles`
- [ ] Verificar visualmente no dev server (se UI): `npm start`
- [ ] **Como confirmar que está correto?** (obrigatório — comando exato, teste específico ou verificação visual que comprova a entrega desta task)
```

#### Modo feature avulsa: formato simplificado

```markdown
## Tasks — [Nome da Feature]

### TASK 1 — [Título]
**Complexidade:** 🟢 Baixa
**Arquivos:** `portfolio/src/app/app.scss`
1. [Instrução concreta]
2. [Instrução concreta]
- [ ] Validar: `npm run build` sem erros
- [ ] **Como confirmar que está correto?** (obrigatório)

## Ordem
TASK 1 → TASK 2
```

### Passo 5 — Definir ordem de execução

```markdown
## Ordem de Execução

TASK 1 → TASK 2 → TASK 3 ∥ TASK 4 → TASK 5

Legenda:
→ sequencial (dependência)
∥ paralelo (independentes)
```

### Passo 6 — Preencher tabela de arquivos (modo fase)

```markdown
## Arquivos Principais Afetados

| Task | Arquivos |
|------|----------|
| 1    | `portfolio/src/app/app.html` |
| 2    | `portfolio/src/app/app.scss` |
| 3    | `portfolio/src/app/app.spec.ts` |
```

### Passo 7 — Revisar restrições

Verificar se as tasks respeitam as restrições do escopo:
- Nenhuma task altera lógica não relacionada (navegação, sidebar, scroll)?
- Nenhuma task regride a11y (Lighthouse 100/100) ou lints (0 problems)?
- Cada task deixa a aplicação em estado funcional ao final?

---

## Regras de decomposição

### Tamanho ideal de task

| Complexidade | Arquivos | Tempo estimado | Exemplo |
|---|---|---|---|
| 🟢 Baixa | 1-2 | ~30min-1h | Ajustar cor, adicionar aria-label, script de assets |
| 🟡 Média | 3-5 | 1-3h | Nova seção simples, otimização de imagens, testes novos |
| 🔴 Alta | 5+ | 3h+ | Auditoria completa, refatoração de SCSS, reestruturação de layout |

Tasks 🔴 devem ser quebradas em subtasks menores sempre que possível.

### Padrões de decomposição por tipo (portfolio)

**Feature de UI (HTML + SCSS):**
```
TASK 1 — Estrutura/layout (app.html + app.scss)
TASK 2 — Estilos responsivos (breakpoints 768px/1024px)
TASK 3 — Testes de renderização (app.spec.ts)
```

**Lógica no AppComponent (TypeScript):**
```
TASK 1 — Implementação (app.ts)
TASK 2 — Template/binding (app.html)
TASK 3 — Testes unitários (app.spec.ts — incluir casos de borda)
```

**Auditoria (a11y, responsividade, performance):**
```
TASK 1 — Baseline/auditoria (Lighthouse MCP, Playwright MCP — registrar no doc)
TASK 2 — Correções
TASK 3 — Re-auditoria + evidências (antes/depois)
```

**Assets/config (favicons, imagens, CI):**
```
TASK 1 — Gerar/ajustar assets (ImageMagick/PIL, public/)
TASK 2 — Integrar (app.html, app.scss, index.html)
TASK 3 — Testes/validação de referências
```

### Nomenclatura de tasks

- Verbos no infinitivo em português: "Criar", "Refatorar", "Remover", "Atualizar", "Auditar"
- Ser específico: "Criar skip link com padrão hidden-until-focus" (não "Criar skip link")
- Commits seguem conventional commits em inglês (tipo(escopo): descrição)

### Validação por tipo de task

| Tipo | Validação específica |
|---|---|
| UI/CSS | Visual no dev server + responsivo (320/768/1024/1440) |
| Lógica/TS | `npm run typecheck` + comportamento em happy-path e edge cases |
| Testes | `cd portfolio && npm test` (todos os testes, incluindo os existentes) |
| Assets | `ls dist/portfolio/browser/` + referências 200 no browser |
| Refatoração | Funcionalidade existente permanece inalterada + lints zerados |

**Gates obrigatórios do projeto (toda fase):**
- `npm run lint` → 0 problems
- `npm run lint:styles` → 0 problems
- `npm run typecheck` → exit 0
- `npm test` → todos passando (baseline atual: 28 testes)
- `npm run build` → budgets OK (500kB initial / 1MB max)
- Lighthouse a11y → não regredir (baseline: 100/100)

**Obrigatório para todas as tasks:** responder "Como confirmar que está correto?" com o comando exato, teste ou verificação visual que comprova a entrega.

---

## Exemplo — Modo feature avulsa

**Input (descrição):**
> "Adicionar lazy loading nas imagens dos cards de projeto."

**Output:**

```markdown
## Tasks — Lazy loading nas imagens de projeto

### TASK 1 — Adicionar loading lazy e decoding async
**Complexidade:** 🟢 Baixa
**Arquivos:** `portfolio/src/app/app.html`
1. Nas 4 `<img>` de projeto (linhas 152/182/212/237), adicionar `loading="lazy"` e `decoding="async"`
2. Manter `alt` e demais atributos intactos
- [ ] Validar: `npm run build`, `npm run lint`
- [ ] **Como confirmar que está correto?** DevTools → Network mostra as imagens de projeto com "Lazy" na coluna Timing; alts preservados no DOM

### TASK 2 — Teste de regressão
**Complexidade:** 🟢 Baixa
**Arquivos:** `portfolio/src/app/app.spec.ts`
1. Spec: cada `img[src*=".jpg"]` de projeto tem atributo `loading="lazy"`
- [ ] Validar: `npm test` todos passando
- [ ] **Como confirmar que está correto?** `npm test` verde com o novo spec

## Ordem
TASK 1 → TASK 2
```
