import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';

import { createTestApp } from './helpers/create-test-app';
import { resetDatabase } from './helpers/reset-database';

describe('Producers (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    app = await createTestApp();
  });

  beforeEach(async () => {
    await resetDatabase(app);
  });

  afterAll(async () => {
    await app.close();
  });

  it('creates a producer, normalizes the document and lists it', async () => {
    const created = await request(app.getHttpServer())
      .post('/api/producers')
      .send({ document: '111.444.777-35', name: 'João da Silva' })
      .expect(201);

    expect(created.body).toMatchObject({
      document: '11144477735',
      name: 'João da Silva',
    });
    expect(created.body.id).toEqual(expect.any(String));

    const list = await request(app.getHttpServer())
      .get('/api/producers')
      .expect(200);
    expect(list.body).toHaveLength(1);
    expect(list.body[0].id).toBe(created.body.id);
  });

  it('rejects an invalid CPF with 400', async () => {
    const res = await request(app.getHttpServer())
      .post('/api/producers')
      .send({ document: '00000000000', name: 'Fake' })
      .expect(400);

    expect(res.body).toMatchObject({
      statusCode: 400,
      code: 'BAD_REQUEST',
    });
  });

  it('rejects duplicate document with 409', async () => {
    await request(app.getHttpServer())
      .post('/api/producers')
      .send({ document: '11144477735', name: 'First' })
      .expect(201);

    const res = await request(app.getHttpServer())
      .post('/api/producers')
      .send({ document: '11144477735', name: 'Second' })
      .expect(409);

    expect(res.body).toMatchObject({
      statusCode: 409,
      code: 'CONFLICT',
    });
  });

  it('supports the full CRUD lifecycle', async () => {
    const created = await request(app.getHttpServer())
      .post('/api/producers')
      .send({ document: '11144477735', name: 'Original' })
      .expect(201);

    await request(app.getHttpServer())
      .patch(`/api/producers/${created.body.id}`)
      .send({ name: 'Updated' })
      .expect(200)
      .expect((res) => expect(res.body.name).toBe('Updated'));

    await request(app.getHttpServer())
      .delete(`/api/producers/${created.body.id}`)
      .expect(204);

    const notFound = await request(app.getHttpServer())
      .get(`/api/producers/${created.body.id}`)
      .expect(404);
    expect(notFound.body.code).toBe('ENTITY_NOT_FOUND');
  });
});
