import { INestApplication } from '@nestjs/common';
import { DataSource } from 'typeorm';

export async function resetDatabase(app: INestApplication): Promise<void> {
  const dataSource = app.get(DataSource);
  await dataSource.query(
    'TRUNCATE TABLE crops, harvests, farms, producers RESTART IDENTITY CASCADE',
  );
}
