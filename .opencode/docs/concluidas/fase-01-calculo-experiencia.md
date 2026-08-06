# Fase 01 — Cálculo automático de experiência (Sobre Mim)

**Branch:** `feature/fase-01-calculo-experiencia`
**Status:** ✅ Concluída

---

## Visão Geral

O texto fixo "Engenheiro de Software com aproximadamente 3 anos de experiência..." na seção Sobre Mim envelhece e exige edição manual a cada marco de carreira. Esta fase substitui o número fixo por um valor **calculado dinamicamente** no `AppComponent`, a partir da data de transição para tecnologia (janeiro de 2022) até a data atual.

O valor se atualiza sozinho: em ago/2026 exibirá "4 anos e 7 meses", sem intervenção manual. A entrega resolve uma pendência registrada no backlog (item em negrito) e elimina um dado desatualizado do portfolio.

---

## Contexto Técnico Atual

### Estrutura de componentes/arquivos relevantes

```
portfolio/src/app/
├── app.ts       ← componente principal (AppComponent, 29 linhas)
├── app.html     ← template com todas as seções (321 linhas)
├── app.scss     ← estilos SCSS
└── app.spec.ts  ← testes unitários (Jasmine/Karma)
```

### Layout atual

A seção Sobre Mim (`app.html`, linha 85) contém o parágrafo:

> Engenheiro de Software com aproximadamente **3 anos** de experiência no desenvolvimento e manutenção de sistemas críticos e de alta performance para o setor financeiro...

O número está **hardcoded** no HTML e não reflete a data atual (ago/2026 → deveria ser 4 anos e 7 meses).

### Convenções e regras atuais

- Arquitetura single-component, standalone, sem roteamento
- `AppComponent` sem `ChangeDetection.OnPush` (não alterar nesse escopo)
- Budgets de produção: 500kB initial / 1MB max; 25kB/30kB por style de componente
- Navegação e demais seções não devem ser afetadas
- Testes: Jasmine/Karma (`npm test`), foco em behaviors, não em detalhes de implementação

---

## Tasks

### TASK 1 — Cálculo dinâmico de experiência no AppComponent + template

**Objetivo:** Implementar o cálculo de anos e meses desde janeiro de 2022 até a data atual e exibi-lo na seção Sobre Mim.
**Escopo:** Apenas `app.ts` e `app.html` (seção Sobre Mim). Fora de escopo: Hero, outras seções, mudanças de estilo.

#### Subtask 1.1 — Implementar propriedade de experiência no `app.ts`
- Adicionar constante da data de início da carreira: **janeiro de 2022** (ex: `private readonly careerStartDate = new Date(2022, 0, 1);` — mês 0 = janeiro em JS)
- Criar propriedade/calculada `experienceText` que retorna a string com anos e meses (ex: `"4 anos e 7 meses"`)
- Cálculo: diferença entre data atual (`new Date()`) e `careerStartDate` em anos e meses
  - Regra: se mês atual < mês de início OU (mês atual == mês de início E dia atual < dia de início), subtrair 1 ano e ajustar meses
  - **Casos de borda obrigatórios:**
    - Meses = 0 → retornar apenas "X anos" (ex: "4 anos")
    - Anos = 0 → retornar apenas "Y meses" (ex: "7 meses")
    - Singular: "1 ano", "1 mês" (nunca "1 anos"/"1 meses")
- O valor é calculado uma vez na criação do componente (data atual é estável durante o ciclo de vida da SPA)

#### Subtask 1.2 — Substituir texto fixo no `app.html`
- Na linha 85, substituir apenas o trecho "3 anos" por interpolação: `...com aproximadamente {{ experienceText }} de experiência...`
- **Manter** a palavra "aproximadamente" e o restante da frase intactos
- Não alterar nenhuma outra linha do template

#### Subtask 1.3 — Validação
- [ ] Build sem erros: `npm run build`
- [ ] **Como confirmar que está correto?** Rodar `npm start`, abrir a seção Sobre Mim e verificar que o texto exibe "aproximadamente 4 anos e 7 meses de experiência" (ago/2026). Comparar com o cálculo manual: jan/2022 → ago/2026 = 4 anos e 7 meses
- [ ] Verificar que as demais seções seguem intactas (Hero, Projetos, Contato)

---

### TASK 2 — Testes unitários do cálculo e da renderização

**Objetivo:** Cobrir o cálculo (anos/meses, singular/plural, casos de borda) e a renderização do texto no template.
**Escopo:** `app.spec.ts`.

