const request = require('supertest');
const pool = require('../src/db');
const app = require('../src/app');

jest.mock('../src/db', () => ({ query: jest.fn() }));

const curso = {
  codigo: 'C001',
  nombre: 'Bases de Datos',
  creditos: 4,
  docente: 'Juan Torres',
};

beforeEach(() => jest.clearAllMocks());

describe('API de Cursos', () => {
  test('POST /cursos registra un curso', async () => {
    pool.query.mockResolvedValueOnce([{ insertId: 1 }]);
    const res = await request(app).post('/cursos').send(curso);
    expect(res.status).toBe(201);
    expect(res.body).toEqual({ id: 1, ...curso });
  });

  test('POST /cursos con datos incompletos devuelve 400', async () => {
    const res = await request(app).post('/cursos').send({ codigo: 'C002' });
    expect(res.status).toBe(400);
  });

  test('POST /cursos con créditos inválidos devuelve 400', async () => {
    const res = await request(app).post('/cursos').send({ ...curso, creditos: -2 });
    expect(res.status).toBe(400);
  });

  test('GET /cursos lista los cursos', async () => {
    pool.query.mockResolvedValueOnce([[{ id: 1, ...curso }]]);
    const res = await request(app).get('/cursos');
    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(1);
  });

  test('GET /cursos/:id consulta un curso', async () => {
    pool.query.mockResolvedValueOnce([[{ id: 1, ...curso }]]);
    const res = await request(app).get('/cursos/1');
    expect(res.status).toBe(200);
    expect(res.body.codigo).toBe('C001');
  });

  test('GET /cursos/:id inexistente devuelve 404', async () => {
    pool.query.mockResolvedValueOnce([[]]);
    const res = await request(app).get('/cursos/99');
    expect(res.status).toBe(404);
  });

  test('PUT /cursos/:id actualiza un curso', async () => {
    pool.query.mockResolvedValueOnce([{ affectedRows: 1 }]);
    const res = await request(app).put('/cursos/1').send(curso);
    expect(res.status).toBe(200);
  });

  test('PUT /cursos/:id inexistente devuelve 404', async () => {
    pool.query.mockResolvedValueOnce([{ affectedRows: 0 }]);
    const res = await request(app).put('/cursos/99').send(curso);
    expect(res.status).toBe(404);
  });

  test('DELETE /cursos/:id elimina un curso', async () => {
    pool.query.mockResolvedValueOnce([{ affectedRows: 1 }]);
    const res = await request(app).delete('/cursos/1');
    expect(res.status).toBe(204);
  });

  test('DELETE /cursos/:id inexistente devuelve 404', async () => {
    pool.query.mockResolvedValueOnce([{ affectedRows: 0 }]);
    const res = await request(app).delete('/cursos/99');
    expect(res.status).toBe(404);
  });
});