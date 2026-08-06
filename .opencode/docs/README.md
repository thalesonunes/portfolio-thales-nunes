# Documentação de Fases — Portfolio Thales Nunes

Índice central para acompanhar o planejamento e execução de fases de desenvolvimento.

---

## Fases Ativas

| Nº | Nome da Fase | Status | Documento |
|----|--------------|--------|-----------|
|    |              |        |           |

---

## Fases Concluídas

| Nº | Nome da Fase | Status | Documento |
|----|--------------|--------|-----------|
|    |              |        |           |

---

## Convenções

- Fases em planejamento/desenvolvimento ficam em `ativas/`
- Fases concluídas são movidas para `concluidas/`
- Números são sequenciais (último + 1)
- Branches seguem padrão `feature/fase-XX-nome-curta`
- Commits seguem conventional commits em inglês

## Workflow

1. **Refinar escopo** → `/refinar-escopo` (antes de planejar)
2. **Criar fase** → `/criar-fase` (gera documento em `ativas/`)
3. **Implementar** na branch da fase
4. **Finalizar fase** → `/finalizar-fase` (move para `concluidas/`, atualiza README, backlog, cria PR)