#### Subtask 2.1 — Testes do cálculo
- Testar com data atual fixada (usar `jasmine.clock()` ou mock de `Date`): jan/2022 → ago/2026 = "4 anos e 7 meses"
- Testar singular: "1 ano", "1 mês"
- Testar meses = 0 → "X anos" sem "e 0 meses"
- Testar anos = 0 → apenas meses
- Testar jan/2022 → jan/2023 = "1 ano" (borda de aniversário)

#### Subtask 2.2 — Teste de renderização
- Verificar que o template da seção Sobre Mim contém o texto interpolado (ex: `"aproximadamente 4 anos e 7 meses de experiência"`) — evitar dependência de classes CSS ou estrutura exata do DOM

#### Subtask 2.3 — Validação
- [ ] **Como confirmar que está correto?** Rodar `npm test` com todos os testes passando (incluindo os existentes)
- [ ] Rodar build sem erros: `npm run build`

---

## Ordem de Execução

```
TASK 1 → TASK 2
```

- TASK 1: `frontend-portfolio` (implementação)
- TASK 2: `qa-frontend-portfolio` (testes)
- Após ambas: `review-portfolio` (validação final — correção, estilo, a11y, performance)

Cada task deve:
1. Deixar build validado (`npm run build`)
2. Responder "Como confirmar que está correto?" com evidência
3. Ser commitada antes de avançar

---

## Arquivos Principais Afetados

| Task | Arquivos |
|------|----------|
| 1    | `portfolio/src/app/app.ts`, `portfolio/src/app/app.html` |
| 2    | `portfolio/src/app/app.spec.ts` |

---

## Restrições e Regras de Escopo

- **Não alterar** lógica não relacionada à fase (navegação, sidebar, demais seções)
- **Não alterar** configurações de build/angular.json
- **Manter** funcionalidades existentes intactas
- Cada task deve deixar a aplicação em estado funcional
- Respeitar budgets de produção: 500kB initial / 1MB max, 25kB/30kB component style
- Manter a palavra "aproximadamente" no texto (decisão do desenvolvedor)

---

## Critérios de Aceitação

- [x] Texto da seção Sobre Mim exibe "aproximadamente 4 anos e 7 meses de experiência" em ago/2026, sem edição manual
- [x] Casos de borda tratados: meses = 0, anos = 0, singular ("1 ano", "1 mês")
- [x] Demais seções e funcionalidades intactas
- [x] **Para cada task: "Como confirmar que está correto?" respondido** (obrigatório)
- [x] Testes passando: `npm test` (13/13)
- [x] Build sem erros: `npm run build` (286.93 kB initial, budgets OK)
- [x] Revisão final (`review-portfolio`) aprovada

---

## Delta (Plano vs. Entrega)

| Aspecto | Plano | Entrega |
|---------|-------|---------|
| Cálculo | TS no AppComponent, data de início jan/2022 | ✅ Igual — `careerStartDate` + `experienceText` readonly calculado 1x |
| Formato do texto | "X anos e Y meses" com singular/plural | ✅ Igual — casos de borda cobertos (meses=0, anos=0, "1 ano", "1 mês") |
| Template | Interpolação na linha 85 mantendo "aproximadamente" | ✅ Igual — única linha alterada |
| Testes | Cobertura do cálculo e renderização | ✅ 11 testes novos (13 total) + mock de `Date` via factory/Reflect.construct (jasmine.clock() descartado por conflitar com zone.js) |

### Entregas não previstas

- Correção de testes pré-existentes quebrados no `app.spec.ts`: import inexistente `App` → `AppComponent`; teste "should render title" esperava "Hello, portfolio" (template real tem "Thales Nunes") — regra do escoteiro
- Newline final adicionada ao `app.ts` (arquivo sem `\n` final)

### Pendências

- 10 links com `target="_blank"` sem `rel="noopener noreferrer"` (sidebar, projetos, contato) → **backlog** (vulnerabilidade `window.opener`, pré-existente)
- Aviso `baseline-browser-mapping` desatualizado no build/test → **backlog** (cosmético)
- SVG dos ícones GitHub com typo nos paths (`1.30` vs `1.23`) → **backlog** (pré-existente, renderização idêntica)
- `AppComponent` sem `ChangeDetection.OnPush` → **backlog** (melhoria de performance futura)

---

## Commits principais

| Commit | Descrição |
|--------|-----------|
| `300288e` | docs(fase-01): create planning for automatic experience calculation |
| `9ed5b05` | feat(about): dynamic experience calculation since January 2022 |
| `b1ac069` | test(about): cover dynamic experience calculation and rendering |
