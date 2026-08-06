---
name: "Segurança"
description: "Regras básicas para o portfolio (projeto estático, sem backend)."
applyTo: "portfolio/src/**/*.ts,portfolio/src/**/*.html"
---

# Segurança — Portfolio Thales Nunes

## Contexto
Projeto **frontend-only** (Angular SPA estático). Não há backend, autenticação, banco de dados ou APIs sensíveis.

## Boas práticas
- Não exponha segredos, tokens ou chaves no código (mesmo que não haja backend)
- Links externos (`target="_blank"`) devem ter `rel="noopener noreferrer"`
- Sanitize qualquer input do usuário se houver formulários (ex: contato)
- Content Security Policy: configurada no Vercel (`vercel.json` apenas `"public": true`)
- HTTPS forçado pelo Vercel