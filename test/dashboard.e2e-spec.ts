import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';

import { createTestApp } from './helpers/create-test-app';
import { resetDatabase } from './helpers/reset-database';

describe('Dashboard (e2e)', () => {
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

  it('returns zeroed values when there is no data', async () => {
    const res = await request(app.getHttpServer())
      .get('/api/dashboard')
      .expect(200);

    expect(res.body).toEqual({
      totalFarms: 0,
      totalHectares: 0,
      farmsByState: [],
      cropsByName: [],
      landUse: [
        { label: 'arable', hectares: 0, percentage: 0 },
        { label: 'vegetation', hectares: 0, percentage: 0 },
      ],
    });
  });

  it('aggregates totals across producers, farms, harvests and crops', async () => {
    const server = app.getHttpServer();

    const p1 = (
      await request(server)
        .post('/api/producers')
        .send({ document: '11144477735', name: 'Owner A' })
        .expect(201)
    ).body.id;

    const p2 = (
      await request(server)
        .post('/api/producers')
        .send({ document: '11222333000181', name: 'Owner B' })
        .expect(201)
    ).body.id;

    const f1 = (
      await request(server)
        .post('/api/farms')
        .send({
          producerId: p1,
          name: 'Boa Vista',
          city: 'Uberaba',
          state: 'MG',
          totalHa: 100,
          arableHa: 60,
          vegetationHa: 40,
        })
        .expect(201)
    ).body.id;

    const f2 = (
      await request(server)
        .post('/api/farms')
        .send({
          producerId: p1,
          name: 'Recanto',
          city: 'Uberlandia',
          state: 'MG',
          totalHa: 200,
          arableHa: 100,
          vegetationHa: 80,
        })
        .expect(201)
    ).body.id;

    await request(server)
      .post('/api/farms')
      .send({
        producerId: p2,
        name: 'Sao Jose',
        city: 'Ribeirao Preto',
        state: 'SP',
        totalHa: 50,
        arableHa: 30,
        vegetationHa: 20,
      })
      .expect(201);

    const h1 = (
      await request(server)
        .post('/api/harvests')
        .send({ farmId: f1, year: 2024 })
        .expect(201)
    ).body.id;

    const h2 = (
      await request(server)
        .post('/api/harvests')
        .send({ farmId: f2, year: 2024 })
        .expect(201)
    ).body.id;

    await request(server)
      .post('/api/crops')
      .send({ harvestId: h1, name: 'Soja' })
      .expect(201);
    await request(server)
      .post('/api/crops')
      .send({ harvestId: h1, name: 'Milho' })
      .expect(201);
    await request(server)
      .post('/api/crops')
      .send({ harvestId: h2, name: 'Soja' })
      .expect(201);

    const res = await request(server).get('/api/dashboard').expect(200);

    expect(res.body.totalFarms).toBe(3);
    expect(res.body.totalHectares).toBe(350);

    expect(res.body.farmsByState).toEqual([
      { label: 'MG', value: 2, percentage: 66.67 },
      { label: 'SP', value: 1, percentage: 33.33 },
    ]);

    expect(res.body.cropsByName[0]).toEqual({
      label: 'Soja',
      value: 2,
      percentage: 66.67,
    });

    expect(res.body.landUse).toEqual([
      { label: 'arable', hectares: 190, percentage: 57.58 },
      { label: 'vegetation', hectares: 140, percentage: 42.42 },
    ]);
  });
});
