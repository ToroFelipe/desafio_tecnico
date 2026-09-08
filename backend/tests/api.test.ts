import jwt from 'jsonwebtoken';
import request from 'supertest';
import { beforeAll, describe, expect, it } from 'vitest';
import type { Express } from 'express';

const RUT_ANA = '12.345.678-5';
const RUT_CARLOS = '18.756.066-7';

let app: Express;

beforeAll(async () => {
  const { createApp } = await import('../src/app');
  app = createApp();
});

async function loginWith(email: string, password: string): Promise<string> {
  const response = await request(app).post('/login').send({ email, password });
  return response.body.token;
}

describe('POST /login', () => {
  it('entrega token con sub, role y rut para rol user', async () => {
    const response = await request(app)
      .post('/login')
      .send({ email: 'ana.soto@fintech.cl', password: 'user123' });

    expect(response.status).toBe(200);
    const payload = jwt.decode(response.body.token) as Record<string, unknown>;
    expect(payload.role).toBe('user');
    expect(payload.rut).toBe('123456785');
  });

  it('no incluye rut cuando el rol es admin', async () => {
    const response = await request(app)
      .post('/login')
      .send({ email: 'admin@fintech.cl', password: 'admin123' });

    expect(response.status).toBe(200);
    const payload = jwt.decode(response.body.token) as Record<string, unknown>;
    expect(payload.role).toBe('admin');
    expect(payload.rut).toBeUndefined();
  });

  it('responde 401 con contrasena incorrecta', async () => {
    const response = await request(app)
      .post('/login')
      .send({ email: 'ana.soto@fintech.cl', password: 'incorrecta' });

    expect(response.status).toBe(401);
    expect(response.body.error.code).toBe('INVALID_CREDENTIALS');
  });

  it('mismo error para email inexistente', async () => {
    const response = await request(app)
      .post('/login')
      .send({ email: 'nadie@fintech.cl', password: 'loquesea' });

    expect(response.status).toBe(401);
    expect(response.body.error.code).toBe('INVALID_CREDENTIALS');
  });
});

describe('GET /score/:rut - autenticacion', () => {
  it('responde 401 sin token', async () => {
    const response = await request(app).get(`/score/${RUT_ANA}`);
    expect(response.status).toBe(401);
  });

  it('responde 401 con token firmado con otro secreto', async () => {
    const tokenFalso = jwt.sign({ sub: 'usr_002', role: 'user', rut: '123456785' }, 'otro-secreto');
    const response = await request(app)
      .get(`/score/${RUT_ANA}`)
      .set('Authorization', `Bearer ${tokenFalso}`);
    expect(response.status).toBe(401);
  });

  it('responde 401 con token expirado', async () => {
    const tokenExpirado = jwt.sign(
      { sub: 'usr_002', role: 'user', rut: '123456785' },
      process.env['JWT_SECRET'] as string,
      { issuer: 'riesgo-financiero-api', expiresIn: '-1s' },
    );
    const response = await request(app)
      .get(`/score/${RUT_ANA}`)
      .set('Authorization', `Bearer ${tokenExpirado}`);
    expect(response.status).toBe(401);
    expect(response.body.error.code).toBe('TOKEN_EXPIRED');
  });
});

describe('GET /score/:rut - autorizacion', () => {
  it('permite al user consultar su propio RUT', async () => {
    const token = await loginWith('ana.soto@fintech.cl', 'user123');
    const response = await request(app)
      .get(`/score/${RUT_ANA}`)
      .set('Authorization', `Bearer ${token}`);
    expect(response.status).toBe(200);
    expect(response.body.rut).toBe(RUT_ANA);
  });

  it('responde 403 cuando user consulta RUT ajeno', async () => {
    const token = await loginWith('ana.soto@fintech.cl', 'user123');
    const response = await request(app)
      .get(`/score/${RUT_CARLOS}`)
      .set('Authorization', `Bearer ${token}`);
    expect(response.status).toBe(403);
    expect(response.body.error.code).toBe('RUT_FORBIDDEN');
  });

  it('no deja evadir el control cambiando el formato del RUT', async () => {
    const token = await loginWith('ana.soto@fintech.cl', 'user123');
    for (const variante of ['187560667', '18756066-7', '18.756.066-7']) {
      const response = await request(app)
        .get(`/score/${variante}`)
        .set('Authorization', `Bearer ${token}`);
      expect(response.status).toBe(403);
    }
  });

  it('permite al admin consultar cualquier RUT', async () => {
    const token = await loginWith('admin@fintech.cl', 'admin123');
    for (const rut of [RUT_ANA, RUT_CARLOS]) {
      const response = await request(app)
        .get(`/score/${rut}`)
        .set('Authorization', `Bearer ${token}`);
      expect(response.status).toBe(200);
    }
  });

  it('devuelve el mismo score en consultas repetidas', async () => {
    const token = await loginWith('admin@fintech.cl', 'admin123');
    const primera = await request(app).get(`/score/${RUT_ANA}`).set('Authorization', `Bearer ${token}`);
    const segunda = await request(app).get(`/score/${RUT_ANA}`).set('Authorization', `Bearer ${token}`);
    expect(primera.body.score).toBe(segunda.body.score);
  });
});