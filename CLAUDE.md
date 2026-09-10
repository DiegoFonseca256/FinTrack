# FinTrack — Controle Financeiro Pessoal

## Sobre o projeto

FinTrack é uma aplicação web de controle financeiro pessoal onde o usuário registra receitas e despesas do dia a dia, organiza esses lançamentos por categoria (ex: alimentação, transporte, lazer, salário) e acompanha, por meio de um dashboard, como está o seu orçamento no mês corrente.

**Objetivo:** ferramenta simples, visual e rápida de usar, focada em quem quer começar a se organizar financeiramente sem a complexidade das planilhas ou dos aplicativos bancários.

**Prazo do projeto:** 3 semanas.

---

## Stack Técnica

### Back-end (`/api`)
- **Node.js** com **Express** (ou Fastify) e **TypeScript**
- **Prisma ORM** para acesso ao banco
- **PostgreSQL** como banco de dados
- **Zod** para validação de inputs
- **JWT** + **bcrypt** para autenticação
- **Vitest** + **Supertest** para testes

### Front-end (`/web`)
- **Next.js** (App Router) com **TypeScript**
- **CSS Modules** para estilização (⚠️ **NÃO usar Tailwind CSS**)
- **Recharts** (ou Chart.js) para gráficos

### Infraestrutura e DevOps
- **Docker + Docker Compose** para ambiente local
- **GitHub Actions** para CI (lint + testes)
- **Vercel** para deploy do front-end
- **Railway** (ou Render) para deploy do back-end e PostgreSQL

### Qualidade de código
- **ESLint** + **Prettier** em ambos os projetos
- Padronização de commits (Conventional Commits recomendado)

---

## Estrutura de pastas esperada

```
fintrack/
├── api/                  # Back-end Node.js
│   ├── src/
│   │   ├── routes/
│   │   ├── controllers/
│   │   ├── services/
│   │   ├── repositories/
│   │   ├── middlewares/
│   │   ├── schemas/      # Zod schemas
│   │   ├── lib/          # prisma client, helpers
│   │   └── server.ts
│   ├── prisma/
│   │   ├── schema.prisma
│   │   └── migrations/
│   ├── tests/
│   ├── Dockerfile
│   ├── package.json
│   └── tsconfig.json
├── web/                  # Front-end Next.js
│   ├── src/
│   │   ├── app/          # rotas do App Router
│   │   ├── components/
│   │   ├── contexts/     # AuthContext etc.
│   │   ├── hooks/
│   │   ├── services/     # cliente HTTP
│   │   └── styles/       # CSS Modules globais
│   ├── package.json
│   └── tsconfig.json
├── .github/
│   └── workflows/
│       └── ci.yml
├── docker-compose.yml
├── .gitignore
├── README.md
└── CLAUDE.md             # este arquivo
```

---

## Regras e convenções do projeto

1. **Sempre usar TypeScript** — tipos explícitos em funções públicas, evitar `any`.
2. **Sempre validar inputs com Zod** em todas as rotas do back-end.
3. **NÃO usar Tailwind CSS** — a estilização é feita com CSS Modules.
4. **Todas as queries ao banco devem filtrar por `userId`** — nenhum usuário pode acessar dados de outro.
5. **Nunca commitar arquivos `.env`** — apenas `.env.example` com placeholders.
6. **Senhas sempre com hash bcrypt** — nunca armazenar em texto plano.
7. **Rotas protegidas** devem passar pelo middleware de autenticação JWT.
8. **Escrever testes** para funções críticas (dashboard, auth, CRUDs principais).
9. **Prisma migrations** devem ser versionadas — a pasta `prisma/migrations/` vai para o Git.
10. **Componentes React** devem ser funcionais (nada de class components) e usar hooks.

---

## Entidades do banco

```
User
  - id, email (unique), passwordHash, createdAt

Category
  - id, name, type ("income" | "expense"), color, userId
  - relacionamento: User 1-N Category

Transaction
  - id, amount, description, date, type, categoryId, userId
  - relacionamentos: User 1-N Transaction, Category 1-N Transaction

Goal
  - id, month (YYYY-MM), limitAmount, categoryId, userId
  - unique constraint: (userId, categoryId, month)
```

---

## Funcionalidades mínimas do produto

- Cadastro e login de usuários
- CRUD de categorias personalizadas
- CRUD de transações com filtros por mês e categoria
- CRUD de metas mensais por categoria
- Dashboard com: total de receitas, total de despesas, saldo, gráfico de despesas por categoria e status das metas
- Isolamento total de dados entre usuários

---

## Backlog das tarefas (Kanban no Trello)

O projeto está dividido em ~50 tarefas no board **FinTrack** no Trello. As tarefas seguem o padrão `[SX.Y]` — onde X é a semana (1, 2 ou 3) e Y é o número da tarefa.

