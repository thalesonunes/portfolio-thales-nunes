# Fase 06 — Otimização de imagens (WebP, srcset, lazy loading)

**Branch:** `feature/fase-06-otimizacao-imagens`
**Status:** ✅ Concluída

---

## Visão Geral

Otimiza as imagens do portfolio para reduzir peso de página e melhorar performance/LCP: conversão para **WebP** com fallback via `<picture>`, **srcset multi-tamanho** (480/960/1280) nas imagens de projeto, **lazy loading** nativo nas 4 imagens abaixo da dobra, otimização do **background do hero** e **remoção de 2 arquivos órfãos** (`eu.png` 1,25 MB e `public/eu-panoramico.jpg` duplicado) que incham o repositório e o dist sem serem referenciados.

Resolve o item de backlog "Otimização de imagens (WebP, srcset, lazy loading nativo)" — 100% local (ImageMagick/PIL, sem deps novas).

---

## Contexto Técnico Atual

### Inventário de imagens

| Arquivo | Local | Uso | Tamanho | Ação |
|---|---|---|---|---|
| `eu.png` | `public/` | **ÓRFÃO** — não referenciado | **1.25 MB** | 🗑️ Remover |
| `eu-panoramico.jpg` | `public/` | **ÓRFÃO** — duplicata (CSS usa `/assets/`) | 91 KB | 🗑️ Remover |
| `eu-panoramico.jpg` | `src/assets/` | Background do hero (CSS `app.scss:272` → `/assets/eu-panoramico.jpg`) | 91 KB | WebP (mantém jpg? não — hero vira webp direto) |
| `minha-guita.jpg` | `public/` | `<img>` projeto 1 | 23 KB | WebP 480/960/1280 + fallback |
| `plano-truco.jpg` | `public/` | `<img>` projeto 2 | 14 KB | WebP 480/960/1280 + fallback |
| `donedep.jpg` | `public/` | `<img>` projeto 3 | 15 KB | WebP 480/960/1280 + fallback |
| `deveria.jpg` | `public/` | `<img>` projeto 4 | 22 KB | WebP 480/960/1280 + fallback |

### Assets mapping (angular.json)
- `public/**` → raiz do dist
- `src/assets/**` → `/assets/` do dist

### Estrutura HTML atual (projetos)
```html
<img src="/minha-guita.jpg" alt="Minha Guita - Plataforma de Prática de Guitarra">
```

### Ferramentas
- ImageMagick `convert` disponível e **suporta WebP** (confirmado)
- Python PIL disponível (fallback)
- Lints zerados (Fase 03), a11y 100/100 (Fase 04 — alt texts **não podem regredir**), testes 28 (Fase 05)

---

## Tasks

### TASK 1 — Gerar WebPs multi-tamanho

**Objetivo:** Assets WebP otimizados para todos os tamanhos.
**Escopo:** `public/` e `src/assets/`.

#### Subtask 1.1 — WebP das imagens de projeto
- Para cada `*.jpg` de projeto (minha-guita, plano-truco, donedep, deveria): gerar WebP em 3 larguras — `480w`, `960w`, `1280w`
- Nomenclatura: `<nome>-480.webp`, `<nome>-960.webp`, `<nome>-1280.webp` (em `public/`)
- Qualidade: `-quality 80` (equilíbrio visual/peso); verificar tamanho resultante (meta: reduzir ≥ 50% vs jpg)

#### Subtask 1.2 — WebP do hero
- Gerar `src/assets/eu-panoramico.webp` (qualidade 80, mesma resolução da fonte ou otimizada — se a fonte for maior que o uso (cover em 100vw), considerar largura ~1920px; documentar escolha)

#### Subtask 1.3 — Validação
- [ ] `file *.webp` confirma formato; tamanhos registrados (tabela antes/depois)
- [ ] **Como confirmar que está correto?** `convert -list format` OK + `du -h` dos webp vs jpg originais; abrir os webp no browser

---

### TASK 2 — `<picture>` + srcset + lazy loading no template

**Objetivo:** HTML com imagens responsivas e carregamento preguiçoso.
**Escopo:** `app.html` (4 imagens de projeto).

