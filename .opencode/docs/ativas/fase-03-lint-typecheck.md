# Fase 03 — Lint (ESLint + stylelint) e typecheck com CI

**Branch:** `feature/fase-03-lint-typecheck`
**Status:** 📋 Planejada

---

## Visão Geral

Configura o ferramental de qualidade de código no portfolio (hoje **inexistente**): ESLint 9 + angular-eslint (TS e templates HTML) com regras **recommended + type-checked**, stylelint para SCSS, script de typecheck explícito e integração no pipeline CI (workflow de deploy). Todos os problemas apontados pelos linters no código atual serão **corrigidos** (decisão do desenvolvedor: "corrigir tudo"), deixando o projeto 100% limpo.

Resolve o item de backlog "Lint (ESLint + angular-eslint + stylelint)" e prepara o terreno para o item "CI com lint + typecheck + test + build".

> ⚠️ Contexto: o GitHub Actions está em incidente global (major outage) — a config do CI é **preparada** nesta fase e será validada quando o GitHub se recuperar. Implementação, lint, typecheck, testes e build são 100% locais.

---

## Contexto Técnico Atual

### Stack

- Angular **20** (standalone, single-component), TypeScript **~5.8.2**, SCSS
- Sem ESLint, sem stylelint, sem script de typecheck
- Scripts npm atuais: `ng`, `start`, `build`, `watch`, `test`
- tsconfigs: `tsconfig.json`, `tsconfig.app.json`, `tsconfig.spec.json`
- Workflow CI único: `.github/workflows/vercel-deploy.yml` (build + deploy Vercel, roda em push para `main`)

### Arquivos que o lint vai analisar

```
portfolio/src/
├── app/
│   ├── app.ts        (66 linhas)
│   ├── app.html      (321 linhas — templates)
│   ├── app.scss      (~1000+ linhas)
│   └── app.spec.ts   (~200 linhas)
├── main.ts
├── styles.scss
└── index.html
```

### Convenções e regras atuais

- Budgets de produção: 500kB initial / 1MB max; 25kB/30kB style
- Conventional commits (hooks locais)
- Projeto **frontend-only**, sem backend

---

## Tasks

### TASK 1 — Setup ESLint + angular-eslint (recommended + type-checked)

**Objetivo:** Lint funcional de TS e templates HTML com scripts npm.
**Escopo:** Config + deps + scripts. Nenhuma correção de código nesta task.

#### Subtask 1.1 — Instalar dependências (devDeps)
- `eslint` (^9, flat config)
- `@eslint/js`
- `typescript-eslint` (parser + plugin, com suporte a type-checked)
- `angular-eslint` (pacote unificado v19+ para Angular 20: `@angular-eslint/eslint-plugin` + `@angular-eslint/template` + `@angular-eslint/eslint-plugin-template`)
- Versões compatíveis com Angular 20 / ESLint 9 (verificar peer deps; usar `npm i -D` e validar `npm ls`)

#### Subtask 1.2 — Criar `eslint.config.mjs` (flat config)
- Config base `js.configs.recommended`
- Config TS `tseslint.configs.recommended` + `tseslint.configs.recommendedTypeChecked` (parserOptions.projectService)
- Configs `angular-eslint.configs.recommended` e `angular-eslint.template.configs.recommended` (para `*.html`)
- Ignorar: `dist/`, `node_modules/`, `.angular/`
- Aplicar as configs de template apenas a `**/*.html`

#### Subtask 1.3 — Scripts npm em `portfolio/package.json`
- `"lint": "eslint ."`
- `"lint:fix": "eslint . --fix"`

#### Subtask 1.4 — Validação
- [ ] `npm run lint` roda sem erro de configuração (pode listar problemas do código atual — NÃO corrigir nesta task)
- [ ] **Como confirmar que está correto?** `npm run lint` executa e mostra contagem de problemas (erros/warnings) sem crash

---

### TASK 2 — Setup stylelint (SCSS)

**Objetivo:** Lint de estilos com script próprio.
**Escopo:** Config + deps + scripts.

#### Subtask 2.1 — Instalar dependências (devDeps)
- `stylelint` (^16)
- `stylelint-config-standard-scss` (config padrão com suporte a SCSS)

#### Subtask 2.2 — Criar `.stylelintrc.json` (ou `stylelint.config.mjs`)
- `extends: ["stylelint-config-standard-scss"]`
- `customSyntax` se necessário para SCSS moderno
- Ignorar `dist/`, `node_modules/`

#### Subtask 2.3 — Script npm
- `"lint:styles": "stylelint \"src/**/*.scss\""`
- `"lint:styles:fix": "stylelint \"src/**/*.scss\" --fix"`

#### Subtask 2.4 — Validação
- [ ] `npm run lint:styles` roda sem erro de config
- [ ] **Como confirmar que está correto?** comando executa e lista problemas (se houver) sem crash

---

### TASK 3 — Typecheck explícito

**Objetivo:** Verificação de tipos independente do build.
**Escopo:** Scripts + tsconfig (se necessário).

#### Subtask 3.1 — Script npm
- `"typecheck": "tsc --noEmit -p tsconfig.app.json && tsc --noEmit -p tsconfig.spec.json"`
- Validar que os dois tsconfigs têm `noEmit` compatível (tsconfig.base pode precisar de `"noEmit": true` ou uso de `--noEmit` no CLI)

