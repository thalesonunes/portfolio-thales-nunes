---
name: "Regra do Escoteiro"
description: "Sempre que editar um arquivo, corrija problemas pré-existentes que encontrar — deixe o código mais limpo do que encontrou."
applyTo: "portfolio/src/**/*.ts,portfolio/src/**/*.html,portfolio/src/**/*.scss,portfolio/*.json"
---

# Regra do Escoteiro — Portfolio Thales Nunes

Sempre que modificar um arquivo, identifique e corrija problemas pré-existentes no caminho:

## O que corrigir
- **Testes falhando**: se um teste falha por bug ou mock incompleto, corrija no mesmo PR
- **Warnings de build/lint**: elimine warnings nos arquivos editados (`npm run build` não deve gerar warnings)
- **Imports não utilizados**: remova imports que não são usados
- **Problemas de tipo**: variáveis `any` que podem ser tipadas
- **Código morto**: código comentado, variáveis não usadas, branches que nunca executam
- **Acessibilidade**: alt texts faltando, contraste, semântica HTML

## O que NÃO fazer
- Refatorar código não relacionado ao escopo da tarefa
- Mudar APIs ou contratos sem necessidade
- Introduzir dependências novas para corrigir problemas pequenos

## Prioridade
| Tipo | Ação |
|---|---|
| Teste falhando | Corrigir |
| Warning de build | Corrigir |
| Código morto/morto aparente | Remover |
| Comentário desatualizado | Atualizar ou remover |
| Acessibilidade | Corrigir |