### Semana 1 — Back-end e Banco de Dados
- [ ] S1.1 — Criar repositório "fintrack" no GitHub
- [ ] S1.2 — Definir estrutura de pastas (/web e /api)
- [ ] S1.3 — Configurar TypeScript no back-end
- [ ] S1.4 — Configurar ESLint e Prettier no back-end
- [ ] S1.5 — Criar docker-compose.yml com PostgreSQL local
- [ ] S1.6 — Instalar e configurar Prisma
- [ ] S1.7 — Modelar entidades User, Category, Transaction e Goal no Prisma
- [ ] S1.8 — Rodar primeira migration e validar tabelas
- [ ] S1.9 — Configurar servidor Express e variáveis de ambiente
- [ ] S1.10 — Implementar rota POST /auth/register com hash bcrypt
- [ ] S1.11 — Implementar rota POST /auth/login com JWT
- [ ] S1.12 — Criar middleware de autenticação JWT
- [ ] S1.13 — Implementar CRUD de categorias
- [ ] S1.14 — Implementar CRUD de transações com filtros
- [ ] S1.15 — Implementar CRUD de metas mensais
- [ ] S1.16 — Validar inputs com Zod em todas as rotas
- [ ] S1.17 — Garantir isolamento de dados por usuário
- [ ] S1.18 — Criar endpoint GET /dashboard
- [ ] S1.19 — Testar todas as rotas manualmente (Postman/Insomnia)

### Semana 2 — Front-end e Integração
- [ ] S2.1 — Criar projeto Next.js com TypeScript
- [ ] S2.2 — Configurar CSS Modules e paleta de cores
- [ ] S2.3 — Configurar cliente HTTP com JWT automático
- [ ] S2.4 — Criar AuthContext e persistência do token
- [ ] S2.5 — Criar página de cadastro
- [ ] S2.6 — Criar página de login
- [ ] S2.7 — Implementar rotas protegidas no front
- [ ] S2.8 — Tela de listagem de categorias
- [ ] S2.9 — Formulário de criar/editar categoria
- [ ] S2.10 — Excluir categoria com confirmação
- [ ] S2.11 — Tela de listagem de transações com filtros
- [ ] S2.12 — Formulário de nova transação
- [ ] S2.13 — Editar e excluir transação com confirmação
- [ ] S2.14 — Cards de totais do dashboard
- [ ] S2.15 — Gráfico de despesas por categoria
- [ ] S2.16 — Seletor de mês no dashboard
- [ ] S2.17 — Tela de gerenciamento de metas mensais
- [ ] S2.18 — Seção de metas no dashboard com progresso

### Semana 3 — Qualidade, DevOps e Deploy
- [ ] S3.1 — Escrever testes unitários das funções do dashboard
- [ ] S3.2 — Testes de integração das rotas de auth
- [ ] S3.3 — Testes de integração de transactions e goals
- [ ] S3.4 — Configurar workflow GitHub Actions
- [ ] S3.5 — Adicionar badge de CI e proteger a branch main
- [ ] S3.6 — Criar Dockerfile do back-end (multi-stage)
- [ ] S3.7 — Atualizar docker-compose (back + banco juntos)
- [ ] S3.8 — Provisionar PostgreSQL de produção
- [ ] S3.9 — Deploy do back-end no Railway/Render
- [ ] S3.10 — Deploy do front-end na Vercel
- [ ] S3.11 — Ajustar CORS e testar app publicamente
- [ ] S3.12 — Escrever README completo
- [ ] S3.13 — Documentar rotas da API
- [ ] S3.14 — Revisão final de bugs e usabilidade
- [ ] S3.15 — Criar tag v1.0.0 no repositório

---

## Como pedir ajuda ao Claude Code

Ao trabalhar em uma tarefa, referencie ela pelo código:

> "Vamos fazer a tarefa S1.5: criar o docker-compose.yml com PostgreSQL local."

Ou peça revisão de código:

> "Revise a implementação da rota POST /auth/login em `api/src/routes/auth.ts`."

**Regras importantes ao pedir ajuda:**
- Sempre seguir as convenções da seção "Regras e convenções" acima.
- Ao criar arquivos novos, respeitar a estrutura de pastas definida.
- Após concluir uma tarefa, marcar o checkbox correspondente neste arquivo.

---

## Critérios de conclusão do projeto

- ✅ Aplicação acessível por URL pública
- ✅ Cadastro, login, CRUDs e dashboard funcionando ponta a ponta
- ✅ Testes automatizados passando no CI (GitHub Actions verde)
- ✅ README completo com prints, stack e link do deploy
- ✅ Ambiente local sobe com `docker-compose up`
- ✅ Código versionado no GitHub com histórico de commits organizado
