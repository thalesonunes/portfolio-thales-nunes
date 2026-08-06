---
name: finalizar-fase
description: Finaliza uma fase concluída — move o documento de ativas/ para concluidas/, atualiza status e README, registra delta de entregas e pendências, atualiza o backlog, cria a PR no GitHub e sincroniza o ambiente local.
---

# Skill: finalizar-fase

Finaliza uma fase de desenvolvimento concluída, movendo a documentação de `ativas/` para `concluidas/` e atualizando todos os índices.

## Quando usar

- Após todos os commits da fase estarem na branch e a PR ter sido mergeada
- Para arquivar formalmente uma fase e manter o histórico organizado
- Antes de iniciar o planejamento da próxima fase

## Pré-requisitos

- A fase está implementada, testada e mergeada
- O documento da fase existe em `.opencode/docs/ativas/fase-XX-nome.md`
- O arquivo `.opencode/docs/README.md` está atualizado com a fase em "Ativas"
- O backlog (`.opencode/docs/backlog.md`) reflete o estado atual

## Workflow

```
Passo 1 (identificar) → Passo 2 (atualizar doc) → Passo 3 (mover) → Passo 4 (README) → Passo 5 (backlog) → Passo 6 (commit) → Passo 7 (PR + merge) → Passo 8 (ambiente local)
```
Passos 1-6 são sempre executados. Passo 7 requer permissão do desenvolvedor. Passo 8 é recomendado mas opcional.

### Passo 1 — Identificar a fase

- Confirmar o número e nome da fase a ser finalizada
- Ler o documento em `.opencode/docs/ativas/fase-XX-nome.md`
- Verificar se há itens pendentes registrados no próprio documento

### Passo 2 — Atualizar o documento da fase

No arquivo da fase, fazer as seguintes alterações:

#### 2.1 — Atualizar status
```diff
-**Status:** 📋 Planejada
+**Status:** ✅ Concluída
```

#### 2.2 — Adicionar seção de Delta (se não existir)

Adicionar ao final do documento, antes dos Critérios de Aceitação:

```markdown
## Delta (Plano vs. Entrega)

| Aspecto | Plano | Entrega |
|---------|-------|---------|
| [item] | [planejado] | [realizado] |

### Entregas não previstas

- [item que surgiu durante o desenvolvimento]
- [refinamento de UI ou regra adicional]

### Pendências

- [item não concluído — justificativa e se vai para backlog]
```

Regras para o delta:
- **Sempre** incluir a tabela Delta com as diferenças relevantes
- Listar entregas não previstas (ex: correções de bugs encontrados, componentes extras)
- Pendências devem ter justificativa e indicação se vão para o backlog

#### 2.3 — Referenciar commits principais

Adicionar seção com os commits mais relevantes:

```markdown
## Commits principais

| Commit | Descrição |
|--------|-----------|
| `abc1234` | feat(hero): redesign hero section |
| `def5678` | fix(nav): smooth scroll behavior |
```

### Passo 3 — Mover para concluídas

```bash
mv .opencode/docs/ativas/fase-XX-nome.md .opencode/docs/concluidas/fase-XX-nome.md
```

### Passo 4 — Atualizar README

Em `.opencode/docs/README.md`:

1. Remover a linha da fase da tabela "Fases Ativas"
2. Adicionar a linha na tabela "Fases Concluídas" (manter ordem numérica)

```diff
-## Fases Ativas
-| XX | Nome da Fase | 📋 Planejada |
-
 ## Fases Concluídas
+| XX | Nome da Fase | ✅ Concluída |
```

### Passo 5 — Atualizar backlog (se necessário)

Em `.opencode/docs/backlog.md`:

- Marcar itens implementados nesta fase como `✅` (se ainda constarem como `💡`)
- Adicionar novas pendências identificadas durante a fase
- Remover itens que foram resolvidos

### Passo 6 — Commit

```bash
git add .opencode/docs/
git commit -m "docs: finalizar Fase XX — [nome da fase]"
git push origin feature/fase-XX-nome
```

### Passo 7 — Criar e mergear PR

Após o push, criar a PR e mergear no GitHub:

```bash
gh pr create \
  --base main \
  --head feature/fase-XX-nome \
  --title "Fase XX: tipo(escopo): descrição" \
  --body "Descrição consolidada com entregas, números e pendências."

gh pr merge <N> --merge
```

⚠️ **Nunca usar `--squash` nem `--delete-branch`.** Branches são mantidos para sempre.

### Passo 8 — Atualizar ambiente local (recomendado)

Após o merge, voltar para a branch base e sincronizar o ambiente local.

#### 8.1 — Sincronizar código

```bash
git checkout main
git pull origin main
```

#### 8.2 — Verificar ambiente

Após pull, validar que tudo funciona:

```bash
# Build de produção
cd portfolio && npm run build

# Dev server (opcional)
npm start
```

**Regra de decisão:**

| A fase alterou... | Ação |
|---|---|
| Frontend (Angular, SCSS, assets, HTML) | `npm run build` + `npm start` |
| Config (angular.json, package.json, vercel.json) | `npm run build` |
| Apenas docs/harness | `git pull` basta |

## Template do documento finalizado

```markdown
# Fase XX — [Título]

**Branch:** `feature/fase-XX-nome`
**Status:** ✅ Concluída

---

[documentação original da fase...]

---

## Delta (Plano vs. Entrega)

| Aspecto | Plano | Entrega |
|---------|-------|---------|
| | | |

### Entregas não previstas

- 

### Pendências

- 

---

## Commits principais

| Commit | Descrição |
|--------|-----------|
| | |
```

## Exemplo

### Antes (em ativas/)
```markdown
# Fase 01 — Hero Section Redesign
**Status:** 📋 Planejada
```

### Depois (em concluidas/)
```markdown
# Fase 01 — Hero Section Redesign
**Branch:** `feature/fase-01-hero-redesign`
**Status:** ✅ Concluída

[...documentação original...]

## Delta (Plano vs. Entrega)

| Aspecto | Plano | Entrega |
|---------|-------|---------|
| Paleta de cores | 3 cores | 4 cores (adicionado accent) |
| Animação entrada | Fade | Slide + fade |

### Entregas não previstas
- Otimização de imagens do hero (WebP + lazy load)
- Ajuste de contraste para WCAG AA

### Pendências
- Teste de performance no mobile → backlog

## Commits principais

| Commit | Descrição |
|--------|-----------|
| `a1b2c3d` | feat(hero): redesign hero section com novos tokens |
| `e4f5g6h` | fix(hero): imagens otimizadas e lazy load |
| `i7j8k9l` | chore(a11y): contraste WCAG AA no hero |
```

## Convenções

- O delta **deve refletir o que realmente foi entregue**, não o plano original
- Pendências devem ser acionáveis (indicar se vão para backlog ou fase futura)
- Commits principais: listar 3-5 mais representativos, não todos
- Manter o idioma português (exceto termos técnicos)