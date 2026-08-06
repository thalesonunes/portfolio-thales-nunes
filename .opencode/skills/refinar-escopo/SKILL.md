---
name: refinar-escopo
description: Faz perguntas clarificadoras sobre a intenção de uma feature antes de planejar ou implementar. Identifica dúvidas, lacunas e decisões pendentes que impedem o desenvolvimento. Deve ser usada antes de criar-fase ou decompor-tarefas.
---

# Refinar escopo — Portfolio Thales Nunes

Antes de planejar ou implementar qualquer feature no portfolio, faça perguntas que esclareçam a intenção real, identifiquem lacunas e evitem retrabalho.

## Quando usar

- **Sempre** antes de `criar-fase` ou `decompor-tarefas`
- Quando alguém descreve uma feature de forma vaga ("melhorar o design", "adicionar animações")
- Quando há múltiplas interpretações possíveis do que deve ser feito
- Quando o escopo parece grande demais e precisa ser delimitado

## Workflow

### Passo 1 — Entender a intenção

Perguntas obrigatórias:

1. **Qual problema isso resolve?** (não "o que vamos fazer", mas "por que precisamos disso")
2. **Quem é o usuário afetado?** (visitante do portfolio, recrutador, eu mesmo?)
3. **Qual o resultado esperado?** (como saberemos que terminou?)

### Passo 2 — Identificar escopo e limites

4. **O que está DENTRO do escopo?** (liste explicitamente)
5. **O que está FORA do escopo?** (o que NÃO vamos fazer agora)
6. **Há dependências de outras fases/issues/PRs?**
7. **Isso quebra algo existente?** (breaking changes — SEO, links, estrutura?)

### Passo 3 — Mapear decisões pendentes

8. **Quais decisões de design/arquitetura ainda não foram tomadas?**
9. **Há opções mutuamente exclusivas?** (ex: CSS variables vs SCSS variables, CSS animations vs JS animations)
10. **Quais informações faltam para começar?** (ex: preciso ver o estado atual primeiro, referências visuais)

### Passo 4 — Classificar e priorizar

Após as respostas, classificar cada item:

| Símbolo | Significado |
|---|---|
| 🟢 | Claro — pode prosseguir |
| 🟡 | Dúvida — precisa de esclarecimento |
| 🔴 | Bloqueante — impede o progresso |
| ⚪ | Fora do escopo — anotar para depois |

Gerar um resumo:

```markdown
## Escopo refinado — [Nome da Feature]

### Intenção
[1-2 frases sobre o problema a resolver]

### Dentro do escopo
- Item 1
- Item 2

### Fora do escopo (para depois)
- Item X
- Item Y

### Decisões pendentes
- 🔴 Decisão bloqueante: ...
- 🟡 Dúvida: ...

### Próximo passo
✅ Prosseguir com `criar-fase` / ⚠️ Aguardar decisões
```

## Exemplo

**Input vago:** "melhorar o design do portfolio"

**Perguntas geradas:**
1. 🔴 O que exatamente será melhorado? Cores? Tipografia? Espaçamento? Layout? Tudo?
2. 🔴 CSS custom properties ou SCSS variables para tokens?
3. 🟡 Manter a paleta atual ou repensar cores?
4. 🟡 Os componentes existentes serão reescritos ou só ajustados?
5. 🔴 Qual o critério de conclusão? Todos os hardcoded colors substituídos? Checklist a11y?
6. 🟡 Vai afetar o tema dark? (não temos tema dark hoje — criar ou ignorar?)
7. ⚪ Animações complexas ficam para depois?

## Regras

- **Pergunte antes de planejar.** Nunca assuma o escopo.
- **Seja específico.** "Melhorar o CSS" ≠ "Extrair 15 cores únicas para 8 tokens de cor"
- **Identifique bloqueios cedo.** Se algo impede começar, destaque como 🔴.
- **Uma iteração é suficiente.** Se após as respostas ainda houver dúvidas, faça mais uma rodada. Depois, prossiga.
- **Sempre termine com uma recomendação clara:** prosseguir ou aguardar.