# Plano — To-do List fullstack (CRUD, login, refresh token, animações)

## Contexto
O diretório `to-do-list` está vazio, exceto por `CLAUDE.md` (que define a stack e a estrutura de pastas), `.claude/skills/vercel-react-best-practices` e `skills-lock.json`. O objetivo é criar do zero uma aplicação de tarefas com autenticação segura (access token + refresh token com rotação) e uma interface com animações suaves.

Decisões confirmadas com o usuário:
- **Campos da tarefa:** título, descrição (opcional), prioridade (LOW/MEDIUM/HIGH) e concluída. Sem data de vencimento.
- **Animações:** biblioteca `motion` (antigo Framer Motion). É a única dependência fora do CLAUDE.md e se justifica porque anima saída e reordenação de itens da lista (AnimatePresence + `layout`).
- **Tokens:** access token só em memória; refresh token em cookie httpOnly, com rotação e hash no banco.

Stack (definida no CLAUDE.md): React + TS strict + Vite + Tailwind + shadcn/ui + React Router + RHF + Zod + Axios + Zustand | Express + TS + Prisma + PostgreSQL + Zod + JWT + bcrypt | Docker Compose.

## Estrutura
```
to-do-list/
├── backend/   (prisma/, src/{configs,controllers,dtos,errors,middlewares,repositories,routes,services,utils}, app.ts, server.ts, Dockerfile)
├── frontend/  (src/{components/ui,components/shared,features/auth,features/tasks,layouts,lib,pages,routes,services,stores,types}, Dockerfile)
├── docker-compose.yml   (postgres com volume + backend + frontend)
├── .env.example, .gitignore
```

## Fase 1 — Infra e banco
- `docker-compose.yml`: `postgres:16-alpine` com volume nomeado e healthcheck; backend depende de `service_healthy`.
- `.env.example`: `DATABASE_URL`, `JWT_ACCESS_SECRET`, `JWT_REFRESH_SECRET`, `ACCESS_TOKEN_TTL=15m`, `REFRESH_TOKEN_TTL_DAYS=7`, `CORS_ORIGIN`, `VITE_API_URL`.
- `backend/prisma/schema.prisma`:
  - `User` (id uuid, name, email unique, passwordHash, createdAt, updatedAt)
  - `Task` (id, title, description?, priority enum `Priority`, completed bool default false, userId → User onDelete Cascade, timestamps; índice em `userId`)
  - `RefreshToken` (id, tokenHash unique, userId, expiresAt, revokedAt?, replacedById?, createdAt)
- Migration inicial com `prisma migrate dev --name init`.

## Fase 2 — Backend (camadas route → controller → service → repository)
- `configs/env.ts`: validação das variáveis com Zod, falhando no boot se faltar alguma.
- `errors/AppError.ts` + `middlewares/errorHandler.ts`: ZodError vira 400 e AppError usa o status próprio; o resto vira 500 genérico, sem vazar stack.
- `middlewares/validate.ts`: valida body/params/query com um schema Zod (os schemas ficam em `dtos/`).
- `middlewares/authenticate.ts`: lê `Authorization: Bearer`, verifica o JWT de acesso e coloca `req.userId`.
- **Auth** (`/api/auth`):
  - `POST /register`: bcrypt (cost 12); responde com o usuário e já faz login.
  - `POST /login`: devolve `{ accessToken, user }` e grava o cookie `refreshToken` (httpOnly, `sameSite=strict`, `secure` em produção, `path=/api/auth`).
  - `POST /refresh`: lê o cookie, procura o hash SHA-256, checa expiração e revogação, **rotaciona** (revoga o antigo e cria um novo) e devolve um novo access token. **Detecção de reuso:** se chegar um token já revogado, revoga todos os tokens do usuário.
  - `POST /logout`: revoga o token e limpa o cookie.
  - `GET /me`: devolve o usuário autenticado.
  - O refresh token é aleatório (`crypto.randomBytes(64)`), e não um JWT. Só o hash dele vai para o banco.
- **Tasks** (`/api/tasks`, todas autenticadas e sempre filtradas por `userId`):
  - `GET /` com filtros `?status=all|pending|completed&priority=&search=` e ordenação (prioridade, data)
  - `POST /`, `PATCH /:id` (parcial, inclusive para alternar concluída) e `DELETE /:id`
  - Uma tarefa de outro usuário responde **404** (não 403), para não revelar que ela existe.
