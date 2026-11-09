import { Injectable, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname } from 'node:path';
import { CreateSongDto } from './song.dto';
import { Song } from './song.interface';

@Injectable()
export class SongsService {
  private readonly filePath = process.env.MUSIC_DB_PATH ?? 'data/music.json';

  findAll(): Song[] {
    if (!existsSync(this.filePath)) return [];
    return JSON.parse(readFileSync(this.filePath, 'utf8')) as Song[];
  }

  findOne(id: string): Song {
    const song = this.findAll().find((song) => song.id === id);
    if (!song) throw new NotFoundException('Cancion no encontrada');
    return song;
  }

  create(data: CreateSongDto): Song {
    const songs = this.findAll();
    const song = { id: randomUUID(), title: data.title, artist: data.artist };
    songs.push(song);
    mkdirSync(dirname(this.filePath), { recursive: true });
    writeFileSync(this.filePath, JSON.stringify(songs, null, 2));
    return song;
  }
}
