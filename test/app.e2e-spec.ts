import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';

import { createTestApp } from './helpers/create-test-app';

describe('App (e2e) — smoke', () => {
  let app: INestApplication;

  beforeAll(async () => {
    app = await createTestApp();
  });

  afterAll(async () => {
    await app.close();
  });

  it('GET /api/producers/health returns ok', async () => {
    await request(app.getHttpServer())
      .get('/api/producers/health')
      .expect(200)
      .expect({ status: 'ok' });
  });

  it('exposes the OpenAPI spec at /api/docs-json', async () => {
    const res = await request(app.getHttpServer()).get('/api/docs-json');
    expect(res.status).toBe(200);
    expect(res.body.openapi).toBeDefined();
    expect(Object.keys(res.body.paths)).toEqual(
      expect.arrayContaining([
        '/api/producers',
        '/api/farms',
        '/api/harvests',
        '/api/crops',
        '/api/dashboard',
      ]),
    );
  });
});