- Segurança: `helmet`, `cors` com `credentials: true` e origin restrita, `express-rate-limit` em `/auth/login` e `/auth/register`, e `cookie-parser`. São dependências pequenas e justificadas pela segurança.

## Fase 3 — Frontend
- **Base:** Vite + TS strict, Tailwind e `shadcn init`. Componentes usados: button, input, textarea, card, dialog, select, checkbox, badge, dropdown-menu, sonner (toasts) e skeleton.
- **Auth:**
  - `stores/authStore.ts` (Zustand): `accessToken`, `user`, `status: 'loading' | 'authenticated' | 'guest'`. Nada é salvo em localStorage.
  - `lib/api.ts`: instância Axios com `withCredentials: true`. O interceptor de request injeta o Bearer token. O interceptor de response, ao receber 401, chama `/auth/refresh` **uma única vez**, mesmo com várias requisições falhando ao mesmo tempo (uma promise compartilhada guarda o refresh em andamento), e depois repete as requisições originais. Se o refresh falhar, faz logout e redireciona para `/login`.
  - Bootstrap: no `main.tsx`/`App.tsx`, tenta `/auth/refresh` ao carregar para restaurar a sessão. Enquanto isso, mostra um splash.
  - `routes/ProtectedRoute.tsx` e `PublicOnlyRoute.tsx`.
- **Páginas:** `/login`, `/register` (RHF + zodResolver, com os schemas espelhando os DTOs do backend) e `/` (lista de tarefas).
- **Tasks** (`features/tasks/`): `services/tasks.ts`, um hook `useTasks` com atualização **otimista** (alternar e excluir refletem na hora e voltam atrás se der erro), `TaskList`, `TaskItem`, `TaskFormDialog` (criar/editar), `TaskFilters` e um estado vazio.
- `types/`: tipos `Task`, `Priority` e `User` coerentes com o backend.

## Fase 4 — Animações (Motion)
- **Lista:** `AnimatePresence` + `motion.li` com `layout`. A entrada faz fade + slide-up, a saída faz fade + colapso de altura, e a reordenação fica suave quando o filtro ou a ordem mudam.
- **Concluir tarefa:** um risco animado no título e o checkbox com efeito spring.
- **Rotas:** `AnimatePresence mode="wait"` com `useLocation().pathname` como key, para dar fade/slide entre login e dashboard.
- **Dialog/toasts:** as animações nativas do shadcn/sonner já resolvem; não vale duplicar.
- **Micro-interações:** `whileTap`/`whileHover` nos botões e skeletons durante o carregamento.
- **Acessibilidade:** `MotionConfig reducedMotion="user"` respeita o `prefers-reduced-motion`.
- **Performance:** animar só `transform`/`opacity` e importar `motion/react` (siga a skill `vercel-react-best-practices`).

## Sugestões extras (opcionais, fora do escopo inicial)
- Tema claro/escuro com o toggle do shadcn.
- Drag-and-drop para reordenar as tarefas (o `Reorder` do Motion, sem dependência nova).
- Contador e progresso (“3 de 8 concluídas”) com uma barra animada.
- Desfazer exclusão com um toast que tem ação “Desfazer”.
- Atalhos de teclado (`n` para nova tarefa, `/` para busca).
- Testes: Vitest + Supertest no backend (auth e isolamento por usuário) e Vitest + Testing Library no front.
- Job para limpar refresh tokens expirados.

## Ordem de execução
1. Infra + Prisma + migration
2. Backend de auth (com refresh e rotação)
3. Backend de tasks
4. Front: base, auth e interceptor
5. Front: CRUD de tasks
6. Animações
7. Polimento e sugestões escolhidas

## Verificação
- `docker compose up -d --build`. Conferir que o Postgres fica healthy e que as migrations são aplicadas.
- `npx tsc --noEmit` e `npm run build` no backend e no frontend.
- Testar a API à mão com curl: register → login (o cookie é gravado) → `GET /tasks` com o Bearer → CRUD → `POST /refresh` (novo token, e o antigo é rejeitado) → reutilizar o refresh antigo (todos os tokens devem ser revogados) → logout.
- Isolamento: o usuário B recebe 404 ao acessar uma tarefa do usuário A.
- Front com a skill `run`/browser: login, recarregar a página (a sessão deve continuar), CRUD com as animações, e access token expirado (TTL curto, como 30s) renovado sem o usuário perceber, inclusive com várias requisições simultâneas.
- Conferir no DevTools que não há tokens no localStorage e que o cookie está com `HttpOnly`.
