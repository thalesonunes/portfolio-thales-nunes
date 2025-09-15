# GitHub Actions - Vercel Deploy

Este workflow realiza o deploy automático do portfólio para a Vercel sempre que houver push ou merge na branch `main`.

## Configuração de Secrets

Para que o workflow funcione, você precisa adicionar os seguintes secrets no GitHub:

1. Acesse: Repository → Settings → Secrets and variables → Actions
2. Adicione os seguintes secrets:

### VERCEL_TOKEN
1. Acesse https://vercel.com/account/tokens
2. Crie um novo token
3. Copie o token gerado

### VERCEL_ORG_ID
```
team_RK6dLe9qWYa4sYP5acuItBpd
```

### VERCEL_PROJECT_ID
```
prj_xp9ocEc4kiHWEMr9Vq9SY7Q0vPyB
```

## Como funciona

O workflow:
1. Faz checkout do código
2. Configura Node.js 22
3. Instala dependências
4. Executa o build
5. Faz deploy para produção na Vercel

O deploy será executado automaticamente em:
- Push para a branch `main`
- Pull requests para a branch `main` (deploy de preview)