import { NotFoundException } from '@nestjs/common';
import { SongsService } from '../../src/songs/songs.service';

describe('SongsService - unitarias', () => {
  let service: SongsService;

  beforeEach(() => {
    service = new SongsService();
  });

  it('encuentra una cancion por su id', () => {
    const song = { id: '1', title: 'Imagine', artist: 'John Lennon' };
    jest.spyOn(service, 'findAll').mockReturnValue([song]);
    expect(service.findOne('1')).toEqual(song);
  });

  it('devuelve un error si la cancion no existe', () => {
    jest.spyOn(service, 'findAll').mockReturnValue([]);
    expect(() => service.findOne('99')).toThrow(NotFoundException);
  });
});
