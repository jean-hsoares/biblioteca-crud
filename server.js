const express = require('express');
const path = require('path');
const { pool, init } = require('./db');

const app = express();
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

const render = (res, view, data = {}) => res.render(view, { erro: null, ...data });
const ano = v => (v === '' || v == null ? null : parseInt(v, 10));

app.get('/', (req, res) => res.redirect('/livros'));

// ---------- AUTORES ----------
app.get('/autores', async (req, res, next) => {
  try {
    const { rows } = await pool.query(`
      SELECT a.*, COUNT(l.id)::int AS total_livros
      FROM autores a LEFT JOIN livros l ON l.autor_id = a.id
      GROUP BY a.id ORDER BY a.nome`);
    render(res, 'autores/index', { autores: rows, erro: req.query.erro });
  } catch (e) { next(e); }
});

app.get('/autores/novo', (req, res) =>
  render(res, 'autores/form', { autor: {}, acao: '/autores', titulo: 'Novo autor' }));

app.post('/autores', async (req, res, next) => {
  try {
    const { nome, nacionalidade } = req.body;
    if (!nome || !nome.trim())
      return render(res, 'autores/form', { autor: req.body, acao: '/autores', titulo: 'Novo autor', erro: 'Informe o nome do autor.' });
    await pool.query('INSERT INTO autores (nome, nacionalidade) VALUES ($1,$2)', [nome.trim(), nacionalidade || null]);
    res.redirect('/autores');
  } catch (e) { next(e); }
});

app.get('/autores/:id/editar', async (req, res, next) => {
  try {
    const { rows } = await pool.query('SELECT * FROM autores WHERE id=$1', [req.params.id]);
    if (!rows[0]) return res.status(404).send('Autor não encontrado');
    render(res, 'autores/form', { autor: rows[0], acao: `/autores/${rows[0].id}/editar`, titulo: 'Editar autor' });
  } catch (e) { next(e); }
});

app.post('/autores/:id/editar', async (req, res, next) => {
  try {
    const { nome, nacionalidade } = req.body;
    const acao = `/autores/${req.params.id}/editar`;
    if (!nome || !nome.trim())
      return render(res, 'autores/form', { autor: { ...req.body, id: req.params.id }, acao, titulo: 'Editar autor', erro: 'Informe o nome do autor.' });
    await pool.query('UPDATE autores SET nome=$1, nacionalidade=$2 WHERE id=$3', [nome.trim(), nacionalidade || null, req.params.id]);
    res.redirect('/autores');
  } catch (e) { next(e); }
});

app.post('/autores/:id/excluir', async (req, res, next) => {
  try {
    await pool.query('DELETE FROM autores WHERE id=$1', [req.params.id]);
    res.redirect('/autores');
  } catch (e) {
    if (e.code === '23503') // violação de chave estrangeira
      return res.redirect('/autores?erro=' + encodeURIComponent('Este autor possui livros. Exclua ou mude os livros antes.'));
    next(e);
  }
});

// ---------- LIVROS ----------
const listaAutores = async () => (await pool.query('SELECT id, nome FROM autores ORDER BY nome')).rows;

app.get('/livros', async (req, res, next) => {
  try {
    const { rows } = await pool.query(`
      SELECT l.*, a.nome AS autor_nome
      FROM livros l JOIN autores a ON a.id = l.autor_id ORDER BY l.titulo`);
    render(res, 'livros/index', { livros: rows });
  } catch (e) { next(e); }
});

app.get('/livros/novo', async (req, res, next) => {
  try {
    render(res, 'livros/form', { livro: {}, autores: await listaAutores(), acao: '/livros', titulo: 'Novo livro' });
  } catch (e) { next(e); }
});

app.post('/livros', async (req, res, next) => {
  try {
    const { titulo, ano_publicacao, autor_id } = req.body;
    if (!titulo || !titulo.trim() || !autor_id)
      return render(res, 'livros/form', { livro: req.body, autores: await listaAutores(), acao: '/livros', titulo: 'Novo livro', erro: 'Informe o título e escolha um autor.' });
    await pool.query('INSERT INTO livros (titulo, ano_publicacao, autor_id) VALUES ($1,$2,$3)', [titulo.trim(), ano(ano_publicacao), autor_id]);
    res.redirect('/livros');
  } catch (e) { next(e); }
});

app.get('/livros/:id/editar', async (req, res, next) => {
  try {
    const { rows } = await pool.query('SELECT * FROM livros WHERE id=$1', [req.params.id]);
    if (!rows[0]) return res.status(404).send('Livro não encontrado');
    render(res, 'livros/form', { livro: rows[0], autores: await listaAutores(), acao: `/livros/${rows[0].id}/editar`, titulo: 'Editar livro' });
  } catch (e) { next(e); }
});

app.post('/livros/:id/editar', async (req, res, next) => {
  try {
    const { titulo, ano_publicacao, autor_id } = req.body;
    const acao = `/livros/${req.params.id}/editar`;
    if (!titulo || !titulo.trim() || !autor_id)
      return render(res, 'livros/form', { livro: { ...req.body, id: req.params.id }, autores: await listaAutores(), acao, titulo: 'Editar livro', erro: 'Informe o título e escolha um autor.' });
    await pool.query('UPDATE livros SET titulo=$1, ano_publicacao=$2, autor_id=$3 WHERE id=$4', [titulo.trim(), ano(ano_publicacao), autor_id, req.params.id]);
    res.redirect('/livros');
  } catch (e) { next(e); }
});

app.post('/livros/:id/excluir', async (req, res, next) => {
  try {
    await pool.query('DELETE FROM livros WHERE id=$1', [req.params.id]);
    res.redirect('/livros');
  } catch (e) { next(e); }
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send('Erro interno do servidor.');
});

const PORT = process.env.PORT || 3000;
init()
  .then(() => app.listen(PORT, () => console.log(`Rodando na porta ${PORT}`)))
  .catch(e => { console.error('Falha ao conectar no banco:', e.message); process.exit(1); });
