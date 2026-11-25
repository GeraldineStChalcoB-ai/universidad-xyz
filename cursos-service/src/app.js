const express = require('express');
const pool = require('./db');

const app = express();
app.use(express.json());

const textos = ['codigo', 'nombre', 'docente'];
const valido = (b) =>
  textos.every((c) => b[c] && String(b[c]).trim() !== '') &&
  Number.isInteger(Number(b.creditos)) &&
  Number(b.creditos) > 0;

const manejar = (fn) => async (req, res) => {
  try {
    await fn(req, res);
  } catch (e) {
    if (e.code === 'ER_DUP_ENTRY')
      return res.status(409).json({ error: 'Código de curso ya registrado' });
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

app.post('/cursos', manejar(async (req, res) => {
  if (!valido(req.body)) return res.status(400).json({ error: 'Datos incompletos o inválidos' });
  const { codigo, nombre, creditos, docente } = req.body;
  const [r] = await pool.query(
    'INSERT INTO cursos (codigo, nombre, creditos, docente) VALUES (?,?,?,?)',
    [codigo, nombre, creditos, docente]
  );
  res.status(201).json({ id: r.insertId, ...req.body });
}));

app.get('/cursos', manejar(async (req, res) => {
  const [filas] = await pool.query('SELECT * FROM cursos');
  res.json(filas);
}));

app.get('/cursos/:id', manejar(async (req, res) => {
  const [filas] = await pool.query('SELECT * FROM cursos WHERE id = ?', [req.params.id]);
  if (filas.length === 0) return res.status(404).json({ error: 'Curso no encontrado' });
  res.json(filas[0]);
}));

app.put('/cursos/:id', manejar(async (req, res) => {
  if (!valido(req.body)) return res.status(400).json({ error: 'Datos incompletos o inválidos' });
  const { codigo, nombre, creditos, docente } = req.body;
  const [r] = await pool.query(
    'UPDATE cursos SET codigo=?, nombre=?, creditos=?, docente=? WHERE id=?',
    [codigo, nombre, creditos, docente, req.params.id]
  );
  if (r.affectedRows === 0) return res.status(404).json({ error: 'Curso no encontrado' });
  res.json({ id: Number(req.params.id), ...req.body });
}));

app.delete('/cursos/:id', manejar(async (req, res) => {
  const [r] = await pool.query('DELETE FROM cursos WHERE id = ?', [req.params.id]);
  if (r.affectedRows === 0) return res.status(404).json({ error: 'Curso no encontrado' });
  res.status(204).send();
}));

module.exports = app;