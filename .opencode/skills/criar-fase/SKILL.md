---
name: criar-fase
description: Cria uma nova fase de desenvolvimento seguindo as convenções do projeto (.opencode/docs/). Gera documento de planejamento com template completo, tasks, ordem de execução e critérios de aceitação.
---

Cria uma nova fase de desenvolvimento seguindo as convenções estabelecidas no diretório `.opencode/docs/`.

## Quando usar

- Iniciar o planejamento de uma nova feature, refatoração ou milestone no portfolio
- Criar documentação estruturada para uma fase antes de começar a implementar
- Seguir o workflow padrão: documentar → planejar → implementar → arquivar

## Pré-requisitos

Antes de criar a fase, verifique:
1. O número da fase — consulte `.opencode/docs/README.md` e `.opencode/docs/concluidas/` para determinar o próximo número
2. Se já existe uma fase com escopo similar — evite duplicação
3. Se há dependências de fases anteriores não concluídas

## Workflow

### Passo 1 — Determinar o número e nome da fase

- O número é sequencial (último + 1), baseado nas fases já concluídas ou planejadas
- O nome segue o padrão `fase-XX-descricao-curta.md`
- Exemplos: `fase-01-hero-section-redesign.md`, `fase-02-contact-form.md`

### Passo 2 — Criar o documento de planejamento

Criar `.opencode/docs/ativas/fase-XX-nome.md` com a seguinte estrutura:

```markdown
# Fase XX — [Título Descritivo]

**Branch:** `feature/fase-XX-nome-curto`
**Status:** 📋 Planejada

---

## Visão Geral

(2-3 parágrafos descrevendo o objetivo geral da fase, o problema que resolve e o valor que entrega.)

---

## Contexto Técnico Atual

### Estrutura de componentes/arquivos relevantes

```
app/
├── app.ts          ← componente principal
├── app.html        ← template com todas as seções
└── app.scss        ← estilos SCSS
```

### Layout atual (se aplicável)

Descrever o estado atual da UI/UX que será modificada.

### Convenções e regras atuais

Listar regras de escopo, padrões de código, ou contratos relevantes (ex: budgets, a11y, SEO).

---

## Tasks

### TASK 1 — [Título da Task]

**Objetivo:** (O que esta task entrega)
**Escopo:** (O que está dentro e fora do escopo)

#### Subtask 1.1 — [Descrição]
(Instruções detalhadas de implementação — o que modificar, quais arquivos, qual abordagem.)

#### Subtask 1.2 — [Descrição]

#### Subtask 1.N — Validação
- [ ] Item de checklist para validar conclusão
- [ ] **Como confirmar que está correto?** (obrigatório — descrever o teste, comando ou verificação visual que comprova a entrega)
- [ ] Rodar build sem erros: `npm run build`
- [ ] Verificar visualmente no dev server: `npm start`

---

### TASK 2 — [Título da Task]
...

---

### TASK N — [Título da Task]
...

---

## Ordem de Execução

```
TASK 1 → TASK 2 → TASK 3 → ... → TASK N
```

Tasks independentes podem ser paralelizadas (marcar com `∥`).

Cada task deve ser:
1. Implementada na branch da fase
2. Build validado (`npm run build`)
3. Aplicação rodando via `npm start` com visual confirmado (se UI)
4. **Responder "Como confirmar que está correto?"** com evidência concreta (comando, teste, screenshot)
5. Commit com mensagem descritiva antes de avançar

---

## Arquivos Principais Afetados

| Task | Arquivos |
|------|----------|
| 1    | `portfolio/src/app/app.ts`, `portfolio/src/app/app.scss` |
| 2    | `portfolio/src/app/app.html` |

---

## Restrições e Regras de Escopo

- **Não alterar** lógica não relacionada à fase
- **Não alterar** configurações de build/angular.json sem necessidade
- **Manter** funcionalidades existentes intactas
- Cada task deve deixar a aplicação em estado funcional
- Respeitar budgets de produção: 500kB initial / 1MB max, 25kB/30kB component style

---

## Critérios de Aceitação

- [ ] Critério 1
- [ ] Critério 2
- [ ] **Para cada task: "Como confirmar que está correto?" respondido** (obrigatório)
- [ ] Testes passando: `npm test`
- [ ] Build sem erros: `npm run build`

---

## Passo 3 — Atualizar o índice de fases

Atualizar `.opencode/docs/README.md` adicionando a nova fase na tabela "Fases Ativas":

```markdown
| XX | Nome da Fase | 📋 Planejada | `fase-XX-nome.md` |
```

### Passo 4 — Criar a branch

```bash
git checkout -b feature/fase-XX-nome-curto
```

### Passo 5 — Após conclusão da fase

1. Mover o arquivo da fase para `.opencode/docs/concluidas/`
2. Atualizar `.opencode/docs/concluidas/README.md` adicionando a fase concluída
3. Atualizar o status no documento original para `✅ Concluída`

---

## Template simplificado (para fases menores)

Para fases com escopo reduzido (single feature, correção grande, etc.), usar:

```markdown
# [Título] - Fase XX: [Assunto]

## Visão Geral
## Objetivos
## Tasks
## Critérios de Aceitação
## Arquivos Afetados
```

---

## Convenções de nomenclatura

| Elemento | Padrão | Exemplo |
|---|---|---|
| Arquivo da fase | `fase-XX-descricao-curta.md` | `fase-01-hero-redesign.md` |
| Branch | `feature/fase-XX-descricao-curta` | `feature/fase-01-hero-redesign` |
| Commits | Seguir `.gitmessage` (tipo(escopo): descrição, imperativo) | `feat(hero): redesign hero section` |

## Status

| Ícone | Significado |
|---|---|
| 📋 | Planejada |
| ⚠️ | Em Desenvolvimento |
| ✅ | Concluída |
| 🚫 | Cancelada |
| 🔄 | Refatoração |