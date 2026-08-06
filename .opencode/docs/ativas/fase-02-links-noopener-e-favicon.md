# Fase 02 — Correção de segurança/SEO: rel noopener, favicon completo e typo SVG

**Branch:** `feature/fase-02-links-noopener-e-favicon`
**Status:** 📋 Planejada

---

## Visão Geral

Fase **fast-win** que limpa três pendências do backlog identificadas na revisão da Fase 01:

1. **10 links externos** com `target="_blank"` sem `rel="noopener noreferrer"` (vulnerabilidade `window.opener` — permite phishing via abas filhas)
2. **Favicon incompleto** — existe apenas `favicon.ico`; falta apple-touch-icon (iOS), manifest (PWA/browsers) e `theme-color`
3. **Typo em 4 SVGs do ícone GitHub** (`3.297-1.30` vs `3.297-1.23` correto) nos cards de projetos

Sem dependência externa — ícones gerados localmente (ImageMagick/PIL) a partir do `favicon.ico` existente. Implementável 100% local (deploy fica pendente do incidente global do GitHub Actions).

---

## Contexto Técnico Atual

### Arquivos relevantes

```
portfolio/
├── public/
│   ├── favicon.ico              ← único favicon existente
│   └── *.jpg (imagens de projetos)
└── src/
    ├── index.html               ← meta tags + <link rel="icon">
    └── app/app.html             ← 321 linhas; 10 links externos + 5 SVGs GitHub
```

### Estado atual dos itens

**Links sem `rel` (10):**
| Linha | Link | Seção |
|---|---|---|
| 26 | GitHub (sidebar) | Sidebar |
| 31 | LinkedIn (sidebar) | Sidebar |
| 153 | GitHub minha-guita | Projetos |
| 158 | deploy minha-guita | Projetos |
| 183 | GitHub plano-truco | Projetos |
| 188 | deploy plano-truco | Projetos |
| 213 | GitHub donedep | Projetos |
| 238 | GitHub deveria | Projetos |
| 309 | LinkedIn | Contato |
| 313 | WhatsApp | Contato |

**Typo SVG (4 ocorrências):** linhas 155, 185, 215, 240 — `3.297-1.30.653 1.653` deve ser `3.297-1.23.653 1.653` (como na linha 28 da sidebar, path correto).

**Favicon:** `public/favicon.ico` (15 kB) + `<link rel="icon" type="image/x-icon" href="/favicon.ico">` no index.html. Sem apple-touch-icon, sem manifest, sem theme-color.

**Bug pré-existente (regra do escoteiro):** `index.html` linha 22 — `<meta property="og:description" ...>` **sem fechamento** (`>` em vez de `/>`), HTML inválido que pode quebrar o parse das metas sociais seguintes (og:type, og:url, twitter:card).

### Convenções e regras atuais

- Design tokens em `portfolio/src/styles.scss`: `--bg-primary: #020008`, `--accent-primary: #ff6b35`
- Budgets: 500kB initial / 1MB max; 25kB/30kB style por componente
- Links externos devem ter `rel="noopener noreferrer"` (security.instructions.md)
- Assets estáticos em `public/` (servidos na raiz `/`)
- Sem lint configurado — validar via build e testes

---

## Tasks

### TASK 1 — `rel="noopener noreferrer"` nos links externos + correção do typo SVG

**Objetivo:** Eliminar a vulnerabilidade `window.opener` e padronizar os ícones GitHub.
**Escopo:** `app.html` apenas.

#### Subtask 1.1 — Adicionar `rel="noopener noreferrer"` nos 10 links
- Adicionar `rel="noopener noreferrer"` em cada `<a target="_blank">` das linhas 26, 31, 153, 158, 183, 188, 213, 238, 309, 313
- Manter atributos existentes intactos (title, class, href)

#### Subtask 1.2 — Corrigir typo nos paths SVG
- Linhas 155, 185, 215, 240: substituir `3.297-1.30.653 1.653` por `3.297-1.23.653 1.653`
- Resultado final deve ser **idêntico** ao path da linha 28

#### Subtask 1.3 — Validação
- [ ] `npm run build` sem erros
- [ ] **Como confirmar que está correto?** `grep -c 'target="_blank"' app.html` == `grep -c 'rel="noopener noreferrer"' app.html` (10/10) e `grep -c '1\.30' app.html` == 0
- [ ] Visual no `npm start`: ícones GitHub dos 4 projetos renderizam como o da sidebar

---

### TASK 2 — Favicon set completo (apple-touch-icon, manifest, theme-color)

