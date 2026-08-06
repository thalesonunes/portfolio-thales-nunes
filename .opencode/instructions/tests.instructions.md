---
name: "Testes"
description: "Convenções para testes Jasmine/Karma no portfolio Angular."
applyTo: "portfolio/src/**/*.spec.ts"
---

# Testes — Portfolio Thales Nunes

## Frontend (Jasmine / Karma)
- Use `TestBed.configureTestingModule` com `HttpClientTestingModule` se necessário
- Cubra behaviors do componente principal: renderização de seções, navegação suave, responsividade
- Teste outputs e interações do usuário (cliques, scroll, toggle mobile)
- Evite testes frágeis presos a detalhes de implementação (classes CSS, estrutura exata do DOM)

## Comandos
```bash
npm test           # roda testes (Karma/Jasmine)
npm run watch      # build incremental para desenvolvimento
```

## Cobertura
- Foco em: Hero section, navegação entre seções, sidebar mobile, formulário de contato
- Não há E2E (Cypress) configurado — apenas unit/component specs