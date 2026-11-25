const request = require('supertest');
const pool = require('../src/db');
const app = require('../src/app');

jest.mock('../src/db', () => ({ query: jest.fn() }));

const estudiante = {
  codigo: 'U001',
  nombres: 'Ana',
  apellidos: 'Pérez',
  correo: 'ana@correo.com',
  carrera: 'Ingeniería de Sistemas',
};

beforeEach(() => jest.clearAllMocks());

describe('API de Estudiantes', () => {
  test('POST /estudiantes registra un estudiante', async () => {
    pool.query.mockResolvedValueOnce([{ insertId: 1 }]);
    const res = await request(app).post('/estudiantes').send(estudiante);
    expect(res.status).toBe(201);
    expect(res.body).toEqual({ id: 1, ...estudiante });
  });

  test('POST /estudiantes con datos incompletos devuelve 400', async () => {
    const res = await request(app).post('/estudiantes').send({ codigo: 'U002' });
    expect(res.status).toBe(400);
  });

  test('GET /estudiantes lista los estudiantes', async () => {
    pool.query.mockResolvedValueOnce([[{ id: 1, ...estudiante }]]);
    const res = await request(app).get('/estudiantes');
    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(1);
  });

  test('GET /estudiantes/:id consulta un estudiante', async () => {
    pool.query.mockResolvedValueOnce([[{ id: 1, ...estudiante }]]);
    const res = await request(app).get('/estudiantes/1');
    expect(res.status).toBe(200);
    expect(res.body.codigo).toBe('U001');
  });

  test('GET /estudiantes/:id inexistente devuelve 404', async () => {
    pool.query.mockResolvedValueOnce([[]]);
    const res = await request(app).get('/estudiantes/99');
    expect(res.status).toBe(404);
  });

  test('PUT /estudiantes/:id actualiza un estudiante', async () => {
    pool.query.mockResolvedValueOnce([{ affectedRows: 1 }]);
    const res = await request(app).put('/estudiantes/1').send(estudiante);
    expect(res.status).toBe(200);
  });

  test('PUT /estudiantes/:id inexistente devuelve 404', async () => {
    pool.query.mockResolvedValueOnce([{ affectedRows: 0 }]);
    const res = await request(app).put('/estudiantes/99').send(estudiante);
    expect(res.status).toBe(404);
  });

  test('DELETE /estudiantes/:id elimina un estudiante', async () => {
    pool.query.mockResolvedValueOnce([{ affectedRows: 1 }]);
    const res = await request(app).delete('/estudiantes/1');
    expect(res.status).toBe(204);
  });

  test('DELETE /estudiantes/:id inexistente devuelve 404', async () => {
    pool.query.mockResolvedValueOnce([{ affectedRows: 0 }]);
    const res = await request(app).delete('/estudiantes/99');
    expect(res.status).toBe(404);
  });
});