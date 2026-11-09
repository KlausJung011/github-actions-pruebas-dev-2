import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CreateSongDto } from './song.dto';
import { SongsService } from './songs.service';

@Controller('songs')
export class SongsController {
  constructor(private readonly service: SongsService) {}

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Post()
  create(@Body() data: CreateSongDto) {
    return this.service.create(data);
  }
}
