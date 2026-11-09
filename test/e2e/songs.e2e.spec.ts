import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import request from 'supertest';
import { AppModule } from '../../src/app.module';
import { configureApp } from '../../src/setup';

describe('API de canciones - E2E', () => {
  let app: INestApplication;
  let directory: string;
  const previousPath = process.env.MUSIC_DB_PATH;

  beforeEach(async () => {
    directory = mkdtempSync(join(tmpdir(), 'music-e2e-'));
    process.env.MUSIC_DB_PATH = join(directory, 'music.json');
    const moduleRef = await Test.createTestingModule({ imports: [AppModule] }).compile();
    app = moduleRef.createNestApplication();
    configureApp(app);
    await app.init();
  });

  afterEach(async () => {
    await app.close();
    rmSync(directory, { recursive: true, force: true });
    if (previousPath === undefined) delete process.env.MUSIC_DB_PATH;
    else process.env.MUSIC_DB_PATH = previousPath;
  });

  it('crea una cancion por HTTP y la muestra en la lista', async () => {
    const input = { title: 'Imagine', artist: 'John Lennon' };
    const response = await request(app.getHttpServer())
      .post('/api/songs').send(input).expect(201);
    expect(response.body).toEqual({ ...input, id: expect.any(String) });
    await request(app.getHttpServer()).get('/api/songs')
      .expect(200).expect([response.body]);
  });

  it('rechaza una cancion sin artista', async () => {
    await request(app.getHttpServer()).post('/api/songs')
      .send({ title: 'Imagine' }).expect(400);
    await request(app.getHttpServer()).get('/api/songs').expect(200).expect([]);
  });
});