**Objetivo:** Cobertura de favicon para iOS/Android/desktop + cor de tema do browser.
**Escopo:** `public/` + `index.html`.

#### Subtask 2.1 — Gerar PNGs derivados do `favicon.ico`
- `apple-touch-icon.png` (180×180) — usado pelo iOS em "Adicionar à tela inicial"
- `icon-192x192.png` (192×192) — ícone Android/manifest
- `icon-512x512.png` (512×512) — ícone maior manifest/PWA
- Fonte: `public/favicon.ico` (converter com ImageMagick `convert` ou Python PIL; se o .ico tiver múltiplos tamanhos, usar o maior)

#### Subtask 2.2 — Criar `public/manifest.webmanifest`
- `name`: "Thales Nunes - Software Engineer"
- `short_name`: "Thales Nunes"
- `start_url`: "/", `display`: "standalone", `background_color`/`theme_color`: `#020008`
- `icons`: 192×192 e 512×512 (type image/png, purpose "any maskable" se aplicável)

#### Subtask 2.3 — Atualizar `index.html`
- Adicionar `<link rel="apple-touch-icon" href="/apple-touch-icon.png">`
- Adicionar `<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">` e `16x16` (se gerados)
- Adicionar `<link rel="manifest" href="/manifest.webmanifest">`
- Adicionar `<meta name="theme-color" content="#020008">`
- **Escoteiro:** corrigir a meta `og:description` sem fechamento (linha 22: `>` → `/>`)

#### Subtask 2.4 — Validação
- [ ] `npm run build` sem erros e assets copiados para `dist/portfolio/browser/` (verificar `ls dist/portfolio/browser/` contém manifest.webmanifest e PNGs)
- [ ] **Como confirmar que está correto?** `npm start` + DevTools: favicon carrega; `curl`/browser em `/manifest.webmanifest` retorna JSON válido; inspecionar `<head>` com os novos links
- [ ] Ícones abrem corretamente (ex: `file`/browser direto em `/apple-touch-icon.png`)

---

### TASK 3 — Teste unitário: links externos com `rel` + escopo geral

**Objetivo:** Prevenir regressão da correção de segurança.
**Escopo:** `app.spec.ts`.

#### Subtask 3.1 — Teste de links externos
- Renderizar o componente e coletar todos os `<a[target="_blank"]>`
- Verificar que **todos** têm `rel="noopener noreferrer"` (atributo `rel` presente e contém ambos os tokens)
- Caminho feliz: falha se qualquer link externo não tiver o rel

#### Subtask 3.2 — Validação
- [ ] **Como confirmar que está correto?** `npm test` com o novo teste passando; `npm run build` sem erros
- [ ] Testes existentes (13) continuam passando

---

## Ordem de Execução

```
TASK 1 → TASK 2 → TASK 3
```

- TASK 1 e 2: `frontend-portfolio` (implementação, podem ser sequenciais no mesmo agente)
- TASK 3: `qa-frontend-portfolio` (testes)
- Após todas: `review-portfolio` (validação final — correção, estilo, a11y, SEO, performance)

Cada task deve:
1. Deixar build validado (`npm run build`)
2. Responder "Como confirmar que está correto?" com evidência
3. Ser commitada antes de avançar

---

## Arquivos Principais Afetados

| Task | Arquivos |
|------|----------|
| 1 | `portfolio/src/app/app.html` |
| 2 | `portfolio/public/*.png`, `portfolio/public/manifest.webmanifest`, `portfolio/src/index.html` |
| 3 | `portfolio/src/app/app.spec.ts` |

---

## Restrições e Regras de Escopo

- **Não alterar** lógica de navegação, estilos ou layout
- **Não alterar** configurações de build/angular.json (assets de `public/` já são copiados automaticamente)
- **Manter** funcionalidades existentes intactas
- Cada task deve deixar a aplicação em estado funcional
- Respeitar budgets de produção
- Links externos: `rel="noopener noreferrer"` obrigatório (security.instructions.md)

---

## Critérios de Aceitação

- [ ] 10/10 links externos com `rel="noopener noreferrer"`
- [ ] 0 ocorrências de `1.30` nos SVGs (paths alinhados com a sidebar)
- [ ] `apple-touch-icon.png`, `manifest.webmanifest`, `theme-color` presentes e válidos
- [ ] Meta `og:description` corrigida (HTML válido no `<head>`)
- [ ] Teste de regressão de `rel` adicionado e passando
- [ ] **Para cada task: "Como confirmar que está correto?" respondido** (obrigatório)
- [ ] Testes passando: `npm test`
- [ ] Build sem erros: `npm run build`
- [ ] Revisão final (`review-portfolio`) aprovada