#### Subtask 3.2 — Validação
- [ ] `npm run typecheck` passa sem erros
- [ ] **Como confirmar que está correto?** comando retorna exit 0

---

### TASK 4 — Corrigir TODOS os problemas apontados pelos linters

**Objetivo:** Projeto 100% limpo (0 erros, 0 warnings) em ESLint e stylelint.
**Escopo:** `app.ts`, `app.spec.ts`, `app.html`, `app.scss`, `styles.scss`, `main.ts` — apenas correções apontadas pelos linters (sem refatoração funcional).

#### Subtask 4.1 — Rodar lints e inventariar problemas
- `npm run lint` e `npm run lint:styles` → listar todos os erros/warnings por arquivo

#### Subtask 4.2 — Corrigir problemas de TS/templates
- Tipos `any` que podem ser tipados, imports não usados, variáveis não usadas, `@typescript-eslint/no-explicit-any`, regras de template (acessibilidade/estrutura) — **todas** as regras apontadas
- Usar `--fix` para autocorrigíveis e corrigir manualmente o restante
- ⚠️ Atenção: com type-checked, `app.spec.ts` pode exigir ajustes de tipos nos mocks (ex: `MockDate: any` → tipar como `typeof Date` ou interface)
- ⚠️ Templates: regras `@angular-eslint/template` podem apontar acessibilidade (ex: elementos clicáveis sem role, alt faltando) — corrigir o que for apontado, **sem mudar layout/estilos**

#### Subtask 4.3 — Corrigir problemas de SCSS
- Regras stylelint (ordenação de propriedades? formatação, cores, unidades, etc. conforme config standard-scss)
- Usar `--fix` e corrigir manualmente o que sobrar

#### Subtask 4.4 — Validação
- [ ] `npm run lint` → **0 problemas**
- [ ] `npm run lint:styles` → **0 problemas**
- [ ] `npm run typecheck` → sem erros
- [ ] `npm run build` → sem erros, budgets OK
- [ ] `npm test` → 15/15 passando
- [ ] **Como confirmar que está correto?** os 4 comandos acima retornam exit 0 e testes passam; verificação visual rápida com `npm start` (nenhuma mudança visual esperada)

---

### TASK 5 — CI: lint + typecheck no workflow de deploy

**Objetivo:** Pipeline CI com as novas verificações antes do build/deploy.
**Escopo:** `.github/workflows/vercel-deploy.yml`.

#### Subtask 5.1 — Adicionar steps no workflow
- Após "Install dependencies", antes de "Build project":
  - Step `Lint`: `npm run lint` (working-directory `./portfolio`)
  - Step `Lint styles`: `npm run lint:styles`
  - Step `Typecheck`: `npm run typecheck`
- Manter os steps existentes (build + deploy) intactos

#### Subtask 5.2 — Validação
- [ ] YAML válido (validar com `python3 -c "import yaml..."` ou editor)
- [ ] **Como confirmar que está correto?** validação de sintaxe YAML + revisão do diff; execução real fica pendente do GitHub Actions (incidente) — registrar no delta

---

## Ordem de Execução

```
TASK 1 → TASK 2 → TASK 3 → TASK 4 → TASK 5
```

- TASKs 1-3 e 5: `frontend-portfolio` (config/setup)
- TASK 4: `frontend-portfolio` (correções) — pode ser iterativa, rodar lints até zerar
- Após TASK 4: `qa-frontend-portfolio` (confirmar testes) + `review-portfolio` (validação final)

Cada task deve:
1. Deixar a aplicação em estado funcional
2. Responder "Como confirmar que está correto?" com evidência
3. Ser commitada antes de avançar

---

## Arquivos Principais Afetados

| Task | Arquivos |
|------|----------|
| 1 | `portfolio/eslint.config.mjs`, `portfolio/package.json`, `portfolio/package-lock.json` |
| 2 | `portfolio/.stylelintrc.json`, `portfolio/package.json` |
| 3 | `portfolio/package.json`, possivelmente `portfolio/tsconfig*.json` |
| 4 | `portfolio/src/**` (app.ts, app.spec.ts, app.html, app.scss, styles.scss, main.ts) |
| 5 | `.github/workflows/vercel-deploy.yml` |

---

## Restrições e Regras de Escopo

- **Não alterar** comportamento funcional: correções de lint são mecânicas (tipos, imports, formatação), sem mudar lógica
- **Não alterar** layout/estilos visuais: stylelint corrige formatação/regras, não design
- **Não remover** funcionalidades existentes
- Budgets de produção devem continuar OK (286 kB initial)
- Não usar `any` novo; não adicionar `eslint-disable` sem justificativa
- Dependências novas apenas como devDeps

---

## Critérios de Aceitação

- [ ] `npm run lint` → 0 problemas (erros E warnings)
- [ ] `npm run lint:styles` → 0 problemas
- [ ] `npm run typecheck` → exit 0
- [ ] `npm test` → 15/15 passando
- [ ] `npm run build` → sem erros, budgets OK
- [ ] CI atualizado com lint + typecheck (YAML válido)
- [ ] **Para cada task: "Como confirmar que está correto?" respondido** (obrigatório)
- [ ] Revisão final (`review-portfolio`) aprovada