#### Subtask 2.1 — Marcação `<picture>`
Para cada projeto, substituir:
```html
<picture>
  <source srcset="/minha-guita-480.webp 480w, /minha-guita-960.webp 960w, /minha-guita-1280.webp 1280w"
          sizes="(max-width: 768px) 100vw, 480px"
          type="image/webp">
  <img src="/minha-guita.jpg" alt="Minha Guita - Plataforma de Prática de Guitarra"
       loading="lazy" decoding="async" width="480" height="270">
</picture>
```
- `sizes`: avaliar o layout real do card de projeto (largura do card em desktop ≈ ? e em mobile 100vw) — definir com base no CSS real
- `width`/`height` para prevenir CLS (usar dimensões reais da imagem)
- `loading="lazy"` + `decoding="async"` nas 4 (abaixo da dobra)
- **Manter `alt` existente** (não regredir a11y)

#### Subtask 2.2 — Validação
- [ ] `npm run lint` 0 problems (regras template ok)
- [ ] Screenshot dos 4 cards: imagens renderizam (webp carregado no Chrome)
- [ ] **Como confirmar que está correto?** DevTools → Network: webp 480/960 carregados (não o jpg em browsers modernos); Lighthouse Performance melhora

---

### TASK 3 — Hero background WebP

**Objetivo:** Hero usa o WebP otimizado.
**Escopo:** `app.scss:272` + `src/assets/`.

#### Subtask 3.1 — Trocar referência
- `app.scss:272`: `url('/assets/eu-panoramico.jpg')` → `url('/assets/eu-panoramico.webp')`
- Remover `src/assets/eu-panoramico.jpg` (não será mais referenciado) — confirmar que nenhum outro lugar usa o .jpg
- Nota: background CSS não suporta `<picture>`/srcset nativamente; WebP direto com fallback via `@supports`? — avaliar: se browser não suportar webp em CSS background, o hero fica sem imagem (risco baixo — webp é suportado por todos os modernos; documentar decisão; alternativa: manter jpg como `background` e webp em `@supports (background-image: -webkit-image-set(...))` — escolher a mais simples e segura)

#### Subtask 3.2 — Validação
- [ ] Hero renderiza com a imagem (screenshot)
- [ ] **Como confirmar que está correto?** visual do hero no dev server + Network mostra webp 200

---

### TASK 4 — Remover arquivos órfãos

**Objetivo:** Limpar repositório e dist.
**Escopo:** `public/`.

#### Subtask 4.1 — Remoção
- `git rm public/eu.png` e `git rm public/eu-panoramico.jpg`
- Confirmar que nada referencia (grep por `eu.png` e `eu-panoramico` em src/) — já verificado: só `/assets/eu-panoramico` (que será o .webp)

#### Subtask 4.2 — Validação
- [ ] Build: dist sem eu.png e sem eu-panoramico.jpg na raiz
- [ ] **Como confirmar que está correto?** `ls dist/portfolio/browser/` + grep no dist por `eu.png` = 0

---

### TASK 5 — Testes e validação final

**Objetivo:** Proteger referências de imagem e comprovar ganho.
**Escopo:** `app.spec.ts` + validação geral.

#### Subtask 5.1 — Specs novos (qa)
- Teste: cada `<picture>` de projeto tem `<source type="image/webp">` com srcset (3 tamanhos) e `<img>` com `loading="lazy"` + `alt` não vazio
- Teste: todas as imagens referenciadas no template (src/srcset) existem no dist? — inviável no unit test (dist não existe no Karma); alternativa: teste de estrutura (srcset tem 3 entradas, alt presente, lazy presente)
- Testes existentes (28) preservados

#### Subtask 5.2 — Validação final
- `npm run lint` / `lint:styles` / `typecheck` / `npm test` / `npm run build` — todos verdes
- Lighthouse Performance (dev server) — comparar antes/depois (registrar números)
- Lighthouse a11y — manter 100/100

#### Subtask 5.3 — Validação
- [ ] **Como confirmar que está correto?** 5 comandos verdes + Lighthouse perf antes/depois + a11y 100

---

## Ordem de Execução

```
TASK 1 → TASK 2 → TASK 3 → TASK 4 → TASK 5
```

