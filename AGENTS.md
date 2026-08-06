# Portfolio Thales Nunes - Agent Instructions

## Project Structure
- Root: minimal `package.json` (only `baseline-browser-mapping` dev dep)
- App: Angular 20 SPA in `portfolio/` directory

## Key Commands (run from `portfolio/`)
```bash
npm install          # install deps
npm start            # dev server at localhost:4200
npm run build        # production build → dist/portfolio/
npm test             # run tests (Karma/Jasmine)
npm run watch        # incremental build watch mode
```

## CI/CD
- GitHub Actions (`.github/workflows/vercel-deploy.yml`)
- Triggers: push/PR to `main`
- Uses Node 22, `npm ci`, then `npm run build`
- Deploys to Vercel via `amondnet/vercel-action@v25` (requires secrets: VERCEL_TOKEN, VERCEL_ORG_ID, VERCEL_PROJECT_ID)

## Architecture Notes
- Single-component architecture (`src/app/app.ts` + `app.html` + `app.scss`)
- No routing - smooth scroll navigation between sections
- SCSS for styling (configured in angular.json)
- Assets in `public/` and `src/assets/`
- Production budgets: 500kB initial / 1MB max, 25kB/30kB per component style

## Vercel Config
- Root `vercel.json` only sets `"public": true`
- Actual build output: `dist/portfolio/` (Angular default)

## Gotchas
- Always run commands from `portfolio/` directory, not root
- Root `package.json` is NOT the app package.json
- Angular 20 uses `@angular/build` (not `@angular-devkit/build-angular`)
- No lint/typecheck scripts configured - only build/test

## Opencode Harness
- `.opencode/instructions/` — Angular, Testes, Segurança, Regra do Escoteiro
- `.opencode/commands/` — `gerar-testes`, `preparar-pr`
- Use `/gerar-testes` para planos de teste, `/preparar-pr` para preparar PRs

## Git Setup (one-time per clone)
- `git config commit.template .gitmessage` — editor abre com template de commit
- Hooks (`scripts/git-hooks/`) não são versionados no `.git/hooks/` — reinstalar após clone:
  ```bash
  ln -sf ../../scripts/git-hooks/commit-msg .git/hooks/commit-msg
  ln -sf ../../scripts/git-hooks/pre-commit .git/hooks/pre-commit
  ln -sf ../../scripts/git-hooks/pre-push .git/hooks/pre-push
  ```
- Hooks bloqueiam commits diretos em `main`/`master` e exigem build no pre-push