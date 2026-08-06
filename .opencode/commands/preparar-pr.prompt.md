---
description: Preparar uma Pull Request com título, resumo, testes e riscos para o portfolio.
name: preparar-pr
agent: fullstack-portfolio
---

Prepare uma Pull Request pronta para revisão do portfolio.

## Objetivo
- Resumir a mudança com clareza
- Explicar impacto funcional e técnico (frontend Angular)
- Deixar explícito o que foi testado
- Apontar riscos, pendências e rollback, se houver

## Instruções
- Leia a diff e identifique o propósito principal da mudança
- Estruture a PR para alguém que não viu o contexto anterior
- Use português objetivo e tom profissional
- Não invente testes, decisões ou resultados
- Se faltar informação, marque como pendente em vez de supor
- Se houver alteração de contrato visível externamente (SEO, meta tags, links), classifique como breaking change e documente o impacto

## Entrega
- Título sugerido da PR (prefixo: feat/fix/refactor/chore/breaking)
- Resumo executivo em 3 a 5 linhas
- Tipo de mudança identificado
- Lista de mudanças relevantes (frontend / assets / config / docs)
- Testes executados (`npm test`, `npm run build`)
- Breaking changes, se houver
- Impactos e riscos (performance, acessibilidade, SEO, responsividade)
- Checklist de revisão
- Sugestão de rollback, quando aplicável