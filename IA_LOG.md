# Diário de Prompts (IA_LOG)

## 1. Ferramentas utilizadas
- Claude (Anthropic) — geração da estrutura inicial do projeto.
- <!-- ADICIONE outras ferramentas que você realmente usou (Cursor, ChatGPT, Copilot...) -->

## 2. Prompts iniciais
Prompt principal enviado ao Claude (anexando o PDF com as instruções do trabalho):

> "execute essa tarefa"

Decisões de arquitetura que fiz/validei:
- Tema: Biblioteca, com tabelas `autores` e `livros` (1:N).
- Monolito Express + EJS, `pg` para o Neon, tabelas criadas automaticamente em `db.js`.
- `ON DELETE RESTRICT`: não é possível excluir um autor que ainda tem livros; a interface mostra uma mensagem.
- Exclusão e edição via `POST` (formulários HTML não suportam PUT/DELETE sem bibliotecas extras).

<!-- ADICIONE aqui os prompts seguintes que você realmente usou -->

## 3. Resolução de problemas (PREENCHA COM UM CASO REAL)
> Este item é crítico na avaliação e deve descrever algo que ACONTECEU no SEU desenvolvimento.

- **O que a IA errou:** <!-- ex.: erro de conexão SSL com o Neon, porta errada no Render, rota que não funcionava... -->
- **Como identifiquei o erro:** <!-- mensagem do log, comportamento na tela -->
- **Como corrigi (no código ou no prompt):** <!-- prompt usado, trecho alterado -->
