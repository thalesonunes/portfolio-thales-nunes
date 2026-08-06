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
| 01 | Cálculo automático de experiência (Sobre Mim) | ✅ Concluída | `fase-01-calculo-experiencia.md` |
| 02 | Correção segurança/SEO: rel noopener, favicon e typo SVG | ✅ Concluída | `fase-02-links-noopener-e-favicon.md` |
| 03 | Lint (ESLint + stylelint) e typecheck com CI | ✅ Concluída | `fase-03-lint-typecheck.md` |
| 04 | Acessibilidade: Auditoria WCAG 2.1 AA + Correções | ✅ Concluída | `fase-04-acessibilidade.md` |

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