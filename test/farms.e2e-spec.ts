import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';

import { createTestApp } from './helpers/create-test-app';
import { resetDatabase } from './helpers/reset-database';

async function createProducer(app: INestApplication): Promise<string> {
  const res = await request(app.getHttpServer())
    .post('/api/producers')
    .send({ document: '11144477735', name: 'Owner' })
    .expect(201);
  return res.body.id;
}

describe('Farms (e2e)', () => {
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

  it('creates a farm and normalizes the state to uppercase', async () => {
    const producerId = await createProducer(app);

    const res = await request(app.getHttpServer())
      .post('/api/farms')
      .send({
        producerId,
        name: 'Boa Vista',
        city: 'Uberaba',
        state: 'mg',
        totalHa: 100,
        arableHa: 60,
        vegetationHa: 40,
      })
      .expect(201);

    expect(res.body.state).toBe('MG');
    expect(res.body.totalHa).toBe(100);
  });

  it('rejects when arable + vegetation exceeds total with 422', async () => {
    const producerId = await createProducer(app);

    const res = await request(app.getHttpServer())
      .post('/api/farms')
      .send({
        producerId,
        name: 'Invalid',
        city: 'X',
        state: 'MG',
        totalHa: 100,
        arableHa: 80,
        vegetationHa: 30,
      })
      .expect(422);

    expect(res.body).toMatchObject({
      statusCode: 422,
      code: 'BUSINESS_RULE_VIOLATION',
    });
  });

  it('rejects an unknown state with 400', async () => {
    const producerId = await createProducer(app);

    await request(app.getHttpServer())
      .post('/api/farms')
      .send({
        producerId,
        name: 'X',
        city: 'Y',
        state: 'XX',
        totalHa: 10,
        arableHa: 5,
        vegetationHa: 5,
      })
      .expect(400);
  });

  it('rejects a farm for a producer that does not exist with 404', async () => {
    await request(app.getHttpServer())
      .post('/api/farms')
      .send({
        producerId: '00000000-0000-0000-0000-000000000000',
        name: 'X',
        city: 'Y',
        state: 'MG',
        totalHa: 10,
        arableHa: 5,
        vegetationHa: 5,
      })
      .expect(404);
  });

  it('cascades: deleting the producer removes their farms', async () => {
    const producerId = await createProducer(app);
    await request(app.getHttpServer())
      .post('/api/farms')
      .send({
        producerId,
        name: 'Farm 1',
        city: 'X',
        state: 'MG',
        totalHa: 100,
        arableHa: 60,
        vegetationHa: 40,
      })
      .expect(201);

    await request(app.getHttpServer())
      .delete(`/api/producers/${producerId}`)
      .expect(204);

    const list = await request(app.getHttpServer())
      .get('/api/farms')
      .expect(200);
    expect(list.body).toEqual([]);
  });
});
