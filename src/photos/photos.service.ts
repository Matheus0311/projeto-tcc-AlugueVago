import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Photo } from './photo.entity';

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
  
}
