import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Photo } from './photo.entity';
import path, { extname } from 'path';
import * as fs from 'fs';

@Injectable()
export class PhotosService {
  constructor(
    @InjectRepository(Photo)
    private readonly photoRepository: Repository<Photo>,
  ) {}

  async createPhoto(photo: Photo): Promise<Photo> {
    console.log("Creating photo:", photo);
  
    try {
      const savedPhoto = await this.photoRepository.save(photo);
      console.log("Saved photo:", savedPhoto);
      return savedPhoto;
    } catch (error) {
      console.error("\n\n\nError creating photo:", error);
      throw error;
    }
  }

  async deletePhotosByImovelId(imovelId: number): Promise<void> {
    await this.photoRepository.delete({ imovel: { id: imovelId } });
  }

  async createPhotos(photos: Photo[]): Promise<Photo[]> {
    const savedPhotos = await this.photoRepository.save(photos);
    console.log("Saved photos:", savedPhotos);
    return savedPhotos;
  }
  

  async findAll(): Promise<Photo[]> {
    return this.photoRepository.find();
  }

  async saveFile(file: Express.Multer.File, destination: string): Promise<string> {
    console.log('\n\n\n\nSAVEFILE')
    console.log(file)
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const filePath = `${destination}/${uniqueSuffix}${extname(file.originalname)}`;
    
    await fs.promises.writeFile(filePath, file.buffer);
    return filePath;
  }
}
