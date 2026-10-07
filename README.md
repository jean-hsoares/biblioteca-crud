# Biblioteca — CRUD de Autores e Livros

Aplicação monolítica (Node.js + Express + EJS) com PostgreSQL hospedado no NeonDB.
Relacionamento 1:N: um **autor** possui vários **livros**; cada livro pertence a um autor.
CRUD completo (criar, listar, editar, excluir) nas duas tabelas pela interface web.

## Executar localmente
1. Requisitos: Node.js 18+ e uma conta no [NeonDB](https://neon.tech).
2. `npm install`
3. Copie `.env.example` para `.env` e preencha `DATABASE_URL` com a connection string do Neon.
4. `npm start` e abra http://localhost:3000

As tabelas `autores` e `livros` são criadas automaticamente na primeira execução.

## Variáveis de ambiente
| Variável | Descrição |
|---|---|
| `DATABASE_URL` | Connection string PostgreSQL do NeonDB (com `sslmode=require`) |
| `PORT` | Porta do servidor (o Render define automaticamente) |

## Deploy no Render
Web Service → conectar este repositório → Build: `npm install` → Start: `npm start` → adicionar `DATABASE_URL` em Environment.

## Estrutura
`server.js` (rotas) · `db.js` (conexão e criação das tabelas) · `views/` (EJS) · `public/` (CSS)
