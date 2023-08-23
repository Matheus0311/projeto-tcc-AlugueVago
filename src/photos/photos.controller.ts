import { Controller, Post, Body, Get, Param, Put, Delete, InternalServerErrorException, Render, UseGuards, BadRequestException, Req, UseInterceptors, UploadedFile, Res, Request, ConsoleLogger, ParseIntPipe, Query, UploadedFiles  } from '@nestjs/common';
import { Photo } from './photo.entity';

import { PhotosService } from "./photos.service";

@Controller('photos')
export class PhotoController {
  constructor(private readonly photoService: PhotosService) {}

  @Get()
  async findAll(): Promise<Photo[]> {
    return this.photoService.findAll();
  }

  @Get('/uploads/fotos-imoveis/:imageName')
  async serveImovelImage(@Param('imageName') imageName, @Res() res) {
    const imagePath = `./uploads/fotos-imoveis/${imageName}`;
    // Envia o arquivo como resposta
    res.sendFile(imagePath, { root: '.' });
  }
}