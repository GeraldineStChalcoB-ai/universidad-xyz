const express = require('express');
const pool = require('./db');

const app = express();
app.use(express.json());

const campos = ['codigo', 'nombres', 'apellidos', 'correo', 'carrera'];
const valido = (b) => campos.every((c) => b[c] && String(b[c]).trim() !== '');

const manejar = (fn) => async (req, res) => {
  try {
    await fn(req, res);
  } catch (e) {
    if (e.code === 'ER_DUP_ENTRY')
      return res.status(409).json({ error: 'Código o correo ya registrado' });
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

app.post('/estudiantes', manejar(async (req, res) => {
  if (!valido(req.body)) return res.status(400).json({ error: 'Faltan datos' });
  const { codigo, nombres, apellidos, correo, carrera } = req.body;
  const [r] = await pool.query(
    'INSERT INTO estudiantes (codigo, nombres, apellidos, correo, carrera) VALUES (?,?,?,?,?)',
    [codigo, nombres, apellidos, correo, carrera]
  );
  res.status(201).json({ id: r.insertId, ...req.body });
}));

app.get('/estudiantes', manejar(async (req, res) => {
  const [filas] = await pool.query('SELECT * FROM estudiantes');
  res.json(filas);
}));

app.get('/estudiantes/:id', manejar(async (req, res) => {
  const [filas] = await pool.query('SELECT * FROM estudiantes WHERE id = ?', [req.params.id]);
  if (filas.length === 0) return res.status(404).json({ error: 'Estudiante no encontrado' });
  res.json(filas[0]);
}));

app.put('/estudiantes/:id', manejar(async (req, res) => {
  if (!valido(req.body)) return res.status(400).json({ error: 'Faltan datos' });
  const { codigo, nombres, apellidos, correo, carrera } = req.body;
  const [r] = await pool.query(
    'UPDATE estudiantes SET codigo=?, nombres=?, apellidos=?, correo=?, carrera=? WHERE id=?',
    [codigo, nombres, apellidos, correo, carrera, req.params.id]
  );
  if (r.affectedRows === 0) return res.status(404).json({ error: 'Estudiante no encontrado' });
  res.json({ id: Number(req.params.id), ...req.body });
}));

app.delete('/estudiantes/:id', manejar(async (req, res) => {
  const [r] = await pool.query('DELETE FROM estudiantes WHERE id = ?', [req.params.id]);
  if (r.affectedRows === 0) return res.status(404).json({ error: 'Estudiante no encontrado' });
  res.status(204).send();
}));

module.exports = app;