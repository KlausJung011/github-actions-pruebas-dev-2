import { Test, TestingModule } from '@nestjs/testing';
import { mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { SongsModule } from '../../src/songs/songs.module';
import { SongsController } from '../../src/songs/songs.controller';
import { SongsService } from '../../src/songs/songs.service';

describe('Controlador + servicio + JSON - integracion', () => {
  let moduleRef: TestingModule;
  let controller: SongsController;
  let directory: string;
  const previousPath = process.env.MUSIC_DB_PATH;

  beforeEach(async () => {
    directory = mkdtempSync(join(tmpdir(), 'music-integration-'));
    process.env.MUSIC_DB_PATH = join(directory, 'music.json');
    moduleRef = await Test.createTestingModule({ imports: [SongsModule] }).compile();
    controller = moduleRef.get(SongsController);
  });

  afterEach(async () => {
    await moduleRef.close();
    rmSync(directory, { recursive: true, force: true });
    if (previousPath === undefined) delete process.env.MUSIC_DB_PATH;
    else process.env.MUSIC_DB_PATH = previousPath;
  });

  it('guarda en JSON una cancion creada desde el controlador', () => {
    const song = controller.create({ title: 'Imagine', artist: 'John Lennon' });
    const saved = JSON.parse(readFileSync(join(directory, 'music.json'), 'utf8'));
    expect(saved).toEqual([song]);
  });

  it('recupera canciones guardadas desde una nueva instancia del servicio', () => {
    const song = controller.create({ title: 'Yesterday', artist: 'The Beatles' });
    const newService = new SongsService();
    expect(newService.findAll()).toEqual([song]);
    expect(controller.findOne(song.id)).toEqual(song);
  });
});