- TASKs 1-4: `frontend-portfolio` (assets + HTML + CSS)
- TASK 5: `qa-frontend-portfolio` (testes) + Lighthouse
- Revisão final: `review-portfolio`

Cada task deve:
1. Deixar build validado (`npm run build`), lints zerados
2. Responder "Como confirmar que está correto?" com evidência
3. Ser commitada antes de avançar

---

## Arquivos Principais Afetados

| Task | Arquivos |
|------|----------|
| 1 | `portfolio/public/*.webp` (novos), `portfolio/src/assets/eu-panoramico.webp` (novo) |
| 2 | `portfolio/src/app/app.html` |
| 3 | `portfolio/src/app/app.scss`, `portfolio/src/assets/` |
| 4 | `portfolio/public/eu.png`, `portfolio/public/eu-panoramico.jpg` (removidos) |
| 5 | `portfolio/src/app/app.spec.ts` |

---

## Restrições e Regras de Escopo

- **Manter alt texts** (não regredir a11y — Lighthouse 100/100)
- **Não alterar** layout/estilos dos cards (só o formato das imagens e marcação `<picture>`)
- Lints zerados; budgets respeitados; sem deps novas
- WebP: qualidade 80 (balancear com tamanho)
- Nomenclatura consistente: `<nome>-<largura>.webp`

---

## Critérios de Aceitação

- [ ] 12 WebPs de projeto gerados (4 imagens × 3 tamanhos) + 1 WebP do hero
- [ ] `<picture>` com srcset/sizes/type/webp + `loading="lazy"` + `decoding="async"` nas 4 imagens de projeto
- [ ] Hero usa WebP (visual idêntico)
- [ ] `eu.png` e `public/eu-panoramico.jpg` removidos (0 referências, dist limpo)
- [ ] Peso total de imagens reduzido ≥ 50% (tabela antes/depois)
- [ ] Lighthouse a11y mantido 100/100; Performance sem regressão (ideal: melhora)
- [ ] Testes: 28 existentes + novos passando
- [ ] Lints zerados, typecheck OK, build OK (budgets)
- [ ] **Para cada task: "Como confirmar que está correto?" respondido** (obrigatório)
- [ ] Revisão final (`review-portfolio`) aprovada

---

## Delta (Plano vs. Entrega)

| Aspecto | Plano | Entrega |
|---------|-------|---------|
| WebPs de projeto | 12 (4 × 3 tamanhos) | ✅ Igual — 480/960/1280w, qualidade 80, filtro Lanczos |
| `<picture>` | srcset/sizes/lazy | ✅ Igual — sizes calibrados ao CSS real (100vw/94vw/560px); width/height 600×295 (CLS 0.00); alts intactos |
| Hero WebP | WebP direto (decisão) | ✅ Igual — /assets/eu-panoramico.webp com comentário documentado |
| Órfãos | Remover 2 | ✅ Removidos 3 (eu.png 1.25MB + public/eu-panoramico.jpg + src/assets/eu-panoramico.jpg) |
| Testes | 4 novos | ✅ 32/32 — pictures, srcset 3 entries, lazy/alt/dimensões, fallback jpg |

### Entregas não previstas

- **Descoberta**: fontes dos projetos são 600×295 (menores que o assumido) — 960/1280w são upscales; ganho real está no hero (−50%) e mobile (−57%)
- JPGs originais **mantidos** em public/ como fallback (não foram removidos — apenas os órfãos)

### Pendências

- **P2**: `sizes` mobile = `100vw` ignora padding de 64px (seleciona 960w em vez de 480w em 375-700px, ~15KB total) → ajustar para `calc(100vw - 4rem)` em fase futura → backlog
- **P3**: 1280w parcialmente redundante em desktop (DPR 2 precisa 1120px) — manter ou reduzir em fase futura → backlog
- Execução real do CI pendente do incidente do GitHub Actions

---

## Commits principais

| Commit | Descrição |
|--------|-----------|
| `a53998c` | docs(fase-06): create planning for image optimization (WebP, srcset, lazy) |
| `eb8316a` | perf(images): WebP srcset, lazy loading, hero WebP and remove orphan assets |
| `09b0ad0` | test(images): cover picture webp srcset, lazy loading and jpg fallback |
